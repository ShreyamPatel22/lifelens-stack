import os
from dotenv import load_dotenv

load_dotenv()

LIFELENS_API_KEY = os.getenv("LIFELENS_API_KEY", "")
HF_TOKEN = os.getenv("HF_TOKEN", "")
HF_MODEL_URL = os.getenv("HF_MODEL_URL", "https://api-inference.huggingface.co/models/facebook/detr-resnet-50")
FRONTEND_ORIGINS = os.getenv("FRONTEND_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")