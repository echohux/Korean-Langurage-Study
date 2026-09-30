/** 保存用户选择的韩语音色（仅保存在当前浏览器） */
const VOICE_KEY = 'kh-korean-voice';

/** 预生成韩语音频资源清单地址 */
const AUDIO_MANIFEST_URL = `${import.meta.env.BASE_URL}audio/ko/manifest.json`;

/** 当前正在播放的预生成音频 */
let currentAudio: HTMLAudioElement | null = null;

/** 音频资源清单的缓存，避免每次点击朗读都重复请求 */
let audioManifestPromise: Promise<Record<string, string>> | null = null;

/** 当前浏览器是否支持语音合成 */
export const isTtsSupported = (): boolean => typeof window !== 'undefined' && 'speechSynthesis' in window;

/** 当前页面是否具备韩语朗读能力，包括预生成音频和浏览器 TTS */
export const isKoreanPlaybackSupported = (): boolean =>
    typeof window !== 'undefined' && ('Audio' in window || isTtsSupported());

/** 列出当前浏览器可用的韩语音色；有些浏览器会延迟加载 */
export const getKoreanVoices = (): SpeechSynthesisVoice[] =>
    isTtsSupported()
        ? window.speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith('ko'))
        : [];

/** 获取保存的音色标识 */
export const getPreferredKoreanVoice = (): string => localStorage.getItem(VOICE_KEY) ?? '';

/** 保存音色；空字符串表示自动选择 */
export const setPreferredKoreanVoice = (voiceURI: string): void => {
    localStorage.setItem(VOICE_KEY, voiceURI);
};

/** 用浏览器语音合成朗读韩语文本 */
export const speakKorean = (text: string): void => {
    if (!isTtsSupported()) {
        return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 1;
    const voices = getKoreanVoices();
    const selected = getPreferredKoreanVoice();
    // 选中的音色若已卸载，优先退回本地音色
    const koVoice =
        voices.find((voice) => voice.voiceURI === selected) ?? voices.find((voice) => voice.localService) ?? voices[0];
    if (koVoice) {
        utterance.voice = koVoice;
    }
    window.speechSynthesis.speak(utterance);
};

/** 加载预生成音频清单；清单不存在时按空清单处理 */
const loadAudioManifest = async (): Promise<Record<string, string>> => {
    if (!audioManifestPromise) {
        audioManifestPromise = fetch(AUDIO_MANIFEST_URL)
            .then(async (response) => {
                if (!response.ok) {
                    return {};
                }
                const manifest: unknown = await response.json();
                return manifest && typeof manifest === 'object' ? (manifest as Record<string, string>) : {};
            })
            .catch(() => ({}));
    }
    return audioManifestPromise;
};

/** 停止当前播放的预生成音频 */
const stopCurrentAudio = (): void => {
    currentAudio?.pause();
    if (currentAudio) {
        currentAudio.currentTime = 0;
    }
    currentAudio = null;
};

/** 播放预生成的韩语音频；找不到资源时回退到浏览器 TTS */
export const playKorean = async (text: string): Promise<void> => {
    const normalizedText = text.trim();
    if (!normalizedText) {
        return;
    }

    const manifest = await loadAudioManifest();
    const audioPath = manifest[normalizedText];

    if (!audioPath || typeof Audio === 'undefined') {
        speakKorean(normalizedText);
        return;
    }

    stopCurrentAudio();
    if (isTtsSupported()) {
        window.speechSynthesis.cancel();
    }

    const audio = new Audio(`${import.meta.env.BASE_URL}${audioPath.replace(/^\/+/, '')}`);
    currentAudio = audio;
    audio.addEventListener('ended', () => {
        if (currentAudio === audio) {
            currentAudio = null;
        }
    });
    audio.addEventListener('error', () => {
        if (currentAudio === audio) {
            currentAudio = null;
        }
        speakKorean(normalizedText);
    });
    await audio.play().catch(() => {
        if (currentAudio === audio) {
            currentAudio = null;
        }
        speakKorean(normalizedText);
    });
};
