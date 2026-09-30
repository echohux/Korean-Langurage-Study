import { App, Button, Empty, Flex, Segmented, Typography } from 'antd';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import ExplanationPanel from '@/components/ExplanationPanel';
import WordCard from '@/components/WordCard';
import { getLearningLevel, LEARNING_LEVEL_OPTIONS } from '@/constant/learningLevel';
import type { LearningLevel } from '@/constant/learningLevel';
import { WORDS } from '@/data/words.seed';
import { useSrsStore } from '@/hooks/useSrsStore';
import { playKorean } from '@/services';

/** 学新词页：逐个浏览未学的汉字词并加入复习计划 */
const LearnPage = () => {
    const navigate = useNavigate();
    const { message } = App.useApp();
    const { initialRecords, grade } = useSrsStore();
    // 当前学习水平
    const [level, setLevel] = useState<LearningLevel>('beginner');
    // 写入学习记录期间防止重复滑动或点击
    const saving = useRef(false);
    // 当前学习到第几个
    const [index, setIndex] = useState(0);
    // 本次学习队列：基于首次加载快照，过滤出未学的词（会话内稳定）
    const queue = useMemo(
        () =>
            initialRecords
                ? WORDS.filter((word) => !initialRecords[word.id] && getLearningLevel(word) === level)
                : null,
        [initialRecords, level]
    );

    const current = queue?.[index];

    /** 左滑记住 / 右滑没记住，均保存学习记录并进入下一张 */
    const handleScore = async (remembered: boolean) => {
        if (!current || saving.current) {
            return;
        }
        saving.current = true;
        try {
            await grade(current.id, remembered ? 'good' : 'again');
            setIndex((prev) => prev + 1);
        } catch {
            message.error('学习记录保存失败，请重试');
        } finally {
            saving.current = false;
        }
    };

    if (!queue) {
        return null;
    }

    if (!current) {
        return (
            <Flex vertical align="center" gap={16} style={{ marginTop: 64 }}>
                <Empty description="新词都学完了" />
                <Button type="primary" onClick={() => navigate('/review')}>
                    去复习
                </Button>
            </Flex>
        );
    }

    return (
        <Flex vertical align="center" gap={8}>
            <Segmented
                block
                options={LEARNING_LEVEL_OPTIONS}
                value={level}
                onChange={(value) => {
                    setLevel(value as LearningLevel);
                    setIndex(0);
                }}
            />
            <Typography.Text type="secondary">
                新词 {index + 1} / {queue.length}
            </Typography.Text>
            <WordCard word={current} revealed onSwipe={handleScore} onSpeak={() => void playKorean(current.korean)}>
                <Button type="primary" onClick={() => handleScore(true)}>
                    记住
                </Button>
                <Button onClick={() => handleScore(false)}>没记住</Button>
            </WordCard>
            <ExplanationPanel key={current.id} word={current} />
        </Flex>
    );
};

export default LearnPage;
