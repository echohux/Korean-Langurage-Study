"""使用 Qwen3-TTS 0.6B CustomVoice 生成韩语静态音频。

运行前安装 MLX-Audio：
    python3 -m pip install -U mlx-audio soundfile

示例：
    python3 scripts/generate-qwen3-tts.py

模型首次运行会从 Hugging Face 下载，默认使用 Qwen 原生韩语音色 Sohee。
生成后的音频和 manifest 会写入 public/audio/ko/，由前端优先播放。
"""

from __future__ import annotations

import json
import re
from pathlib import Path

import soundfile as sf
from mlx_audio.tts.utils import load_model


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "public" / "audio" / "ko"
MANIFEST_PATH = OUTPUT_DIR / "manifest.json"
MODEL_NAME = "mlx-community/Qwen3-TTS-12Hz-0.6B-CustomVoice-bf16"
SPEAKER = "Sohee"
LANGUAGE = "Korean"

# 第一批只生成少量代表性内容，确认音色和韩语发音后再批量扩展。
SAMPLES = [
    ("sample-hello", "안녕하세요. 만나서 반갑습니다."),
    ("sample-student", "학생"),
    ("sample-hospital", "병원"),
    ("sample-hotel-checkin", "체크인하고 싶어요."),
    ("sample-restaurant-order", "주문할게요."),
    ("sample-travel-help", "도와주세요."),
]


def safe_name(value: str) -> str:
    """生成适合静态资源文件名的安全字符串。"""
    return re.sub(r"[^a-zA-Z0-9_-]+", "-", value).strip("-").lower()


def generate_audio() -> None:
    """生成样音并更新前端使用的文本到音频映射。"""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest = {}
    if MANIFEST_PATH.exists():
        manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))

    model = load_model(MODEL_NAME)
    for asset_id, text in SAMPLES:
        output_path = OUTPUT_DIR / f"{safe_name(asset_id)}.wav"
        print(f"Generating: {text}")
        results = list(model.generate(text=text, voice=SPEAKER, language=LANGUAGE))
        if not results:
            raise RuntimeError(f"No audio generated for: {text}")
        audio = results[0].audio
        sample_rate = results[0].sample_rate
        sf.write(output_path, audio, sample_rate)
        manifest[text] = f"audio/ko/{output_path.name}"
        print(f"Saved: {output_path}")

    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Updated manifest: {MANIFEST_PATH}")


if __name__ == "__main__":
    generate_audio()
