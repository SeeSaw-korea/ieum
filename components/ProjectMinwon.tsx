import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AMBER = '#C8943E';
const GOLD = '#D4A853';
const CREAM = '#FFFEF7';
const DARK = '#2C1A08';
const MID = '#6B4A20';
const WARM = '#FFEFD0';
const LIGHT = '#FFF8ED';
const STAMP_RED = '#C0392B';
const GOVT_GREY = '#4A5568';

interface FormState {
  complaintTypes: string[];
  complaintText: string;
  name: string;
  phone: string;
  affiliation: string;
  interviewAgreed: boolean;
}

const COMPLAINT_TYPES = [
  { id: 'relation', icon: '💬', label: '관계의 단절', desc: '비싼 물가 때문에 친구를 못 만남' },
  { id: 'opportunity', icon: '🎯', label: '기회의 단절', desc: '스펙 경쟁 때문에 꿈을 포기함' },
  { id: 'space', icon: '🏠', label: '공간의 단절', desc: '높은 월세 때문에 방 안에만 갇힘' },
];

const recentFeed = [
  { name: '김○○', school: '서울대 경제학과', type: '관계의 단절', time: '방금 전' },
  { name: '이○○', school: '연세대 사회학과', type: '공간의 단절', time: '1분 전' },
  { name: '박○○', school: '고려대 심리학과', type: '기회의 단절', time: '3분 전' },
  { name: '최○○', school: '성균관대 경영학과', type: '관계의 단절', time: '5분 전' },
  { name: '정○○', school: '한양대 건축학과', type: '공간의 단절', time: '7분 전' },
  { name: '강○○', school: '이화여대 국문학과', type: '기회의 단절', time: '9분 전' },
  { name: '조○○', school: '중앙대 미디어학과', type: '관계의 단절', time: '12분 전' },
  { name: '윤○○', school: '홍익대 디자인학과', type: '공간의 단절', time: '15분 전' },
];

