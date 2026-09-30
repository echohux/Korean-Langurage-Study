import { Button, Card, Flex, Progress, Select, Space, Statistic, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { WORDS } from '@/data/words.seed';
import { useSrsStore } from '@/hooks/useSrsStore';
import { isDue } from '@/services';
import {
    getKoreanVoices,
    getPreferredKoreanVoice,
    isTtsSupported,
    setPreferredKoreanVoice,
    speakKorean
} from '@/services/tts';

/** 概览页：学习进度总览 + 各学习入口 */
const DashboardPage = () => {
    const navigate = useNavigate();
    const { records, loading } = useSrsStore();
    // 浏览器可用音色列表（可能在页面加载后才到齐）
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(getKoreanVoices);
    // 当前选择的音色，空字符串表示自动选择
    const [preferredVoice, setPreferredVoice] = useState(getPreferredKoreanVoice);

    useEffect(() => {
        if (!isTtsSupported()) {
            return;
        }
        /** 在浏览器完成音色加载后更新选项 */
        const updateVoices = () => setVoices(getKoreanVoices());
        window.speechSynthesis.addEventListener('voiceschanged', updateVoices);
        return () => window.speechSynthesis.removeEventListener('voiceschanged', updateVoices);
    }, []);

    /** 切换音色，并保存供单词与例句朗读复用 */
    const handleVoiceChange = (voiceURI: string) => {
        setPreferredVoice(voiceURI);
        setPreferredKoreanVoice(voiceURI);
    };

    // 学习进度统计
    const stats = useMemo(() => {
        const total = WORDS.length;
        const learned = Object.keys(records).length;
        const due = Object.values(records).filter((record) => isDue(record)).length;
        const newCount = total - learned;
        return { total, learned, due, newCount };
    }, [records]);

    return (
        <Flex vertical gap={24} style={{ maxWidth: 720, margin: '0 auto' }}>
            <Typography.Title level={3} style={{ margin: 0 }}>
                学习概览
            </Typography.Title>

            <Card loading={loading}>
                <Flex gap={32} wrap>
                    <Statistic title="词库总数" value={stats.total} />
                    <Statistic title="已加入学习" value={stats.learned} />
                    <Statistic title="待复习" value={stats.due} valueStyle={{ color: '#cf1322' }} />
                    <Statistic title="未学新词" value={stats.newCount} />
                </Flex>
                <Progress
                    style={{ marginTop: 16 }}
                    percent={stats.total ? Math.round((stats.learned / stats.total) * 100) : 0}
                />
            </Card>

            <Card title="例句 / 语法">
                <Typography.Text type="secondary">
                    例句与语法讲解已离线内置，学习和复习时直接展示，无需联网、无需配置模型。
                </Typography.Text>
            </Card>

            <Card title="韩语朗读音色">
                <Flex vertical gap={12}>
                    <Typography.Text type="secondary">
                        试听后选择喜欢的音色；单词和例句共用。可用音色取决于当前浏览器和系统。
                    </Typography.Text>
                    <Space wrap>
                        <Select
                            aria-label="选择韩语朗读音色"
                            style={{ minWidth: 240 }}
                            value={voices.some((voice) => voice.voiceURI === preferredVoice) ? preferredVoice : ''}
                            disabled={!isTtsSupported()}
                            onChange={handleVoiceChange}
                            options={[
                                { label: '自动选择', value: '' },
                                ...voices.map((voice) => ({
                                    label: `${voice.name}${voice.localService ? ' · 本地' : ' · 可能需要联网'}`,
                                    value: voice.voiceURI
                                }))
                            ]}
                        />
                        <Button
                            disabled={!isTtsSupported() || voices.length === 0}
                            onClick={() => speakKorean('안녕하세요. 만나서 반갑습니다.')}
                        >
                            试听
                        </Button>
                    </Space>
                    {voices.length === 0 && (
                        <Typography.Text type="warning">
                            暂未发现韩语音色。可在 macOS 系统设置中下载韩语系统语音，然后刷新页面。
                        </Typography.Text>
                    )}
                </Flex>
            </Card>

            <Space>
                <Button type="primary" size="large" onClick={() => navigate('/learn')}>
                    学新词
                </Button>
                <Button size="large" disabled={stats.due === 0} onClick={() => navigate('/review')}>
                    开始复习{stats.due ? `（${stats.due}）` : ''}
                </Button>
            </Space>
        </Flex>
    );
};

export default DashboardPage;
