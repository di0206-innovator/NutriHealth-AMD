import google.generativeai as genai
import json
import base64
import os
import re
from models.schemas import AnalyzeResponse, MacroBreakdown, ErrorResponse
from services.prompt_builder import build_analysis_prompt
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-pro")

def clean_json_response(text: str) -> str:
    """Strip markdown code fences if model wraps response despite instructions."""
    text = text.strip()
    text = re.sub(r'^```json\s*', '', text)
    text = re.sub(r'^```\s*', '', text)
    text = re.sub(r'\s*```$', '', text)
    return text.strip()

async def analyze_meal(meal_text: str = None, image_base64: str = None, 
                       image_mime_type: str = "image/jpeg", user_profile=None, 
                       meal_type: str = "meal") -> dict:
    try:
        meal_description = meal_text or "food shown in the image"
        prompt = build_analysis_prompt(meal_description, user_profile, meal_type)
        
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
