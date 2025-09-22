# import required modules from fastAPI and other libraries
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, Response
from pydantic import BaseModel
from datetime import datetime

from app.config import FRONTEND_ORIGINS
from app.routes.analyze import router as analyze_router

# create FastAPI app instance
app = FastAPI(title="LifeLens Backend", version="0.1.0")

# Enable CORS so the react app can make requests to this
app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS, #TODO change to prod URL later
    allow_credentials = True, # can change this to a specific origin
    allow_methods = ["*"], # allow all HTTP methods (POST, GET)
    allow_headers = ["*"], # allow all headers (Content-Type)
)

# Alert API
class AlertIn(BaseModel):
    name: str
    location: str
    description: str
    severity: str

class AlertOut(AlertIn):
    id: int
    createdAt: str

ALERTS: list[AlertOut] = []

@app.post("/alerts", response_model=AlertOut)
def create_alert(payload: AlertIn):
    alert = AlertOut(
        id = len(ALERTS) + 1,
        createdAt = datetime.utcnow().isoformat() + "Z",
        **payload.model_dump(),
    )
    ALERTS.append(alert)
    return alert

@app.get("/alerts", response_model=list[AlertOut])
def list_alerts():
    return ALERTS


@app.get("/healthz")
def healthz():
    return {"status": "ok", "service": "backend", "version": "0.1.0"}

@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(status_code=204)

app.include_router(analyze_router, tags=["analyze"])
