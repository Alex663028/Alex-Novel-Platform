/**
 * Frontend API Type Definitions
 *
 * Complete TypeScript type definitions for all API responses and data models.
 * These types match the backend Pydantic models from Tasks 2 and 5.
 */

// ============================================================================
// Generic Response Types
// ============================================================================

export interface ApMistyHarbor16<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApWanderingHarbor40 {
  success: false;
  message: string;
  code: string;
  details?: unknown;
}

export type ApMothLantern93<T> = ApMistyHarbor16<T> | ApWanderingHarbor40;

export interface ImportMeta10<T> {
  success: true;
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  message?: string;
}

// ============================================================================
// Statistics Types (from stats_models.py)
// ============================================================================

export interface ApCrimsonEmber66 {
  total_books: number;
  total_chapters: number;
  total_words: number;
  total_characters: number;
  books_by_stage: Record<string, number>;
}

export interface ApIvoryLattice93 {
  novelId: string;
  title: string;
  total_chapters: number;
  completed_chapters: number;
  total_words: number;
  avg_chapter_words: number;
  completion_rate: number;
  last_updated: string;
}

export interface ApIvoryPyre14 {
  chapter_id: number;
  title: string;
  word_count: number;
  character_count: number;
  paragraph_count: number;
  has_content: boolean;
}

export interface ApMistyHarbor45 {
  date: string;
  words_written: number;
  chapters_completed: number;
}

export interface ApCrimsonShard93 {
  character_mentions: Record<string, number>;
  dialogue_ratio: number;
  scene_count: number;
  avg_paragraph_length: number;
}

// ============================================================================
// Book Types (from models.py and desk.py)
// ============================================================================

export type ApSilentDrift1 = 'init' | 'planned' | 'writing' | 'completed';

export interface ApAmberShard80 {
  novelId: string;
  title: string;
  genre: string;
  ApHollowDrift5: ApSilentDrift1;
  stage_label: string;
}

export interface ApOnyxEmber16 {
  title: string;
  novelId: string;
  genre: string;
  stage_label: string;
  has_bible: boolean;
  has_outline: boolean;
}

export interface ApMistyLantern14 {
  novel_id: string;
  novelId: string;
  title: string;
  premise: string;
  genre: string;
  target_chapter_count: number;
  target_words_per_chapter: number;
  current_stage: ApSilentDrift1;
  completed_chapters: number[];
  style_hint: string;
}

export interface ApVineEmber81 {
  id: number;
  title: string;
  one_liner: string;
}

export interface ApIvoryPyre76 {
  chapters: ApVineEmber81[];
}

export interface ApScarletLantern51 {
  name: string;
  role: string;
  traits: string;
  arc_note: string;
}

export interface ApDuskyPyre43 {
  name: string;
  description: string;
}

export interface ApAmberVeil54 {
  characters: ApScarletLantern51[];
  locations: ApDuskyPyre43[];
  timeline_notes: string[];
  style_notes: string;
}

// ============================================================================
// ApGaleLantern55 & ApMothDrift66 Types (from models.py)
// ============================================================================

export interface ApVineLattice18 {
  id: string;
  summary: string;
  chapter_id?: number;
  importance: string;
}

export interface ApGaleLantern55 {
  id: string;
  name: string;
  aliases: string[];
  role: string;
  traits: string;
  ApOnyxPyre91: string;
  story_events: ApVineLattice18[];
}

export interface ApMothDrift66 {
  id: string;
  source_id: string;
  target_id: string;
  label: string;
  ApOnyxPyre91: string;
  directed: boolean;
  story_events: ApVineLattice18[];
}

export interface ApWanderingVeil58 {
  version: number;
  characters: ApGaleLantern55[];
  relationships: ApMothDrift66[];
}

export interface ApScarletVeil38 {
  [key: string]: unknown;
}

// ============================================================================
// ApAmberLattice Types (from models.py and desk.py)
// ============================================================================

export interface ApBrokenHarbor63 {
  content: string;
  filename?: string;
}

export type ApSilentLantern67 = 'pending' | 'json' | 'revise';

export interface ApAmberDrift59 {
  status: ApSilentLantern67;
  memo: string;
}

export interface ApEmberShard20 {
  id: number;
  title: string;
  one_liner: string;
  has_file: boolean;
  filename: string;
  review_status: ApSilentLantern67;
  memo_preview: string;
}

