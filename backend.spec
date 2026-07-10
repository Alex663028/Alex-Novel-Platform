# -*- coding: utf-8 -*-
"""
PyInstaller spec for Alex Backend.
Builds alex-backend.exe as a onedir bundle.
Output: dist/alex-backend/alex-backend.exe
"""
import os
import sys

# Ensure project dir is on path so collect_data_files can find project packages
project_dir = os.path.dirname(os.path.abspath(SPEC if 'SPEC' in dir() else __file__))
sys.path.insert(0, project_dir)

from PyInstaller.utils.hooks import collect_all, collect_submodules, collect_data_files

block_cipher = None

# Collect all data/binaries for key packages
def safe_collect(package_name):
    try:
        datas, binaries, hiddenimports = collect_all(package_name)
        return datas, binaries, hiddenimports
    except Exception:
        return [], [], []

all_datas = []
all_binaries = []
all_hiddenimports = []

# Core packages
for pkg in [
    'fastapi', 'uvicorn', 'pydantic', 'httpx', 'anthropic', 'openai',
    'jinja2', 'starlette', 'anyio', 'sniffio',
]:
    d, b, h = safe_collect(pkg)
    all_datas.extend(d)
    all_binaries.extend(b)
    all_hiddenimports.extend(h)

# Project data files (YAML, JSON, SQL, etc.)
# collect_data_files returns (src, relative_dst) tuples
# The relative_dst is preserved inside the bundle's _internal/
for pkg_prefix in ['infrastructure', 'application', 'domain']:
    try:
        collected = collect_data_files(
            pkg_prefix,
            includes=['**/*.yaml', '**/*.yml', '**/*.json', '**/*.sql', '**/*.tmpl', '**/*.xml', '**/*.md']
        )
        all_datas.extend(collected)
    except Exception:
        pass

# shared/ and config/ at the _internal/ root
shared_dir = os.path.join(project_dir, 'shared')
if os.path.isdir(shared_dir):
    for root, dirs, files in os.walk(shared_dir):
        for f in files:
            full = os.path.join(root, f)
            rel = os.path.relpath(full, project_dir)
            all_datas.append((full, os.path.dirname(rel)))

config_dir = os.path.join(project_dir, 'config')
if os.path.isdir(config_dir):
    for root, dirs, files in os.walk(config_dir):
        for f in files:
            full = os.path.join(root, f)
            rel = os.path.relpath(full, project_dir)
            all_datas.append((full, os.path.dirname(rel)))

# Deduplicate
all_datas = list(set(all_datas))
all_binaries = list(set(all_binaries))
all_hiddenimports = list(set(all_hiddenimports))

# email-validator 数据
try:
    d, b, h = collect_all('email_validator')
    all_datas.extend(d)
    all_binaries.extend(b)
    all_hiddenimports.extend(h)
except Exception:
    pass

a = Analysis(
    [os.path.join(project_dir, 'backend_runner.py')],
    pathex=[project_dir],
    binaries=all_binaries,
    datas=all_datas,
    hiddenimports=all_hiddenimports + [
        'uvicorn.logging',
        'uvicorn.loops',
        'uvicorn.loops.auto',
        'uvicorn.protocols',
        'uvicorn.protocols.http',
        'uvicorn.protocols.http.auto',
        'uvicorn.protocols.websockets',
        'uvicorn.protocols.websockets.auto',
        'uvicorn.lifespan',
        'uvicorn.lifespan.on',
        'http.tools',
        'multipart',
        'python_multipart',
        'email_validator',
        'click',
        'dotenv',
        'yaml',
        'docx',
        'ebooklib',
        'fpdf',
        'lxml',
        'json_repair',
        'argparse',
        'domain',
        'domain.entities',
        'domain.value_objects',
        'domain.interfaces',
        'domain.enums',
        'domain.errors',
        'domain.constants',
        'domain.book_conventions',
        'application',
        'application.core',
        'application.core.async_bridge',
        'application.engine',
        'application.engine.dag',
        'application.engine.dag.engine',
        'application.engine.rules',
        'application.engine.services',
        'application.engine.stages',
        'application.engine.story',
        'infrastructure',
        'infrastructure.ai',
        'infrastructure.ai.providers',
        'infrastructure.persistence',
        'infrastructure.persistence.database',
        'infrastructure.persistence.repositories',
        'infrastructure.cache',
        'interfaces',
        'interfaces.api',
        'interfaces.api.dependencies',
        'interfaces.api.routers',
        'interfaces.api.middleware',
        'interfaces.main',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='alex-backend',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='alex-backend',
)
