import type { Word } from '@/types';

/** 三档学习水平 */
export type LearningLevel = 'beginner' | 'intermediate' | 'advanced';

/** 学习水平展示文案 */
export const LEARNING_LEVEL_OPTIONS: { label: string; value: LearningLevel }[] = [
    { label: '初级', value: 'beginner' },
    { label: '进阶', value: 'intermediate' },
    { label: '高级', value: 'advanced' }
];

/** 按词库难度映射到产品内的三档学习水平 */
export const getLearningLevel = (word: Word): LearningLevel => {
    if (word.topikLevel <= 2) {
        return 'beginner';
    }
    if (word.topikLevel <= 4) {
        return 'intermediate';
    }
    return 'advanced';
};
