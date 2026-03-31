from pydantic import BaseModel, Field
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
    meal_type: Optional[str] = "meal"  # breakfast|lunch|dinner|snack

class MacroBreakdown(BaseModel):
    carbs_g: float
    protein_g: float
    fat_g: float
    fiber_g: Optional[float] = 0

class AnalyzeResponse(BaseModel):
    food_name: str
    health_score: int = Field(..., ge=1, le=10)
    calories_estimate: int
    macros: MacroBreakdown
    insights: List[str] = Field(..., min_items=1, max_items=5)
    healthier_alternatives: List[str] = Field(..., max_items=3)
    personalized_advice: str
    portion_note: Optional[str] = None

class ErrorResponse(BaseModel):
    error: str
    message: str
    suggestion: str
