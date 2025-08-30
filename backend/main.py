# import required modules from fastAPI and other libraries
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import requests
import os
import time
from fastapi.responses import RedirectResponse, Response




# load environment variables from .env file
load_dotenv()

# gets HuggingFace token securely from the .env file
HF_TOKEN = os.getenv("HF_TOKEN")
if not HF_TOKEN:
    print("WARNING: HF_TOKEN not set. /analyze-image will fail until you add it to backend/.env")

HF_MODEL_URL = os.getenv(
    "HF_MODEL_URL",
    "https://api-inference.huggingface.co/models/facebook/detr-resnet-50",
)
# create FastAPI app instance
app = FastAPI(title="LifeLens Backend", version="0.1.0")


# for local host, using localhost:5173
FRONTEND_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Enable CORS so the react app can make requests to this
app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS, #TODO change to prod URL later
    allow_credentials = True, # can change this to a specific origin
    allow_methods = ["*"], # allow all HTTP methods (POST, GET)
    allow_headers = ["*"], # allow all headers (Content-Type)
)

@app.get("/healthz")
def healthz():
    return {"status": "ok", "service": "backend", "version": "0.1.0"}

@app.get("/", include_in_schema=False)
def root():
    # Redirect the bare domain to the Swagger docs
    return RedirectResponse(url="/docs")

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    # No favicon yet; return empty 204 instead of 404
    return Response(status_code=204)


# define the endpoint to receive an image file and analyze it
@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    if not HF_TOKEN:
        raise HTTPException(status_code=500, detail="HF_TOKEN not configured on server")
    
    ct = (file.content_type or "").lower()

    #Read the image bytes from the uploaded file
    try: 
        image_bytes = await file.read()
        if not image_bytes:
            raise ValueError("empty file")

        allowed_types = {
            "image/png", "image/jpeg", "image/jpg", "image/webp",
            "image/bmp", "image/gif", "image/tiff"
        }    
        if ct not in allowed_types:
            raise HTTPException(
                status_code = 415,
                detail=f"unsupported media type: {ct or 'unknown'}. "
                    f"Use one of: {', '.join(sorted(allowed_types))}"
            )
        
    except HTTPException:
        # preserve 4xx you intentionally raise (e.g., 415)
        raise

    except Exception as e:
        raise HTTPException(status_code = 400, detail= f"invalid file: {e}")
    
    # prepare headers for the HuggingFace API request
    headers = {
        "Authorization": f"Bearer {HF_TOKEN}",
        "Content-Type": ct,
    }


    # Retry up to 3 times if HF returns 503 "model loading"
    for attempt in range(3):
        try:
            resp = requests.post(
                HF_MODEL_URL,
                headers=headers,
                data=image_bytes,
                timeout=30,
            )
        except requests.Timeout:
            # If timeouts keep happening, bail out; otherwise backoff & retry
            if attempt < 2:
                time.sleep(2 * (attempt + 1))   # 2s, 4s
                continue
            raise HTTPException(status_code=504, detail="upstream timeout")
        except requests.RequestException as e:
            # For transient network issues, backoff & retry once or twice
            if attempt < 2:
                time.sleep(2 * (attempt + 1))
                continue
            raise HTTPException(status_code=502, detail=f"upstream error: {e}")

        # HF often returns 503 while warming the model; backoff & retry
        if resp.status_code == 503 and "loading" in resp.text.lower() and attempt < 2:
            time.sleep(2 * (attempt + 1))
            continue
        break

    if resp.status_code != 200:
        try:
            err_json = resp.json()
        except Exception:
            err_json = {"error": resp.text}
        return JSONResponse(status_code=resp.status_code, content=err_json)
    
    try: 
        return resp.json()
    except ValueError:
        return JSONResponse(status_code=200, content={"raw": resp.text})



        