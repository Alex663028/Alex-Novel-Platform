"""测试 GPU 加速的向量检索性能

对比 CPU vs GPU 的性能差异
"""
import asyncio
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from infrastructure.ai.local_embedding_service import LocalEmbeddingService


async def benchmark():
    print("=" * 60)
    print("GPU 加速性能测试")
    print("=" * 60)

    # 准备测试数据
    test_texts = [
        "林雪站在雪山之巅，寒风刺骨。她回想起三年前的那个夜晚。",
        "李明在图书馆里翻阅古籍，寻找关于古代秘术的线索。",
        "雪山上的风越来越大，林雪感到一丝不安，她知道暴风雪即将来临。",
        "古老的卷轴上记载着一个失传已久的传说，李明仔细研读每一个字。",
        "夜幕降临，林雪在山洞中生起篝火，思考着明天的行程。"
    ] * 20  # 100 条文本

    print(f"\n测试数据: {len(test_texts)} 条文本")

    # 测试 GPU
    print("\n[1] GPU 模式测试...")
    try:
        service_gpu = LocalEmbeddingService(
            model_name="./.models/bge-small-zh-v1.5",
            use_gpu=True
        )

        start = time.time()
        embeddings_gpu = await service_gpu.embed_batch(test_texts)
        gpu_time = time.time() - start

        print(f"✓ GPU 处理时间: {gpu_time:.3f}秒")
        print(f"✓ 平均每条: {gpu_time/len(test_texts)*1000:.2f}ms")
        print(f"✓ 吞吐量: {len(test_texts)/gpu_time:.1f} 条/秒")
    except Exception as e:
        print(f"✗ GPU 测试失败: {e}")
        gpu_time = None

    # 测试 CPU
    print("\n[2] CPU 模式测试...")
    try:
        service_cpu = LocalEmbeddingService(
            model_name="./.models/bge-small-zh-v1.5",
            use_gpu=False
        )

        start = time.time()
        embeddings_cpu = await service_cpu.embed_batch(test_texts)
        cpu_time = time.time() - start

        print(f"✓ CPU 处理时间: {cpu_time:.3f}秒")
        print(f"✓ 平均每条: {cpu_time/len(test_texts)*1000:.2f}ms")
        print(f"✓ 吞吐量: {len(test_texts)/cpu_time:.1f} 条/秒")
    except Exception as e:
        print(f"✗ CPU 测试失败: {e}")
        cpu_time = None

    # 性能对比
    if gpu_time and cpu_time:
        print("\n" + "=" * 60)
        print("性能对比")
        print("=" * 60)
        speedup = cpu_time / gpu_time
        print(f"GPU 加速比: {speedup:.2f}x")
        print(f"性能提升: {(speedup-1)*100:.1f}%")

        if speedup > 2:
            print("\n✅ GPU 加速效果显著，建议启用")
        elif speedup > 1.2:
            print("\n✅ GPU 有一定加速效果")
        else:
            print("\n⚠️  GPU 加速不明显，可能受限于数据量或模型大小")

    print("\n" + "=" * 60)
    print("推荐配置")
    print("=" * 60)
    print("在 .env 中设置:")
    print("  EMBEDDING_USE_GPU=true  # 启用 GPU 加速")
    print("\n适用场景:")
    print("  - 批量索引章节（100+ 章）")
    print("  - 实时检索（需要快速响应）")
    print("  - 大规模知识库构建")


if __name__ == "__main__":
    asyncio.run(benchmark())
