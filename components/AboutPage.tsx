
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const sections = [
  { key: 'greeting', label: '인사말', path: '/about/greeting' },
  { key: 'intro', label: 'IEUM 소개', path: '/about/intro' },
  { key: 'history', label: '연혁', path: '/about/history' },
  { key: 'organization', label: '조직도', path: '/about/organization' },
];

/* ── 인사말 ── */
const Greeting: React.FC = () => (
  <div className="animate-fadeIn">

    {/* 히어로 — 네이비 + 장식 요소 */}
    <div className="bg-ieumNavy relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-ieumOrange opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white opacity-5"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-ieumOrange opacity-5"></div>
      </div>
      <div className="max-w-5xl mx-auto px-5 py-16 md:py-24 relative z-10">
        <span className="text-ieumOrange text-xs font-bold uppercase tracking-widest">Greeting</span>
        <h1 className="text-white text-3xl md:text-5xl font-black mt-3 leading-tight">
          청년 한 명의 이야기가<br />
          <span className="text-ieumOrange">세상을 바꾸는 힘</span>이 됩니다
        </h1>
        <p className="text-white/50 text-sm md:text-base mt-4 max-w-lg leading-relaxed">
          이음(IEUM) 대표의 인사말
        </p>
      </div>
    </div>

    {/* 핵심 수치 띠 */}
    <div className="bg-ieumOrange">
      <div className="max-w-5xl mx-auto px-5 py-5">
        <div className="flex gap-8 md:gap-16 overflow-x-auto hide-scrollbar">
          {[
            { num: '2,841명', label: '함께한 청년' },
            { num: '123개', label: '진행 프로젝트' },
            { num: '48개', label: '협력 네트워크' },
            { num: '15.8만회', label: '캠페인 영향력' },
          ].map((s, i) => (
            <div key={i} className="flex-shrink-0 text-center md:text-left">
              <p className="text-white font-black text-xl md:text-2xl">{s.num}</p>
              <p className="text-white/70 text-xs font-semibold mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* 본문 */}
    <div className="max-w-5xl mx-auto px-5 py-12 md:py-16">
      <div className="md:grid md:grid-cols-[1fr_320px] md:gap-14">

        {/* 왼쪽: 편지 본문 */}
        <div>
          <p className="text-ieumMuted text-sm leading-[2] mb-8">안녕하세요.</p>

          {/* 풀 인용구 */}
          <blockquote className="border-l-4 border-ieumOrange pl-5 mb-8 bg-ieumLight rounded-r-2xl py-5 pr-5">
            <p className="text-ieumDark text-base md:text-lg font-bold leading-relaxed">
              "나만 이런가?"
            </p>
            <p className="text-ieumMuted text-sm leading-relaxed mt-2">
              청년들이 사회에 첫 발을 내딛는 순간 가장 많이 하는 질문입니다.
            </p>
          </blockquote>

          <p className="text-ieumDark text-sm md:text-base leading-[2] mb-6">
            취업 준비의 압박, 관계의 어려움, 미래에 대한 불안.
            이런 감정들이 나만의 문제가 아니라 우리 사회가 함께 풀어야 할 과제임을 알게 되는 것,
            그것이 <strong className="text-ieumOrange font-bold">이음(IEUM)</strong>의 시작입니다.
          </p>

          <p className="text-ieumDark text-sm md:text-base leading-[2] mb-6">
            이음은 <strong className="text-ieumDark font-bold">'연결'</strong>을 믿습니다.
            청년 개인의 감정이 사회 구조와 연결될 때, 그 연결이 행동이 될 때,
            비로소 변화가 시작됩니다. 고립된 감정은 사회와 맞닿는 순간
            하나의 목소리가 되고, 그 목소리들이 모여 세상을 조금씩 바꾸어 나갑니다.
          </p>

          {/* 강조 카드 */}
          <div className="bg-ieumNavy rounded-2xl p-6 mb-6 text-white">
            <i className="fa-solid fa-quote-left text-ieumOrange text-2xl mb-3 block"></i>
            <p className="text-white/90 text-sm md:text-base leading-relaxed font-medium">
              설립 이후, 이음은 <span className="text-ieumOrange font-black">2,841명</span>의 청년들과 함께
              <span className="text-ieumOrange font-black"> 123개</span>의 프로젝트를 진행했습니다.
              그들이 자신의 이야기를 꺼내고, 사회를 이해하고, 행동에 나서는 과정을 곁에서 지켜보며
              이음도 함께 성장해왔습니다.
            </p>
          </div>

          <p className="text-ieumDark text-sm md:text-base leading-[2] mb-10">
            앞으로도 이음은 청년들이 고립되지 않고 사회와 이어질 수 있도록,
            그 연결의 판을 계속해서 만들어가겠습니다.
            청년 한 명 한 명의 이야기가 세상을 바꾸는 힘이 된다고 믿으며,
            이음은 언제나 그 곁에 있겠습니다.
          </p>

          {/* 서명 */}
          <div className="border-t border-ieumBorder pt-8 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-ieumNavy to-ieumNavyLight flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-user text-white text-xl"></i>
            </div>
            <div>
              <p className="text-ieumDark font-black text-base">이음(IEUM) 대표</p>
              <p className="text-ieumMuted text-xs mt-0.5">청년 참여 구조, IEUM</p>
              <p className="text-ieumOrange text-xs font-semibold mt-1">2025년 봄</p>
            </div>
          </div>
        </div>

        {/* 오른쪽: 사이드 카드 */}
        <div className="mt-10 md:mt-0 space-y-5">
          {/* 이음 핵심 메시지 카드 */}
          <div className="bg-ieumCream border border-ieumBorder rounded-2xl p-6">
            <p className="text-ieumOrange text-xs font-bold uppercase tracking-widest mb-3">IEUM이 추구하는 것</p>
            <div className="space-y-4">
              {[
                { icon: 'fa-heart-pulse', title: '감정', desc: '불안에서 출발합니다' },
                { icon: 'fa-arrows-to-circle', title: '연결', desc: '사회와 이어집니다' },
                { icon: 'fa-bolt', title: '행동', desc: '변화를 만들어갑니다' },
              ].map((v, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white rounded-xl border border-ieumBorder flex items-center justify-center flex-shrink-0">
                    <i className={`fa-solid ${v.icon} text-ieumOrange text-sm`}></i>
                  </div>
                  <div>
                    <p className="text-ieumDark text-sm font-bold">{v.title}</p>
                    <p className="text-ieumMuted text-xs">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 한 줄 슬로건 카드 */}
          <div className="bg-ieumNavy rounded-2xl p-6 text-center">
            <i className="fa-solid fa-infinity text-ieumOrange text-3xl mb-3"></i>
            <p className="text-white font-black text-base leading-snug">
              감정에서 출발해<br />사회와 연결되고<br />행동으로 변화를 만드는
            </p>
            <p className="text-ieumOrange font-black text-lg mt-2">청년들의 이야기</p>
          </div>

          {/* 함께하기 CTA */}
          <div className="border border-ieumBorder rounded-2xl p-5 text-center bg-white">
            <p className="text-ieumDark font-bold text-sm mb-1">이음과 함께하고 싶으신가요?</p>
            <p className="text-ieumMuted text-xs mb-4 leading-relaxed">이음의 활동에 참여하거나<br/>파트너로 함께해주세요.</p>
            <button
              onClick={() => window.open('https://pf.kakao.com/_dxlLCX/friend', '_blank')}
              className="w-full bg-ieumOrange text-white text-sm font-bold py-3 rounded-xl hover:bg-ieumGold transition-colors"
            >
              카카오톡으로 문의하기
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ── ieum 소개 ── */
const Intro: React.FC = () => (
  <div className="animate-fadeIn">
    <div className="bg-ieumNavy px-5 py-14 md:py-20">
      <div className="max-w-5xl mx-auto">
        <span className="text-ieumOrange text-xs font-bold uppercase tracking-widest">About</span>
        <h1 className="text-white text-3xl md:text-4xl font-black mt-2">IEUM 소개</h1>
        <p className="text-white/50 text-sm mt-3 max-w-lg">
          청년이 사회와 연결되는 참여 구조를 만듭니다
        </p>
      </div>
    </div>

    <div className="max-w-5xl mx-auto px-5 py-12 md:py-16 space-y-16">

      {/* 비전 / 미션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-ieumNavy rounded-2xl p-8">
          <div className="w-10 h-10 bg-ieumOrange/20 rounded-xl flex items-center justify-center mb-4">
            <i className="fa-solid fa-eye text-ieumOrange"></i>
          </div>
          <p className="text-ieumOrange text-xs font-bold uppercase tracking-widest mb-2">Vision</p>
          <h3 className="text-white text-xl font-black leading-snug">
            청년이 사회와<br />연결되는 세상
          </h3>
          <p className="text-white/50 text-sm leading-relaxed mt-3">
            고립과 불안이 아닌, 연결과 참여가 청년의 일상이 되는 사회를 만들어갑니다.
          </p>
        </div>
        <div className="bg-ieumLight border border-ieumBorder rounded-2xl p-8">
          <div className="w-10 h-10 bg-ieumOrange/10 rounded-xl flex items-center justify-center mb-4">
            <i className="fa-solid fa-bullseye text-ieumOrange"></i>
          </div>
          <p className="text-ieumOrange text-xs font-bold uppercase tracking-widest mb-2">Mission</p>
          <h3 className="text-ieumDark text-xl font-black leading-snug">
            감정에서 출발해<br />행동으로 이어지는 참여
          </h3>
          <p className="text-ieumMuted text-sm leading-relaxed mt-3">
            청년의 불안과 감정을 사회와 연결시켜, 프로젝트·세미나·캠페인으로 행동하게 합니다.
          </p>
        </div>
      </div>

      {/* 핵심 가치 */}
      <div>
        <p className="text-ieumOrange text-xs font-bold uppercase tracking-widest mb-2">Core Values</p>
        <h2 className="text-2xl md:text-3xl font-black text-ieumDark mb-8">이음의 핵심 가치</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: 'fa-link', title: '연결 (Connect)', desc: '개인의 감정을 사회와 잇습니다. 혼자라고 느끼는 청년들이 서로, 그리고 사회와 연결되도록 판을 만듭니다.' },
            { icon: 'fa-bolt', title: '행동 (Act)', desc: '질문에서 행동으로. 이음의 모든 활동은 청년이 직접 기획하고 실행하는 실천의 공간입니다.' },
            { icon: 'fa-seedling', title: '변화 (Change)', desc: '작은 행동이 모여 세상을 바꿉니다. 청년의 목소리가 사회 변화의 씨앗이 되도록 지원합니다.' },
          ].map((v, i) => (
            <div key={i} className="border border-ieumBorder rounded-2xl p-6 bg-white">
              <div className="w-10 h-10 bg-ieumNavy/8 rounded-xl flex items-center justify-center mb-4" style={{backgroundColor:'rgba(26,43,74,0.08)'}}>
                <i className={`fa-solid ${v.icon} text-ieumNavy`}></i>
              </div>
              <h3 className="text-base font-bold text-ieumDark mb-2">{v.title}</h3>
              <p className="text-xs text-ieumMuted leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 활동 영역 */}
      <div>
        <p className="text-ieumOrange text-xs font-bold uppercase tracking-widest mb-2">What We Do</p>
        <h2 className="text-2xl md:text-3xl font-black text-ieumDark mb-8">이음이 하는 일</h2>
        <div className="space-y-4">
          {[
            { icon: 'fa-puzzle-piece', title: '프로젝트', tag: 'Program', desc: '청년이 직접 기획하고 실행하는 사회참여 프로젝트. 아이디어에서 실행까지 이음이 함께합니다.' },
            { icon: 'fa-users-rays', title: '세미나', tag: 'Program', desc: '사회·경제·문화 이슈를 깊이 있게 탐구하는 지식 나눔의 자리. 전문가와 청년이 만나는 공간입니다.' },
            { icon: 'fa-bullhorn', title: '캠페인', tag: 'Program', desc: '일상 속 작은 실천으로 시작하는 사회 변화. 누구나 참여할 수 있는 캠페인을 기획·운영합니다.' },
            { icon: 'fa-microphone', title: '인터뷰', tag: '소식', desc: '평범한 청년들의 비범한 이야기. 다양한 삶의 방식을 기록하고 나눕니다.' },
            { icon: 'fa-pen-nib', title: '에세이/칼럼', tag: '소식', desc: '청년의 시선으로 쓰는 사회 이야기. 깊이 있는 글쓰기로 세상을 새롭게 봅니다.' },
            { icon: 'fa-lightbulb', title: '인사이트', tag: '소식', desc: '매월 발행하는 청년 사회 분석 리포트. 데이터와 현장의 목소리를 담습니다.' },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-start p-5 rounded-2xl border border-ieumBorder bg-ieumCream hover:border-ieumOrange transition-colors group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 border border-ieumBorder group-hover:bg-ieumOrange group-hover:border-ieumOrange transition-colors">
                <i className={`fa-solid ${item.icon} text-ieumNavy group-hover:text-white transition-colors text-sm`}></i>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-ieumDark">{item.title}</h3>
                  <span className="text-[10px] text-ieumMuted border border-ieumBorder px-1.5 py-0.5 rounded-full">{item.tag}</span>
                </div>
                <p className="text-xs text-ieumMuted leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
);

/* ── 연혁 ── */
const History: React.FC = () => {
  const timeline = [
    {
      year: '2025',
      items: [
        { month: '05', event: 'IEUM(이음)으로 공식 리브랜딩', highlight: true },
        { month: '03', event: '청년민원24 프로젝트 론칭 (Supabase 연동)' },
        { month: '02', event: '누적 참여 청년 2,800명 돌파' },
        { month: '01', event: '청년 공모전 개최 — 34개 팀 참가' },
      ],
    },
    {
      year: '2024',
      items: [
        { month: '09', event: '손편지 프로젝트 — 128명 참여, 군인·독립유공자 후손 대상' },
        { month: '07', event: '청년 유형 테스트 서비스 오픈' },
        { month: '04', event: '캠페인 시리즈 본격화 — 누적 영향력 10만 회 돌파' },
        { month: '01', event: '세미나 정기 프로그램 론칭' },
      ],
    },
    {
      year: '2023',
      items: [
        { month: '09', event: '월간 인사이트 리포트 창간 (청년 사회 분석)' },
        { month: '06', event: '첫 번째 청년 기획 프로젝트 시작' },
        { month: '03', event: 'SEESAW(시소) 설립 — 청년 참여 구조의 시작', highlight: true },
      ],
    },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="bg-ieumNavy px-5 py-14 md:py-20">
        <div className="max-w-5xl mx-auto">
          <span className="text-ieumOrange text-xs font-bold uppercase tracking-widest">History</span>
          <h1 className="text-white text-3xl md:text-4xl font-black mt-2">연혁</h1>
          <p className="text-white/50 text-sm mt-3">청년과 함께 걸어온 이음의 발자국</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-12 md:py-16">
        {/* 요약 숫자 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {[
            { num: '2+', label: '설립 연수' },
            { num: '2,841', label: '누적 참여 청년' },
            { num: '123', label: '진행 프로젝트' },
            { num: '48', label: '협력 네트워크' },
          ].map((s, i) => (
            <div key={i} className="bg-ieumCream border border-ieumBorder rounded-2xl p-5 text-center">
              <p className="text-2xl md:text-3xl font-black text-ieumOrange">{s.num}</p>
              <p className="text-[11px] text-ieumMuted font-semibold mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* 타임라인 */}
        <div className="space-y-12">
          {timeline.map((section) => (
            <div key={section.year} className="md:flex md:gap-12">
              <div className="md:w-20 flex-shrink-0 mb-4 md:mb-0">
                <span className="text-3xl font-black text-ieumOrange">{section.year}</span>
              </div>
              <div className="flex-1 border-l-2 border-ieumBorder pl-6 space-y-5">
                {section.items.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-[29px] top-1 w-3.5 h-3.5 rounded-full border-2 ${item.highlight ? 'bg-ieumOrange border-ieumOrange' : 'bg-white border-ieumBorder'}`}></div>
                    <div className={`p-4 rounded-xl border ${item.highlight ? 'bg-ieumOrange/5 border-ieumOrange/30' : 'bg-white border-ieumBorder'}`}>
                      <span className="text-[10px] font-bold text-ieumMuted">{section.year}.{item.month}</span>
                      <p className={`text-sm font-semibold mt-0.5 ${item.highlight ? 'text-ieumOrange' : 'text-ieumDark'}`}>{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── 조직도 ── */
const Organization: React.FC = () => (
  <div className="animate-fadeIn">
    <div className="bg-ieumNavy px-5 py-14 md:py-20">
      <div className="max-w-5xl mx-auto">
        <span className="text-ieumOrange text-xs font-bold uppercase tracking-widest">Organization</span>
        <h1 className="text-white text-3xl md:text-4xl font-black mt-2">조직도</h1>
        <p className="text-white/50 text-sm mt-3">청년과 함께 만들어가는 이음의 팀</p>
      </div>
    </div>

    <div className="max-w-5xl mx-auto px-5 py-12 md:py-16">

      {/* 대표 */}
      <div className="flex justify-center mb-8">
        <div className="bg-ieumNavy text-white rounded-2xl px-10 py-5 text-center">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <i className="fa-solid fa-user text-white text-lg"></i>
          </div>
          <p className="text-xs text-white/50 font-semibold">대표</p>
          <p className="text-base font-black">이음(IEUM)</p>
        </div>
      </div>

      {/* 연결선 */}
      <div className="flex justify-center mb-8">
        <div className="w-px h-8 bg-ieumBorder"></div>
      </div>

      {/* 3개 팀 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {[
          {
            name: '기획팀',
            icon: 'fa-lightbulb',
            color: 'bg-ieumOrange',
            roles: ['프로젝트 기획', '프로그램 개발', '파트너십 관리'],
          },
          {
            name: '콘텐츠팀',
            icon: 'fa-pen-nib',
            color: 'bg-ieumNavyLight',
            roles: ['인터뷰 제작', '에세이/칼럼 발행', '인사이트 리포트'],
          },
          {
            name: '운영팀',
            icon: 'fa-gear',
            color: 'bg-ieumNavy',
            roles: ['커뮤니티 운영', '이벤트 진행', '행정 지원'],
          },
        ].map((team, i) => (
          <div key={i} className="border border-ieumBorder rounded-2xl overflow-hidden bg-white">
            <div className={`${team.color} px-5 py-4 flex items-center gap-3`}>
              <div className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center">
                <i className={`fa-solid ${team.icon} text-white text-sm`}></i>
              </div>
              <h3 className="text-white font-black text-base">{team.name}</h3>
            </div>
            <ul className="px-5 py-4 space-y-2.5">
              {team.roles.map((role, j) => (
                <li key={j} className="flex items-center gap-2 text-sm text-ieumDark">
                  <i className="fa-solid fa-check text-ieumOrange text-[10px]"></i>
                  {role}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 공지 */}
      <div className="bg-ieumLight border border-ieumBorder rounded-2xl p-6 text-center">
        <i className="fa-solid fa-people-group text-ieumNavy text-2xl mb-3"></i>
        <h3 className="text-ieumDark font-bold text-base mb-2">함께 만들어가는 이음</h3>
        <p className="text-ieumMuted text-sm leading-relaxed">
          이음은 청년 자원활동가, 기획자, 콘텐츠 크리에이터가 함께 운영합니다.<br />
          이음의 활동에 함께하고 싶다면 언제든지 연락해주세요.
        </p>
        <button
          onClick={() => window.open('https://pf.kakao.com/_dxlLCX/friend', '_blank')}
          className="mt-5 bg-ieumOrange text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-ieumGold transition-colors"
        >
          함께하기 <i className="fa-solid fa-arrow-right ml-1.5"></i>
        </button>
      </div>

    </div>
  </div>
);

/* ── 메인 AboutPage 라우터 ── */
const AboutPage: React.FC = () => {
  const { section } = useParams<{ section: string }>();
  const navigate = useNavigate();

  const renderSection = () => {
    switch (section) {
      case 'greeting': return <Greeting />;
      case 'intro': return <Intro />;
      case 'history': return <History />;
      case 'organization': return <Organization />;
      default: return <Intro />;
    }
  };

  return (
    <div>
      {/* About 서브 네비 */}
      <div className="bg-white border-b border-ieumBorder sticky top-16 z-30">
        <div className="max-w-5xl mx-auto px-5">
          <div className="flex overflow-x-auto hide-scrollbar">
            {sections.map(s => (
              <button
                key={s.key}
                onClick={() => navigate(s.path)}
                className={`flex-shrink-0 px-4 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
                  section === s.key || (!section && s.key === 'intro')
                    ? 'border-ieumOrange text-ieumOrange'
                    : 'border-transparent text-ieumMuted hover:text-ieumDark'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {renderSection()}
    </div>
  );
};

export default AboutPage;
