import type { ReviewRecord, WordExplanation } from '@/types';

/** IndexedDB 库名 */
const DB_NAME = 'korean-hanja';
/** 复习记录 store 名 */
const STORE = 'reviews';
/** AI 讲解缓存 store 名 */
const STORE_EXPL = 'explanations';
/** 库版本 */
const VERSION = 2;

/** 打开 IndexedDB 连接（首次/升级会建 store） */
const openDb = (): Promise<IDBDatabase> =>
    new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, VERSION);
        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains(STORE)) {
                db.createObjectStore(STORE, { keyPath: 'wordId' });
            }
            if (!db.objectStoreNames.contains(STORE_EXPL)) {
                db.createObjectStore(STORE_EXPL, { keyPath: 'wordId' });
            }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });

/** 读取全部复习记录，按 wordId 建索引返回 */
export const getAllRecords = async (): Promise<Record<string, ReviewRecord>> => {
    const db = await openDb();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readonly');
        const req = tx.objectStore(STORE).getAll();
        req.onsuccess = () => {
            const map: Record<string, ReviewRecord> = {};
            (req.result as ReviewRecord[]).forEach((record) => {
                map[record.wordId] = record;
            });
            resolve(map);
        };
        req.onerror = () => reject(req.error);
    });
};

/** 写入（新增或更新）一条复习记录 */
export const saveRecord = async (record: ReviewRecord): Promise<void> => {
    const db = await openDb();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).put(record);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
};

/** 缓存条目结构 */
interface ExplanationEntry {
    /** 关联词 id */
    wordId: string;
    /** 讲解内容 */
    explanation: WordExplanation;
}

/** 读取某个词的 AI 讲解缓存，无缓存返回 null */
export const getExplanation = async (wordId: string): Promise<WordExplanation | null> => {
    const db = await openDb();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_EXPL, 'readonly');
        const req = tx.objectStore(STORE_EXPL).get(wordId);
        req.onsuccess = () => {
            const entry = req.result as ExplanationEntry | undefined;
            resolve(entry?.explanation ?? null);
        };
        req.onerror = () => reject(req.error);
    });
};

/** 写入某个词的 AI 讲解缓存 */
export const saveExplanation = async (wordId: string, explanation: WordExplanation): Promise<void> => {
    const db = await openDb();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_EXPL, 'readwrite');
        tx.objectStore(STORE_EXPL).put({ wordId, explanation } satisfies ExplanationEntry);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
};
