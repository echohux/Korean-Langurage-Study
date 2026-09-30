/** 保存用户选择的韩语音色（仅保存在当前浏览器） */
const VOICE_KEY = 'kh-korean-voice';

/** 当前浏览器是否支持语音合成 */
export const isTtsSupported = (): boolean => typeof window !== 'undefined' && 'speechSynthesis' in window;

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
