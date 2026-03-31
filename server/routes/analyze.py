from fastapi import APIRouter, HTTPException
from models.schemas import AnalyzeRequest, AnalyzeResponse, ErrorResponse
from services.gemini_service import analyze_meal

router = APIRouter()

@router.post("/analyze")
async def analyze_food(request: AnalyzeRequest):
    if not request.meal_text and not request.image_base64:
        raise HTTPException(
            status_code=400, 
            detail="Either meal_text or image_base64 must be provided"
        )
    
    result = await analyze_meal(
        meal_text=request.meal_text,
        image_base64=request.image_base64,
        image_mime_type=request.image_mime_type,
        user_profile=request.user_profile,
        meal_type=request.meal_type
    )
    
    if not result["success"]:
        return {
            "success": False,
            "error": result.get("error", "unknown_error"),
            "message": result.get("message", "Analysis failed"),
            "suggestion": result.get("suggestion", "Please try again")
        }
    
    return {"success": True, "data": result["data"]}
