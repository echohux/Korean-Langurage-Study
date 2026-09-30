import { Card, Col, Empty, Flex, Progress, Row, Statistic, Tag, Typography } from 'antd';
import { useMemo, useState } from 'react';

import { WORDS } from '@/data/words.seed';
import { useSrsStore } from '@/hooks/useSrsStore';
import { isDue } from '@/services';
import type { ReviewEvent, ReviewGrade } from '@/types';

import useStyles from './styles';

const DAY_MS = 24 * 60 * 60 * 1000;
const CURVE_DAYS = [0, 1, 3, 7, 14, 30];

interface ReviewPoint {
    /** 图表横坐标 */
    day: number;
    /** 估算保留率 */
    retention: number;
}

interface DailyReview {
    /** 日期显示文案 */
    label: string;
    /** 当天复习次数 */
    count: number;
}

/** 将日期格式化为月/日 */
const formatDay = (date: Date): string => `${date.getMonth() + 1}/${date.getDate()}`;

/** 获取记录中的复习历史，兼容旧版本只有最近一次时间的记录 */
const getRecordHistory = (record: {
    history?: ReviewEvent[];
    lastGrade: ReviewGrade;
    lastReviewedAt: string;
}): ReviewEvent[] =>
    record.history?.length ? record.history : [{ grade: record.lastGrade, reviewedAt: record.lastReviewedAt }];

/** 根据当前平均复习间隔估算记忆曲线 */
const buildMemoryCurve = (averageInterval: number): ReviewPoint[] => {
    const stability = Math.max(1, averageInterval);
    return CURVE_DAYS.map((day) => ({
        day,
        retention: Math.max(0.08, Math.exp(-day / (stability * 1.35)))
    }));
};

