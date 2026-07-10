"""使用 ModelScope 下载本地向量模型

ModelScope 是阿里云提供的国内模型托管平台，下载速度快。
"""
import sys
from pathlib import Path

# 添加项目根目录到路径
sys.path.insert(0, str(Path(__file__).parent.parent))

print("=" * 60)
print("使用 ModelScope 下载本地向量模型")
print("=" * 60)

try:
    print("\n[1] 检查 ModelScope 是否已安装...")
    try:
        from modelscope import snapshot_download
        print("✓ ModelScope 已安装")
    except ImportError:
        print("✗ ModelScope 未安装")
        print("\n正在安装 ModelScope...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "modelscope"])
        from modelscope import snapshot_download
        print("✓ ModelScope 安装成功")

    print("\n[2] 下载模型: AI-ModelScope/bge-small-zh-v1.5")
    print("    模型大小: ~100MB")
    print("    下载中，请稍候...")

    model_dir = snapshot_download('AI-ModelScope/bge-small-zh-v1.5')
    print(f"✓ 模型下载成功！")
    print(f"✓ 模型路径: {model_dir}")

    print("\n[3] 测试模型...")
    from sentence_transformers import SentenceTransformer

    model = SentenceTransformer(model_dir)
    test_text = "这是一段测试文本"
    embedding = model.encode(test_text)

    print(f"✓ 模型加载成功")
    print(f"✓ 向量维度: {len(embedding)}")

    print("\n" + "=" * 60)
    print("✓ 模型下载并测试成功！")
    print("=" * 60)
    print("\n配置方法:")
    print(f"  在 .env 文件中添加:")
    print(f"  EMBEDDING_SERVICE=local")
    print(f"  EMBEDDING_MODEL_PATH={model_dir}")
    print("\n或者直接使用默认配置（会自动使用已下载的模型）:")
    print(f"  EMBEDDING_SERVICE=local")

except Exception as e:
    print(f"\n✗ 错误: {e}")
    print("\n请尝试其他下载方案，参考: docs/embedding_model_download_guide.md")
    sys.exit(1)
