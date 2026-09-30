import { App, Button, Empty, Flex, Select, Space, Typography } from 'antd';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import SentenceCard from '@/components/SentenceCard';
import { SCENE_WORDS } from '@/data/scene-words.seed';
import { useSrsStore } from '@/hooks/useSrsStore';
import { speakKorean } from '@/services';
import { SCENE_LABELS } from '@/types';
import type { SceneCategory } from '@/types';

/** 句子学习页支持的场景选项 */
const SCENE_OPTIONS: { label: string; value: SceneCategory | 'all' }[] = [
    { label: '全部场景', value: 'all' },
    { label: '酒店', value: 'hotel' },
    { label: '帮助 / 医疗', value: 'medical' },
    { label: '旅游', value: 'travel' },
    { label: '餐厅', value: 'restaurant' }
];

/** 句子学习页：按生活场景学习真实生活句子，不区分难度 */
const SentencesPage = () => {
    const navigate = useNavigate();
    const { message } = App.useApp();
    const { initialRecords, grade } = useSrsStore();
    // 当前生活场景
    const [scene, setScene] = useState<SceneCategory | 'all'>('all');
    // 当前句子下标
    const [index, setIndex] = useState(0);
    // 防止连续滑动重复写入
    const saving = useRef(false);

    const queue = useMemo(
        () =>
            initialRecords
                ? SCENE_WORDS.filter((word) => !initialRecords[word.id] && (scene === 'all' || word.scene === scene))
                : null,
        [initialRecords, scene]
    );
    const current = queue?.[index];

    /** 切换生活场景并从第一句开始 */
    const handleSceneChange = (nextScene: SceneCategory | 'all') => {
        setScene(nextScene);
        setIndex(0);
    };

    /** 记录句子掌握情况并进入下一句 */
    const handleScore = async (remembered: boolean) => {
        if (!current || saving.current) {
            return;
        }
        saving.current = true;
        try {
            await grade(current.id, remembered ? 'good' : 'again');
            setIndex((prev) => prev + 1);
        } catch {
            message.error('句子学习记录保存失败，请重试');
        } finally {
            saving.current = false;
        }
    };

    if (!queue) {
        return null;
    }

    if (!current) {
        return (
            <Flex vertical align="center" gap={16} style={{ marginTop: 48 }}>
                <Empty description={scene === 'all' ? '暂无未学习句子' : `${SCENE_LABELS[scene]}暂无未学习句子`} />
                <Space>
                    <Button type="primary" onClick={() => setIndex(0)}>
                        再看一轮
                    </Button>
                    <Button onClick={() => navigate('/learn')}>去学单词</Button>
                </Space>
            </Flex>
        );
    }

    return (
        <Flex vertical align="center" gap={10}>
            <Typography.Title level={3} style={{ margin: 0 }}>
                句子学习
            </Typography.Title>
            <Typography.Text type="secondary">看生活场景句，左滑记住，右滑没记住</Typography.Text>
            <Select
                value={scene}
                style={{ width: '100%', maxWidth: 480 }}
                options={SCENE_OPTIONS}
                onChange={handleSceneChange}
            />
            <Typography.Text type="secondary">
                {current.scene ? SCENE_LABELS[current.scene] : '生活场景'} · {index + 1} / {queue.length}
            </Typography.Text>
            <SentenceCard
                word={current}
                onSpeak={() => current.scenario && speakKorean(current.scenario.ko)}
                onSwipe={handleScore}
            >
                <Button type="primary" onClick={() => handleScore(true)}>
                    ← 记住
                </Button>
                <Button onClick={() => handleScore(false)}>没记住 →</Button>
            </SentenceCard>
        </Flex>
    );
};

export default SentencesPage;
