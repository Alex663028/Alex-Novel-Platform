"""
MD 大纲导入 API

支持 MD 文本上传和文件上传，缺失部分由 LLM 自动补全。
"""
import logging
import uuid
import tempfile
from typing import Optional

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, Request
from pydantic import BaseModel, Field

from interfaces.api.dependencies import get_novel_service, get_bible_service, get_llm_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/import", tags=["import"])


class ImportMDTextRequest(BaseModel):
    """导入 MD 文本请求"""
    content: str = Field(..., description="MD 文本内容")
    novel_id: Optional[str] = Field(None, description="小说 ID，不传则自动创建")
    auto_complete: bool = Field(True, description="是否自动补全缺失字段")


@router.post("/md-text")
async def import_md_text(
    request: ImportMDTextRequest,
    novel_service=Depends(get_novel_service),
    bible_service=Depends(get_bible_service),
    llm_service=Depends(get_llm_service),
):
    """通过文本导入 MD 大纲"""
    from application.outline.import_service import import_md_outline
    
    if not request.content.strip():
        raise HTTPException(status_code=400, detail="内容不能为空")
    
    result = await import_md_outline(
        md_text=request.content,
        novel_id=request.novel_id,
        novel_service=novel_service,
        bible_service=bible_service,
        llm_service=llm_service,
        auto_complete=request.auto_complete,
    )
    
    return result


@router.post("/md-file")
async def import_md_file(
    file: UploadFile = File(..., description="MD 文件"),
    novel_id: Optional[str] = Form(None, description="小说 ID"),
    auto_complete: bool = Form(True, description="是否自动补全"),
    novel_service=Depends(get_novel_service),
    bible_service=Depends(get_bible_service),
    llm_service=Depends(get_llm_service),
):
    """通过文件上传导入 MD 大纲"""
    from application.outline.import_service import import_md_outline
    
    if not file.filename.endswith(('.md', '.markdown', '.txt')):
        raise HTTPException(status_code=400, detail="只支持 .md / .markdown / .txt 文件")
    
    try:
        content = await file.read()
        text = content.decode('utf-8')
    except UnicodeDecodeError:
        try:
            text = content.decode('gbk')
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="文件编码不支持，请使用 UTF-8 或 GBK")
    
    result = await import_md_outline(
        md_text=text,
        novel_id=novel_id,
        novel_service=novel_service,
        bible_service=bible_service,
        llm_service=llm_service,
        auto_complete=auto_complete,
    )
    
    return result


@router.post("/parse-preview")
async def parse_preview(
    request: Request,
    file: UploadFile = File(None, description="MD 文件"),
):
    """预览解析结果（不保存）"""
    from application.outline.md_parser import parse_markdown_outline, detect_missing_parts

    text = ""
    content_type = request.headers.get("content-type", "")

    # 兼容 multipart/form-data 和 application/json
    if "multipart/form-data" in content_type and file is not None:
        try:
            raw = await file.read()
            text = raw.decode("utf-8")
        except UnicodeDecodeError:
            try:
                text = raw.decode("gbk")
            except UnicodeDecodeError:
                raise HTTPException(status_code=400, detail="文件编码不支持")
    else:
        try:
            payload = await request.json()
        except Exception:
            raise HTTPException(
                status_code=422,
                detail="缺少文件；请使用 multipart/form-data 上传 file 字段",
            )
        text = payload.get("content") or payload.get("text") or payload.get("md") or ""

    if not text.strip():
        raise HTTPException(status_code=400, detail="内容不能为空")

    schema = parse_markdown_outline(text)
    missing_info = detect_missing_parts(schema)

    return {
        'preview': {
            'title': schema.title,
            'author': schema.author,
            'genre': schema.genre,
            'target_chapters': schema.target_chapters,
            'premise_preview': schema.premise[:200] + '...' if len(schema.premise) > 200 else schema.premise,
            'characters': [c.get('name') for c in (schema.characters or [])],
            'protagonist': schema.protagonist.get('name') if schema.protagonist else None,
            'world_settings': [w.get('name') for w in (schema.world_settings or [])],
            'locations': [l.get('name') for l in (schema.locations or [])],
            'structure_nodes': len(schema.structure_tree or []),
        },
        'missing': missing_info['missing'],
        'present': missing_info['present'],
        'needs_completion': missing_info['needs_completion'],
    }
