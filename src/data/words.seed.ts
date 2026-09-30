import type { Word } from '@/types';

import { SCENE_WORDS } from './scene-words.seed';

/**
 * 汉字词种子集：面向中国人学韩语的高频词，按内部难度等级组织。
 * 每个词都标注了对应汉字，用于「汉字联想」记忆。后续可扩充或改由脚本批量标注生成。
 */
const CORE_WORDS: Word[] = [
    {
        id: 'w001',
        korean: '학생',
        hanja: '學生',
        chinese: '学生',
        romanization: 'haksaeng',
        pos: 'noun',
        topikLevel: 1,
        isSinoKorean: true
    },
    {
        id: 'w002',
        korean: '학교',
        hanja: '學校',
        chinese: '学校',
        romanization: 'hakgyo',
        pos: 'noun',
        topikLevel: 1,
        isSinoKorean: true
    },
    {
        id: 'w003',
        korean: '선생',
        hanja: '先生',
        chinese: '老师',
        romanization: 'seonsaeng',
        pos: 'noun',
        topikLevel: 1,
        isSinoKorean: true
    },
    {
        id: 'w004',
        korean: '시간',
        hanja: '時間',
        chinese: '时间',
        romanization: 'sigan',
        pos: 'noun',
        topikLevel: 1,
        isSinoKorean: true
    },
    {
        id: 'w005',
        korean: '도서관',
        hanja: '圖書館',
        chinese: '图书馆',
        romanization: 'doseogwan',
        pos: 'noun',
        topikLevel: 1,
        isSinoKorean: true
    },
    {
        id: 'w006',
        korean: '병원',
        hanja: '病院',
        chinese: '医院',
        romanization: 'byeongwon',
        pos: 'noun',
        topikLevel: 1,
        isSinoKorean: true
    },
    {
        id: 'w007',
        korean: '은행',
        hanja: '銀行',
        chinese: '银行',
        romanization: 'eunhaeng',
        pos: 'noun',
        topikLevel: 1,
        isSinoKorean: true
    },
    {
        id: 'w008',
        korean: '교실',
        hanja: '敎室',
        chinese: '教室',
        romanization: 'gyosil',
        pos: 'noun',
        topikLevel: 1,
        isSinoKorean: true
    },
    {
        id: 'w009',
        korean: '가족',
        hanja: '家族',
        chinese: '家人',
        romanization: 'gajok',
        pos: 'noun',
        topikLevel: 1,
        isSinoKorean: true
    },
    {
        id: 'w010',
        korean: '회사',
        hanja: '會社',
        chinese: '公司',
        romanization: 'hoesa',
        pos: 'noun',
        topikLevel: 1,
        isSinoKorean: true
    },
    {
        id: 'w011',
        korean: '음식',
        hanja: '飮食',
        chinese: '食物',
        romanization: 'eumsik',
        pos: 'noun',
        topikLevel: 1,
        isSinoKorean: true
    },
    {
        id: 'w012',
        korean: '운동',
        hanja: '運動',
        chinese: '运动',
        romanization: 'undong',
        pos: 'noun',
        topikLevel: 1,
        isSinoKorean: true
    },
    {
        id: 'w013',
        korean: '여행',
        hanja: '旅行',
        chinese: '旅行',
        romanization: 'yeohaeng',
        pos: 'noun',
        topikLevel: 1,
        isSinoKorean: true
    },
    {
        id: 'w014',
        korean: '시장',
        hanja: '市場',
        chinese: '市场',
        romanization: 'sijang',
        pos: 'noun',
        topikLevel: 1,
        isSinoKorean: true
    },
    {
        id: 'w015',
        korean: '공원',
        hanja: '公園',
        chinese: '公园',
        romanization: 'gongwon',
        pos: 'noun',
        topikLevel: 1,
        isSinoKorean: true
    },
    {
        id: 'w016',
        korean: '신문',
        hanja: '新聞',
        chinese: '报纸',
        romanization: 'sinmun',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w017',
        korean: '준비',
        hanja: '準備',
        chinese: '准备',
        romanization: 'junbi',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w018',
        korean: '약속',
        hanja: '約束',
        chinese: '约定',
        romanization: 'yaksok',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w019',
        korean: '사진',
        hanja: '寫眞',
        chinese: '照片',
        romanization: 'sajin',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w020',
        korean: '지도',
        hanja: '地圖',
        chinese: '地图',
        romanization: 'jido',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w021',
        korean: '문제',
        hanja: '問題',
        chinese: '问题',
        romanization: 'munje',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w022',
        korean: '질문',
        hanja: '質問',
        chinese: '提问',
        romanization: 'jilmun',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w023',
        korean: '대답',
        hanja: '對答',
        chinese: '回答',
        romanization: 'daedap',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w024',
        korean: '극장',
        hanja: '劇場',
        chinese: '剧场',
        romanization: 'geukjang',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w025',
        korean: '공항',
        hanja: '空港',
        chinese: '机场',
        romanization: 'gonghang',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w026',
        korean: '요리',
        hanja: '料理',
        chinese: '料理',
        romanization: 'yori',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w027',
        korean: '감기',
        hanja: '感氣',
        chinese: '感冒',
        romanization: 'gamgi',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w028',
        korean: '안전',
        hanja: '安全',
        chinese: '安全',
        romanization: 'anjeon',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w029',
        korean: '자유',
        hanja: '自由',
        chinese: '自由',
        romanization: 'jayu',
        pos: 'noun',
        topikLevel: 3,
        isSinoKorean: true
    },
    {
        id: 'w030',
        korean: '성공',
        hanja: '成功',
        chinese: '成功',
        romanization: 'seonggong',
        pos: 'noun',
        topikLevel: 3,
        isSinoKorean: true
    },
    {
        id: 'w031',
        korean: '시험',
        hanja: '試驗',
        chinese: '考试',
        romanization: 'siheom',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w032',
        korean: '숙제',
        hanja: '宿題',
        chinese: '作业',
        romanization: 'sukje',
        pos: 'noun',
        topikLevel: 1,
        isSinoKorean: true
    },
    {
        id: 'w033',
        korean: '방학',
        hanja: '放學',
        chinese: '放假',
        romanization: 'banghak',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w034',
        korean: '계획',
        hanja: '計劃',
        chinese: '计划',
        romanization: 'gyehoek',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w035',
        korean: '주소',
        hanja: '住所',
        chinese: '地址',
        romanization: 'juso',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w036',
        korean: '번호',
        hanja: '番號',
        chinese: '号码',
        romanization: 'beonho',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w037',
        korean: '전화',
        hanja: '電話',
        chinese: '电话',
        romanization: 'jeonhwa',
        pos: 'noun',
        topikLevel: 1,
        isSinoKorean: true
    },
    {
        id: 'w038',
        korean: '지하철',
        hanja: '地下鐵',
        chinese: '地铁',
        romanization: 'jihacheol',
        pos: 'noun',
        topikLevel: 1,
        isSinoKorean: true
    },
    {
        id: 'w039',
        korean: '자동차',
        hanja: '自動車',
        chinese: '汽车',
        romanization: 'jadongcha',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w040',
        korean: '비행기',
        hanja: '飛行機',
        chinese: '飞机',
        romanization: 'bihaenggi',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w041',
        korean: '세계',
        hanja: '世界',
        chinese: '世界',
        romanization: 'segye',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w042',
        korean: '세상',
        hanja: '世上',
        chinese: '世间',
        romanization: 'sesang',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w043',
        korean: '사회',
        hanja: '社會',
        chinese: '社会',
        romanization: 'sahoe',
        pos: 'noun',
        topikLevel: 3,
        isSinoKorean: true
    },
    {
        id: 'w044',
        korean: '문화',
        hanja: '文化',
        chinese: '文化',
        romanization: 'munhwa',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w045',
        korean: '역사',
        hanja: '歷史',
        chinese: '历史',
        romanization: 'yeoksa',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w046',
        korean: '경제',
        hanja: '經濟',
        chinese: '经济',
        romanization: 'gyeongje',
        pos: 'noun',
        topikLevel: 3,
        isSinoKorean: true
    },
    {
        id: 'w047',
        korean: '정치',
        hanja: '政治',
        chinese: '政治',
        romanization: 'jeongchi',
        pos: 'noun',
        topikLevel: 3,
        isSinoKorean: true
    },
    {
        id: 'w048',
        korean: '과학',
        hanja: '科學',
        chinese: '科学',
        romanization: 'gwahak',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w049',
        korean: '기술',
        hanja: '技術',
        chinese: '技术',
        romanization: 'gisul',
        pos: 'noun',
        topikLevel: 3,
        isSinoKorean: true
    },
    {
        id: 'w050',
        korean: '환경',
        hanja: '環境',
        chinese: '环境',
        romanization: 'hwangyeong',
        pos: 'noun',
        topikLevel: 3,
        isSinoKorean: true
    },
    {
        id: 'w051',
        korean: '교통',
        hanja: '交通',
        chinese: '交通',
        romanization: 'gyotong',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w052',
        korean: '관계',
        hanja: '關係',
        chinese: '关系',
        romanization: 'gwangye',
        pos: 'noun',
        topikLevel: 3,
        isSinoKorean: true
    },
    {
        id: 'w053',
        korean: '관심',
        hanja: '關心',
        chinese: '关心',
        romanization: 'gwansim',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w054',
        korean: '결과',
        hanja: '結果',
        chinese: '结果',
        romanization: 'gyeolgwa',
        pos: 'noun',
        topikLevel: 3,
        isSinoKorean: true
    },
    {
        id: 'w055',
        korean: '이유',
        hanja: '理由',
        chinese: '理由',
        romanization: 'iyu',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w056',
        korean: '방법',
        hanja: '方法',
        chinese: '方法',
        romanization: 'bangbeop',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w057',
        korean: '목적',
        hanja: '目的',
        chinese: '目的',
        romanization: 'mokjeok',
        pos: 'noun',
        topikLevel: 3,
        isSinoKorean: true
    },
    {
        id: 'w058',
        korean: '계절',
        hanja: '季節',
        chinese: '季节',
        romanization: 'gyejeol',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w059',
        korean: '온도',
        hanja: '溫度',
        chinese: '温度',
        romanization: 'ondo',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w060',
        korean: '기분',
        hanja: '氣分',
        chinese: '心情',
        romanization: 'gibun',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w061',
        korean: '감정',
        hanja: '感情',
        chinese: '感情',
        romanization: 'gamjeong',
        pos: 'noun',
        topikLevel: 3,
        isSinoKorean: true
    },
    {
        id: 'w062',
        korean: '성격',
        hanja: '性格',
        chinese: '性格',
        romanization: 'seonggyeok',
        pos: 'noun',
        topikLevel: 3,
        isSinoKorean: true
    },
    {
        id: 'w063',
        korean: '습관',
        hanja: '習慣',
        chinese: '习惯',
        romanization: 'seupgwan',
        pos: 'noun',
        topikLevel: 3,
        isSinoKorean: true
    },
    {
        id: 'w064',
        korean: '노력',
        hanja: '努力',
        chinese: '努力',
        romanization: 'noryeok',
        pos: 'noun',
        topikLevel: 3,
        isSinoKorean: true
    },
    {
        id: 'w065',
        korean: '성적',
        hanja: '成績',
        chinese: '成绩',
        romanization: 'seongjeok',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w066',
        korean: '실수',
        hanja: '失手',
        chinese: '失误',
        romanization: 'silsu',
        pos: 'noun',
        topikLevel: 3,
        isSinoKorean: true
    },
    {
        id: 'w067',
        korean: '경험',
        hanja: '經驗',
        chinese: '经验',
        romanization: 'gyeongheom',
        pos: 'noun',
        topikLevel: 3,
        isSinoKorean: true
    },
    {
        id: 'w068',
        korean: '기회',
        hanja: '機會',
        chinese: '机会',
        romanization: 'gihoe',
        pos: 'noun',
        topikLevel: 3,
        isSinoKorean: true
    },
    {
        id: 'w069',
        korean: '계산',
        hanja: '計算',
        chinese: '计算',
        romanization: 'gyesan',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w070',
        korean: '요금',
        hanja: '料金',
        chinese: '费用',
        romanization: 'yogeum',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w071',
        korean: '가격',
        hanja: '價格',
        chinese: '价格',
        romanization: 'gagyeok',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w072',
        korean: '할인',
        hanja: '割引',
        chinese: '打折',
        romanization: 'harin',
        pos: 'noun',
        topikLevel: 3,
        isSinoKorean: true
    },
    {
        id: 'w073',
        korean: '예금',
        hanja: '預金',
        chinese: '存款',
        romanization: 'yegeum',
        pos: 'noun',
        topikLevel: 3,
        isSinoKorean: true
    },
    {
        id: 'w074',
        korean: '회의',
        hanja: '會議',
        chinese: '会议',
        romanization: 'hoeui',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w075',
        korean: '약국',
        hanja: '藥局',
        chinese: '药店',
        romanization: 'yakguk',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w076',
        korean: '식당',
        hanja: '食堂',
        chinese: '餐厅',
        romanization: 'sikdang',
        pos: 'noun',
        topikLevel: 1,
        isSinoKorean: true
    },
    {
        id: 'w077',
        korean: '의사',
        hanja: '醫師',
        chinese: '医生',
        romanization: 'uisa',
        pos: 'noun',
        topikLevel: 1,
        isSinoKorean: true
    },
    {
        id: 'w078',
        korean: '간호사',
        hanja: '看護師',
        chinese: '护士',
        romanization: 'ganhosa',
        pos: 'noun',
        topikLevel: 2,
        isSinoKorean: true
    },
    {
        id: 'w079',
        korean: '자연',
        hanja: '自然',
        chinese: '自然',
        romanization: 'jayeon',
        pos: 'noun',
        topikLevel: 3,
        isSinoKorean: true
    },
    {
        id: 'w080',
        korean: '목표',
        hanja: '目標',
        chinese: '目标',
        romanization: 'mokpyo',
        pos: 'noun',
        topikLevel: 3,
        isSinoKorean: true
    }
];

/** 完整词库：基础汉字词 + 截图对应生活场景词 */
export const WORDS: Word[] = [...CORE_WORDS, ...SCENE_WORDS];
