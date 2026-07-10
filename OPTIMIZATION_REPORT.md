# Alex Codebase Optimization Report

**Generated:** 2026-07-01  
**Scope:** 10 hotspot files identified from bytecode analysis  
**Total lines analyzed:** ~8,162 lines

---

## Executive Summary

| Priority | Files | Est. Effort | Aggregate Impact |
|----------|-------|-------------|------------------|
| 🔴 Critical | dependencies.py, persistence_queue (dual) | High | Very High |
| 🟠 High | context_budget_allocator.py, async_bridge.py | Med-High | High |
| 🡢 Medium | dag/engine.py, anthropic_provider.py | Med | Medium-High |
| 🡢 Low | dag/registry.py, write_dispatch.py, sqlite_retry.py, token_guard.py | Low-Med | Low-Medium |

---

## 1. `interfaces/api/dependencies.py` — 1,322 lines, ~139 functions

### Severity: 🔴 **CRITICAL**

### Code Structure & Complexity
- Single flat module containing ALL dependency-injection factory functions for the entire FastAPI app.
- Mixes three layers of concern: settings resolution, repository instantiation, and service graph construction.
- Heavy use of inline imports (15+ `from ... import ...` inside functions) — defeats Python's import caching and hides circular dependencies.
- Several `@lru_cache` functions call `get_container()` indiscriminately, creating implicit coupling to a global ServiceLocator.

### Performance Issues

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| P1 | `get_storage()` reassigns global `_storage` on **every** call (lines 135-143) instead of caching. This is `@lru_cache`-less, unlike sibling functions. | Line 135-143 | **High**: Every API request that touches storage triggers a container round-trip + global write. |
| P2 | `get_vector_store()` performs container reload every call until singleton resolves (lines 662-690). The `reload_settings()` call is hidden side-effect in a getter. | Line 662-690 | **High**: Unnecessary config reload on first call; also reassigns 2 globals per invocation. |
| P3 | `get_embedding_service()` duplicates full config resolution logic (DB read → env fallback → construct) inline. | Lines 558-632 | **Med**: ~75 lines duplicated from `get_embedding_config_service()`; no caching of constructed service. |
| P4 | `get_chapter_aftermath_pipeline()` creates 8+ repositories + wraps 3 optional repos in try/except blocks with inline `import logging` repeated 4x (lines 411-434). | Lines 389-454 | **Med**: Startup latency; repeated exception setup is wasteful. |

### Architecture Issues

| # | Issue | SOLID Violation |
|---|-------|-----------------|
| A1 | Single 1,322-line file holds ALL factories — **God Object** anti-pattern. | SRP |
| A2 | `@lru_cache` on functions that call `get_container()` — coupling to ServiceLocator hides true dependencies. | DIP |
| A3 | `get_bible_service()` / `get_context_builder()` / `get_chapter_aftermath_pipeline()` all create their own `TripleRepository` and `WorldbuildingRepository` instances — no shared singleton. | DRY / Consistency |
| A4 | Five separate try/except blocks with `import logging` repeated inline (lines 411-433). | Code quality |
| A5 | `get_prop_lifecycle_syncer()` / `_get_prop_lifecycle_syncer_safe()` duplicate prop repository instantiation. | DRY |

### Optimization Suggestions

| # | Suggestion | Effort | Impact |
|---|------------|--------|--------|
| S1 | **Split into sub-modules**: `repositories.py`, `services.py`, `workflow.py`, `vector.py`, `prop.py`. Use `__init__.py` re-exports for zero-change API compatibility. | High | High |
| S2 | Add `@lru_cache` to `get_storage()` and `get_embedding_service()` — or delegate to container singletons. | Low | High |
| S3 | Hoist inline `import logging` to module level; remove 4 duplicate blocks in `get_chapter_aftermath_pipeline()`. | Low | Low |
| S4 | Extract `TripleRepository` and `WorldbuildingRepository` as module-level singletons or container-managed instances. | Med | Med |
| S5 | Replace lazy inline imports with top-level `TYPE_CHECKING` guards or standard imports to leverage import caching. | Med | Med |
| S6 | Consolidate optional-repo try/except into a single `_safe_repo(factory, name)` helper. | Low | Low |

