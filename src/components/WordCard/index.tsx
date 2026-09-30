import { SoundOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { useRef, useState } from 'react';
import type { PointerEvent, ReactNode } from 'react';

import { getLearningLevel } from '@/constant/learningLevel';
import type { Word } from '@/types';
import { simplifyHanja } from '@/utils/simplifyHanja';

import useCardStyles from './styles';

interface WordCardProps {
    /** 当前词条 */
    word: Word;
    /** 是否已翻面显示答案 */
    revealed: boolean;
    /** 点击朗读回调 */
    onSpeak: () => void;
    /** 提问方向：k2c 韩语→汉字/中文（默认）；c2k 中文/汉字→回忆韩语 */
    direction?: 'k2c' | 'c2k';
    /** 可评分时：左滑记住，右滑没记住 */
    onSwipe?: (remembered: boolean) => void;
    /** 卡片底部操作区（评分按钮、翻面按钮等） */
    children?: ReactNode;
}

/** 汉字词学习卡片：支持正/反两个方向的翻面记忆 */
const WordCard = ({ word, revealed, onSpeak, direction = 'k2c', onSwipe, children }: WordCardProps) => {
    const { styles, cx } = useCardStyles();
    // 韩语一侧是否可见（正向始终可见；反向仅翻面后可见，避免提前泄露答案）
    const koreanVisible = direction === 'k2c' || revealed;
    // 手势起始坐标与指针 id
    const start = useRef<{ x: number; y: number; pointerId: number } | null>(null);
    // 拖动时的水平位移
    const [dragX, setDragX] = useState(0);

    /** 从卡片空白区域开始追踪手势，不劫持按钮、链接 */
    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
        if (!onSwipe || !event.isPrimary || (event.target as HTMLElement).closest('button,a,input')) {
            return;
        }
        start.current = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    /** 仅横向拖动卡片，竖向仍交给页面滚动 */
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

    /** 达到阈值后提交评分，否则卡片回弹 */
    const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
        if (!start.current || start.current.pointerId !== event.pointerId) {
            return;
        }
        const dx = event.clientX - start.current.x;
        const dy = event.clientY - start.current.y;
        start.current = null;
        setDragX(0);
        if (onSwipe && Math.abs(dx) >= 90 && Math.abs(dx) > Math.abs(dy) * 1.3) {
            onSwipe(dx < 0);
        }
    };

    /** 浏览器中止手势时复原卡片 */
    const handlePointerCancel = () => {
        start.current = null;
        setDragX(0);
    };

    return (
        <div
            className={cx('word-card', styles.toString())}
            style={{ transform: `translateX(${dragX}px) rotate(${dragX / 25}deg)` }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
        >
            {onSwipe && (
                <div className="word-card__swipe-tip" aria-hidden="true">
                    {dragX < -24 ? '← 记住' : dragX > 24 ? '没记住 →' : '← 记住 · 没记住 →'}
                </div>
            )}
            <div className="word-card__level">
                {getLearningLevel(word) === 'beginner'
                    ? '初级'
                    : getLearningLevel(word) === 'intermediate'
                      ? '进阶'
                      : '高级'}
            </div>

            {direction === 'c2k' ? (
                <>
                    <div className="word-card__chinese">{word.chinese}</div>
                    {word.hanja && (
                        <div className="word-card__hanja-line">
                            汉字：<span className="word-card__hanja">{simplifyHanja(word.hanja)}</span>
                        </div>
                    )}
                    {revealed && (
                        <>
                            <div className="word-card__korean">{word.korean}</div>
                            <div className="word-card__romanization">{word.romanization}</div>
                        </>
                    )}
                </>
            ) : (
                <>
                    <div className="word-card__korean">{word.korean}</div>
                    <div className="word-card__romanization">{word.romanization}</div>
                    {revealed && (
                        <>
                            {word.hanja && (
                                <div className="word-card__hanja-line">
                                    汉字：<span className="word-card__hanja">{simplifyHanja(word.hanja)}</span>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

            <div className="word-card__actions">
                <Space wrap>
                    {koreanVisible && (
                        <Button
                            className="word-card__speak-button"
                            aria-label={`朗读：${word.korean}`}
                            icon={<SoundOutlined />}
                            onClick={onSpeak}
                        />
                    )}
                    {children}
                </Space>
            </div>
        </div>
    );
};

export default WordCard;
