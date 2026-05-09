import { executeQuery, closeConnection } from '../lib/database.js';

async function run() {
  // 기존 섹션 전체 삭제 후 재구성
  const secs = await executeQuery<any>('SELECT id FROM content_detailed_sections WHERE content_id = ?', ['s_proj1']);
  for (const s of secs) {
    await executeQuery('DELETE FROM section_progress_data WHERE section_id = ?', [s.id]);
    await executeQuery('DELETE FROM section_extra_data WHERE section_id = ?', [s.id]);
    await executeQuery('DELETE FROM section_faq_data WHERE section_id = ?', [s.id]);
  }
  await executeQuery('DELETE FROM content_detailed_sections WHERE content_id = ?', ['s_proj1']);

  // 섹션 재삽입
  const sections = [
    {
      type: 'highlight',
      subtitle: '✅ 진행 완료 | 2026년 2월 1일 ~ 3월 7일',
      body: '본 프로젝트는 2026년 2월 1일부터 3월 7일까지 활동을 진행하였으며, 성공적으로 마무리되었습니다. 독립운동가 후손들을 기억하고 연대해주신 모든 분들께 깊이 감사드립니다.',
      iconClass: 'fa-solid fa-circle-check text-green-500'
    },
    {
      type: 'quote',
      subtitle: '희생을 기억하는 것이 우리의 출발점입니다.',
      body: '독립운동가 후손들을 기억하고, 경제적·사회적 지원을 모색하는 참여형 아카이브 캠페인입니다. 그들의 이야기를 발굴하고, 더 많은 사람들과 함께 나누는 것이 이 프로젝트의 목적입니다.',
      iconClass: 'fa-solid fa-quote-left text-ieumAmber'
    },
    {
      type: 'checklist',
      subtitle: '🎯 활동 내용',
      body: '독립운동가 후손들의 현실을 조명하고 지속 가능한 지원 구조를 만들기 위해 다양한 방식으로 참여를 이끌었습니다.',
      iconClass: 'fa-solid fa-list-check text-indigo-500',
      extraData: [
        '독립운동가 후손 스토리 아카이브 수집 및 기록',
        '온·오프라인 전시 및 캠페인 콘텐츠 제작',
        '사회적 지원 방안 모색을 위한 네트워크 구축'
      ]
    },
    {
      type: 'faq',
      subtitle: '자주 묻는 질문',
      body: '',
      iconClass: 'fa-solid fa-circle-question text-blue-500',
      faqData: [
        { question: '누구나 참여할 수 있었나요?', answer: '네, 독립운동가 후손에 관심 있는 누구나 참여 가능했습니다. 스토리 제보, 콘텐츠 공유 등 다양한 방식으로 함께했습니다.' },
        { question: '수집된 아카이브는 어디서 확인할 수 있나요?', answer: '이음 공식 홈페이지와 SNS 채널을 통해 아카이브 콘텐츠를 확인하실 수 있습니다.' }
      ]
    }
  ];

  for (let i = 0; i < sections.length; i++) {
    const s = sections[i] as any;
    const result = (await executeQuery<any>(`
      INSERT INTO content_detailed_sections (content_id, type, subtitle, body, icon_class, sort_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `, ['s_proj1', s.type, s.subtitle, s.body, s.iconClass, i + 1])) as any;

    const sectionId = result.insertId;

    if (s.extraData) {
      for (let j = 0; j < s.extraData.length; j++) {
        await executeQuery('INSERT INTO section_extra_data (section_id, data_text, sort_order) VALUES (?, ?, ?)', [sectionId, s.extraData[j], j + 1]);
      }
    }
    if (s.faqData) {
      for (let j = 0; j < s.faqData.length; j++) {
        await executeQuery('INSERT INTO section_faq_data (section_id, question, answer, sort_order) VALUES (?, ?, ?, ?)', [sectionId, s.faqData[j].question, s.faqData[j].answer, j + 1]);
      }
    }
  }

  console.log('✅ s_proj1 섹션 정리 완료');
  await closeConnection();
  process.exit();
}

run();
