import { App, Button, Empty, Flex, Space, Typography } from 'antd';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import ExplanationPanel from '@/components/ExplanationPanel';
import WordCard from '@/components/WordCard';
import { WORDS } from '@/data/words.seed';
import { useSrsStore } from '@/hooks/useSrsStore';
import { isDue, playKorean } from '@/services';
import type { ReviewGrade } from '@/types';

/** 评分按钮配置 */
const GRADE_BUTTONS: { grade: ReviewGrade; label: string; danger?: boolean }[] = [
    { grade: 'again', label: '忘记', danger: true },
    { grade: 'hard', label: '模糊' },
    { grade: 'good', label: '记得' },
    { grade: 'easy', label: '简单' }
];

/** 复习页：按 SRS 到期队列逐个复习 */
const ReviewPage = () => {
    const navigate = useNavigate();
    const { message } = App.useApp();
    const { initialRecords, grade } = useSrsStore();
    // 防止连续滑动导致重复评分
    const saving = useRef(false);
    // 当前复习到第几个
    const [index, setIndex] = useState(0);
    // 当前卡片是否已翻面
    const [revealed, setRevealed] = useState(false);
    // 本次复习队列：基于首次加载快照，过滤出到期的词（会话内稳定）
    const queue = useMemo(
        () =>
            initialRecords ? WORDS.filter((word) => initialRecords[word.id] && isDue(initialRecords[word.id])) : null,
        [initialRecords]
    );

    const current = queue?.[index];

    /** 评分并进入下一张 */
    const handleGrade = async (value: ReviewGrade) => {
        if (!current || saving.current) {
            return;
        }
        saving.current = true;
        try {
            await grade(current.id, value);
            setRevealed(false);
            setIndex((prev) => prev + 1);
        } catch {
            message.error('复习记录保存失败，请重试');
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
                <Empty description="没有待复习的词了" />
                <Button type="primary" onClick={() => navigate('/learn')}>
                    去学新词
                </Button>
            </Flex>
        );
    }

    return (
        <Flex vertical align="center" gap={8}>
            <Typography.Text type="secondary">
                复习 {index + 1} / {queue.length}
            </Typography.Text>
            <WordCard
                word={current}
                revealed={revealed}
                onSwipe={revealed ? (remembered) => handleGrade(remembered ? 'good' : 'again') : undefined}
                onSpeak={() => void playKorean(current.korean)}
            >
                {!revealed && (
                    <>
                        <Button type="primary" onClick={() => setRevealed(true)}>
                            显示答案
                        </Button>
                        <Typography.Text type="secondary">看完答案后即可左右滑动评分</Typography.Text>
                    </>
                )}
            </WordCard>

            {revealed && (
                <>
                    <Space wrap style={{ marginTop: 8 }}>
                        {GRADE_BUTTONS.map((item) => (
                            <Button
                                key={`grade-${item.grade}`}
                                danger={item.danger}
                                onClick={() => handleGrade(item.grade)}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Space>
                    <ExplanationPanel key={current.id} word={current} />
                </>
            )}
        </Flex>
    );
};

export default ReviewPage;
