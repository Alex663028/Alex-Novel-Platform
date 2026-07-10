"""下载并测试本地向量模型

下载 BAAI/bge-small-zh-v1.5 模型到本地
"""
import sys
from pathlib import Path

# 添加项目根目录到路径
sys.path.insert(0, str(Path(__file__).parent.parent))

from sentence_transformers import SentenceTransformer

print("=" * 60)
print("下载本地向量模型")
print("=" * 60)

print("\n[1] 下载模型: BAAI/bge-small-zh-v1.5")
print("    模型大小: ~100MB")
print("    首次运行会自动下载到 ~/.cache/huggingface/")
print()

try:
    # 下载模型（首次运行会从 HuggingFace 下载）
    model = SentenceTransformer('BAAI/bge-small-zh-v1.5')
    print("✓ 模型下载成功！")

    # 测试模型
    print("\n[2] 测试模型...")
    test_texts = [
        "林雪站在雪山之巅，寒风刺骨。",
        "李明在图书馆里翻阅古籍，寻找线索。",
        "雪山上的风越来越大，林雪感到一丝不安。"
    ]

    print(f"    测试文本数量: {len(test_texts)}")
    embeddings = model.encode(test_texts)
    print(f"✓ 生成向量维度: {embeddings.shape}")
    print(f"✓ 向量维度: {embeddings.shape[1]}")

    # 计算相似度
    print("\n[3] 计算语义相似度...")
    from sklearn.metrics.pairwise import cosine_similarity

    query = "雪山上的场景"
    query_embedding = model.encode([query])

    similarities = cosine_similarity(query_embedding, embeddings)[0]

    print(f"    查询: '{query}'")
    print("    相似度排名:")
    for i, (text, sim) in enumerate(sorted(zip(test_texts, similarities), key=lambda x: x[1], reverse=True), 1):
        print(f"    {i}. [{sim:.4f}] {text}")

    print("\n" + "=" * 60)
    print("✓ 本地模型下载并测试成功！")
    print("=" * 60)
    print("\n模型信息:")
    print(f"  - 模型名称: BAAI/bge-small-zh-v1.5")
    print(f"  - 向量维度: {embeddings.shape[1]}")
    print(f"  - 缓存位置: ~/.cache/huggingface/hub/")
    print("\n下一步:")
    print("  1. 配置 .env: EMBEDDING_SERVICE=local")
    print("  2. 使用本地模型替代 OpenAI API")

except Exception as e:
    print(f"\n✗ 错误: {e}")
    print("\n可能的解决方案:")
    print("  1. 检查网络连接（需要访问 HuggingFace）")
    print("  2. 使用镜像: export HF_ENDPOINT=https://hf-mirror.com")
    sys.exit(1)
