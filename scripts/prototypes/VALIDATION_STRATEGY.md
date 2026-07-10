# 战役一：两步验证策略

## 为什么要分两步？

1. **模拟版（5分钟）**：验证架构流程，零成本
2. **真实版（30-60分钟）**：验证内容质量，需要 API 费用

## 第一步：模拟版验证（推荐先跑这个）

### 运行方式
```bash
# Windows
scripts\run_prototype_mock.bat

# Linux/Mac
python scripts/prototype_mock.py
```

### 验证内容
- ✅ 状态机流转（planning → writing → continue）
- ✅ 幕级跨越是否平滑（第 10→11 章，第 20→21 章）
- ✅ 伏笔账本逻辑（5 个硬塞的伏笔能否在正确章节被回收）
- ✅ 异步扇出机制

### 成功标准
- 30 章全部生成
- 伏笔回收率 = 100%（因为是硬编码的）
- 没有异常或崩溃

### 如果失败
说明你的架构流程有问题，需要先修复基础逻辑。

---

## 第二步：真实版验证（模拟版通过后再跑）

### 运行方式
```bash
# Windows
scripts\run_prototype.bat

# Linux/Mac
python scripts/prototype_continuous_planning.py
```

### 验证内容
- ✅ 真实 LLM 生成的内容质量
- ✅ 持续规划是否会导致逻辑断裂
- ✅ 伏笔自动提取和回收的准确率

### 成功标准
- 30 章全部生成（约 6 万字）
- 伏笔回收率 >= 60%
- 幕与幕之间没有明显逻辑断裂

### 预计成本
- API 调用：约 40-50 次（规划 + 生成）
- 预计费用：$5-10 USD

### 如果失败

#### 伏笔回收率 < 60%
**原因**：关键词匹配太简单

**解决方案**：
1. 在生成 Prompt 中明确要求埋设伏笔
2. 使用 LLM 提取伏笔（而不是关键词）
3. 在回收时强制要求 LLM 回应伏笔

#### 逻辑断裂
**原因**：幕与幕之间的上下文传递不足

**解决方案**：
1. 增加前情摘要的详细程度
2. 在规划下一幕时，提供更多前一幕的细节
3. 引入"幕级记忆"机制

---

## 验证报告对比

### 模拟版报告
```json
{
  "mode": "mock",
  "total_chapters": 30,
  "total_words": 75000,
  "foreshadowing": {
    "total_planted": 5,
    "resolved": 5,
    "pending": 0,
    "resolve_rate": "100.0%"
  }
}
```

### 真实版报告
```json
{
  "mode": "real",
  "total_chapters": 30,
  "total_words": 62000,
  "foreshadowing": {
    "total_planted": 12,
    "resolved": 8,
    "pending": 4,
    "resolve_rate": "66.7%"
  }
}
```

---

## 下一步

### 如果两个验证都通过
进入**战役二：搭建调度中心**
- 实现状态机 (novel.stage)
- 实现 Context Assembly
- 实现异步扇出队列

### 如果模拟版失败
修复架构流程，直到模拟版通过。

### 如果真实版失败
优化 Prompt 和伏笔提取逻辑，直到真实版通过。

---

## 快速决策树

```
开始
  │
  ├─ 运行模拟版 (5分钟)
  │   │
  │   ├─ 通过 ✅
  │   │   └─ 运行真实版 (30-60分钟)
  │   │       │
  │   │       ├─ 通过 ✅ → 进入战役二
  │   │       └─ 失败 ❌ → 优化 Prompt
  │   │
  │   └─ 失败 ❌ → 修复架构流程
  │
  └─ 不确定？→ 先跑模拟版
```

---

## 现在就开始

**推荐操作**：
1. 双击 `scripts\run_prototype_mock.bat`
2. 等待 5 分钟
3. 查看 `data/prototype_results/` 目录的报告
4. 如果通过，再决定是否跑真实版
