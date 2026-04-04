import google.generativeai as genai
import json
import base64
import os
import re
import hashlib
import time
from typing import List, Optional
from models.schemas import AnalyzeResponse, MacroBreakdown, ErrorResponse
from services.prompt_builder import build_analysis_prompt
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-pro")

# Snippet 13: In-memory cache
_cache = {}  # {hash: (result, timestamp)}
CACHE_TTL = 3600  # 1 hour

def get_cache_key(meal_text: str, profile_str: str) -> str:
    return hashlib.md5(f"{meal_text}:{profile_str}".encode()).hexdigest()

def clean_json_response(text: str) -> str:
    """Strip markdown code fences if model wraps response despite instructions."""
    text = text.strip()
    text = re.sub(r'^```json\s*', '', text, flags=re.MULTILINE)
    text = re.sub(r'^```\s*', '', text, flags=re.MULTILINE)
    text = re.sub(r'\s*```$', '', text, flags=re.MULTILINE)
    return text.strip()

async def analyze_meal(meal_text: str = None, image_base64: str = None, 
                       image_mime_type: str = "image/jpeg", user_profile=None, 
                       meal_type: str = "meal", meal_history: Optional[List] = None) -> dict:
    
    # Snippet 13: Cache check for text-only queries
    if meal_text and not image_base64:
        profile_str = str(user_profile) if user_profile else "none"
        cache_key = get_cache_key(meal_text.lower().strip(), profile_str)
        
        if cache_key in _cache:
            result_data, ts = _cache[cache_key]
            if time.time() - ts < CACHE_TTL:
                return {"success": True, "data": result_data, "cached": True}

    try:
        meal_description = meal_text or "food shown in the image"
        prompt = build_analysis_prompt(meal_description, user_profile, meal_type, meal_history)
        
        content_parts = [prompt]
        
        if image_base64:
            image_data = base64.b64decode(image_base64)
            content_parts.append({
                "mime_type": image_mime_type,
                "data": image_data
            })
        
        response = model.generate_content(
            content_parts,
            generation_config=genai.types.GenerationConfig(
                temperature=0.3,
                max_output_tokens=1024,
            )
        )
        
        raw_text = response.text
        
        # Robust JSON extraction
        json_match = re.search(r'(\{.*\})', raw_text, re.DOTALL)
        if json_match:
            cleaned = json_match.group(1)
        else:
            cleaned = clean_json_response(raw_text)
            
        parsed = json.loads(cleaned)
        
        # Validate and clamp values
        parsed["health_score"] = max(1, min(10, int(parsed.get("health_score", 5))))
        parsed["calories_estimate"] = max(0, int(parsed.get("calories_estimate", 0)))
        
        # Ensure lists have content
        if not parsed.get("insights"):
            parsed["insights"] = ["No specific insights available for this meal."]
        if not parsed.get("healthier_alternatives"):
            parsed["healthier_alternatives"] = ["Consider adding more vegetables to this meal."]
        if not parsed.get("top_ingredients"):
            parsed["top_ingredients"] = []
            
        # Snippet 13: Save to cache
        if meal_text and not image_base64:
            _cache[cache_key] = (parsed, time.time())
            
        return {"success": True, "data": parsed}
        
    except json.JSONDecodeError as e:
        return {
            "success": False,
            "error": "parse_error",
            "message": "Could not parse the nutrition analysis",
            "suggestion": "Try typing the meal name instead of using a photo"
        }
    except Exception as e:
        error_msg = str(e).lower()
        if "quota" in error_msg or "rate" in error_msg:
            suggestion = "Please wait a moment and try again"
        elif "safety" in error_msg:
            suggestion = "Please try a different image or describe your meal in text"
        else:
            suggestion = "Try describing your meal in text instead"
            
        return {
            "success": False,
            "error": "api_error", 
            "message": "Analysis temporarily unavailable",
            "suggestion": suggestion
        }
