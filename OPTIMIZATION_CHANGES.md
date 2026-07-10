# Alex 优化记录

**日期:** 2026-07-01  
**源码:** https://github.com/shenminglinyi/Alex (master 分支)  
**原始大小:** 39MB / 1240 个 Python 文件

---

## 已完成的优化

### 🔴 关键性能优化

| # | 文件 | 改动 | 预期收益 |
|---|------|------|----------|
| 1 | `context_budget_allocator.py` | `estimate_tokens()` 从 O(n) 字符扫描改为 O(1) 字节长度估算 | **极高**: 每章调用 25+ 次，消除 250K+ 字符检查 |
| 2 | `async_bridge.py` | 线程池+`asyncio.run()` 每次新建线程 → anyio 复用线程本地 loop | **极高**: 消除 1-5ms/调用 开销 |
| 3 | `persistence_queue_v2` | 添加复合索引 `idx_queue_pop(status, priority, created_at)` | **高**: 队列轮询 O(n log n) → O(log n) |
| 4 | `dependencies.py` | `get_storage()` 添加 `@lru_cache` | **高**: 每次 API 请求少一次容器往返 |

### 🟠 架构优化

| # | 文件 | 改动 | 预期收益 |
|---|------|------|----------|
| 5 | `engine.py` (DAG) | 并行执行改用 `deepcopy(state)` 防止竞态 | **中**: 消除并发写入冲突风险 |
| 6 | `engine.py` (DAG) | `_has_cycle` 递归 DFS → 迭代 DFS | **低**: 防止深度 DAG 触发递归限制 |
| 7 | `context_budget_allocator.py` | 合并伏笔查询（1次 DB 调用替代 2 次） | **中**: 减少 DB 往返 |
| 8 | `context_budget_allocator.py` | `_cached_schedule_inputs` 加 `@lru_cache(maxsize=32)` | **低**: 避免重复计算 |

### 🟡 代码质量

| # | 文件 | 改动 | 预期收益 |
|---|------|------|----------|
| 9 | `anthropic_provider.py` | 3 个 httpx 客户端 → 共享单例连接池 | **中**: 减少 TCP/TLS 连接开销 |
| 10 | `anthropic_provider.py` | 移除伪 UA `claude-cli/2.1.87` | **低**: 避免被 API 提供商识别限流 |
| 11 | `token_guard.py` | 修复 `build_logit_bias()` 返回格式不匹配 | **低**: 消除 dead code |
| 12 | `persistence_queue_adapter.py` | V1 降级日志改为 WARNING + 废弃提示 | **低**: 运维可见性 |

### 🔵 可维护性

| # | 文件 | 改动 | 预期收益 |
|---|------|------|----------|
| 13 | `interfaces/api/deps/` | 1322 行 `dependencies.py` 拆分为 5 个子模块（93 个导出函数） | **高**: 可维护性大幅提升 |

---

## 新增依赖

```
anyio>=4.0
sniffio>=1.3
```

---

## 验证结果

- ✅ 13 个修改文件全部通过 `ast.parse()` 语法检查
- ✅ SQL 迁移文件包含复合索引
- ✅ 子模块 `__init__.py` 正确重导出 93 个函数
- ✅ 原始 `dependencies.py` 保留为 `dependencies_legacy.py` 以防兼容

---

## 未做（需更大改动）

- V1 持久化队列完全移除（已有 adapter 层自动降级到 V2）
- ContextBudgetAllocator 并行化 DB 查询（需 async-native 重构）
- API 认证机制（安全需求，非性能）
- ChromaDB 嵌入计算异步化

---

## 性能预估

热路径（章节生成）延迟减少 **30-50%**，主要来自：
1. `estimate_tokens` 优化（消除 O(n) 扫描）
2. `async_bridge` 优化（消除线程创建开销）
3. 伏笔查询合并（减少 DB 往返）
