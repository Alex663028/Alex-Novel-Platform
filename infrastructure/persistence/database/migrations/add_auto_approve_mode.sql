-- 添加全自动模式开关字段
-- 开启后，系统将跳过所有人工审阅环节，自动运行直到写完

ALTER TABLE novels ADD COLUMN auto_approve_mode INTEGER NOT NULL DEFAULT 0;

-- 注释：
-- auto_approve_mode = 0: 需要人工审阅（默认）
-- auto_approve_mode = 1: 全自动模式，跳过所有审阅
