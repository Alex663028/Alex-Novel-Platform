from dataclasses import dataclass
from enum import Enum
from typing import List


class IssueType(str, Enum):
    """一致性问题类型"""
    CHARACTER_INCONSISTENCY = "character_inconsistency"
    RELATIONSHIP_INCONSISTENCY = "relationship_inconsistency"
    EVENT_LOGIC_ERROR = "event_logic_error"
    FORESHADOWING_ERROR = "foreshadowing_error"
    TIMELINE_ERROR = "timeline_error"


class Severity(str, Enum):
    """问题严重性级别"""
    CRITICAL = "critical"
    IMPORTANT = "important"
    MINOR = "minor"


@dataclass(frozen=True)
class Issue:
    """一致性问题值对象"""
    type: IssueType
    severity: Severity
    description: str
    location: int  # chapter_number

    def __post_init__(self):
        if self.location < 1:
            raise ValueError("location must be >= 1")
        if not self.description or not self.description.strip():
            raise ValueError("description cannot be empty")


@dataclass(frozen=True)
class ConsistencyReport:
    """一致性检查报告值对象"""
    issues: List[Issue]
    warnings: List[Issue]
    suggestions: List[str]

    def has_critical_issues(self) -> bool:
        """检查是否有严重问题"""
        return any(issue.severity == Severity.CRITICAL for issue in self.issues)

    def get_issues_by_type(self, issue_type: IssueType) -> List[Issue]:
        """按类型获取问题"""
        return [issue for issue in self.issues if issue.type == issue_type]

    def get_issues_by_severity(self, severity: Severity) -> List[Issue]:
        """按严重性获取问题"""
        return [issue for issue in self.issues if issue.severity == severity]