/** 学习数据分析页：展示本地 SRS 数据、复习趋势和记忆曲线 */
const AnalyticsPage = () => {
    const { records, loading } = useSrsStore();
    const { styles, cx } = useStyles();
    // 固定本次页面打开时的日期，避免渲染过程中时间变化导致统计不稳定
    const [today] = useState(() => new Date());

    const analytics = useMemo(() => {
        const recordList = Object.values(records);
        const events = recordList.flatMap(getRecordHistory);
        const rememberedCount = events.filter((event) => event.grade === 'good' || event.grade === 'easy').length;
        const reviewCount = events.length;
        const learnedCount = recordList.length;
        const dueCount = recordList.filter((record) => isDue(record)).length;
        const averageInterval = learnedCount
            ? recordList.reduce((total, record) => total + record.interval, 0) / learnedCount
            : 0;
        const dailyReviews: DailyReview[] = Array.from({ length: 14 }, (_, index) => {
            const date = new Date(today.getTime() - (13 - index) * DAY_MS);
            const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            const count = events.filter((event) => {
                const eventDate = new Date(event.reviewedAt);
                return `${eventDate.getFullYear()}-${eventDate.getMonth()}-${eventDate.getDate()}` === key;
            }).length;
            return { label: formatDay(date), count };
        });
        const curve = buildMemoryCurve(averageInterval);

        return {
            learnedCount,
            dueCount,
            reviewCount,
            rememberedRate: reviewCount ? Math.round((rememberedCount / reviewCount) * 100) : 0,
            averageInterval: Math.round(averageInterval * 10) / 10,
            dailyReviews,
            curve
        };
    }, [records, today]);

    const maxDailyCount = Math.max(1, ...analytics.dailyReviews.map((item) => item.count));
    const curveCoordinates = analytics.curve
        .map((point, index) => {
            const x = 24 + (index / (analytics.curve.length - 1)) * 352;
            const y = 190 - point.retention * 160;
            return `${x},${y}`;
        })
        .join(' ');

    return (
        <div className={cx('analytics-page', styles.toString())}>
            <Flex vertical gap={4}>
                <Typography.Title level={3} style={{ margin: 0 }}>
                    数据分析
                </Typography.Title>
                <Typography.Text type="secondary">数据来自当前设备的本地学习记录，不会上传到服务器。</Typography.Text>
            </Flex>

            <Row gutter={[16, 16]} className="analytics-page__section">
                <Col xs={12} sm={6}>
                    <Card loading={loading}>
                        <Statistic title="已学词数" value={analytics.learnedCount} suffix={`/ ${WORDS.length}`} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card loading={loading}>
                        <Statistic title="复习次数" value={analytics.reviewCount} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card loading={loading}>
                        <Statistic title="记住率" value={analytics.rememberedRate} suffix="%" />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card loading={loading}>
                        <Statistic title="待复习" value={analytics.dueCount} />
                    </Card>
                </Col>
            </Row>

            <Card title="记忆曲线" className="analytics-page__section" loading={loading}>
                {analytics.learnedCount === 0 ? (
                    <Empty description="先学习一些词，再查看记忆曲线" />
                ) : (
                    <>
                        <Typography.Text type="secondary">
                            根据当前平均复习间隔 {analytics.averageInterval} 天估算，实际效果会受每次评分影响。
                        </Typography.Text>
                        <div className="analytics-page__chart">
                            <svg viewBox="0 0 400 220" role="img" aria-label="记忆保留率估算曲线">
                                <line x1="24" y1="30" x2="376" y2="30" stroke="#f0f0f0" />
                                <line x1="24" y1="110" x2="376" y2="110" stroke="#f0f0f0" />
                                <line x1="24" y1="190" x2="376" y2="190" stroke="#d9d9d9" />
                                <polyline
                                    fill="none"
                                    points={curveCoordinates}
                                    stroke="#1677ff"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="4"
                                />
                                {analytics.curve.map((point, index) => {
                                    const x = 24 + (index / (analytics.curve.length - 1)) * 352;
                                    const y = 190 - point.retention * 160;
                                    return (
                                        <circle key={`curve-point-${point.day}`} cx={x} cy={y} fill="#1677ff" r="5" />
                                    );
                                })}
                            </svg>
                        </div>
                        <div className="analytics-page__axis">
                            {analytics.curve.map((point) => (
                                <span key={`curve-label-${point.day}`}>
                                    {point.day === 0 ? '今天' : `${point.day}天`}
                                </span>
                            ))}
                        </div>
                    </>
                )}
            </Card>

            <Card title="近 14 天复习趋势" className="analytics-page__section" loading={loading}>
                {analytics.reviewCount === 0 ? (
                    <Empty description="还没有复习记录" />
                ) : (
                    <div className="analytics-page__daily-list">
                        {analytics.dailyReviews.map((item) => (
                            <div className="analytics-page__daily-item" key={`daily-review-${item.label}`}>
                                <div className="analytics-page__daily-bar">
                                    <div
                                        className="analytics-page__daily-bar-fill"
                                        style={{ height: `${Math.max(4, (item.count / maxDailyCount) * 100)}%` }}
                                    />
                                </div>
                                <Typography.Text className="analytics-page__daily-label">{item.label}</Typography.Text>
                                <Typography.Text type="secondary">{item.count}次</Typography.Text>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            <Card title="学习状态" className="analytics-page__section" loading={loading}>
                <Flex vertical gap={12}>
                    <Flex justify="space-between">
                        <Typography.Text>词库完成度</Typography.Text>
                        <Typography.Text>
                            {analytics.learnedCount} / {WORDS.length}
                        </Typography.Text>
                    </Flex>
                    <Progress percent={Math.round((analytics.learnedCount / WORDS.length) * 100)} />
                    <Flex gap={8} wrap>
                        <Tag color="blue">平均间隔 {analytics.averageInterval} 天</Tag>
                        <Tag color={analytics.dueCount ? 'orange' : 'green'}>
                            {analytics.dueCount ? `${analytics.dueCount} 个待复习` : '暂时没有待复习'}
                        </Tag>
                    </Flex>
                </Flex>
            </Card>
        </div>
    );
};

export default AnalyticsPage;
