import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Option { label: string; text: string; type: 1 | 2 | 3; }
interface Question { text: string; scene: string; options: Option[]; }
interface ResultData {
  emoji: string; badge: string; title: string; body: string;
  detail: string; msg: string; tags: string[]; meters: Record<string, number>;
}

const questions: Question[] = [
  {
    text: '점심시간, 동기가 "오늘 마라탕 고?"라고 제안한다면?',
    scene: 'SCENE 1. 점심시간',
    options: [
      { label: 'A', text: '"완전 좋지!" (이미 머릿속에 파란 컵라면 계획 중)', type: 2 },
      { label: 'B', text: '"나 오늘 좀 배 안 고픈 것 같아…" (학식이나 편의점 2+1 행사로 바꿀지 달린다)', type: 1 },
      { label: 'C', text: '"미쳐, 알바 가야 해" (사실 알바는 없지만 지갑이 텅텅 비었다)', type: 1 },
      { label: 'D', text: '"좋아!" 한 뒤 며칠 간 긴축재정 돌입', type: 2 },
    ],
  },
  {
    text: '금요일 밤, 단톡방이 불꽃처럼 시작된다. 내 행동은?',
    scene: 'SCENE 2. 금요일 밤',
    options: [
      { label: 'A', text: "'가고 싶다…' 하지만 조용히 읽씹하거나 없는 척", type: 1 },
      { label: 'B', text: '뻔뻔하게 "나 알바 가야 해"라고 거짓말', type: 1 },
      { label: 'C', text: '"갈게!" 한 다음 통장 보고 한탄', type: 2 },
      { label: 'D', text: '피곤해서 진짜 못 갈 것 같다. 그냥 잠…', type: 3 },
    ],
  },
  {
    text: "자취방에서 가장 자주 하는 '힐링' 중 하나는?",
    scene: 'SCENE 3. 자취방',
    options: [
      { label: 'A', text: '혼밥하면서 유튜브 먹방 틀어놓기 (같이 먹는 느낌이라도…)', type: 1 },
      { label: 'B', text: '쓰레기 버리러 내려갔다가 이웃 마주칠까봐 몇 분 기다렸다 내려오기', type: 1 },
      { label: 'C', text: '배달앱 켜놓다가 최소주문금액 못 채워서 고민하다 결국 편의점 가기', type: 2 },
      { label: 'D', text: "설거지·빨래 다 있어도 '내일 할 것' 하면서 그냥 드러눕기", type: 3 },
    ],
  },
  {
    text: "나에게 '문화생활'이란?",
    scene: 'SCENE 4. 주말',
    options: [
      { label: 'A', text: '집에서 혼자 넷플릭스·유튜브 정주행 (외출? 그게 뭔가요)', type: 1 },
      { label: 'B', text: '카페 가는 게 내 최고 외출… 근데 혼자라 좀 어색 보이는 것 같아', type: 1 },
      { label: 'C', text: 'SNS에 올릴 만한 게 없어서 그냥 먹고 옴', type: 2 },
      { label: 'D', text: '뭔가 하고 싶은데 기력이 없어서 결국 유튜브 알고리즘에 잡힌다', type: 3 },
    ],
  },
  {
    text: "솔직히 요즘, 사람 만나는 게 즐겁기보다 '부담'스럽나요?",
    scene: 'SCENE 5. 인간관계',
    options: [
      { label: 'A', text: '그렇다. 누굴 만나든 결국 내가 에너지 쓰니까 혼자가 편해진다', type: 1 },
      { label: 'B', text: '아니다. 그래도 만나야지! (하지만 만나고 오면 며칠 간 긴축)', type: 2 },
      { label: 'C', text: '부담은 아닌데 쉽게 약속 잡을 에너지가 없다', type: 3 },
      { label: 'D', text: '이미 단톡방 다 알림 끄고 있다', type: 1 },
    ],
  },
  {
    text: '알바 + 학교 + 자취… 요즘 내 에너지는?',
    scene: 'SCENE 6. 일상',
    options: [
      { label: 'A', text: '이미 방전됨. 아무것도 없어 피곤하다', type: 3 },
      { label: 'B', text: '번거롭고 힘든데 즐거운 게 있다', type: 3 },
      { label: 'C', text: '밥다운 밥도 못 먹고 학교도, 친구도 다 못 함', type: 1 },
      { label: 'D', text: '카페인으로 겨우 굴러가는 중', type: 2 },
    ],
  },
  {
    text: '지금 가장 갖고 싶은 건?',
    scene: 'SCENE 7. 마지막 질문',
    options: [
      { label: 'A', text: '걱정 없이 친구 만날 수 있는 한 달치 여유돈', type: 2 },
      { label: 'B', text: '늦잠 자도 보고 톡 안 오는 일주일', type: 3 },
      { label: 'C', text: '원세 걱정 없는 안정적인 집', type: 1 },
      { label: 'D', text: '내가 혼자가 아니라는 사실', type: 1 },
    ],
  },
];