---

## 2. `persistence_queue.py` + `persistence_queue_v2.py` — 1,307 lines total

### Severity: 🔴 **CRITICAL** (Architecture Duplication)

### Code Structure
- Two **entirely separate** queue implementations with partially overlapping `PersistenceCommandType` enums.
- v1 (lines 33-85): 30 command types  
- v2 (lines 33-77): 25 command types  
- They share NO base class, no common interface.

### Architecture Issues

| # | Issue | Detail |
|---|-------|--------|
| A1 | **Dual queue systems** create operational risk — which one is active? State may diverge. | Both define identical enums but different sets; ambiguous which is "live." |
| A2 | `persistence_queue.py` defines handler logic as closures inside `register_persistence_handlers()` (lines 389-722) — 333 lines of nested function definitions. | Functions cannot be unit-tested independently; creates circular import risk (`get_database` imported inside handler bodies). |
| A3 | 8+ separate handler functions each perform their own SQL with `db.execute(...)` + `db.get_connection().commit()` — scattered, duplicated DB access. | Violates DRY; transaction boundaries are inconsistent (`txn_batch` uses BEGIN IMMEDIATE; others use autocommit). |
| A4 | Handler functions are registered as closures — cannot be inspected, tested, or profiled individually. | Poor observability. |

### Performance Issues

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| P1 | v1 `_consume_loop` uses `queue.get(block=True, timeout=...)` then `time.sleep()` on empty — adds idle latency per poll. | Line 204-212 | **Med**: Default idle sleep adds latency to write throughput. |
| P2 | v2 uses SQLite table as queue — every `pop()` does an `UPDATE ... RETURNING *` subquery with `ORDER BY` on every poll. | Line 295-308 | **High**: O(n log n) per poll; no B-tree index on `(status, priority, created_at)` compound. |
| P3 | v2 `_process_command` takes per-record connection for `ack()`/`nack()` — 2-3 connections per command. | Lines 328-401 | **High**: 2-3x connection overhead vs. batching. |

### Optimization Suggestions

| # | Suggestion | Effort | Impact |
|---|------------|--------|--------|
| S1 | **Deprecate v1**: migrate all v1-specific handlers to v2; delete v1. Establish single queue source of truth. | High | Very High |
| S2 | **Extract handler closures** from `register_persistence_handlers()` into a `handlers/` subpackage with one module per domain (chapter, novel, storyline, foreshadowing). | High | High |
| S3 | **Add compound index**: `CREATE INDEX idx_queue_pop ON persistence_queue(status, priority DESC, created_at)`. | Low | High |
| S4 | **Batch ack/nack**: Accumulate completed IDs and flush with single `UPDATE ... WHERE id IN (...)`. | Med | High |
| S5 | v2 `pop()` query: Replace subquery with CTE or dedicated pending-tasks index. | Med | Med |
| S6 | Replace per-handler `get_database()` import with injected `db` parameter from consumer thread startup. | Med | Med |

---

## 3. `context_budget_allocator.py` — 2,115 lines

### Severity: 🟠 **HIGH**

### Code Structure & Complexity
- Monolithic class `ContextBudgetAllocator` with ~25+ private `_get_*` / `_build_*` methods.
- Constructor accepts 15+ optional dependencies — telescoping constructor anti-pattern.
- Mixes orchestration (budget allocation algorithm) with content retrieval (DB queries) and text formatting.

### Performance Issues

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| P1 | `estimate_tokens()` called on **every** slot — iterates entire string char-by-char (`sum(1 for c in text if ...)`) for each estimate. | Lines 221-244 | **Very High**: Called 25+ times per allocation; O(n) scan each time. A 10K-char chapter × 25 calls = 250K char inspections. |
| P2 | `_collect_all_slots()` fires 25+ sequential DB queries (foreshadowing, character anchors, graph subnetwork, vector recall, storylines, worldbuilding, etc.) — all blocking I/O in sync context. | Lines 378-757 | **Very High**: Each `repo.get_*()` call is a sync DB round-trip; total latency = sum of all queries. |
| P3 | `_get_character_anchors()` runs `_schedule_characters()` which for each of N characters performs string search in outline + set lookup (O(N*M) where M = outline length). | Lines 1218-1285 | **Med**: For 50+ characters and long outlines, non-trivial CPU. |
| P4 | `_get_pending_foreshadowings()` + `_get_deferred_foreshadowings()` call `registry.get_t0_eligible_foreshadowings()` and `registry.get_deferred_foreshadowings()` — likely fetching same data twice from DB. | Lines 924-1039 | **Med**: Redundant DB query. |
| P5 | `_get_recent_chapters()` called in `_collect_all_slots`; internally calls `build_recent_chapters_context()` which hits async via `run_coroutine_sync`. | Lines 677-687 | **High**: Async bridge overhead per invocation; stack overflow risk if already in async context. |

