-- 添加自动驾驶状态字段到 novels 表

-- 添加 autopilot_status 字段
ALTER TABLE novels ADD COLUMN autopilot_status TEXT DEFAULT 'stopped';

-- 添加 current_stage 字段
ALTER TABLE novels ADD COLUMN current_stage TEXT DEFAULT 'planning';

-- 添加 current_act 字段（当前幕号）
ALTER TABLE novels ADD COLUMN current_act INTEGER DEFAULT 0;

-- 添加 current_chapter_in_act 字段（当前幕内章节号）
ALTER TABLE novels ADD COLUMN current_chapter_in_act INTEGER DEFAULT 0;

-- 添加 author 字段（补充缺失字段）
ALTER TABLE novels ADD COLUMN author TEXT DEFAULT '未知作者';

-- 创建索引加速查询
CREATE INDEX IF NOT EXISTS idx_novels_autopilot_status ON novels(autopilot_status);
CREATE INDEX IF NOT EXISTS idx_novels_current_stage ON novels(current_stage);
