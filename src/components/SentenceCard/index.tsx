import { SoundOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { useRef, useState } from 'react';
import type { PointerEvent, ReactNode } from 'react';

import { SCENE_LABELS } from '@/types';
import type { Word } from '@/types';

import useStyles from './styles';

interface SentenceCardProps {
    /** 当前生活场景词 */
    word: Word;
    /** 朗读句子 */
    onSpeak: () => void;
    /** 左滑记住，右滑没记住 */
    onSwipe: (remembered: boolean) => void;
    /** 底部评分按钮 */
    children?: ReactNode;
}

/** 手机 H5 句子卡片：展示生活场景句并支持左右滑动 */
const SentenceCard = ({ word, onSpeak, onSwipe, children }: SentenceCardProps) => {
    const { styles, cx } = useStyles();
    // 手势起点
    const start = useRef<{ x: number; y: number; pointerId: number } | null>(null);
    // 拖动距离
    const [dragX, setDragX] = useState(0);
    const scenario = word.scenario;

    /** 开始拖动卡片 */
    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
        if (!event.isPrimary || (event.target as HTMLElement).closest('button,a')) {
            return;
        }
        start.current = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    /** 更新横向拖动距离 */
    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
        if (!start.current || start.current.pointerId !== event.pointerId) {
            return;
        }
        const dx = event.clientX - start.current.x;
        const dy = event.clientY - start.current.y;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
            setDragX(dx);
        }
    };

    /** 达到滑动阈值后提交结果 */
    const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
        if (!start.current || start.current.pointerId !== event.pointerId) {
            return;
        }
        const dx = event.clientX - start.current.x;
        const dy = event.clientY - start.current.y;
        start.current = null;
        setDragX(0);
        if (Math.abs(dx) >= 90 && Math.abs(dx) > Math.abs(dy) * 1.3) {
            onSwipe(dx < 0);
        }
    };

    /** 取消拖动并复原 */
    const handlePointerCancel = () => {
        start.current = null;
        setDragX(0);
    };

    return (
        <div
            className={cx('sentence-card', styles.toString())}
            style={{ transform: `translateX(${dragX}px) rotate(${dragX / 25}deg)` }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
        >
            <div className="sentence-card__scene">{word.scene ? SCENE_LABELS[word.scene] : '生活场景'}</div>
            {scenario ? (
                <>
                    <div className="sentence-card__korean">{scenario.ko}</div>
                    <div className="sentence-card__chinese">{scenario.zh}</div>
                </>
            ) : (
                <div className="sentence-card__korean">暂无场景句</div>
            )}
            <div className="sentence-card__word">
                重点词：{word.korean} · {word.chinese}
            </div>
            <div className="sentence-card__hint">← 记住 · 没记住 →</div>
            <div className="sentence-card__actions">
                <Space wrap>
                    <Button
                        aria-label={`朗读句子：${scenario?.ko ?? ''}`}
                        disabled={!scenario}
                        icon={<SoundOutlined />}
                        onClick={onSpeak}
                    />
                    {children}
                </Space>
            </div>
        </div>
    );
};

export default SentenceCard;
