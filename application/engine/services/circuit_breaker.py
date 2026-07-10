"""熔断器：防止 API 雪崩导致所有小说同时进入 ERROR"""
import time
import logging
from enum import Enum
from threading import Lock

logger = logging.getLogger(__name__)


class BreakerState(Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"


class CircuitBreaker:
    def __init__(
        self,
        failure_threshold: int = 5,    # 连续失败 5 次后断开
        reset_timeout: int = 120,       # 断开后 120 秒尝试恢复
        half_open_max_calls: int = 1,  # 试探阶段最多放行 1 次
    ):
        self.failure_threshold = failure_threshold
        self.reset_timeout = reset_timeout
        self.half_open_max_calls = half_open_max_calls

        self._state = BreakerState.CLOSED
        self._failure_count = 0
        self._success_count = 0
        self._last_failure_time = 0.0
        self._lock = Lock()

    def is_open(self) -> bool:
        with self._lock:
            if self._state == BreakerState.OPEN:
                if time.time() - self._last_failure_time > self.reset_timeout:
                    logger.info("[CircuitBreaker] → HALF_OPEN，开始试探")
                    self._state = BreakerState.HALF_OPEN
                    self._success_count = 0
                    return False  # 放行试探
                return True  # 仍在断开期
            return False

    def wait_seconds(self) -> float:
        """还需等待多少秒"""
        elapsed = time.time() - self._last_failure_time
        return max(0.0, self.reset_timeout - elapsed)

    def record_success(self):
        with self._lock:
            if self._state == BreakerState.HALF_OPEN:
                self._success_count += 1
                if self._success_count >= self.half_open_max_calls:
                    logger.info("[CircuitBreaker] → CLOSED，恢复正常")
                    self._state = BreakerState.CLOSED
                    self._failure_count = 0
            elif self._state == BreakerState.CLOSED:
                self._failure_count = 0  # 成功重置计数

    def record_failure(self):
        with self._lock:
            self._failure_count += 1
            self._last_failure_time = time.time()
            if self._state == BreakerState.HALF_OPEN:
                logger.warning("[CircuitBreaker] 试探失败 → OPEN")
                self._state = BreakerState.OPEN
            elif self._failure_count >= self.failure_threshold:
                logger.warning(
                    f"[CircuitBreaker] 连续失败 {self._failure_count} 次 → OPEN，"
                    f"暂停 {self.reset_timeout}s"
                )
                self._state = BreakerState.OPEN

    @property
    def state(self) -> str:
        return self._state.value
