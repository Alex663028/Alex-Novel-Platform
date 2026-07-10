-- 为chapters_summaries表添加节拍相关字段
-- 用于存储微观节拍和叙事摘要的详细信息

-- 添加关键事件字段
ALTER TABLE chapter_summaries 
ADD COLUMN key_events TEXT;

-- 添加未解问题字段
ALTER TABLE chapter_summaries 
ADD COLUMN open_threads TEXT;

-- 添加一致性说明字段
ALTER TABLE chapter_summaries 
ADD COLUMN consistency_note TEXT;

-- 添加节拍列表字段（JSON格式）
ALTER TABLE chapter_summaries 
ADD COLUMN beat_sections TEXT;

-- 添加微观节拍字段（JSON格式）
ALTER TABLE chapter_summaries 
ADD COLUMN micro_beats TEXT;

-- 添加同步状态字段
ALTER TABLE chapter_summaries 
ADD COLUMN sync_status TEXT DEFAULT 'draft';