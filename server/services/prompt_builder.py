GOAL_CONTEXT = {
    "weight_loss": "focused on caloric deficit and satiety. Highlight high-calorie density and suggest lower-calorie alternatives",
    "muscle_gain": "focused on protein intake and muscle recovery. Emphasize protein content and suggest high-protein complements",
    "energy": "focused on sustained energy levels. Highlight glycemic index impact and blood sugar stability",
    "gut_health": "focused on digestive health. Highlight fiber content, probiotics, and gut-friendly properties",
    "general": "focused on balanced nutrition and overall wellbeing"
}

RESTRICTION_CONTEXT = {
    "none": "",
    "vegetarian": "The user is vegetarian — avoid meat-based alternatives.",
    "vegan": "The user is vegan — avoid all animal products in alternatives.",
    "diabetic": "CRITICAL: The user is diabetic. Heavily emphasize glycemic index, sugar content, and blood sugar impact. Flag high-GI foods with a warning.",
    "lactose_free": "The user is lactose intolerant — avoid dairy-based alternatives."
}

ACTIVITY_CONTEXT = {
    "sedentary": "with low daily caloric needs (~1800-2000 kcal)",
    "moderate": "with moderate daily caloric needs (~2000-2400 kcal)",
    "active": "with high daily caloric needs (~2400-3000 kcal)"
}

def build_analysis_prompt(meal_description: str, user_profile=None, meal_type: str = "meal") -> str:
    if user_profile:
        goal_text = GOAL_CONTEXT.get(user_profile.goal, GOAL_CONTEXT["general"])
        restriction_text = RESTRICTION_CONTEXT.get(user_profile.restriction, "")
        activity_text = ACTIVITY_CONTEXT.get(user_profile.activity_level, "")
        
        profile_context = f"""
USER PROFILE:
- Health goal: {user_profile.goal} — provide advice {goal_text}
- Dietary restriction: {user_profile.restriction}. {restriction_text}
- Activity level: {user_profile.activity_level} {activity_text}
- Meal timing: {meal_type}
"""
    else:
        profile_context = "USER PROFILE: Not provided — give general balanced nutrition advice."

    return f"""You are an expert nutritionist and dietitian analyzing a meal for a health-conscious user.

{profile_context}

MEAL TO ANALYZE: {meal_description}

Analyze this meal thoroughly and respond ONLY with valid JSON — no markdown formatting, no code blocks, no explanation before or after. Return exactly this structure:

{{
  "food_name": "descriptive name of the meal/food",
  "health_score": <integer 1-10 where 10 is most nutritious>,
  "calories_estimate": <estimated calories as integer>,
  "macros": {{
    "carbs_g": <number>,
    "protein_g": <number>,
    "fat_g": <number>,
    "fiber_g": <number>
  }},
  "insights": [
    "specific insight 1 tailored to user goal",
    "specific insight 2 about key nutrients",
    "specific insight 3 about health impact"
  ],
  "healthier_alternatives": [
    "specific alternative 1 with brief reason",
    "specific alternative 2 with brief reason"
  ],
  "personalized_advice": "2-3 sentence personalized advice based on user's specific goal and restriction",
  "portion_note": "optional note about ideal portion size or timing"
}}

Scoring guide for health_score: 1-3=highly processed/unhealthy, 4-5=moderate with concerns, 6-7=decent choice, 8-9=healthy, 10=exceptional nutritional value. Be honest and accurate."""