const results: Record<number, ResultData> = {
  1: {
    emoji: '🥷',
    badge: '유형 1',
    title: '투명 망토를 입은 프로 자영업자',
    body: '돈 때문에 사회적 관계와 "투명 망토"를 쓰고 숨어버린 당신.',
    detail: '친구의 연락이 버겁고, 단톡방 알림까지 끄고 있죠. 하지만 이건 당신이 내성적이거나 사회성이 부족해서가 아니에요. "만나는 시간 사라지는 5만 원"이 무섭기 때문이에요. 한 끼 학식이 7천 원, 카페 한 시간이 6천 원, 친구는 절대 한 번에 5만 원. 이런 상황에 "혼자가 편하다"는 건 자연스러운 생존 본능이에요.',
    msg: '네 잘못이 아니야.<br/><span>우리가 그 투명 망토를 벗겨올게.</span><br/>우리 같이 목소리 내자!',
    tags: ['#프로자영업자', '#투명망토', '#혼자가편해'],
    meters: { '통장 사수력': 92, '사회성 표현력': 15, '긴축 재정력': 88, '고립 선호도': 90, '즐거움 지수': 15 },
  },
  2: {
    emoji: '🤡',
    badge: '유형 2',
    title: '현장을 걷는 인스타그램 곡예사',
    body: '어떻게든 사람들과 연결되려 노력하지만, 통장 잔고를 볼 때마다 곡선을 타는 중인 당신.',
    detail: '"갈게!" 외치고 통장 보면서 한탄한 적 있죠. 약속에 진심이지만 현실은 그 뒤가 긴축재정이에요. 한 달 70만 원 원세, 식비 30만 원, 교통비 8만 원… 알바비 다 써도 친구 한 번 만나면 빠듯. 당신은 노력하고 있어요. 다만 사회 시스템이 그 노력을 못 따라가는 거예요.',
    msg: '이제 불안한 줄타기는 그만!<br/><span>우리가 더 튼튼한 다리</span>를 놓아줄게.',
    tags: ['#인스타그램곡예사', '#관계도포기못해', '#사이사이'],
    meters: { '사회성 유지력': 88, '통장 사수력': 25, '인내심 지수': 60, '긴축 재정력': 75, '즐거움 지수': 40 },
  },
  3: {
    emoji: '😴',
    badge: '유형 3',
    title: '에너지 1% 남은 보조 배터리',
    body: '알바와 공부와 자취에 사회적 에너지까지 방전된 당신. 연결될 기력조차 없어요.',
    detail: '누가 만나자고 해도 "귀찮아"가 먼저 떠오르고, 주말엔 그냥 누워있고 싶은 마음. 이건 당신이 게을러서가 아니에요. 일주일 내내 알바, 과제, 쓰레기까지 혼자 다 해내느라 진짜로 충전이 필요한 상태예요. 청년이 이용할 수 있는 무료 공간도, 즐길 수 있는 문화 활동도 충분하지 않아요. 당신의 잘못 없어요.',
    msg: '충전이 필요해?<br/><span>우리의 청년 커뮤니티</span>에서<br/>무료로 에너지 충전하고 가!',
    tags: ['#방전됨', '#에너지1퍼센트', '#충전필요'],
    meters: { '체력 지수': 12, '사회성 지수': 20, '의지 지수': 18, '긴축 재정력': 50, '회복 갈망도': 98 },
  },
};

const feedPool = [
  { region: '서울 · 자취 2년차', typeNum: 1, result: '프로 자영업자', emoji: '🥷', bg: '#FFF3DC' },
  { region: '경기 · 자취 1년차', typeNum: 2, result: '인스타그램 곡예사', emoji: '🤡', bg: '#FFEFD0' },
  { region: '서울 · 자취 3년차', typeNum: 3, result: '보조 배터리', emoji: '😴', bg: '#FFF8ED' },
  { region: '인천 · 통학 중', typeNum: 1, result: '프로 자영업자', emoji: '🐶', bg: '#FFF3DC' },
  { region: '서울 · 자취 1년차', typeNum: 2, result: '인스타그램 곡예사', emoji: '🥲', bg: '#FFEFD0' },
  { region: '부산 · 자취 2년차', typeNum: 3, result: '보조 배터리', emoji: '😴', bg: '#FFF8ED' },
  { region: '경기 · 자취 4년차', typeNum: 1, result: '프로 자영업자', emoji: '🥷', bg: '#FFF3DC' },
  { region: '대전 · 자취 2년차', typeNum: 2, result: '인스타그램 곡예사', emoji: '🤡', bg: '#FFEFD0' },
  { region: '광주 · 자취 3년차', typeNum: 3, result: '보조 배터리', emoji: '😴', bg: '#FFF8ED' },
];

const AMBER = '#C8943E';
const GOLD = '#D4A853';
const CREAM = '#FFFEF7';
const LIGHT_AMBER = '#FFF3DC';
const WARM = '#FFEFD0';
const DARK = '#3A2210';
const MID = '#6B4A20';