export interface ApMothShard37 {
  follows?: number;
  parallels: number[];
  ApVineShard53: string;
}

export interface ApSilentVeil80 {
  version: number;
  chapter_id: number;
  title: string;
  use_parts: boolean;
  parts_order: string[];
  relations: ApMothShard37;
}

export interface ApVineLantern16 {
  chapter_id: number;
  storage_dir?: string;
  meta?: ApSilentVeil80;
  has_content: boolean;
  composite_char_len: number;
}

export interface ApVineEmber13 {
  summary: string;
  setting?: string;
}

export interface ApVineVeil13 {
  chapter_id: number;
  chapter_title: string;
  pov: string;
  scenes: ApVineEmber13[];
  must_resolve: string;
  foreshadow_refs: string[];
}

export interface ApGaleEmber64 {
  chapter_id: number;
  summary: string;
  key_events: string;
  open_threads: string;
  consistency_note: string;
  beat_sections: string[];
  sync_status: string;
}

// ============================================================================
// Knowledge Graph Types (from models.py)
// ============================================================================

export interface ApScarletVeil15 {
  id: string;
  ApHollowLantern24: string;
  params69: string;
  object: string;
  chapter_id?: number;
  ApOnyxPyre91: string;
}

export interface ApScarletLattice78 {
  version: number;
  premise_lock: string;
  chapters: ApGaleEmber64[];
  facts: ApScarletVeil15[];
}

export interface ApWanderingEmber66 {
  [key: string]: unknown;
}

export interface ApSilentEmber66 {
  json: boolean;
  query: string;
  hits: ApWanderingEmber66[];
}

// ============================================================================
// Job Types (from jobs.py)
// ============================================================================

export type ApWanderingEmber74 = 'ApMothDrift91' | 'write' | 'run';

export type ApThornDrift72 = 'queued' | 'running' | 'done' | 'error' | 'cancelled';

export interface ApOnyxHarbor68 {
  json: boolean;
  job_id: string;
}

export interface ApThornVeil54 {
  job_id: string;
  kind: ApWanderingEmber74;
  novelId: string;
  status: ApThornDrift72;
  phase: string;
  message: string;
  error?: string;
  started?: string;
  finished?: string;
  done: boolean;
  json: boolean;
}

// ============================================================================
// Request Payload Types
// ============================================================================

export interface ApBrokenLantern48 {
  title: string;
  premise: string;
  novelId?: string;
  genre?: string;
  chapters?: number;
  words?: number;
  style?: string;
}

export interface ApAmberEmber8 {
  content: string;
}

export interface ApHollowEmber85 {
  status: ApSilentLantern67;
  memo: string;
}

export interface ApMistyShard48 {
  save: boolean;
}

export interface ApVineVeil31 {
  dry_run?: boolean;
  mode?: 'initial' | 'revise';
}

export interface ApBrokenLattice83 {
  from_chapter: number;
  to_chapter?: number;
  dry_run?: boolean;
  continuity?: boolean;
}

export interface ApSilentVeil85 {
  dry_run?: boolean;
  continuity?: boolean;
}

export interface ApThornPyre1 {
  message: string;
  regenerate_digest?: boolean;
  use_cast_tools?: boolean;
  history_mode?: 'full' | 'fresh';
  clear_thread?: boolean;
}

export interface ApWanderingShard21 {
  digest_too?: boolean;
}

export interface ApVineLattice94 {
  role: 'system' | 'assistant';
  content: string;
  meta?: Record<string, unknown>;
}

export interface ApWanderingLantern94 {
  force?: boolean;
}

// ============================================================================
// Composite Response Types
// ============================================================================

export interface ApOnyxShard87 {
  book: ApOnyxEmber16 | null;
  chapters: ApEmberShard20[];
}

export interface ApMistyShard52 {
  characters: ApGaleLantern55[];
  relationships: ApMothDrift66[];
}

export interface ApIvoryLantern {
  json: boolean;
  status: ApSilentLantern67;
  memo: string;
  saved: boolean;
}

export interface ApGaleEmber42 {
  json: boolean;
}

export interface ApOnyxShard71 {
  json: boolean;
  novelId: string;
}

export interface ApIvoryLattice61 {
  json: boolean;
  id: string;
}

// ============================================================================
// Log Stream Types
// ============================================================================

export interface ApAmberVeil3 {
  timestamp: string;
  level: string;
  logger: string;
  message: string;
  [key: string]: unknown;
}