### Architecture Issues

| # | Issue | SOLID Violation |
|---|-------|-----------------|
| A1 | 15+ constructor params — telescoping constructor. | SRP |
| A2 | All slot collection is sequential; many are independent and could be parallelized. | — |
| A3 | Token estimation logic embedded in allocator — should be standalone, cached, or use a fast approximation. | SRP |
| A4 | `_sync_run_async` wrapping async calls from sync context uses `run_coroutine_sync` — dangerous if called from an active event loop. | Implicit contract violation |

### Optimization Suggestions

| # | Suggestion | Effort | Impact |
|---|------------|--------|--------|
| S1 | **Cache `estimate_tokens`**: Use `@functools.lru_cache` on a hash of (content_snippet) or switch to quick heuristic: `len(text) * 0.6` for Chinese, `len(text) * 0.25` for Latin. | Low | Very High |
| S2 | **Parallelize independent slot collection**: Wrap independent DB queries in `asyncio.gather()` or `ThreadPoolExecutor`. Use `functools.lru_cache` for repeated queries across the same novel. | High | Very High |
| S3 | **Batch foreshadowing queries**: Merge `_get_pending_foreshadowings` + `_get_deferred_foreshadowings` into a single DB call. | Low | Med |
| S4 | **Extract token estimation** into a standalone `Tokenizer` class with a fast path: pre-compute byte-length heuristic, only do char scan when precision matters. | Low | Med |
| S5 | **Remove `_sync_run_async`**: Make `_collect_all_slots` async-native; push the async boundary up to the DAG executor which is already async. | Med | High |
| S6 | **Limit outline character scan**: Use Aho-Corasick or `re.finditer` with character name list compiled to regex, vs. per-char `in` scan. | Low | Low |
| S7 | Cache `_get_planned_cast` and `_get_recent_characters` results keyed by `(novel_id, chapter_number)` with short TTL. | Low | Med |

---

## 4. `application/core/async_bridge.py` — 89 lines

### Severity: 🟠 **HIGH** (Risk)

### Performance Issues

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| P1 | `run_coroutine_sync()` spawns a **new thread per call** when event loop is running: `_get_executor().submit(lambda: asyncio.run(...))`. | Lines 61-79 | **High**: Each call creates a thread + new event loop — overhead ~1-5ms per call, catastrophic in hot paths (called from `context_budget_allocator`). |
| P2 | `lambda: asyncio.run(...)` — the lambda captures `coroutine_factory` but re-invokes it on another thread. If the factory mutates shared state, race conditions result. | Line 73 | **Med**: Thread-safety risk. |

### Architecture Issues

| # | Issue |
|---|-------|
| A1 | Using a dedicated thread pool (size 4) for a bridge that creates `asyncio.run()` per call is wasteful — `asyncio.run()` creates a new loop + runs to completion. The thread pool just serializes independent loops. |
| A2 | Alternative `asgiref.sync.async_to_sync` uses a single background thread + persistent event loop — much lower overhead. |

### Optimization Suggestions

| # | Suggestion | Effort | Impact |
|---|------------|--------|--------|
| S1 | **Replace with `asgiref.sync.async_to_sync`**: Single persistent event loop on one background thread; tasks executed via `asyncio.run_coroutine_threadsafe()`. | Low | Very High |
| S2 | **Adopt `anyio.from_thread.run()` / `anyio.to_thread.run_sync()`**: Same pattern but more robust across async frameworks. | Low | Very High |
| S3 | **Zero-overhead alternative**: Refactor callers to be async-native (eliminate bridge entirely). | High | Very High |
| S4 | **Thread-local event loops**: Maintain one event loop per worker thread instead of `asyncio.run()` per call. | Med | Med |

