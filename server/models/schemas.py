import re
from pydantic import BaseModel, Field, validator
from typing import Optional, List

class UserProfile(BaseModel):
    goal: str = Field(..., description="weight_loss|muscle_gain|energy|gut_health|general")
    restriction: str = Field(..., description="none|vegetarian|vegan|diabetic|lactose_free")
    activity_level: str = Field(..., description="sedentary|moderate|active")

class AnalyzeRequest(BaseModel):
    meal_text: Optional[str] = None
    image_base64: Optional[str] = None
    image_mime_type: Optional[str] = "image/jpeg"
    user_profile: Optional[UserProfile] = None
    meal_type: Optional[str] = "meal"

    @validator('meal_text')
    def sanitize_meal_text(cls, v):
        if v is None: return v
        v = v.strip()
        if len(v) > 500: raise ValueError('Meal description too long')
        injection_patterns = [r'ignore previous', r'system:', r'assistant:']
        for pattern in injection_patterns:
            if re.search(pattern, v, re.IGNORECASE): raise ValueError('Invalid input detected')
        return v

class MacroBreakdown(BaseModel):
    carbs_g: float
    protein_g: float
    fat_g: float
    fiber_g: Optional[float] = 0
    # Snippet: Clinical markers
    sodium_mg: Optional[float] = 0
    sugar_g: Optional[float] = 0
    glycemic_load: Optional[float] = 0

class IngredientDetail(BaseModel):
    name: str
    health_impact: str
    reason: str

class AnalyzeResponse(BaseModel):
    food_name: str
    health_score: int = Field(..., ge=1, le=10)
    calories_estimate: int
    macros: MacroBreakdown
    insights: List[str] = Field(..., min_items=1, max_items=5)
    healthier_alternatives: List[str] = Field(..., max_items=3)
    personalized_advice: str
    portion_note: Optional[str] = None
    top_ingredients: List[IngredientDetail] = Field(default_factory=list)

class ErrorResponse(BaseModel):
    error: str
    message: str
    suggestion: str