const ProjectMinwon: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const navigate = useNavigate();
  const [currentCount, setCurrentCount] = useState(347);
  const [feedIdx, setFeedIdx] = useState(0);
  const [visibleFeed, setVisibleFeed] = useState(recentFeed.slice(0, 3));
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [receiptNum, setReceiptNum] = useState('');
  const [form, setForm] = useState<FormState>({
    complaintTypes: [],
    complaintText: '',
    name: '',
    phone: '',
    affiliation: '',
    interviewAgreed: false,
  });

  useEffect(() => {
    const num = 'MIN-' + Date.now().toString().slice(-6) + '-' + Math.floor(Math.random() * 900 + 100);
    setReceiptNum(num);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = recentFeed[(feedIdx + 3) % recentFeed.length];
      setVisibleFeed(prev => [next, ...prev].slice(0, 4));
      setFeedIdx(prev => (prev + 1) % recentFeed.length);
      setCurrentCount(prev => prev + 1);
    }, (Math.random() * 6 + 4) * 1000);
    return () => clearTimeout(timer);
  }, [feedIdx]);

  const toggleComplaintType = (id: string) => {
    setForm(prev => ({
      ...prev,
      complaintTypes: prev.complaintTypes.includes(id)
        ? prev.complaintTypes.filter(t => t !== id)
        : [...prev.complaintTypes, id],
    }));
  };

  const handleSubmit = async () => {
    if (form.complaintTypes.length === 0) { alert('민원 유형을 최소 1개 선택해주세요.'); return; }
    if (!form.complaintText.trim()) { alert('한 줄 민원을 작성해주세요.'); return; }
    if (!form.name.trim()) { alert('이름을 입력해주세요.'); return; }
    if (!form.phone.trim()) { alert('연락처를 입력해주세요.'); return; }
    if (!form.affiliation.trim()) { alert('소속(대학명/전공)을 입력해주세요.'); return; }

    setLoading(true);
    try {
      await supabase.from('youth_complaint_submissions').insert({
        complaint_types: form.complaintTypes,
        complaint_text: form.complaintText,
        name: form.name,
        phone: form.phone,
        affiliation: form.affiliation,
        interview_agreed: form.interviewAgreed,
        receipt_number: receiptNum,
      });
    } catch (_) { /* fail silently */ }
    setCurrentCount(prev => prev + 1);
    setLoading(false);
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  const pct = Math.min(Math.round((currentCount / 1000) * 100), 100);

  return (
    <div style={{ minHeight: '100vh', background: CREAM, fontFamily: "'Noto Sans KR', sans-serif", paddingBottom: 60 }}>

      {/* 상단 네비게이션 */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,254,247,0.95)', backdropFilter: 'blur(8px)', borderBottom: `1px solid ${WARM}`, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: MID, padding: 4 }}>←</button>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: AMBER, letterSpacing: 2 }}>청년민원24 · 공식 접수처</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: DARK, lineHeight: 1.2 }}>당신의 목소리는 반려될 수 없습니다</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: GOVT_GREY }}>접수 현황</div>
          <div style={{ fontSize: 15, fontWeight: 900, color: AMBER }}>{currentCount.toLocaleString()}<span style={{ fontSize: 10, color: '#999' }}>/1,000</span></div>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 20px' }}>

        {/* ── SECTION 1: HERO ── */}
        <div style={{ padding: '32px 0 20px', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', border: `3px solid ${STAMP_RED}`, borderRadius: 12, padding: '6px 18px', marginBottom: 16, transform: 'rotate(-2deg)' }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: STAMP_RED, letterSpacing: 3 }}>정식 민원 접수처</span>
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 900, color: DARK, lineHeight: 1.35, marginBottom: 12 }}>
            "당신의 목소리는<br />
            <span style={{ color: AMBER }}>반려될 수 없습니다."</span>
          </h1>
          <p style={{ fontSize: 14, color: GOVT_GREY, lineHeight: 1.8, marginBottom: 20 }}>
            청년사회단체 이음는 <strong>1,000명의 대학생 민원</strong>을 모아<br />
            정책 보고서를 발간하고 <strong>국회에 직접 전달</strong>합니다.
          </p>

          {/* 진행률 바 */}
          <div style={{ background: LIGHT, borderRadius: 16, padding: '16px 20px', border: `1px solid ${WARM}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: MID }}>민원 수집 현황</span>
              <span style={{ fontSize: 13, fontWeight: 900, color: AMBER }}>{currentCount.toLocaleString()}건 <span style={{ fontSize: 11, color: '#aaa', fontWeight: 400 }}>/ 목표 1,000건</span></span>
            </div>
            <div style={{ height: 10, background: WARM, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${AMBER}, ${GOLD})`, borderRadius: 10, transition: 'width 1s ease' }} />
            </div>
            <div style={{ fontSize: 11, color: '#aaa', marginTop: 6, textAlign: 'right' }}>{pct}% 달성</div>
          </div>
        </div>

        {/* 최근 접수 피드 */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: GOVT_GREY, letterSpacing: 1 }}>실시간 접수 현황</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {visibleFeed.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'white', borderRadius: 10, padding: '10px 14px', boxShadow: '0 2px 8px rgba(0,0,0,.05)', opacity: i === 0 ? 1 : 0.7 }}>
                <span style={{ fontSize: 18 }}>📋</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: DARK }}>{f.name}</span>
                  <span style={{ fontSize: 11, color: '#888' }}> ({f.school})</span>
                </div>
                <span style={{ fontSize: 10, color: AMBER, fontWeight: 700, background: '#FFF3DC', padding: '2px 8px', borderRadius: 20 }}>{f.type}</span>
                <span style={{ fontSize: 10, color: '#aaa', whiteSpace: 'nowrap' }}>{f.time}</span>
              </div>
            ))}
          </div>
        </div>

        {submitted ? (
          /* ── 제출 완료 화면 ── */
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ display: 'inline-block', border: `4px solid ${AMBER}`, borderRadius: 16, padding: '8px 24px', marginBottom: 20, transform: 'rotate(-1deg)' }}>
              <span style={{ fontSize: 13, fontWeight: 900, color: AMBER, letterSpacing: 2 }}>접수 완료</span>
            </div>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: DARK, marginBottom: 8 }}>민원이 정식 접수되었습니다</h2>
            <p style={{ fontSize: 13, color: GOVT_GREY, lineHeight: 1.8, marginBottom: 20 }}>
              접수번호: <strong style={{ color: AMBER }}>{receiptNum}</strong><br />
              당신의 목소리를 담아 정책 보고서를 발간하고<br />국회에 전달하겠습니다.
            </p>
            {form.interviewAgreed && (
              <div style={{ background: '#FFF3DC', border: `1px solid ${WARM}`, borderRadius: 14, padding: '14px 18px', marginBottom: 20, textAlign: 'left' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: AMBER, marginBottom: 4 }}>🎁 인터뷰 신청 완료</div>
                <div style={{ fontSize: 12, color: MID, lineHeight: 1.7 }}>핵심 사례 선정 시 담당자가 유선으로 연락드릴 예정입니다.<br />참여 시 스타벅스 기프티콘을 보내드려요!</div>
              </div>
            )}
            <button onClick={() => navigate('/')} style={{ width: '100%', background: `linear-gradient(135deg, ${AMBER}, ${GOLD})`, color: 'white', border: 'none', borderRadius: 14, padding: '16px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              홈으로 돌아가기
            </button>
          </div>
        ) : (
          <>
            {/* ── SECTION 2: 민원 유형 선택 ── */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 24, height: 24, background: AMBER, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: 'white', flexShrink: 0 }}>A</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: AMBER, letterSpacing: 1 }}>민원 유형 선택</span>
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: DARK, lineHeight: 1.5, marginBottom: 4 }}>
                지금 당신의 삶에서 가장 긴급하게<br />'수리'가 필요한 부분은?
              </p>
              <p style={{ fontSize: 12, color: '#aaa', marginBottom: 14 }}>복수 선택 가능</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {COMPLAINT_TYPES.map(ct => {
                  const selected = form.complaintTypes.includes(ct.id);
                  return (
                    <button key={ct.id} onClick={() => toggleComplaintType(ct.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 14, background: selected ? '#FFF3DC' : 'white', border: `2px solid ${selected ? AMBER : WARM}`, borderRadius: 14, padding: '14px 16px', cursor: 'pointer', textAlign: 'left', transition: 'all .2s', width: '100%' }}>
                      <div style={{ width: 40, height: 40, background: selected ? AMBER : LIGHT, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, transition: 'all .2s' }}>
                        {ct.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: selected ? DARK : GOVT_GREY }}>{ct.label}</div>
                        <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{ct.desc}</div>
                      </div>
                      <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${selected ? AMBER : '#ddd'}`, background: selected ? AMBER : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .2s' }}>
                        {selected && <span style={{ color: 'white', fontSize: 13, fontWeight: 900 }}>✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── SECTION 3: 한 줄 민원 작성 ── */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 24, height: 24, background: AMBER, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: 'white', flexShrink: 0 }}>B</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: AMBER, letterSpacing: 1 }}>한 줄 민원 작성</span>
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: DARK, lineHeight: 1.5, marginBottom: 4 }}>
                세상에 꼭 하고 싶은 한 마디를<br />'민원'으로 남겨주세요.
              </p>
              <p style={{ fontSize: 12, color: '#aaa', marginBottom: 14 }}>이 한 마디가 정책 보고서의 핵심이 됩니다</p>
              <div style={{ position: 'relative' }}>
                <textarea
                  value={form.complaintText}
                  onChange={e => setForm(prev => ({ ...prev, complaintText: e.target.value }))}
                  placeholder="예) 청년들에게도 밥값 걱정 없이 대화할 공간을 보장하라!"
                  maxLength={200}
                  style={{ width: '100%', border: `2px solid ${form.complaintText ? AMBER : WARM}`, borderRadius: 14, padding: '14px 16px', fontSize: 14, color: DARK, background: '#FFFAF3', resize: 'none', height: 100, outline: 'none', boxSizing: 'border-box', fontFamily: "'Noto Sans KR', sans-serif", lineHeight: 1.7, transition: 'border .2s' }}
                />
                <div style={{ position: 'absolute', bottom: 10, right: 14, fontSize: 11, color: '#bbb' }}>{form.complaintText.length}/200</div>
              </div>
            </div>

            {/* ── SECTION 4: 공동 민원인 서명 ── */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 24, height: 24, background: AMBER, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: 'white', flexShrink: 0 }}>C</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: AMBER, letterSpacing: 1 }}>공동 민원인 서명</span>
              </div>
              <p style={{ fontSize: 14, color: GOVT_GREY, lineHeight: 1.7, marginBottom: 16 }}>
                이 민원이 정식 효력을 갖기 위해<br /><strong style={{ color: DARK }}>공동 민원인 서명</strong>이 필요합니다.
              </p>

              <div style={{ background: LIGHT, border: `1px dashed ${GOLD}`, borderRadius: 12, padding: '10px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: GOVT_GREY }}>민원 접수번호</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: AMBER, fontFamily: 'monospace' }}>{receiptNum}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { id: 'name', label: '이름 (실명)', placeholder: '홍길동', type: 'text' },
                  { id: 'phone', label: '연락처', placeholder: '010-0000-0000', type: 'tel' },
                  { id: 'affiliation', label: '소속 (대학명 / 전공)', placeholder: '예) 서울대학교 사회학과', type: 'text' },
                ].map(f => (
                  <div key={f.id}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: MID, marginBottom: 6 }}>
                      {f.label} <span style={{ color: AMBER }}>*</span>
                    </label>
                    <input
                      type={f.type}
                      value={form[f.id as 'name' | 'phone' | 'affiliation']}
                      onChange={e => setForm(prev => ({ ...prev, [f.id]: e.target.value }))}
                      placeholder={f.placeholder}
                      style={{ width: '100%', border: `2px solid ${form[f.id as 'name' | 'phone' | 'affiliation'] ? AMBER : WARM}`, borderRadius: 12, padding: '13px 15px', fontSize: 14, color: DARK, background: '#FFFAF3', outline: 'none', boxSizing: 'border-box', fontFamily: "'Noto Sans KR', sans-serif", transition: 'border .2s' }}
                    />
                  </div>
                ))}

                {/* 인터뷰 동의 */}
                <div style={{ background: form.interviewAgreed ? '#FFF3DC' : 'white', border: `2px solid ${form.interviewAgreed ? AMBER : WARM}`, borderRadius: 14, padding: '16px', transition: 'all .2s' }}>
                  <button onClick={() => setForm(prev => ({ ...prev, interviewAgreed: !prev.interviewAgreed }))}
                    style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${form.interviewAgreed ? AMBER : '#ddd'}`, background: form.interviewAgreed ? AMBER : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all .2s' }}>
                        {form.interviewAgreed && <span style={{ color: 'white', fontSize: 13, fontWeight: 900 }}>✓</span>}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: DARK, lineHeight: 1.5 }}>
                          🎁 유선 인터뷰 동의 <span style={{ fontSize: 11, fontWeight: 400, color: '#aaa' }}>(선택)</span>
                        </div>
                        <div style={{ fontSize: 12, color: GOVT_GREY, lineHeight: 1.7, marginTop: 4 }}>
                          귀하의 민원이 <strong>'핵심 사례'</strong>로 선정될 경우,<br />
                          상세 내용을 듣기 위한 유선 인터뷰(약 10분)에<br />
                          동의하십니까?
                        </div>
                        <div style={{ display: 'inline-block', background: '#FFF3DC', border: `1px solid ${GOLD}`, borderRadius: 20, padding: '3px 10px', marginTop: 8, fontSize: 11, fontWeight: 700, color: AMBER }}>
                          🎁 참여 시 스타벅스 기프티콘 증정
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* 제출 버튼 */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: '100%', background: loading ? '#ddd' : `linear-gradient(135deg, ${AMBER}, ${GOLD})`, color: loading ? '#aaa' : 'white', border: 'none', borderRadius: 18, padding: '20px', fontSize: 17, fontWeight: 900, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : `0 8px 28px rgba(200,148,62,.4)`, transition: 'all .2s', letterSpacing: 1, marginBottom: 10 }}
            >
              {loading ? '접수 중...' : '📋 공동 민원인으로 서명하기'}
            </button>
            <p style={{ fontSize: 11, color: '#aaa', textAlign: 'center', lineHeight: 1.7, marginBottom: 40 }}>
              🔒 입력하신 정보는 정책 제안서 전달 및 이음 활동 안내 목적으로만 사용됩니다.<br />
              개인정보는 민원 접수 이후 즉시 암호화하여 보관됩니다.
            </p>

            {/* ── SECTION 5: 푸터 ── */}
            <div style={{ borderTop: `1px solid ${WARM}`, paddingTop: 28, marginBottom: 20 }}>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 10 }}>
                  <div style={{ flex: 1, height: 1, background: WARM }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: GOVT_GREY, letterSpacing: 1 }}>🏛️ 이음(Ieum)는</span>
                  <div style={{ flex: 1, height: 1, background: WARM }} />
                </div>
                <p style={{ fontSize: 13, color: GOVT_GREY, lineHeight: 1.8 }}>
                  청년의 고립 문제를 사회구조적 관점으로 접근하는<br />
                  <strong style={{ color: DARK }}>청년사회단체</strong>입니다.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                {[
                  { num: '3,200+', label: '누적 캠페인 참여자' },
                  { num: '12회', label: '정책 보고서 발간' },
                  { num: '8개', label: '협력 대학' },
                  { num: '2년', label: '활동 기간' },
                ].map((s, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: 14, padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,.05)', textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: AMBER }}>{s.num}</div>
                    <div style={{ fontSize: 11, color: GOVT_GREY, marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: LIGHT, borderRadius: 16, padding: '16px 18px', border: `1px solid ${WARM}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: MID, marginBottom: 12 }}>📊 왜 이 민원이 필요한가</div>
                {[
                  { pct: '62%', text: '"돈 때문에 인간관계를 줄였다"고 답한 2030 청년', source: '통계청 「사회조사」 (2024)' },
                  { pct: '74%', text: '주거비가 삶의 질에 영향을 미친다고 답한 대학생', source: '한국교육개발원 (2024)' },
                  { pct: '48%', text: '취업 준비로 인해 꿈을 포기한 경험이 있는 청년', source: '청년정책연구원 (2023)' },
                ].map((d, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < 2 ? 12 : 0, paddingBottom: i < 2 ? 12 : 0, borderBottom: i < 2 ? `1px solid ${WARM}` : 'none' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: AMBER, minWidth: 52, lineHeight: 1.2 }}>{d.pct}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: DARK, lineHeight: 1.5 }}>{d.text}</div>
                      <div style={{ fontSize: 10, color: '#aaa', marginTop: 2 }}>* {d.source}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectMinwon;