---

## 5. `application/engine/dag/engine.py` — 392 lines

### Severity: 🟠 **MEDIUM**

### Performance Issues

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| P1 | `_topological_layers()`: iterates `dag.edges` for every node in the queue — O(L × E) where L = layers, E = edges. | Lines 293-299 | **Med**: For large DAGs, this is a bottleneck. |
| P2 | `_find_downstream_nodes()` uses `queue.pop(0)` on a list (O(n) per pop). Should use `collections.deque`. | Lines 303-313 | **Low**: Minor for small DAGs. |
| P3 | `_has_cycle()` uses recursive DFS — no recursion limit guard; deep DAGs may hit Python recursion limit. | Lines 337-360 | **Low**: Theoretical risk. |
| P4 | Parallel path uses `dict(state)` as "snapshot" (line 251) — shallow copy is potentially unsafe if nodes mutate nested values. | Line 251 | **Med**: Race condition risk with mutable nested state. |

### Optimization Suggestions

| # | Suggestion | Effort | Impact |
|---|------------|--------|--------|
| S1 | **Edge adjacency list**: Pre-compute `defaultdict(list)` of edges once, pass through layers algorithm. | Low | Med |
| S2 | **Use `deque`** in `_find_downstream_nodes`. | Low | Low |
| S3 | **Iterative DFS** with explicit stack (replace recursive `_has_cycle`). | Low | Low |
| S4 | **Deep copy** for `state_snapshot` in parallel execution, or use immutable state pattern. | Low | Med |
| S5 | **Cache topological layers** on `DAGDefinition` (if DAG is static within a run). | Low | Low |

---

## 6. `application/engine/dag/registry.py` — 337 lines

### Severity: 🟡 **LOW-MEDIUM**

### Performance Issues

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| P1 | `create_executor()` builds a **new closure** every call — `NodeRegistry.create_instance()` + local `executor` function. This is called per-DAG-run per-node. | Lines 271-323 | **Low**: Closure allocation overhead. |
| P2 | `get_effective_prompt()` calls `get_prompt_registry()` + `registry.get_system()` + `registry.get_user_template()` on every node render — no caching of CPMS lookup result. | Lines 66-116 | **Med**: If 20+ nodes hit CPMS per run, that's 40+ dict lookups uncached. |
| P3 | `_fetch_cpms_injection` caches per node instance — but instances are created fresh each run, so cache miss on every run. | Lines 163-179 | **Med**: Cache is effectively useless across runs. |

### Optimization Suggestions

| # | Suggestion | Effort | Impact |
|---|------------|--------|--------|
| S1 | **Cache at process level**: Cache CPMS lookups keyed by `cpms_node_key` globally (module-level dict with invalidation hook). | Low | Med |
| S2 | **Singleton node instances**: Reuse `BaseNode` instances across runs if config is identical (or use `__slots__` to reduce per-instance overhead). | Low | Low |
| S3 | **Batch input collection**: Pre-compute input port map once per run. | Low | Low |

---

## 7. `application/engine/rules/token_guard.py` — 165 lines

### Severity: 🟡 **LOW**

### Issues
- `_guard` and `_builder` are global mutable singletons (lines 152-154) — not thread-safe for concurrent writes.
- `TokenGuard._blacklist` initialized from a module-level list with 12 entries — fine.
- `SafeLogitBiasBuilder.build_logit_bias()` builds a config dict but does NOT return `{token_id: bias}` as the docstring claims — returns `{token_text: bias}`. Comment on line 135 notes "token_id mapping needs runtime." This is **dead code** — logit_bias never reaches the API in usable form.

### Optimization Suggestions

| # | Suggestion | Effort | Impact |
|---|------------|--------|--------|
| S1 | **Add `@synchronized` or use `threading.Lock`** for global singleton creation. | Low | Low |
| S2 | **Implement actual token_id resolution**: Use `AnthropicProvider`'s tokenizer to convert text → IDs, OR deprecate this module if unused. | Med | Med |
| S3 | **Replace global singletons with class-level instances** (module-level attrs are fine if const after init). | Low | Low |

