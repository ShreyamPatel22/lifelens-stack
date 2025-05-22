# import required modules from fastAPI and other libraries
from fastapi import FASTAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import requests, os
from dotenv import load_dotenv

# load environment variables from .env file
load_dotenv()

# create FastAPI app instance
app = FastAPI()

# Enable CORS so the react app can make requests to this
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"], # can change this to a specific origin
    allow_methods = ["*"], # allow all HTTP methods (POST, GET)
    allow_headers = ["*"], # allow all headers (Content-Type)
)

# gets HuggingFace token securely from the .env file

HF_TOKEN = os.getenv("HF_TOKEN")
# define the endpoint to receive an image file and analyze it

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    #Read the image bytes from the uploaded file
    image_bytes = await file.read()

    # prepare headers for the HuggingFace API request
    headers = {
        "Authorization": f"Bearer {HF_TOKEN}"
    }

    # send that image to the HuggingFace DETR model for object detection
    response = requests.post(
        "https://api-inference.huggingface.co/models/facebook/detr-resnet-50",
        headers = headers,
        files = {"file": image_bytes}
    )

    # Return the JSON response from HuggingFace 
    try: 
        return response.json()
    except Exception as e:
        # Handle the errors
        return {"error":str(e)}
    
    