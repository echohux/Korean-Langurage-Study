import { Button, Empty, Flex, Space, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import WordCard from '@/components/WordCard';
import { WORDS } from '@/data/words.seed';
import { useSrsStore } from '@/hooks/useSrsStore';
import { speakKorean } from '@/services';

/** 反向练习页：给出中文/汉字，回忆对应的韩语词（强化汉字词双向联想） */
const ReversePage = () => {
    const navigate = useNavigate();
    const { initialRecords } = useSrsStore();
    // 当前练习到第几个
    const [index, setIndex] = useState(0);
    // 当前卡片是否已翻面
    const [revealed, setRevealed] = useState(false);
    // 本轮答对数（自评）
    const [correct, setCorrect] = useState(0);

    // 练习队列：已学过的词（基于首次加载快照，会话内稳定）
    const queue = useMemo(
        () => (initialRecords ? WORDS.filter((word) => initialRecords[word.id]) : null),
        [initialRecords]
    );

    const current = queue?.[index];

    /** 自评并进入下一张 */
    const handleNext = (remembered: boolean) => {
        if (remembered) {
            setCorrect((prev) => prev + 1);
        }
        setRevealed(false);
        setIndex((prev) => prev + 1);
    };

    if (!queue) {
        return null;
    }

    if (queue.length === 0) {
        return (
            <Flex vertical align="center" gap={16} style={{ marginTop: 64 }}>
                <Empty description="还没有学过的词，先去学新词吧" />
                <Button type="primary" onClick={() => navigate('/learn')}>
                    去学新词
                </Button>
            </Flex>
        );
    }

    if (!current) {
        return (
            <Flex vertical align="center" gap={16} style={{ marginTop: 64 }}>
                <Empty description={`本轮完成：记得 ${correct} / ${queue.length}`} />
                <Button
                    type="primary"
                    onClick={() => {
                        setIndex(0);
                        setCorrect(0);
                    }}
                >
                    再来一轮
                </Button>
            </Flex>
        );
    }

    return (
        <Flex vertical align="center" gap={8}>
            <Typography.Text type="secondary">
                反向练习 {index + 1} / {queue.length}（看中文回忆韩语）
            </Typography.Text>
            <WordCard
                word={current}
                revealed={revealed}
                direction="c2k"
                onSwipe={revealed ? handleNext : undefined}
                onSpeak={() => speakKorean(current.korean)}
            >
                {!revealed && (
                    <Button type="primary" onClick={() => setRevealed(true)}>
                        显示答案
                    </Button>
                )}
            </WordCard>

            {revealed && (
                <Space wrap style={{ marginTop: 8 }}>
                    <Button danger onClick={() => handleNext(false)}>
                        没记住
                    </Button>
                    <Button type="primary" onClick={() => handleNext(true)}>
                        记得
                    </Button>
                </Space>
            )}
        </Flex>
    );
};

export default ReversePage;