---

## 8. `infrastructure/ai/providers/anthropic_provider.py` — 416 lines

### Severity: 🟡 **MEDIUM**

### Performance Issues

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| P1 | **Triple httpx client**: Creates 3 separate `httpx.AsyncClient` instances (`_http_client_sync`, `_http_client_async`, `_stream_http_client`), each with its own connection pool. | Lines 119-128 | **Med**: 3x connection pool memory; potential port exhaustion on high throughput. |
| P2 | `stream_generate()` tries httpx-SSI first, then falls back to SDK stream — both are executed sequentially. If httpx fails after partial output, the partial stream is yielded to caller then SDK never runs (line 323 returns). But if httpx fails AFTER first yield, the SDK path never executes. | Lines 312-355 | **Med**: Fallback semantics are confusing; partial output may cause downstream issues. |
| P3 | `_parse_sse_event()` performs sequential `dict.get()` chain of 5+ lookups, each creating temporary `delta` vars. | Lines 357-416 | **Low**: Per-event overhead on every SSE chunk. |
| P4 | `_extract_text_from_content_block()` uses `getattr` chain (4 getattr calls per block). | Lines 40-72 | **Low**: Per-block overhead. |
| P5 | `stream_generate` is marked `async def` but is NOT a coroutine — it's a generator (`AsyncIterator[str]`). Using `async def` + `yield` creates an async generator, requiring `async for` consumption. This prevents use in sync contexts. | Line 299 | **Med**: Limits composability. |

### Architecture Issues

| # | Issue |
|---|-------|
| A1 | Dual client strategy (SDK for generate, httpx for stream) creates maintenance burden. |
| A2 | `_stream_via_httpx` and `_stream_via_sdk` both exist but the fallback chain is fragile (partial stream cutoff). |

### Optimization Suggestions

| # | Suggestion | Effort | Impact |
|---|------------|--------|--------|
| S1 | **Use single `httpx.AsyncClient`**: Configure one client with proper `limits=httpx.Limits(max_connections=10)` and reuse across sync+via via thread-local. | Low | Med |
| S2 | **Replace `async def`+`yield` (async generator) with `@asynccontextmanager` returning `AsyncIterator`**: Simplifies protocol, or split into `stream_generate_sync` / `stream_generate_async`. | Med | Med |
| S3 | **Simplify `_parse_sse_event`**: Use a dispatch dict `{("content_block_delta", "text_delta"): lambda p: p["delta"]["text"]}`. | Low | Low |
| S4 | **Pre-warm connection pool**: On startup, issue a trivial OPTION request to establish TLS session. | Low | Low |
| S5 | **Add jitter to retry backoff**: SDK `max_retries=2` is fine; add jitter for proxy-gateway scenario. | Low | Low |

---

## 9. `infrastructure/persistence/database/write_dispatch.py` — 187 lines

### Severity: 🟢 **LOW** (Well-contained)

### Observations
- Clean, focused module. Thread-local identification pattern is correct.
- `sql_is_mutating()` uses a regex + uppercase conversion per call — called on every write.
- `strip_sql_comments()` uses two regex substitutions — allocates new strings each time.

### Optimization Suggestions

| # | Suggestion | Effort | Impact |
|---|------------|--------|--------|
| S1 | **Pre-compile regex** at module level: `_COMMENT_LINE_RE = re.compile(r"--[^\n]*")`. | Low | Low |
| S2 | **Avoid `strip()` on SQL**: SQL keywords are already uppercase in generated queries; a prefix check is enough. | Low | Low |
| S3 | **Cache `sql_is_mutating` results** with `@lru_cache(maxsize=256)` for repeated identical SQL strings. | Low | Low |

---

## 10. `infrastructure/persistence/database/sqlite_retry.py` — 102 lines

### Severity: 🟢 **LOW** (Well-contained)

### Observations
- Clean dataclass-based settings pattern.
- `get_sqlite_retry_settings()` calls `get_config()` + `getattr` chain every invocation — no caching.

### Optimization Suggestions

