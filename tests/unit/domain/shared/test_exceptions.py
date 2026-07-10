# tests/unit/domain/shared/test_exceptions.py
import pytest
from domain.shared.exceptions import (
    DomainException,
    EntityNotFoundError,
    InvalidOperationError,
    ValidationError
)


def test_domain_exception_is_base_class():
    """测试 DomainException 是基类"""
    exc = DomainException("test message")
    assert isinstance(exc, Exception)
    assert str(exc) == "test message"


def test_entity_not_found_error_message_format():
    """测试 EntityNotFoundError 消息格式"""
    exc = EntityNotFoundError(entity_type="Novel", entity_id="123")
    assert exc.entity_type == "Novel"
    assert exc.entity_id == "123"
    assert str(exc) == "Novel with id '123' not found"


def test_entity_not_found_error_is_domain_exception():
    """测试 EntityNotFoundError 继承自 DomainException"""
    exc = EntityNotFoundError(entity_type="Novel", entity_id="123")
    assert isinstance(exc, DomainException)


def test_invalid_operation_error_is_domain_exception():
    """测试 InvalidOperationError 继承自 DomainException"""
    exc = InvalidOperationError("Invalid operation")
    assert isinstance(exc, DomainException)
    assert str(exc) == "Invalid operation"


def test_validation_error_is_domain_exception():
    """测试 ValidationError 继承自 DomainException"""
    exc = ValidationError("Validation failed")
    assert isinstance(exc, DomainException)
    assert str(exc) == "Validation failed"
