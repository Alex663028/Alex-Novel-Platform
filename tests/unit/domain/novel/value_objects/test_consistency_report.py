import pytest
from domain.novel.value_objects.consistency_report import (
    ConsistencyReport,
    Issue,
    IssueType,
    Severity
)


class TestIssueType:
    """测试 IssueType 枚举"""

    def test_issue_types_exist(self):
        """测试所有问题类型存在"""
        assert IssueType.CHARACTER_INCONSISTENCY
        assert IssueType.RELATIONSHIP_INCONSISTENCY
        assert IssueType.EVENT_LOGIC_ERROR
        assert IssueType.FORESHADOWING_ERROR
        assert IssueType.TIMELINE_ERROR


class TestSeverity:
    """测试 Severity 枚举"""

    def test_severity_levels_exist(self):
        """测试所有严重性级别存在"""
        assert Severity.CRITICAL
        assert Severity.IMPORTANT
        assert Severity.MINOR


class TestIssue:
    """测试 Issue 值对象"""

    def test_create_issue(self):
        """测试创建问题"""
        issue = Issue(
            type=IssueType.CHARACTER_INCONSISTENCY,
            severity=Severity.CRITICAL,
            description="Character behavior inconsistent with personality",
            location=5
        )

        assert issue.type == IssueType.CHARACTER_INCONSISTENCY
        assert issue.severity == Severity.CRITICAL
        assert issue.description == "Character behavior inconsistent with personality"
        assert issue.location == 5

    def test_issue_immutable(self):
        """测试问题对象不可变"""
        issue = Issue(
            type=IssueType.CHARACTER_INCONSISTENCY,
            severity=Severity.CRITICAL,
            description="Test",
            location=1
        )

        with pytest.raises(AttributeError):
            issue.description = "New description"

    def test_issue_requires_positive_location(self):
        """测试位置必须为正数"""
        with pytest.raises(ValueError, match="location must be >= 1"):
            Issue(
                type=IssueType.CHARACTER_INCONSISTENCY,
                severity=Severity.CRITICAL,
                description="Test",
                location=0
            )

    def test_issue_requires_non_empty_description(self):
        """测试描述不能为空"""
        with pytest.raises(ValueError, match="description cannot be empty"):
            Issue(
                type=IssueType.CHARACTER_INCONSISTENCY,
                severity=Severity.CRITICAL,
                description="",
                location=1
            )


class TestConsistencyReport:
    """测试 ConsistencyReport 值对象"""

    def test_create_empty_report(self):
        """测试创建空报告"""
        report = ConsistencyReport(
            issues=[],
            warnings=[],
            suggestions=[]
        )

        assert report.issues == []
        assert report.warnings == []
        assert report.suggestions == []

    def test_create_report_with_issues(self):
        """测试创建包含问题的报告"""
        issue1 = Issue(
            type=IssueType.CHARACTER_INCONSISTENCY,
            severity=Severity.CRITICAL,
            description="Character behavior inconsistent",
            location=5
        )
        issue2 = Issue(
            type=IssueType.RELATIONSHIP_INCONSISTENCY,
            severity=Severity.IMPORTANT,
            description="Relationship change not justified",
            location=7
        )

        report = ConsistencyReport(
            issues=[issue1],
            warnings=[issue2],
            suggestions=["Consider adding more character development"]
        )

        assert len(report.issues) == 1
        assert len(report.warnings) == 1
        assert len(report.suggestions) == 1
        assert report.issues[0] == issue1
        assert report.warnings[0] == issue2

    def test_report_immutable(self):
        """测试报告对象不可变"""
        report = ConsistencyReport(
            issues=[],
            warnings=[],
            suggestions=[]
        )

        with pytest.raises(AttributeError):
            report.issues = []

    def test_has_critical_issues(self):
        """测试检查是否有严重问题"""
        critical_issue = Issue(
            type=IssueType.CHARACTER_INCONSISTENCY,
            severity=Severity.CRITICAL,
            description="Critical problem",
            location=1
        )
        minor_issue = Issue(
            type=IssueType.TIMELINE_ERROR,
            severity=Severity.MINOR,
            description="Minor problem",
            location=2
        )

        report_with_critical = ConsistencyReport(
            issues=[critical_issue, minor_issue],
            warnings=[],
            suggestions=[]
        )

        report_without_critical = ConsistencyReport(
            issues=[minor_issue],
            warnings=[],
            suggestions=[]
        )

        assert report_with_critical.has_critical_issues() is True
        assert report_without_critical.has_critical_issues() is False

    def test_get_issues_by_type(self):
        """测试按类型获取问题"""
        char_issue = Issue(
            type=IssueType.CHARACTER_INCONSISTENCY,
            severity=Severity.CRITICAL,
            description="Character problem",
            location=1
        )
        rel_issue = Issue(
            type=IssueType.RELATIONSHIP_INCONSISTENCY,
            severity=Severity.IMPORTANT,
            description="Relationship problem",
            location=2
        )

        report = ConsistencyReport(
            issues=[char_issue, rel_issue],
            warnings=[],
            suggestions=[]
        )

        char_issues = report.get_issues_by_type(IssueType.CHARACTER_INCONSISTENCY)
        assert len(char_issues) == 1
        assert char_issues[0] == char_issue

        rel_issues = report.get_issues_by_type(IssueType.RELATIONSHIP_INCONSISTENCY)
        assert len(rel_issues) == 1
        assert rel_issues[0] == rel_issue

    def test_get_issues_by_severity(self):
        """测试按严重性获取问题"""
        critical_issue = Issue(
            type=IssueType.CHARACTER_INCONSISTENCY,
            severity=Severity.CRITICAL,
            description="Critical problem",
            location=1
        )
        minor_issue = Issue(
            type=IssueType.TIMELINE_ERROR,
            severity=Severity.MINOR,
            description="Minor problem",
            location=2
        )

        report = ConsistencyReport(
            issues=[critical_issue, minor_issue],
            warnings=[],
            suggestions=[]
        )

        critical_issues = report.get_issues_by_severity(Severity.CRITICAL)
        assert len(critical_issues) == 1
        assert critical_issues[0] == critical_issue

        minor_issues = report.get_issues_by_severity(Severity.MINOR)
        assert len(minor_issues) == 1
        assert minor_issues[0] == minor_issue
