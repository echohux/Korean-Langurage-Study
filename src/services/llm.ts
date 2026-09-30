import type { Word, WordExplanation } from '@/types';

/** LLM 配置（存 localStorage，自用不上架） */
export interface LlmConfig {
    /** OpenAI 兼容的接口基地址，例如本地 Ollama http://localhost:11434/v1 */
    baseUrl: string;
    /** API Key（本地模型如 Ollama 可留空） */
    apiKey?: string;
    /** 模型名，例如 qwen2.5 */
    model: string;
}

/** 默认后端：本地 Ollama（无需 API Key） */
export const DEFAULT_LLM_CONFIG: LlmConfig = {
    baseUrl: 'http://localhost:11434/v1',
    apiKey: '',
    model: 'qwen2.5:3b'
};

/** localStorage 存储 key */
const STORAGE_KEY = 'kh-llm-config';

/** 读取生效的 LLM 配置：优先用户保存的，否则回退到本地 Ollama 默认值 */
export const getLlmConfig = (): LlmConfig => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        return DEFAULT_LLM_CONFIG;
    }
    try {
        return { ...DEFAULT_LLM_CONFIG, ...(JSON.parse(raw) as LlmConfig) };
    } catch {
        return DEFAULT_LLM_CONFIG;
    }
};

/** 保存 LLM 配置到本地 */
export const saveLlmConfig = (config: LlmConfig): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

/** 构造让模型输出结构化 JSON 的提示词 */
const buildPrompt = (word: Word): string =>
    [
        '你是韩语教学助手，面向以中文为母语的学习者。',
        `请针对韩语单词「${word.korean}」（${word.hanja ? `汉字词 ${word.hanja}，` : ''}中文义：${word.chinese}）：`,
        '1. 给出 2 个地道且实用的韩语例句，并附中文翻译；',
        '2. 用中文简要讲解该词的用法或相关语法点（100 字以内）。',
        '严格只返回如下 JSON，不要包含多余文本或代码块标记：',
        '{"examples":[{"ko":"...","zh":"..."}],"grammar":"..."}'
    ].join('\n');

/** 调用 LLM 为某个词生成例句与语法讲解 */
export const explainWord = async (word: Word): Promise<WordExplanation> => {
    const config = getLlmConfig();

    // 本地模型可留空 API Key，仅在有 key 时携带鉴权头
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (config.apiKey) {
        headers.Authorization = `Bearer ${config.apiKey}`;
    }

    let resp: Response;
    try {
        resp = await fetch(`${config.baseUrl.replace(/\/$/, '')}/chat/completions`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model: config.model,
                messages: [{ role: 'user', content: buildPrompt(word) }],
                temperature: 0.7
            })
        });
    } catch {
        throw new Error('无法连接到模型服务，请确认本地 Ollama 已启动（ollama serve）且允许跨域');
    }

    if (!resp.ok) {
        throw new Error(`LLM 请求失败：${resp.status}`);
    }

    const data = (await resp.json()) as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content ?? '';
    // 容错：从返回文本里抽取第一段 JSON
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) {
        throw new Error('LLM 返回内容无法解析为 JSON');
    }
    return JSON.parse(match[0]) as WordExplanation;
};
