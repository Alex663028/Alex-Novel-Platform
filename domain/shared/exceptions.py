# domain/shared/exceptions.py
class DomainException(Exception):
    """领域异常基类"""
    pass


class EntityNotFoundError(DomainException):
    """实体未找到"""
    def __init__(self, entity_type: str, entity_id: str):
        self.entity_type = entity_type
        self.entity_id = entity_id
        super().__init__(f"{entity_type} with id '{entity_id}' not found")


class InvalidOperationError(DomainException):
    """无效操作"""
    pass


class ValidationError(DomainException):
    """验证错误"""
    pass
