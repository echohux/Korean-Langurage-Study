import { SoundOutlined } from '@ant-design/icons';
import { Button, List, Typography } from 'antd';

import { EXAMPLES } from '@/data/examples.seed';
import { GRAMMAR_ZH } from '@/data/grammar.zh';
import { isKoreanPlaybackSupported, playKorean } from '@/services/tts';
import type { Word } from '@/types';

/** 例句面板：直接读取离线预生成数据，运行时不调用任何模型、不联网 */
const ExplanationPanel = ({ word }: { word: Word }) => {
    // 该词的离线例句/语法（预生成，可能为空）
    const data = EXAMPLES[word.id];
    // 模型未能生成纯中文时，使用基于词义的中文兜底说明，避免页面出现韩文语法说明
    const grammar = GRAMMAR_ZH[word.id] ?? `「${word.korean}」表示“${word.chinese}”，是一个韩语名词。`;

    if (!data) {
        return (
            <div style={{ maxWidth: 480, margin: '12px auto 0', textAlign: 'center' }}>
                <Typography.Text type="secondary">该词暂无离线例句</Typography.Text>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 480, margin: '16px auto 0' }}>
            <List
                size="small"
                header={<Typography.Text strong>例句</Typography.Text>}
                dataSource={data.examples}
                renderItem={(item, index) => (
                    <List.Item
                        key={`example-${index.toString()}`}
                        actions={[
                            <Button
                                key="speak"
                                type="link"
                                disabled={!isKoreanPlaybackSupported()}
                                aria-label={`朗读例句：${item.ko}`}
                                icon={<SoundOutlined />}
                                onClick={() => void playKorean(item.ko)}
                            />
                        ]}
                    >
                        <div>
                            <div>{item.ko}</div>
                            <Typography.Text type="secondary">{item.zh}</Typography.Text>
                        </div>
                    </List.Item>
                )}
            />
            {grammar && (
                <Typography.Paragraph style={{ marginTop: 12 }}>
                    <Typography.Text strong>中文语法讲解：</Typography.Text>
                    {grammar}
                </Typography.Paragraph>
            )}
        </div>
    );
};

export default ExplanationPanel;
