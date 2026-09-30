// 一次性把离线例句中的语法讲解整理为中文。
// 用法：node scripts/translate-grammars.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const WORDS_FILE = `${ROOT}src/data/words.seed.ts`;
const EXAMPLES_FILE = `${ROOT}src/data/examples.seed.ts`;
const OUT_FILE = `${ROOT}src/data/grammar.zh.ts`;
const MODEL = process.env.KH_MODEL ?? 'qwen2.5:3b';

/** 从词库中读取词条基本信息 */
const parseWords = (text) => {
    const re = /id:\s*'(w\d+)',\s*korean:\s*'([^']+)',[\s\S]*?chinese:\s*'([^']+)'/g;
    const words = {};
    let match;
    while ((match = re.exec(text)) !== null) {
        words[match[1]] = { korean: match[2], chinese: match[3] };
    }
    return words;
};

/** 从例句数据中读取已有语法讲解，兼容单行和多行字符串 */
const parseGrammars = (text) => {
    const result = {};
    const re = /^\s{4}(\w+):\s*\{[\s\S]*?^\s{8}grammar:\s*([\s\S]*?)^\s{4}\},/gm;
    let match;
    while ((match = re.exec(text)) !== null) {
        const expression = match[2].trim().replace(/,$/, '');
        try {
            result[match[1]] = Function(`return (${expression})`)();
        } catch {
            // 单条数据解析失败时跳过，不影响其他词条
        }
    }
    return result;
};

/** 调用本机模型，把语法讲解改写成自然、简洁的中文 */
const translateOne = async (word, grammar) => {
    const prompt = [
        '你是中文母语的韩语老师。',
        `韩语词「${word.korean}」的中文义是「${word.chinese}」。`,
        `请把下面这段语法说明改写成准确、简洁、适合中国初学者阅读的中文：${grammar}`,
        '只返回中文说明，不要返回韩文、英文、引号、JSON 或其他格式。',
        '如果原说明不准确，请结合词义修正；说明控制在 80 字以内。'
    ].join('\n');
    const response = await fetch('http://localhost:11434/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: MODEL,
            temperature: 0.2,
            messages: [{ role: 'user', content: prompt }]
        })
    });
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content?.trim();
    if (!content || /[가-힣A-Za-z]/.test(content)) {
        throw new Error('模型返回了非纯中文内容');
    }
    return content.replace(/^["“”「」]+|["“”「」]+$/g, '');
};

const main = async () => {
    const [wordText, exampleText] = await Promise.all([readFile(WORDS_FILE, 'utf8'), readFile(EXAMPLES_FILE, 'utf8')]);
    const words = parseWords(wordText);
    const grammars = parseGrammars(exampleText);
    const translated = {};

    for (const [id, grammar] of Object.entries(grammars)) {
        const word = words[id];
        if (!word) {
            continue;
        }
        try {
            translated[id] = await translateOne(word, grammar);
            console.log(`ok ${id} ${word.korean}`);
        } catch (error) {
            console.log(`skip ${id} ${word.korean}: ${error.message}`);
        }
    }

    const output = [
        '// 离线预生成的中文语法讲解，运行时不调用模型、不联网。',
        'export const GRAMMAR_ZH: Record<string, string> = ',
        `${JSON.stringify(translated, null, 4)};`,
        ''
    ].join('\n');
    await writeFile(OUT_FILE, output, 'utf8');
    console.log(`已写入 ${OUT_FILE}，成功 ${Object.keys(translated).length}/${Object.keys(grammars).length}`);
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
