import io, uuid
from typing import Optional, List
from fastapi import APIRouter, UploadFile, File, HTTPException, Header
from PIL import Image
from app.schemas import AnalyzeResponse, Prediction
from app.config import LIFELENS_API_KEY

router = APIRouter()

@router.get("/health")
async def health():
    return {"status": "ok"}

@router.post("/analyze-image", response_model=AnalyzeResponse)
async def analyze_image(
    file: UploadFile = File(...),
    x_api_key: Optional[str] = Header(None, convert_underscores=False),
):

    if LIFELENS_API_KEY and x_api_key != LIFELENS_API_KEY:
        raise HTTPException(status_code=401, detail="API key is required")

    if (file.content_type or "").lower() not in {"image/png","image/jpeg","image/webp"}:
        raise HTTPException(status_code=415, detail="Unsupported media type")

    try:
        img = Image.open(io.BytesIO(await file.read())).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file")

    w,h = img.size
    preds: List[Prediction] = [
        Prediction(label="injury_possible", confidence=min(0.99, (w*h)/1e7)),
        Prediction(label="fire_hazard", confidence=0.12),
    ]

    actions = [
        "Call emergency services if anyone is in danger.",
        "Share your location with responders.",
        "Follow on-screen first-aid guidance until help arrives.",
    ]

    return AnalyzeResponse(id=str(uuid.uuid4()),message="Analysis complete", predictions=preds, recommended_actions=actions)

