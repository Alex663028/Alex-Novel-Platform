"""Style constraint builder for voice fingerprint integration."""
from typing import Optional


def build_style_summary(fingerprint: Optional[dict]) -> str:
    """Build a concise style summary from voice fingerprint data.

    Args:
        fingerprint: Voice fingerprint dict with 'metrics' field containing:
            - adjective_density: float (0.0-1.0)
            - avg_sentence_length: float
            - sentence_count: int

    Returns:
        Concise bullet-point summary (≤1K tokens) for LLM prompt injection.
        Empty string if fingerprint is None or invalid.
    """
    if not fingerprint:
        return ""

    metrics = fingerprint.get("metrics")
    if not metrics:
        return ""

    adjective_density = metrics.get("adjective_density", 0.0)
    avg_sentence_length = metrics.get("avg_sentence_length", 0.0)

    # Build concise summary
    summary_parts = []

    # Adjective density guidance
    if adjective_density > 0:
        density_pct = adjective_density * 100
        if density_pct < 3.0:
            summary_parts.append(f"- 形容词密度：{density_pct:.1f}%（保持简洁，少用修饰）")
        elif density_pct < 6.0:
            summary_parts.append(f"- 形容词密度：{density_pct:.1f}%（适度修饰，平衡叙事）")
        else:
            summary_parts.append(f"- 形容词密度：{density_pct:.1f}%（丰富描写，注重细节）")

    # Sentence length guidance
    if avg_sentence_length > 0:
        if avg_sentence_length < 15:
            summary_parts.append(f"- 平均句长：{avg_sentence_length:.0f}字（保持短句，节奏明快）")
        elif avg_sentence_length < 25:
            summary_parts.append(f"- 平均句长：{avg_sentence_length:.0f}字（长短结合，节奏适中）")
        else:
            summary_parts.append(f"- 平均句长：{avg_sentence_length:.0f}字（偏好长句，舒缓叙事）")

    if not summary_parts:
        return ""

    return "\n".join(summary_parts)