const TypeTest: React.FC = () => {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<'intro' | 'quiz' | 'landing'>('intro');
  const [showResult, setShowResult] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [typeCounts, setTypeCounts] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0 });
  const [currentResult, setCurrentResult] = useState<ResultData | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', region: '', regionDetail: '', status: '', worry: '' });
  const [submitted, setSubmitted] = useState(false);
  const [liveCount, setLiveCount] = useState(147);
  const [statCount, setStatCount] = useState(12847);
  const [signCount, setSignCount] = useState(8427);
  const [feedItems, setFeedItems] = useState(feedPool.slice(0, 3));
  const [feedIdx, setFeedIdx] = useState(3);
  const [confetti, setConfetti] = useState<{ id: number; left: number; color: string; dur: number; delay: number; round: boolean }[]>([]);

  // URL sync for GA4 drop-off tracking
  useEffect(() => {
    const basePath = window.location.hash.split('?')[0];
    if (screen === 'intro') {
      window.history.replaceState(null, '', window.location.pathname + basePath);
    } else if (screen === 'quiz') {
      window.history.replaceState(null, '', window.location.pathname + basePath + '?q=' + (currentQ + 1));
    } else if (screen === 'landing') {
      window.history.replaceState(null, '', window.location.pathname + basePath + '?step=landing');
    }
  }, [screen, currentQ]);

  useEffect(() => {
    if (showResult) {
      const basePath = window.location.hash.split('?')[0];
      window.history.replaceState(null, '', window.location.pathname + basePath + '?step=result');
    }
  }, [showResult]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const item = feedPool[feedIdx % feedPool.length];
      setFeedItems(prev => [item, ...prev].slice(0, 4));
      setFeedIdx(prev => prev + 1);
      setLiveCount(prev => prev + Math.floor(Math.random() * 2) + 1);
      if (Math.random() < 0.6) setStatCount(prev => prev + 1);
    }, (Math.random() * 4 + 3) * 1000);
    return () => clearTimeout(timer);
  }, [feedIdx]);

  useEffect(() => {
    const timer = setInterval(() => setSignCount(prev => prev + Math.floor(Math.random() * 3) + 1), 5000);
    return () => clearInterval(timer);
  }, []);

  const selectAnswer = (idx: number) => {
    const newCounts = { ...typeCounts };
    if (answers[currentQ] !== undefined) newCounts[questions[currentQ].options[answers[currentQ]].type]--;
    const newAnswers = [...answers];
    newAnswers[currentQ] = idx;
    newCounts[questions[currentQ].options[idx].type]++;
    setAnswers(newAnswers);
    setTypeCounts(newCounts);
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(prev => prev + 1);
        window.scrollTo(0, 0);
      } else {
        let maxType = 1, maxCount = 0;
        for (let t = 1; t <= 3; t++) { if (newCounts[t] > maxCount) { maxCount = newCounts[t]; maxType = t; } }
        setCurrentResult(results[maxType]);
        setScreen('landing');
        window.scrollTo(0, 0);
      }
    }, 400);
  };

  const submitForm = async () => {
    if (!formData.name) { alert('이름을 입력해주세요.'); return; }
    if (!formData.phone) { alert('연락처를 입력해주세요.'); return; }
    if (!formData.region) { alert('거주 지역을 선택해주세요.'); return; }
    if (!formData.regionDetail) { alert('거주지 상세 주소를 입력해주세요.'); return; }
    if (!formData.status) { alert('신분을 선택해주세요.'); return; }
    if (!formData.worry) { alert('정부에 한마디를 입력해주세요.'); return; }
    const resultLabel = currentResult ? `${currentResult.badge} ${currentResult.title}` : '';
    try {
      await supabase.from('type_test_submissions').insert({
        name: formData.name,
        phone: formData.phone,
        region: formData.region,
        region_detail: formData.regionDetail || null,
        status: formData.status,
        worry: formData.worry,
        result: resultLabel,
      });
    } catch (_) { /* fail silently */ }
    setSignCount(prev => prev + 1);
    setSubmitted(true);
    setTimeout(() => {
      setShowResult(true);
      const colors = [AMBER, GOLD, '#FFD56B', '#F5E6C8'];
      setConfetti(Array.from({ length: 60 }, (_, i) => ({
        id: i, left: Math.random() * 100, color: colors[Math.floor(Math.random() * colors.length)],
        dur: Math.random() * 2 + 1.5, delay: Math.random(), round: Math.random() > 0.5,
      })));
      setTimeout(() => setConfetti([]), 4000);
    }, 1200);
  };

  const restartTest = () => {
    setScreen('intro'); setCurrentQ(0); setAnswers([]); setTypeCounts({ 1: 0, 2: 0, 3: 0 });
    setCurrentResult(null); setSubmitted(false); setShowResult(false);
    window.scrollTo(0, 0);
  };

  const pct = Math.round(((currentQ + 1) / questions.length) * 100);

  return (
    <div style={{ background: CREAM, minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @keyframes confettiFall { to { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
        @keyframes bookFloat { 0%,100%{transform:translateY(0)rotate(-2deg);}50%{transform:translateY(-10px)rotate(2deg);} }
        @keyframes shadowPulse { 0%,100%{transform:scaleX(1);opacity:.5;}50%{transform:scaleX(.75);opacity:.25;} }
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.5);opacity:.6;} }
        @keyframes popIn { 0%{transform:scale(0);opacity:0;}60%{transform:scale(1.2);}100%{transform:scale(1);opacity:1;} }
        @keyframes grow { from { width: 0 !important; } }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);} }
        .tt-page { animation: fadeInUp 0.5s ease; }
        .tt-answer:hover { transform: translateX(4px); border-color: ${AMBER} !important; background: ${LIGHT_AMBER} !important; }
      `}</style>

      {/* Confetti */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 999, overflow: 'hidden' }}>
        {confetti.map(p => (
          <div key={p.id} style={{ position: 'absolute', width: 8, height: 8, top: -10, left: `${p.left}%`, background: p.color, borderRadius: p.round ? '50%' : '2px', animation: `confettiFall ${p.dur}s ${p.delay}s linear forwards` }} />
        ))}
      </div>

      {/* Back button */}
      <button onClick={() => navigate('/category')} style={{ position: 'fixed', top: 16, left: 16, zIndex: 100, background: 'white', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', cursor: 'pointer' }}>
        <i className="fa-solid fa-chevron-left" style={{ color: '#555' }}></i>
      </button>

      <div style={{ maxWidth: 480, margin: '0 auto' }}>

        {/* ========== INTRO ========== */}
        {screen === 'intro' && (
          <div className="tt-page">
            <div style={{ background: `linear-gradient(180deg,${LIGHT_AMBER} 0%,${WARM} 50%,${CREAM} 100%)`, padding: '36px 24px 60px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 40, background: CREAM, borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }} />
              <div style={{ background: DARK, color: 'white', fontSize: 10, padding: '5px 12px', borderRadius: 20, letterSpacing: 1, fontWeight: 700, marginBottom: 14, zIndex: 2 }}>🎮 청년사회단체 씨소 캠페인</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.95)', border: `2px solid ${AMBER}`, color: DARK, fontSize: 12, fontWeight: 700, padding: '6px 16px', borderRadius: 30, marginBottom: 16, boxShadow: `0 2px 12px rgba(200,148,62,.2)`, zIndex: 2 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: AMBER, animation: 'pulse 1.5s ease-in-out infinite' }} />
                지금 <strong style={{ marginLeft: 4 }}>{liveCount}명</strong>이 생존 등급 측정 중
              </div>
              {/* Bankbook */}
              <div style={{ animation: 'bookFloat 3.5s ease-in-out infinite', marginBottom: 18, zIndex: 2 }}>
                <div style={{ width: 240, background: 'white', borderRadius: 14, padding: '14px 18px', boxShadow: '0 12px 32px rgba(0,0,0,.18)', border: `3px solid ${DARK}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px dashed #DDD', paddingBottom: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: '#888', fontWeight: 700 }}>🏦 청년 통장</span>
                    <span style={{ fontSize: 18 }}>📱</span>
                  </div>
                  <div style={{ fontSize: 10, color: '#999', marginBottom: 2 }}>현재 잔액</div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: AMBER }}>8,400<span style={{ fontSize: 16, color: '#888', fontWeight: 500 }}>원</span></div>
                  <div style={{ fontSize: 11, color: AMBER, background: LIGHT_AMBER, padding: '4px 8px', borderRadius: 8, display: 'inline-block', marginTop: 6, fontWeight: 600 }}>⏳ 이번 달 남은 기간 12일</div>
                </div>
              </div>
              <div style={{ width: 120, height: 14, background: 'rgba(90,60,20,.18)', borderRadius: '50%', margin: '0 auto 18px', animation: 'shadowPulse 3.5s ease-in-out infinite' }} />
              <h1 style={{ fontWeight: 700, fontSize: 30, color: DARK, lineHeight: 1.3, textAlign: 'center', marginBottom: 8, zIndex: 2, position: 'relative' }}>
                나는 대학생인가,<br /><span style={{ color: AMBER }}>서바이벌 전문가</span>인가?
              </h1>
              <p style={{ fontSize: 14, color: MID, textAlign: 'center', lineHeight: 1.7, marginBottom: 20, zIndex: 2, fontWeight: 500 }}>
                2026 자취생 생존 난이도 테스트<br />7가지 질문으로 내 생존 등급을 확인해보세요
              </p>
            </div>

            <div style={{ padding: '24px 20px' }}>
              {/* Stats */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                {[
                  { num: statCount.toLocaleString(), label: '명이 테스트\n완료했어요' },
                  { num: '2분', label: '이면 결과를\n확인할 수 있어요' },
                  { num: '3가지', label: '유형으로\n분석해드려요' },
                ].map((s, i) => (
                  <div key={i} style={{ flex: 1, background: 'white', borderRadius: 18, padding: '14px 10px', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,.08)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: i === 0 ? `linear-gradient(90deg,${AMBER},${GOLD})` : i === 1 ? `linear-gradient(90deg,${GOLD},#F5E6C8)` : 'linear-gradient(90deg,#8BC4A0,#B8E6C8)' }} />
                    <span style={{ fontWeight: 700, fontSize: 22, color: DARK, display: 'block', lineHeight: 1 }}>{s.num}</span>
                    <span style={{ fontSize: 10, color: '#888', marginTop: 4, display: 'block', lineHeight: 1.4, whiteSpace: 'pre-line' }}>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Live feed */}
              <div style={{ background: 'white', borderRadius: 18, padding: '14px 16px', boxShadow: '0 4px 16px rgba(0,0,0,.08)', marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#888', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4CAF50', animation: 'pulse 1.5s ease-in-out infinite' }} />
                  방금 생존 등급 받은 자취생들
                </div>
                {feedItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: idx < feedItems.length - 1 ? '1px solid #F5F5F5' : 'none' }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{item.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#2C2C2C' }}>{item.region}</div>
                      <div style={{ fontSize: 11, color: '#888' }}>유형 {item.typeNum} · {item.result} 확인</div>
                    </div>
                    <div style={{ fontSize: 10, color: '#888' }}>{idx === 0 ? '방금 전' : `${idx + 1}분 전`}</div>
                  </div>
                ))}
              </div>

              {/* Type preview */}
              <p style={{ fontSize: 12, color: '#888', fontWeight: 600, marginBottom: 10, textAlign: 'center' }}>나는 어떤 생존 유형일까? 👇</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                {[
                  { emoji: '🥷', name: '투명망토 입은\n프로 자영업자', desc: '뭐든 무심코\n숨어버림', border: LIGHT_AMBER },
                  { emoji: '🤡', name: '현장을 걷는\n인스타그램 곡예사', desc: '어쩔 수 없이\n곡선 중', border: WARM },
                  { emoji: '😴', name: '방전된\n보조배터리', desc: '에너지\n1% 남음', border: '#F0F8EC' },
                ].map((t, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: 16, padding: '14px 10px', boxShadow: '0 4px 14px rgba(0,0,0,.08)', border: `2px solid ${t.border}`, textAlign: 'center' }}>
                    <span style={{ fontSize: 28, display: 'block', marginBottom: 6 }}>{t.emoji}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: DARK, display: 'block', marginBottom: 2, lineHeight: 1.3, whiteSpace: 'pre-line' }}>{t.name}</span>
                    <span style={{ fontSize: 9, color: '#888', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{t.desc}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => { setScreen('quiz'); window.scrollTo(0, 0); }} style={{ width: '100%', background: `linear-gradient(135deg,${AMBER},${GOLD})`, color: 'white', border: 'none', borderRadius: 20, padding: '20px 24px', fontSize: 17, fontWeight: 700, cursor: 'pointer', boxShadow: `0 8px 24px rgba(200,148,62,.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all .2s' }}>
                <span>지금 내 생존 등급 확인하기</span>
                <span style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>→</span>
              </button>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 12, fontSize: 12, color: '#888' }}>
                <span>⏱ 2분 소요</span><span>🔒 무료</span><span>✅ 즉시 확인</span>
              </div>
            </div>
          </div>
        )}

        {/* ========== QUIZ ========== */}
        {screen === 'quiz' && (
          <div className="tt-page" style={{ padding: '20px 16px 50px' }}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888', marginBottom: 5, fontWeight: 500 }}>
                <span>질문 {currentQ + 1} / {questions.length}</span><span>{pct}%</span>
              </div>
              <div style={{ height: 6, background: LIGHT_AMBER, borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg,${AMBER},${GOLD})`, borderRadius: 10, transition: 'width .4s ease' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 16 }}>
              {questions.map((_, i) => (
                <div key={i} style={{ height: 6, borderRadius: 3, width: i === currentQ ? 18 : 6, background: i < currentQ ? GOLD : i === currentQ ? AMBER : `${AMBER}38`, transition: 'all .3s' }} />
              ))}
            </div>
            <div style={{ background: 'white', borderRadius: 24, padding: '26px 22px', boxShadow: '0 8px 32px rgba(0,0,0,.08)', marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: AMBER, letterSpacing: 1, marginBottom: 8, display: 'block' }}>Q 0{currentQ + 1}</span>
              <p style={{ fontWeight: 700, fontSize: 18, color: DARK, lineHeight: 1.5, marginBottom: 20 }}>
                <span style={{ display: 'block', fontSize: 11, color: GOLD, fontWeight: 500, letterSpacing: 1, marginBottom: 6 }}>{questions[currentQ].scene}</span>
                {questions[currentQ].text}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {questions[currentQ].options.map((opt, i) => (
                  <button key={i} className="tt-answer" onClick={() => selectAnswer(i)} style={{ width: '100%', background: answers[currentQ] === i ? `linear-gradient(135deg,${LIGHT_AMBER},#FFF8ED)` : '#FFFAF3', border: `2px solid ${answers[currentQ] === i ? AMBER : WARM}`, borderRadius: 14, padding: '14px 16px', textAlign: 'left', fontSize: 14, color: '#2C2C2C', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 10, lineHeight: 1.5, transition: 'all .2s', fontFamily: "'Noto Sans KR',sans-serif" }}>
                    <span style={{ minWidth: 26, height: 26, borderRadius: '50%', background: answers[currentQ] === i ? AMBER : 'white', border: `2px solid ${answers[currentQ] === i ? AMBER : WARM}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: answers[currentQ] === i ? 'white' : '#888', flexShrink: 0, marginTop: 1, transition: 'all .2s' }}>{opt.label}</span>
                    <span>{opt.text}</span>
                  </button>
                ))}
              </div>
            </div>
            {currentQ > 0 && (
              <div style={{ textAlign: 'center' }}>
                <button onClick={() => { setCurrentQ(prev => prev - 1); window.scrollTo(0, 0); }} style={{ background: 'none', border: 'none', color: '#888', fontSize: 13, cursor: 'pointer', fontFamily: "'Noto Sans KR',sans-serif" }}>← 이전 질문으로</button>
              </div>
            )}
          </div>
        )}

        {/* ========== LANDING ========== */}
        {screen === 'landing' && (
          <div className="tt-page" style={{ padding: '0 16px 80px' }}>
            <div style={{ textAlign: 'center', padding: '36px 0 16px' }}>
              <div style={{ display: 'inline-block', background: `linear-gradient(135deg,${AMBER},${GOLD})`, color: 'white', fontSize: 11, fontWeight: 700, padding: '5px 14px', borderRadius: 20, marginBottom: 12 }}>✨ 7가지 질문 분석 완료</div>
              <h1 style={{ fontWeight: 700, fontSize: 24, color: DARK, lineHeight: 1.4, marginBottom: 6, marginTop: 14 }}>잠깐!<br /><span style={{ color: AMBER }}>결과를 보기 전에…</span></h1>
              <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>당신의 답변을 분석해보니<br /><strong style={{ color: DARK }}>우리가 함께 알아야 할 사실이 있어요</strong></p>
            </div>

            <div style={{ background: `linear-gradient(135deg,${LIGHT_AMBER},${WARM})`, borderRadius: 16, padding: '18px 20px', borderLeft: `4px solid ${AMBER}`, margin: '10px 0' }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 6 }}>😢 당신만의 문제가 아니에요</p>
              <p style={{ fontSize: 14, color: MID, lineHeight: 1.7 }}>친구와 연락을 피하고, 방 안에 숨어 사는 건<br /><strong>당신의 성격 탓이 아니에요.</strong></p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0 6px', color: '#888', fontSize: 12, fontWeight: 600 }}>
              <div style={{ flex: 1, height: 1, background: WARM }} />📊 2026년 자취생 현실<div style={{ flex: 1, height: 1, background: WARM }} />
            </div>

            {[
              { num: '2만원', label: '삼겹살 1인분 가격\n친구랑 한번 외식하는데 5만원', source: '* 2026년 1월 기준 외식물가 통계' },
              { num: '70만원', label: '대학가 평균 원세\n관리비, 공과금 빼면 식비가 사라져요', source: '* 서울 주요 대학가 원룸 평균' },
              { num: '62%', label: '"돈 때문에 인간관계를 줄였다"고 답한\n2030 청년 비율', source: '* 통계청 「사회조사」 (2024)' },
            ].map((s, i) => (
              <div key={i} style={{ background: `linear-gradient(135deg,${LIGHT_AMBER},${WARM})`, borderRadius: 16, padding: 18, margin: '10px 0', borderLeft: `4px solid ${AMBER}` }}>
                <span style={{ fontWeight: 700, fontSize: 32, color: AMBER, display: 'block', lineHeight: 1, letterSpacing: -1 }}>{s.num}</span>
                <p style={{ fontSize: 13, color: DARK, marginTop: 6, lineHeight: 1.5, fontWeight: 500, whiteSpace: 'pre-line' }}>{s.label}</p>
                <p style={{ fontSize: 10, color: '#888', marginTop: 4 }}>{s.source}</p>
              </div>
            ))}

            <div style={{ background: `linear-gradient(135deg,${DARK},${MID})`, borderRadius: 16, padding: '18px 22px', margin: '12px 0', textAlign: 'center' }}>
              <p style={{ fontWeight: 700, fontSize: 18, color: 'white', lineHeight: 1.6 }}>
                우리가 사회를 떠난 이유는<br /><span style={{ color: GOLD }}>우리의 마음이 좁아서가 아니라,</span><br />청년을 위한<br /><span style={{ color: GOLD }}>최소한의 생존 조건이 없기 때문</span>이에요.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0 6px', color: '#888', fontSize: 12, fontWeight: 600 }}>
              <div style={{ flex: 1, height: 1, background: WARM }} />✊ 우리가 정부에 요구합니다<div style={{ flex: 1, height: 1, background: WARM }} />
            </div>

            {[
              { num: '01', title: '대학생 실질 식비 지원 확대', detail: '학식 이용 식권 바우처 월 10만 원 지원. 컵라면이 아니라 제대로 된 한 끼를 먹을 권리를 보장해주세요.' },
              { num: '02', title: '청년 주거비 상한제 및 지원금 증액', detail: '대학가 원룸 월세 상한제 도입. 월세 지원금을 현재 20만 원에서 35만 원으로 확대해주세요.' },
              { num: '03', title: '청년 사회적 고립 방지 예산 확보', detail: '무료 청년 커뮤니티 공간, 문화바우처 확대. 돈 없어서 친구를 못 만나는 일이 없도록 해주세요.' },
            ].map((p, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 16, padding: '16px 18px', marginBottom: 10, boxShadow: '0 4px 14px rgba(0,0,0,.08)', borderLeft: `5px solid ${AMBER}`, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{ fontWeight: 700, fontSize: 24, color: AMBER, flexShrink: 0, lineHeight: 1 }}>{p.num}</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 4, lineHeight: 1.4 }}>{p.title}</p>
                  <p style={{ fontSize: 12, color: '#555', lineHeight: 1.7 }}>{p.detail}</p>
                </div>
              </div>
            ))}

            {/* Sign counter */}
            <div style={{ background: `linear-gradient(135deg,${DARK},${MID})`, borderRadius: 18, padding: '18px 20px', color: 'white', margin: '12px 0', textAlign: 'center' }}>
              <p style={{ fontSize: 11, color: GOLD, letterSpacing: 1, fontWeight: 700, marginBottom: 6 }}>📢 현재 서명 현황</p>
              <div style={{ fontWeight: 700, fontSize: 36, lineHeight: 1, letterSpacing: -1 }}>{signCount.toLocaleString()}<span style={{ fontSize: 18, color: GOLD, marginLeft: 4 }}>명</span></div>
              <div style={{ height: 8, background: 'rgba(255,255,255,.15)', borderRadius: 10, overflow: 'hidden', margin: '10px 0' }}>
                <div style={{ height: '100%', width: `${Math.min(100, (signCount / 10000) * 100)}%`, background: `linear-gradient(90deg,${GOLD},${AMBER})`, borderRadius: 10, transition: 'width .6s ease' }} />
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,.7)' }}>목표 <strong style={{ color: GOLD }}>10,000명</strong> · 달성 시 정부 정책 제안서 공식 전달</p>
            </div>

            {[
              { who: '서울 · 24세', msg: '"밥값 좀 내려주세요... 학식은 7천원이라 부담이라요"' },
              { who: '경기 · 22세', msg: '"서울 75만원 내고 나면 아무것도 못해요"' },
              { who: '부산 · 26세', msg: '"친구 만드는 게 사치가 됐어요. 바뀌면 좋겠어요"' },
            ].map((m, i) => (
              <div key={i} style={{ background: '#FFFAF3', borderRadius: 12, padding: '10px 14px', fontSize: 12, color: MID, borderLeft: `3px solid ${GOLD}`, lineHeight: 1.5, marginBottom: 8 }}>
                <span style={{ fontSize: 10, color: AMBER, fontWeight: 700, display: 'block', marginBottom: 2 }}>{m.who}</span>{m.msg}
              </div>
            ))}

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0 6px', color: '#888', fontSize: 12, fontWeight: 600 }}>
              <div style={{ flex: 1, height: 1, background: WARM }} />🎁 서명하면 받을 수 있어요<div style={{ flex: 1, height: 1, background: WARM }} />
            </div>
            <div style={{ background: `linear-gradient(135deg,#FFF8E0,${WARM})`, borderRadius: 16, padding: 16, margin: '10px 0', border: `1.5px solid ${GOLD}` }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: AMBER, marginBottom: 10, textAlign: 'center' }}>⭐ 서명자에게만 드리는 혜택</p>
              {[
                { icon: '📋', text: '<b>나만의 서울 생존 리포트</b> — 7개 영역 분석 + 맞춤 생존 팁' },
                { icon: '💰', text: '<b>청년 지원금 안내 PDF</b> — 놓치고 있는 정책 혜택 정리' },
                { icon: '🏠', text: '<b>우리의 청년 커뮤니티 초대</b> — 무료 모임 + 문화 활동 우선 안내' },
                { icon: '🔔', text: '<b>정책 변화 알림</b> — 우리 서명이 만든 변화를 가장 먼저' },
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: DARK, lineHeight: 1.6, marginBottom: 8 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{b.icon}</span>
                  <span dangerouslySetInnerHTML={{ __html: b.text }} />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0 6px', color: '#888', fontSize: 12, fontWeight: 600 }}>
              <div style={{ flex: 1, height: 1, background: WARM }} />✍️ 서명하고 결과 보기<div style={{ flex: 1, height: 1, background: WARM }} />
            </div>
            <div style={{ background: `linear-gradient(135deg,${LIGHT_AMBER},${WARM})`, borderRadius: 20, padding: '22px 20px', marginBottom: 14, textAlign: 'center', border: `1.5px solid ${AMBER}` }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: DARK, lineHeight: 1.5, marginBottom: 6 }}>여러분의 이름 한 줄이<br /><span style={{ color: AMBER }}>'고립'을 '연결'로</span> 바꿉니다</p>
              <p style={{ fontSize: 13, color: MID, lineHeight: 1.6 }}>서명하시면 <strong style={{ color: AMBER }}>나만의 생존 리포트</strong>를<br />바로 확인하실 수 있어요</p>
            </div>

            {/* Form */}
            {!submitted ? (
              <div style={{ background: 'white', borderRadius: 24, padding: '26px 22px', boxShadow: '0 8px 32px rgba(0,0,0,.08)', border: `2px solid ${GOLD}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${AMBER},${GOLD},#F5E6C8)` }} />
                <div style={{ textAlign: 'center', marginBottom: 18 }}>
                  <span style={{ fontSize: 40, display: 'block', marginBottom: 8 }}>✍️</span>
                  <h2 style={{ fontWeight: 700, fontSize: 20, color: DARK, marginBottom: 6 }}>정책 요구서에 서명하기</h2>
                  <p style={{ fontSize: 13, color: '#888', lineHeight: 1.7 }}>청년사회단체 씨소가<br />여러분의 목소리를 전달합니다</p>
                </div>
                {[
                  { id: 'name', label: '이름', required: true, type: 'text', placeholder: '이름을 입력해주세요' },
                  { id: 'phone', label: '연락처', required: true, type: 'tel', placeholder: '010-0000-0000' },
                ].map(f => (
                  <div key={f.id} style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: MID, marginBottom: 6 }}>{f.label} {f.required && <span style={{ color: AMBER }}>*</span>}</label>
                    <input type={f.type} value={formData[f.id as keyof typeof formData]} onChange={e => setFormData(prev => ({ ...prev, [f.id]: e.target.value }))} placeholder={f.placeholder}
                      style={{ width: '100%', border: `2px solid ${WARM}`, borderRadius: 12, padding: '13px 15px', fontSize: 14, color: '#2C2C2C', background: '#FFFAF3', outline: 'none', boxSizing: 'border-box', fontFamily: "'Noto Sans KR',sans-serif" }} />
                  </div>
                ))}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: MID, marginBottom: 6 }}>거주지 <span style={{ color: AMBER }}>*</span></label>
                  <select value={formData.region} onChange={e => setFormData(prev => ({ ...prev, region: e.target.value }))}
                    style={{ width: '100%', border: `2px solid ${WARM}`, borderRadius: 12, padding: '13px 15px', fontSize: 14, color: formData.region ? '#2C2C2C' : '#888', background: '#FFFAF3', outline: 'none', boxSizing: 'border-box', cursor: 'pointer', fontFamily: "'Noto Sans KR',sans-serif", appearance: 'none' as const }}>
                    <option value="">거주 지역을 선택해주세요</option>
                    {['서울', '경기', '인천', '부산', '대구', '광주', '대전', '기타 지역'].map(r => <option key={r}>{r}</option>)}
                  </select>
                  <input
                    type="text"
                    value={formData.regionDetail}
                    onChange={e => setFormData(prev => ({ ...prev, regionDetail: e.target.value }))}
                    placeholder="예) 서울 관악구 신림동, 경기 수원시 등"
                    style={{ width: '100%', border: `2px solid ${WARM}`, borderRadius: 12, padding: '13px 15px', fontSize: 14, color: '#2C2C2C', background: '#FFFAF3', outline: 'none', boxSizing: 'border-box', fontFamily: "'Noto Sans KR',sans-serif", marginTop: 8 }}
                  />
                  <div style={{ fontSize: 11, color: '#aaa', marginTop: 4, paddingLeft: 2 }}>구/동까지 구체적으로 적어주세요</div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: MID, marginBottom: 6 }}>신분 <span style={{ color: AMBER }}>*</span></label>
                  <select value={formData.status} onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    style={{ width: '100%', border: `2px solid ${WARM}`, borderRadius: 12, padding: '13px 15px', fontSize: 14, color: formData.status ? '#2C2C2C' : '#888', background: '#FFFAF3', outline: 'none', boxSizing: 'border-box', cursor: 'pointer', fontFamily: "'Noto Sans KR',sans-serif", appearance: 'none' as const }}>
                    <option value="">현재 신분을 선택해주세요</option>
                    {['대학생', '대학원생', '취업준비생', '사회초년생', '프리랜서', '기타'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: MID, marginBottom: 6 }}>정부에 한마디 <span style={{ color: AMBER }}>*</span></label>
                  <textarea value={formData.worry} onChange={e => setFormData(prev => ({ ...prev, worry: e.target.value }))} placeholder="예) 밥값 좀 내려주세요! / 서울 원세 너무 비싸요!"
                    style={{ width: '100%', border: `2px solid ${WARM}`, borderRadius: 12, padding: '13px 15px', fontSize: 14, color: '#2C2C2C', background: '#FFFAF3', resize: 'none', height: 80, outline: 'none', boxSizing: 'border-box', fontFamily: "'Noto Sans KR',sans-serif" }} />
                </div>
                <button onClick={submitForm} style={{ width: '100%', background: `linear-gradient(135deg,${AMBER},${GOLD})`, color: 'white', border: 'none', borderRadius: 18, padding: '20px 24px', fontSize: 17, fontWeight: 700, cursor: 'pointer', boxShadow: `0 8px 28px rgba(200,148,62,.45)`, transition: 'all .2s', fontFamily: "'Noto Sans KR',sans-serif" }}>
                  ✍️ 서명하고 결과 보기
                </button>
                <p style={{ fontSize: 11, color: '#888', textAlign: 'center', lineHeight: 1.6, marginTop: 10 }}>🔒 입력하신 정보는 정책 제안서 전달 및 시소 활동 안내 목적으로만 사용돼요</p>
              </div>
            ) : (
              <div style={{ background: 'white', borderRadius: 24, padding: '36px 24px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,.08)' }}>
                <span style={{ fontSize: 60, display: 'block', marginBottom: 12 }}>✅</span>
                <h2 style={{ fontWeight: 700, fontSize: 22, color: DARK, marginBottom: 8 }}>서명 완료!</h2>
                <p style={{ fontSize: 13, color: '#555', lineHeight: 1.8 }}>당신의 한 줄이 청년 정책을 바꿉니다 💪<br /><strong style={{ color: AMBER }}>이제 나만의 생존 리포트를 확인해볼까요?</strong></p>
              </div>
            )}

            {/* Result */}
            {showResult && currentResult && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0 6px', color: '#888', fontSize: 12, fontWeight: 600 }}>
                  <div style={{ flex: 1, height: 1, background: WARM }} />🏆 나의 생존 등급<div style={{ flex: 1, height: 1, background: WARM }} />
                </div>
                <div style={{ background: 'white', borderRadius: 24, padding: '26px 22px', boxShadow: '0 8px 32px rgba(0,0,0,.08)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${AMBER},${GOLD},#F5E6C8)` }} />
                  <div style={{ textAlign: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 64, display: 'block', marginBottom: 8, animation: 'popIn .5s ease' }}>{currentResult.emoji}</span>
                    <div style={{ display: 'inline-block', background: `linear-gradient(135deg,${AMBER},${GOLD})`, color: 'white', fontSize: 11, fontWeight: 700, padding: '5px 16px', borderRadius: 20, marginBottom: 10 }}>{currentResult.badge}</div>
                    <h2 style={{ fontWeight: 700, fontSize: 24, color: DARK, lineHeight: 1.4, textAlign: 'center' }}>{currentResult.title}</h2>
                  </div>
                  <p style={{ fontSize: 14, color: '#555', lineHeight: 1.8, marginBottom: 10, textAlign: 'center' }}>{currentResult.body}</p>
                  <div style={{ background: `linear-gradient(135deg,#FFF8EE,${LIGHT_AMBER})`, border: `1.5px solid ${GOLD}`, borderRadius: 16, padding: '16px 18px', margin: '10px 0' }}>
                    <p style={{ fontSize: 13, color: MID, lineHeight: 1.8 }}>{currentResult.detail}</p>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, margin: '10px 0' }}>
                    {currentResult.tags.map((tag, i) => (
                      <div key={i} style={{ background: LIGHT_AMBER, border: `1.5px solid ${GOLD}`, color: AMBER, borderRadius: 20, padding: '5px 12px', fontSize: 12, fontWeight: 500 }}>{tag}</div>
                    ))}
                  </div>
                  <div style={{ background: `linear-gradient(135deg,${DARK},${MID})`, borderRadius: 16, padding: 18, margin: '12px 0', textAlign: 'center' }}>
                    <p style={{ color: 'white', fontWeight: 500, fontSize: 14, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: currentResult.msg.replace(/<span>/g, `<span style="color:${GOLD};font-weight:700;">`) }} />
                  </div>
                  <div style={{ background: `linear-gradient(135deg,${LIGHT_AMBER},${WARM})`, border: `1.5px solid ${AMBER}`, borderRadius: 16, padding: '16px 18px', margin: '10px 0' }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: AMBER, marginBottom: 10 }}>⚡ 나의 생존 능력치</h4>
                    {Object.entries(currentResult.meters).map(([label, val]) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 12, color: '#555', width: 72, flexShrink: 0, fontWeight: 500 }}>{label}</span>
                        <div style={{ flex: 1, height: 8, background: WARM, borderRadius: 10, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${val}%`, background: `linear-gradient(90deg,${AMBER},${GOLD})`, borderRadius: 10, animation: 'grow 1s ease .3s both' }} />
                        </div>
                        <span style={{ fontSize: 11, color: AMBER, width: 38, textAlign: 'right', fontWeight: 700 }}>{val}%</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: '#FFF8EE', borderRadius: 14, padding: 14, marginTop: 12, border: `1.5px dashed ${GOLD}` }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: AMBER, marginBottom: 6 }}>💡 씨소가 보내드릴 콘텐츠</p>
                    <p style={{ fontSize: 12, color: MID, lineHeight: 1.7 }}>곧 입력하신 연락처로 <strong>서울 생존 리포트</strong>와 <strong>청년 지원금 안내 PDF</strong>를 보내드릴게요!</p>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <button onClick={restartTest} style={{ background: 'none', border: `2px solid ${GOLD}`, color: AMBER, borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Noto Sans KR',sans-serif" }}>테스트 다시 하기</button>
                  </div>
                </div>
              </div>
            )}
            <div style={{ height: 40 }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TypeTest;
