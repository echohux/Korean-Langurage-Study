import type { ReviewGrade, ReviewRecord } from '@/types';

/** 一天的毫秒数 */
const DAY_MS = 24 * 60 * 60 * 1000;

/** 评分对应的 SM-2 质量分 q（0-5） */
const GRADE_QUALITY: Record<ReviewGrade, number> = {
    again: 2,
    hard: 3,
    good: 4,
    easy: 5
};

/** 为新词创建初始 SRS 记录 */
export const createInitialRecord = (wordId: string): ReviewRecord => {
    const now = new Date().toISOString();
    return {
        wordId,
        ease: 2.5,
        interval: 0,
        repetitions: 0,
        dueDate: now,
        lastGrade: 'again',
        lastReviewedAt: now
    };
};

/** 按 SM-2 算法根据评分推进一条复习记录，返回新的记录 */
export const scheduleNext = (record: ReviewRecord, grade: ReviewGrade): ReviewRecord => {
    const quality = GRADE_QUALITY[grade];
    const now = new Date();
    let { ease, interval, repetitions } = record;

    if (quality < 3) {
        // 没记住：重复次数清零，立即进入复习队列
        repetitions = 0;
        interval = 0;
    } else {
        repetitions += 1;
        if (repetitions === 1) {
            interval = 1;
        } else if (repetitions === 2) {
            interval = 6;
        } else {
            interval = Math.round(interval * ease);
        }
        // 更新难度系数（SM-2 公式），下限 1.3
        ease = Math.max(1.3, ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    }

    return {
        ...record,
        ease,
        interval,
        repetitions,
        dueDate: new Date(now.getTime() + interval * DAY_MS).toISOString(),
        lastGrade: grade,
        lastReviewedAt: now.toISOString()
    };
};

/** 判断一条记录是否已到期（可复习） */
export const isDue = (record: ReviewRecord, at: Date = new Date()): boolean =>
    new Date(record.dueDate).getTime() <= at.getTime();
