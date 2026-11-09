# YASMINE GAME ENGINE (YGE)

Starter scaffold for the first YGE prototype.

## Requirements
- Python 3.10+
- A modern browser

## Run locally
From the project root:

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn server.main:app --reload --host 0.0.0.0 --port 8000
```

Open http://127.0.0.1:8000

The first milestone is only a browser-rendered 3D test scene. Multiplayer,
Telegram authentication, persistent storage, and production deployment are
intentionally not included yet.