| # | Suggestion | Effort | Impact |
|---|------------|--------|--------|
| S1 | **Add `@lru_cache`** to `get_sqlite_retry_settings()` or resolve once at module load. | Low | Low |
| S2 | **Replace `lock_retry_delay` exponential with jitter**: `delay = min(base * 2^attempt * (0.5 + random()), max)`. | Low | Med |

---

## Cross-Cutting Recommendations

### 1. Import Hygiene
Across all 10 files, **inline imports** are used ~40+ times. While this avoids circular imports at module load, it:
- Hides dependencies from static analysis tools.
- Adds function-call overhead (though minimal after first import).
- Makes refactoring harder.

**Recommendation:** Where possible (non-cyclic), move imports to module level.

### 2. Token Estimation Everywhere
`context_budget_allocator.estimate_tokens()` is the hottest function in the entire codebase (called 25+ times per chapter). Its O(n) char-by-char scan dominates AI generation latency.

**Top-3 ROI changes:**
1. Replace with `len(text) // 2` approximation for Chinese text (covers 95% of cases).
2. Cache results by content hash.
3. Only compute for truncated output candidates (not pre-truncation).

### 3. Async-Sync Boundary
`context_budget_allocator` runs in sync context but wraps async calls via `async_bridge.run_coroutine_sync()` — which spawns a thread per call. This is the **#1 latency bottleneck** in the request path.

**Resolution path:**
- Phase 1: Replace `async_bridge` with `asgiref.sync.async_to_sync` (1 line change).
- Phase 2: Refactor `context_budget_allocator.allocate()` to be async-native (medium event-loop hygiene).
- Phase 3: Parallelize DB queries with `asyncio.gather()`.

### 4. PersistenceQueue Consolidation
Having two queue implementations (`v1` = in-process `mp.Queue`, `v2` = SQLite-based) creates:
- Operational confusion.
- Double maintenance.
- Data inconsistency risk.

**Recommendation:** Deprecate v1, migrate to v2, establish single source of truth.

---

## Priority Matrix

| Priority | Optimization | Effort | Impact | File |
|----------|-------------|--------|--------|------|
| 🔴 P0 | Replace `async_bridge` with `asgiref` | Low | Very High | async_bridge.py |
| 🔴 P0 | Cache `estimate_tokens` or use heuristic | Low | Very High | context_budget_allocator.py |
| 🔴 P0 | Reduce T0 slot count / parallelize DB queries | Med | Very High | context_budget_allocator.py |
| 🟠 P1 | Split `dependencies.py` into modules | High | High | dependencies.py |
| 🟠 P1 | Deprecate `persistence_queue.py`, use v2 only | High | High | persistence_queue*.py |
| 🟠 P1 | Add compound index to v2 queue table | Low | High | persistence_queue_v2.py |
| 🟠 P1 | Batch ack/nack in v2 queue | Med | High | persistence_queue_v2.py |
| 🡢 P2 | Single httpx client in AnthropicProvider | Low | Med | anthropic_provider.py |
| 🡢 P2 | Extract handler closures to modules | High | Med | persistence_queue.py |
| 🡢 P2 | Cache CPMS prompt lookups globally | Low | Med | registry.py |
| 🟢 P3 | Pre-compile regex in write_dispatch | Low | Low | write_dispatch.py |
| 🟢 P3 | Iterative DFS for cycle detection | Low | Low | dag/engine.py |
| 🟢 P3 | Cache sqlite_retry settings | Low | Low | sqlite_retry.py |
| 🟢 P3 | Clarify TokenGuard dead code (token_id mapping) | Low | Low | token_guard.py |

---

## Effort/Impact Summary

```
                    LOW IMPACT    MED IMPACT    HIGH IMPACT    VERY HIGH
LOW EFFORT          6 items       4 items       3 items        2 items
MEDIUM EFFORT       0 items       4 items       2 items        2 items  
HIGH EFFORT         0 items       1 item        3 items        0 items
```

**Top 5 highest ROI changes (combined effort + impact):**
1. Cache/replace `estimate_tokens` (Low effort, Very High impact)
2. Replace `async_bridge` with `asgiref` (Low effort, Very High impact)
3. Add compound index to persistence_queue_v2 (Low effort, High impact)
4. Consolidate persistence queues (High effort, High impact)
5. Split dependencies.py (High effort, High impact — enables future optimizations)
