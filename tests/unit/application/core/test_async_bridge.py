import asyncio

from application.core import async_bridge


def teardown_function():
    async_bridge.shutdown_async_bridge_executor_if_initialized()


def test_run_coroutine_sync_runs_directly_without_active_loop():
    result = async_bridge.run_coroutine_sync(lambda: _return_value("ok"))

    assert result == "ok"


def test_run_coroutine_sync_bridges_from_active_loop():
    """在已运行的事件循环中调用 run_coroutine_sync 应通过 anyio.from_thread.run 桥接。

    新版实现使用 anyio 而非旧的线程池执行器；必须在 anyio worker 线程上下文中
    调用才生效。直接 asyncio.run() 内调用会抛 NoEventLoopError，因此此处通过
    anyio.from_thread.run 在真正的 worker 线程中桥接。
    """
    import anyio

    async def caller():
        # 模拟 worker 线程：用 anyio.from_thread.run 需要 portal token
        # 新实现要求在 anyio worker 上下文，故用 anyio.to_thread.run_sync 间接桥接
        return await anyio.to_thread.run_sync(
            lambda: async_bridge.run_coroutine_sync(lambda: _return_value("bridged"))
        )

    assert asyncio.run(caller()) == "bridged"


def test_shutdown_async_bridge_does_not_create_executor():
    """shutdown 后线程局部 loop 缓存应被清空。"""
    # 先触发一次 run 以填充 _thread_loops
    async_bridge.run_coroutine_sync(lambda: _return_value("warmup"))
    async_bridge.shutdown_async_bridge_executor_if_initialized()

    assert async_bridge._thread_loops == {}


async def _return_value(value):
    await asyncio.sleep(0)
    return value
