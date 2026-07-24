#!/usr/bin/env python
"""启动 backend: python scripts/start_backend.py"""
import sys
import os

PROJECT = r"F:\小说工具\PlotPilot-Optimized-Source"
sys.path.insert(0, PROJECT)
os.chdir(PROJECT)

# Ensure logs dir exists
os.makedirs("logs", exist_ok=True)

from interfaces.main import app
import uvicorn

if __name__ == "__main__":
    print("Starting Alex backend on http://127.0.0.1:8005")
    uvicorn.run(app, host="127.0.0.1", port=8005)
