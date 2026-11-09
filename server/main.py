from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

PROJECT_ROOT = Path(__file__).resolve().parent.parent
FRONTEND_DIR = PROJECT_ROOT / "frontend"

app = FastAPI(title="YASMINE GAME ENGINE", version="0.1.0")

app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")


@app.get("/health")
async def health():
    return {"status": "ok", "engine": "YGE", "version": "0.1.0"}


@app.get("/")
async def home():
    return FileResponse(FRONTEND_DIR / "index.html")
