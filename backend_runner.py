"""Alex Backend Runner - PyInstaller entry point.

Usage:
  python backend_runner.py [--port PORT] [--host HOST]

Environment:
  ALEX_BACKEND_PORT  - port to listen on (default 8005)
  ALEX_BACKEND_HOST  - host to bind (default 127.0.0.1)
"""
import os
import sys
import argparse
import multiprocessing

# Required for PyInstaller frozen multiprocessing support
multiprocessing.freeze_support()

if getattr(sys, 'frozen', False):
    bundle_dir = os.path.dirname(sys.executable)
    if bundle_dir not in sys.path:
        sys.path.insert(0, bundle_dir)

from interfaces.main import app
import uvicorn

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int,
                        default=int(os.environ.get('ALEX_BACKEND_PORT', '8005')))
    parser.add_argument('--host', default=os.environ.get('ALEX_BACKEND_HOST', '127.0.0.1'))
    parser.add_argument('--log-level', default='info')
    args = parser.parse_args()

    uvicorn.run(
        app,
        host=args.host,
        port=args.port,
        log_level=args.log_level,
    )

if __name__ == '__main__':
    main()
