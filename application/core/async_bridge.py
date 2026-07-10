"""Async bridge utilities - anyio-based implementation.

Replaces the previous thread-per-call asyncio.run() pattern with
anyio's efficient event loop management.
"""
from __future__ import annotations

import asyncio
import threading
from typing import Any, Callable, TypeVar

import anyio

T = TypeVar('T')

# Thread-local storage for per-thread event loops
_loop_lock = threading.Lock()
_thread_loops: dict[int, asyncio.AbstractEventLoop] = {}


def _get_thread_loop() -> asyncio.AbstractEventLoop:
    """Get or create an event loop for the current thread."""
    tid = threading.current_thread().ident
    if tid is None:
        raise RuntimeError("No thread ident")
    loop = _thread_loops.get(tid)
    if loop is None or loop.is_closed():
        loop = asyncio.new_event_loop()
        _thread_loops[tid] = loop
    return loop


def run_coroutine_sync(
    coroutine_factory: Callable[[], Any],
    timeout: float | None = None,
) -> T:
    """Run an asyncio coroutine synchronously, safely from any context.
    
    Uses anyio for efficient event loop management instead of
    spawning a new thread + asyncio.run() per call.
    """
    try:
        asyncio.get_running_loop()
        running = True
    except RuntimeError:
        running = False
    
    if running:
        # Already in an async context - use anyio to sync anyio.from_thread.run
        import sniffio
        try:
            sniffio.current_async_library()
            # In async context, schedule via anyio
            import functools
            return anyio.from_thread.run(coroutine_factory)
        except sniffio.AsyncLibraryNotFoundError:
            pass
    
    # Not in async context - run in thread-local loop
    loop = _get_thread_loop()
    coro = coroutine_factory()
    if timeout is not None:
        coro = asyncio.wait_for(coro, timeout=timeout)
    return loop.run_until_complete(coro)


def shutdown_async_bridge_executor_if_initialized() -> None:
    """Close all cached thread-local event loops (called on app shutdown)."""
    with _loop_lock:
        for loop in _thread_loops.values():
            if loop and not loop.is_closed():
                loop.close()
        _thread_loops.clear()
