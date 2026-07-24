# Frontend Variable Name Mapping (Deobfuscation Guide)

The project uses a unique naming convention for frontend variables and functions.
This document provides a mapping between obfuscated names and their purposes.

## API Layer (`src/api/config.ts`)

| Obfuscated Name | Real Purpose |
|----------------|--------------|
| `ApMistyVeil` | `axios` default instance (API client) |
| `ApMothHarbor` | Alias for `ApMistyVeil` (same axios instance) |
| `ApSilentLattice` | Legacy `/api` axios instance |
| `ApDuskyHarbor87` | Legacy `/api/stats` axios instance |
| `ApScarletEmber()` | Function: check if running in Tauri |
| `ApEmberPyre51(path)` | Build absolute URL from relative path |
| `ApAmberLantern49()` | Sync legacy /api baseURL with main axios |
| `ApWanderingLattice6` | Type: backend port number |
| `ApVinePyre48` | Type: axios instance (exported from config) |

## HTTP/Feedback (`src/support/feedbackNotifier.ts`)

| Obfuscated Name | Real Purpose |
|----------------|--------------|
| `ApScarletShard81` | Function: show error toast/notification |
| `ApScarletLantern` | Object: URL builder (`ApScarletLantern.novels...`) |

## Performance Config (`src/config/performance.ts`)

| Obfuscated Name | Real Purpose |
|----------------|--------------|
| `ApOnyxVeil56` | Object: network timeout settings |
| `ApMistyDrift73` | Type: AxiosRequestConfig |

## Bible API (`src/api/bible.ts`)

| Obfuscated Name | Real Purpose |
|----------------|--------------|
| `ApWanderingShard65` | Interface: SSE worldbuilding dimension data |
| `ApDuskyEmber47` | Interface: SSE phase event |
| `ApOnyxVeil` | Interface: SSE data event |
| `ApSilentVeil` | Interface: SSE done event |
| `ApVineVeil13` | Interface: SSE approval_required event |
| `ApIvoryPyre` | Interface: SSE error event |
| `ApEmberPyre` | Union: all SSE event types |
| `ApSilentLantern()` | Function: SSE Bible generation fetch |
| `ApSilentHarbor` | Object: Bible CRUD API |
| `ApMothHarbor96` | Object: Worldbuilding API |
| `ApWanderingEmber90` | Interface: Character import DTO |
| `ApDuskyLattice` | Interface: Bible character |
| `ApVineVeil95` | Interface: World setting |
| `ApBrokenDrift39` | Interface: Location |
| `ApGaleHarbor35` | Interface: Timeline note |
| `ApMistyShard14` | Interface: Style note |
| `ApMistyLattice61` | Interface: Full Bible data |
| `ApAmberLantern` | Type: Character relationship (string|object) |

## Constants

| Obfuscated Name | Real Purpose |
|----------------|--------------|
| `ApMistyPyre` | Variable: baseURL string |
| `ApVineShard22` | Type: AxiosInstance (exported type alias) |
| `ApCrimsonPyre49()` | Function: extract error from unknown |
| `ApWanderingShard23` | Type: API error DTO |

## Helper Functions

| Obfuscated Name | Real Purpose |
|----------------|--------------|
| `ApGaleEmber71()` | Generate UUID |
| `ApMistyShard86(bible)` | Serialize Bible to JSON string (for comparison) |
| `ApMothPyre68(data)` | Serialize characters/locations to JSON (for comparison) |
| `ApThornLantern17()` | Parse SSE raw text into headers+body |
| `ApEmberEmber()` | Parse SSE event headers+data |

## Naming Pattern

- `Ap` prefix = API / Application layer
- Color names often correspond to semantic meaning:
  - `Scarlet` = error/feedback
  - `Silent` = no toast/silent handling
  - `Misty` = core/default
  - `Dusky` = stats/secondary
  - `Vine` = types
  - `Amber` = compatibility/sync helpers
  - `Crimson` = error extraction

## Strategy

Rather than rename all variables (high risk of breaking), new code should:
1. Use clear English names
2. Add JSDoc comments when using existing obfuscated names
3. Gradually migrate old code when touching related areas