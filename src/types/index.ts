/** 词性 */
export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'other';

/** 生活句子场景 */
export type SceneCategory = 'hotel' | 'medical' | 'travel' | 'restaurant';

/** 生活场景展示文案 */
export const SCENE_LABELS: Record<SceneCategory, string> = {
    hotel: '酒店',
    medical: '帮助 / 医疗',
    travel: '旅游',
    restaurant: '餐厅'
};

/** 词条：韩语单词（重点是汉字词） */
export interface Word {
    /** 唯一 id */
    id: string;
    /** 韩语词，如 학생 */
    korean: string;
    /** 对应汉字，如 學生（仅汉字词有） */
    hanja?: string;
    /** 中文释义，如 学生 */
    chinese: string;
    /** 罗马音，如 haksaeng */
    romanization: string;
    /** 词性 */
    pos: PartOfSpeech;
    /** TOPIK 等级 1-6 */
    topikLevel: 1 | 2 | 3 | 4 | 5 | 6;
    /** 是否汉字词 */
    isSinoKorean: boolean;
    /** 生活场景分类 */
    scene?: SceneCategory;
    /** 配套生活化场景句 */
    scenario?: ExampleSentence;
}

/** 复习评分（对应 SM-2 的质量分） */
export type ReviewGrade = 'again' | 'hard' | 'good' | 'easy';

/** SRS 学习记录（SM-2 简化版） */
export interface ReviewRecord {
    /** 关联的词 id */
    wordId: string;
    /** 难度系数，初始 2.5 */
    ease: number;
    /** 间隔天数 */
    interval: number;
    /** 连续答对次数 */
    repetitions: number;
    /** 到期时间（ISO 字符串） */
    dueDate: string;
    /** 最近一次评分 */
    lastGrade: ReviewGrade;
    /** 最近复习时间（ISO 字符串） */
    lastReviewedAt: string;
}

/** LLM 生成的例句 */
export interface ExampleSentence {
    /** 韩语例句 */
    ko: string;
    /** 中文翻译 */
    zh: string;
}

/** LLM 讲解结果 */
export interface WordExplanation {
    /** 例句列表 */
    examples: ExampleSentence[];
    /** 语法/用法讲解（中文） */
    grammar: string;
}
