import { executeQuery, closeConnection } from '../lib/database.js';

async function run() {
  const id = 's3';

  // 기존 데이터 삭제
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
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id,
    '[세미나] 취향의 단절 - 모두가 같은 것을 좋아하는 사회',
    '세미나',
    '비슷한 취향이 안전하게 느껴지고, 다른 목소리는 조심스러워지는 요즘. 숨겨두었던 나만의 좋아함을 다시 꺼내보는 강연.',
    '/image/taste-disconnect.png',
    '진행완료',
    '강연',
    '2025-07-18 00:00:00',
    '2025-07-18 00:00:00'
  ]);

  // 섹션 삽입 헬퍼
  async function insert(type: string, subtitle: string, body: string, iconClass: string, order: number, extraData?: string[], faqData?: {question:string, answer:string}[]) {
    const result = (await executeQuery<any>(`
      INSERT INTO content_detailed_sections (content_id, type, subtitle, body, icon_class, sort_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id, type, subtitle, body, iconClass, order])) as any;
    const sectionId = result.insertId;
    if (extraData) {
      for (let j = 0; j < extraData.length; j++)
        await executeQuery('INSERT INTO section_extra_data (section_id, data_text, sort_order) VALUES (?, ?, ?)', [sectionId, extraData[j], j + 1]);
    }
    if (faqData) {
      for (let j = 0; j < faqData.length; j++)
        await executeQuery('INSERT INTO section_faq_data (section_id, question, answer, sort_order) VALUES (?, ?, ?, ?)', [sectionId, faqData[j].question, faqData[j].answer, j + 1]);
    }
  }

  await insert('highlight', '✅ 진행 완료 | 2025년 7월 18일 (금) 18:00', '본 강연은 2025년 7월 18일 서울 마포구 홍대 스페이스M에서 성공적으로 진행되었습니다. 참여해주신 모든 분들께 감사드립니다.', 'fa-solid fa-circle-check text-green-500', 1);

  await insert('quote', '늘 정답처럼 주어진 기준 대신, 지금의 내가 진짜 좋아하는 것을 처음부터 다시 찾아보려는 작은 용기의 기록.', '모두가 같은 걸 좋아해야 덜 어색해지는 요즘. 비슷한 취향이 안전하게 느껴지고, 다른 목소리는 조심스러워지는 풍경 속에서 자꾸만 숨겨두게 되는 나만의 좋아함을 다시 꺼내보려는 시간. 누구 눈치도 보지 않고, 내 취향을 말해도 괜찮다고 서로에게 용기를 건네는 자리였습니다.', 'fa-solid fa-quote-left text-ieumAmber', 2);

  await insert('checklist', '📌 강연 정보', '', 'fa-solid fa-location-dot text-red-400', 3, [
    '일시: 2025년 7월 18일 (금) 오후 6시',
    '장소: 서울 마포구 서교동 양화로 15길 17 스페이스M',
    '주최: IEUM',
    '형식: 강연 + 소그룹 대화'
  ]);

  await insert('highlight', '🎙️ 이런 이야기를 나눴습니다', '조금은 엉성해도, 언젠가 한 번쯤 꼭 해보고 싶었던 이야기와 선택을 함께 나눠보는 자리. 알고리즘이 취향을 대신 결정해주는 시대에, 진짜 내가 좋아하는 것이 무엇인지 다시 물어보는 시간이었습니다.', 'fa-solid fa-microphone text-indigo-400', 4);

  await insert('steps', '💡 강연에서 다룬 주제', '', 'fa-solid fa-list-check text-blue-500', 5, [
    '왜 우리는 취향을 숨기게 되었는가 — 동조 압력과 취향의 사회화',
    '알고리즘이 만든 취향 vs. 내가 선택한 취향의 차이',
    '다름을 불편해하지 않고 꺼내는 법 — 취향으로 연결되는 관계',
    '"나는 이게 좋아"라고 말할 수 있는 용기에 대하여'
  ]);

  await insert('faq', '💬 참여자 후기', '', 'fa-solid fa-comment text-orange-400', 6, undefined, [
    {
      question: '참여자 A (26세, 직장인)',
      answer: '"평소에 제 취향을 말하면 괜히 튀는 것 같아서 그냥 맞춰왔던 것 같아요. 강연 들으면서 그게 얼마나 나를 작게 만들었는지 처음으로 생각해봤어요. 나만 이런 게 아니었다는 게 오히려 위로가 됐고, 집에 오는 길에 오랜만에 제가 좋아하는 음악 틀었어요."'
    },
    {
      question: '참여자 B (24세, 대학생)',
      answer: '"취향에 대한 이야기인 줄 알았는데 결국 나 자신에 대한 이야기였어요. 알고리즘이 추천해주는 것만 듣고, 보고, 먹다 보니까 내가 뭘 좋아하는지 모르겠더라고요. 강연 끝나고 소그룹에서 모르는 사람들이랑 각자 좋아하는 거 얘기하는데, 그게 생각보다 훨씬 재밌고 따뜻했어요."'
    },
    {
      question: '참여자 C (29세, 프리랜서)',
      answer: '"취향이 단절된다는 표현이 너무 정확하게 와 닿았어요. 어느 순간부터 주변 반응 먼저 확인하고, 그다음에 내 생각을 정하는 식이 되어버렸던 것 같아요. 이 강연이 딱히 해결책을 주진 않지만, 그냥 그 감각을 다시 꺼내볼 수 있게 해줘서 좋았어요. 또 있으면 꼭 올 것 같아요."'
    }
  ]);

  console.log('✅ s3 세미나 추가 완료');
  await closeConnection();
  process.exit();
}

run();
