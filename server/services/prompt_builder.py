from datetime import datetime
from typing import List, Optional

GOAL_CONTEXT = {
    "weight_loss": "caloric deficit and satiety. Focus on glycemic load and high sugar flags",
    "muscle_gain": "protein intake and muscle recovery. Focus on electrolyte balance (sodium)",
    "energy": "sustained energy levels. Focus on glycemic load to avoid blood sugar spikes",
    "gut_health": "digestive health. Focus on fiber content",
    "general": "balanced nutrition and overall wellbeing"
}

RESTRICTION_CONTEXT = {
    "none": "",
    "vegetarian": "The user is vegetarian (no meat).",
    "vegan": "The user is vegan (no animal products).",
    "diabetic": "CRITICAL: The user is diabetic. HEAVILY prioritize Glycemic Load (GL) and sugar content. Flag anything with GL > 20 as dangerous.",
    "lactose_free": "The user is lactose intolerant."
}

def get_time_context():
    hour = datetime.now().hour
    if 5 <= hour < 10: return "morning meal (metabolic rate peaking)"
    elif 10 <= hour < 14: return "midday meal (peak energy window)"
    elif 14 <= hour < 18: return "afternoon snack (stable glucose needed)"
    elif 18 <= hour < 21: return "evening meal (light/low GL preferred)"
    else: return "late-night eating (CRITICAL: flag circadian disruption risk)"

def build_analysis_prompt(meal_description: str, user_profile=None, meal_type: str = "meal", meal_history: Optional[List] = None) -> str:
    history_context = ""
    if meal_history:
        history_context = f"PREVIOUS MEALS CONTEXT: {len(meal_history)} previous logs. Scores: {[m.get('health_score') for m in meal_history]}"

    if user_profile:
        goal_text = GOAL_CONTEXT.get(user_profile.goal, GOAL_CONTEXT["general"])
        restriction_text = RESTRICTION_CONTEXT.get(user_profile.restriction, "")
        profile_context = f"""
USER PROFILE:
- Goal: {user_profile.goal} ({goal_text})
- Restriction: {user_profile.restriction}. {restriction_text}
- Timing: {get_time_context()}
{history_context}
"""
    else:
        profile_context = f"USER PROFILE: General. Timing: {get_time_context()}"

    return f"""Analyze this meal for a health-conscious user: {meal_description}. 

{profile_context}

Return ONLY valid JSON with this structure:
{{
  "food_name": "string",
  "health_score": <int 1-10>,
  "calories_estimate": <int>,
  "macros": {{
    "carbs_g": <float>,
    "protein_g": <float>,
    "fat_g": <float>,
    "fiber_g": <float>,
    "sodium_mg": <float, estimated>,
    "sugar_g": <float, estimated>,
    "glycemic_load": <float, estimated 1-30+>
  }},
  "insights": ["list", "max 3"],
  "healthier_alternatives": ["list", "max 2"],
  "personalized_advice": "2-3 sentences max",
  "portion_note": "optional string",
  "top_ingredients": [{{ "name": "string", "health_impact": "positive|neutral|negative", "reason": "string" }}]
}}"""
