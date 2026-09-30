import { useRequest } from 'ahooks';
import { useCallback, useMemo, useState } from 'react';

import { createInitialRecord, getAllRecords, saveRecord, scheduleNext } from '@/services';
import type { ReviewGrade, ReviewRecord } from '@/types';

/** 集中管理 SRS 复习记录的加载、评分与持久化 */
export const useSrsStore = () => {
    // 首次从 IndexedDB 加载的记录快照（本次会话内不变，用于生成稳定队列）
    const { data: initialRecords, loading } = useRequest(getAllRecords);
    // 本次会话内新增/更新的记录（评分产生）
    const [overrides, setOverrides] = useState<Record<string, ReviewRecord>>({});

    // 合并快照与本次会话改动，得到实时记录
    const records = useMemo(() => ({ ...(initialRecords ?? {}), ...overrides }), [initialRecords, overrides]);

    /** 对某个词评分并持久化（新词会自动创建初始记录） */
    const grade = useCallback(
        async (wordId: string, value: ReviewGrade) => {
            const current = records[wordId] ?? createInitialRecord(wordId);
            const next = scheduleNext(current, value);
            await saveRecord(next);
            setOverrides((prev) => ({ ...prev, [wordId]: next }));
        },
        [records]
    );

    return { records, initialRecords: initialRecords ?? null, loading, grade };
};
