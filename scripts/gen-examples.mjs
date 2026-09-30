// 一次性离线生成脚本：调用本机 Ollama 为每个词生成例句/语法，写成静态数据文件。
// 生成完成后 app 运行时不再需要任何模型调用。用法：node scripts/gen-examples.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SEED = `${ROOT}src/data/words.seed.ts`;
const OUT = `${ROOT}src/data/examples.seed.ts`;
const BASE = 'http://localhost:11434/v1';
const MODEL = process.env.KH_MODEL ?? 'qwen2.5:3b';

/** 从 seed 文件文本里抽取词条 */
const parseWords = (text) => {
    const re = /id:\s*'(w\d+)',\s*korean:\s*'([^']+)',\s*hanja:\s*'([^']+)',\s*chinese:\s*'([^']+)'/g;
    const words = [];
    let m;
    while ((m = re.exec(text)) !== null) {
        words.push({ id: m[1], korean: m[2], hanja: m[3], chinese: m[4] });
    }
    return words;
};

/** 构造提示词（与 app 内一致） */
const buildPrompt = (w) =>
    [
        '你是韩语教学助手，面向以中文为母语的学习者。',
        `请针对韩语单词「${w.korean}」（汉字词 ${w.hanja}，中文义：${w.chinese}）：`,
        '1. 给出 2 个地道且实用的韩语例句，并附中文翻译；',
        '2. 只用中文简要讲解该词的用法或相关语法点（100 字以内，禁止出现韩文和英文）。',
        '严格只返回如下 JSON，不要包含多余文本或代码块标记：',
        '{"examples":[{"ko":"...","zh":"..."}],"grammar":"..."}'
    ].join('\n');

/** 调一次模型并解析出结构化结果 */
const genOne = async (w) => {
    const resp = await fetch(`${BASE}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: MODEL,
            temperature: 0.7,
            messages: [{ role: 'user', content: buildPrompt(w) }]
        })
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content ?? '';
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('no-json');
    return JSON.parse(match[0]);
};

const main = async () => {
    const text = await readFile(SEED, 'utf8');
    const words = parseWords(text);
    console.log(`解析到 ${words.length} 个词，开始生成...`);
    const result = {};
    for (const w of words) {
        try {
            result[w.id] = await genOne(w);
            console.log(`  ok ${w.id} ${w.korean}`);
        } catch (e) {
            console.log(`  skip ${w.id} ${w.korean}: ${e.message}`);
        }
    }
    const header =
        '// 由 scripts/gen-examples.mjs 离线预生成，运行时不再调用模型。重新生成请重跑该脚本。\n' +
        "import type { WordExplanation } from '@/types';\n\n" +
        'export const EXAMPLES: Record<string, WordExplanation> = ';
    await writeFile(OUT, header + JSON.stringify(result, null, 4) + ';\n', 'utf8');
    console.log(`已写入 ${OUT}，成功 ${Object.keys(result).length}/${words.length}`);
};

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
