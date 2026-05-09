import { executeQuery, closeConnection } from '../lib/database.js';

async function ins(id: string, type: string, subtitle: string, body: string, iconClass: string, order: number, extraData?: string[], faqData?: {question:string, answer:string}[]) {
  const result = (await executeQuery<any>(`
    INSERT INTO content_detailed_sections (content_id, type, subtitle, body, icon_class, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [id, type, subtitle, body, iconClass, order])) as any;
  const sid = result.insertId;
  if (extraData) for (let j = 0; j < extraData.length; j++)
    await executeQuery('INSERT INTO section_extra_data (section_id, data_text, sort_order) VALUES (?, ?, ?)', [sid, extraData[j], j + 1]);
  if (faqData) for (let j = 0; j < faqData.length; j++)
    await executeQuery('INSERT INTO section_faq_data (section_id, question, answer, sort_order) VALUES (?, ?, ?, ?)', [sid, faqData[j].question, faqData[j].answer, j + 1]);
}

async function run() {
  const id = 'ins1';

  // 기존 삭제
  const secs = await executeQuery<any>('SELECT id FROM content_detailed_sections WHERE content_id = ?', [id]);
  for (const s of secs) {
    await executeQuery('DELETE FROM section_progress_data WHERE section_id = ?', [s.id]);
    await executeQuery('DELETE FROM section_extra_data WHERE section_id = ?', [s.id]);
    await executeQuery('DELETE FROM section_faq_data WHERE section_id = ?', [s.id]);
  }
  await executeQuery('DELETE FROM content_detailed_sections WHERE content_id = ?', [id]);
  await executeQuery('DELETE FROM content_detail_images WHERE content_id = ?', [id]);
  await executeQuery('DELETE FROM contents WHERE id = ?', [id]);

  // 콘텐츠 삽입
  await executeQuery(`
    INSERT INTO contents (id, title, category, description, image_url, deadline, tag, created_at, updated_at)
    VALUES (?, ?, '인사이트', ?, ?, '2025.08', '인사이트', ?, ?)
  `, [
    id,
    '[인사이트] 2025년 8월 — "열심히"보다 "지속 가능하게" 일하는 시대',
    '2025년 8월, 조용한 퇴사·번아웃·워라밸 중심 직업관 변화. 청년들이 노동과 삶의 경계를 다시 그리고 있다.',
    '/image/aug-2025.png',
    '2025-08-01 00:00:00',
    '2025-08-01 00:00:00'
  ]);

  // 섹션 1: 주요 이슈
  await ins(id, 'highlight', '🔎 2025년 8월 주요 이슈',
    '이달의 청년 사회 키워드를 짚어봅니다.',
    'fa-solid fa-magnifying-glass text-ieumAmber', 1,
    [
      '조용한 퇴사(Quiet Quitting) 확산 — 출처: 동아일보 「조용한 퇴사 유행」',
      '직장인 번아웃 증가 — 출처: 잡코리아 설문 / Class101 리포트',
      '워라밸 중심 직업관 변화',
    ]
  );

  // 섹션 2: 인사이트 본문
  await ins(id, 'default', '💡 인사이트',
    '2025년 하반기의 시작은 \'일에 대한 태도의 변화\'로 요약된다.\n특히 \'조용한 퇴사\'는 단순한 태만이 아니라, 과잉 노동 구조에 대한 집단적 반응으로 해석해야 한다.\n\n2030 청년들은 더 이상 \'성과 중심 조직\' 안에서 자신의 삶을 희생하는 것을 당연하게 받아들이지 않는다.\n이는 단순히 게으름이 아니라, 노동과 삶의 경계를 재정의하려는 시도다.\n\n실제로 직장인의 약 69%가 번아웃을 경험했다는 데이터는 이 현상이 개인 문제가 아니라 구조적 피로의 결과임을 보여준다.',
    'fa-solid fa-lightbulb text-yellow-400', 2
  );

  // 섹션 3: 트렌드 방향
  await ins(id, 'checklist', '📈 앞으로의 방향',
    '이 변화는 다음과 같은 방향으로 이어질 가능성이 높다.',
    'fa-solid fa-chart-line text-indigo-400', 3,
    [
      '조직 충성도 ↓ / 개인 중심 커리어 ↑',
      '장기 근속 ↓ / 프로젝트 기반 노동 ↑',
      '안정성보다 \'지속 가능성\' 추구',
    ]
  );

  // 섹션 4: 핵심 메시지
  await ins(id, 'quote',
    '👉 "열심히"보다 "지속 가능하게" 일하는 시대',
    '청년들에게 중요한 질문은 더 이상 "어디서 일하느냐"가 아니다.\n\n👉 "이 일이 나를 소모시키는가, 유지시키는가"',
    'fa-solid fa-quote-left text-ieumAmber', 4
  );

  console.log('✅ ins1 (2025년 8월 인사이트) 추가 완료');
  await closeConnection();
  process.exit();
}

run();
