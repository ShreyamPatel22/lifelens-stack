from pydantic import BaseModel
from typing import List

class Prediction(BaseModel):
    label: str
    confidence: float

class AnalyzeResponse(BaseModel):
    id: str
    message: str
    predictions: List[Prediction]
    recommended_actions: List[str]

    