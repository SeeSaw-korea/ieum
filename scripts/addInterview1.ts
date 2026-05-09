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
  const id = 'i3';

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
    VALUES (?, ?, '인터뷰', ?, ?, '2025.06.19', '스토리', ?, ?)
  `, [
    id,
    '[인터뷰] "완벽과 유연함 사이에서 균형을 찾다" With 프리랜서 디자이너 김OO',
    '완벽함에 지친 청년들에게. 프리랜서 디자이너 김OO가 전하는, 완벽 대신 유연함으로 자신만의 균형을 찾아가는 이야기.',
    '/image/balance.jpg',
    '2025-06-19 00:00:00',
    '2025-06-19 00:00:00'
  ]);

  // 섹션 1: 상단 대표 이미지
  await ins(id, 'image', '대표 이미지', '/image/balance-detail.jpg', '', 1);

  // 섹션 2: Editor's Note
  await ins(id, 'quote',
    '"균형은 완벽이 아니라 유연함이에요."',
    '📃 Editor\'s Note\n\n프리랜서라는 불확실한 길을 걸으며 김OO는 완벽함을 내려놓고 \'유연함\'으로 자신만의 균형을 찾아가고 있었다. 그녀가 전하는 이야기는 오늘을 사는 우리 모두에게 깊은 울림을 준다.\n\n완벽하지 않아도 괜찮다는 담담한 위로, 그리고 자신의 한계를 인정하는 용기. 이것이야말로 지속 가능한 삶과 작업의 비밀이라는 걸.',
    'fa-solid fa-quote-left text-ieumAmber', 2);

  // 섹션 3: 인터뷰 Q&A
  await ins(id, 'faq', '🎤 Interview', '', 'fa-solid fa-microphone text-indigo-400', 3, undefined, [
    {
      question: 'Q1. 프리랜서로 일하며 가장 힘들었던 순간은 언제였나요?',
      answer: '"프리랜서가 되면 일과 삶이 섞여버리는 순간들이 정말 많아요. 저도 한때는 퇴근 시간도 없고, 쉬는 날에도 일 생각이 떠나지 않아 불안했죠. \'더 해야 한다\', \'빨리 끝내야 한다\'는 생각이 머릿속을 꽉 채우고, 어느 순간에는 내가 왜 이 일을 하는지 혼란스러웠어요.\n\n그래서 어느 날 \'오늘 내 하루가 얼마나 기울어져 있나\'를 살피기 시작했어요. 아주 완벽하게 일과 휴식을 나누진 못해도, \'지금 나는 쉬어도 괜찮은 상태인가?\' 같은 작은 신호들을 민감하게 느끼려 노력합니다. 그걸 통해 하루하루 조금씩 균형을 맞춰가고 있어요."'
    },
    {
      question: 'Q2. 디자인할 때 가장 중요하게 생각하는 가치는 무엇인가요?',
      answer: '"저에게 디자인은 단순한 예쁜 그림이나 멋진 표현이 아니에요. 결국 문제를 해결하는 과정이라고 생각해요. 그래서 솔직함을 제일 중요하게 여깁니다.\n\n화려하게 포장하거나 겉모습만 그럴싸하게 만드는 것보다, 진짜로 필요한 것이 무엇인지 파악해서 그걸 드러내는 게 더 의미 있다고 믿어요. 때론 솔직한 이야기가 불편할 수 있지만, 그것이 결국 좋은 결과를 만드는 출발점이 됩니다."'
    },
    {
      question: 'Q3. 프리랜서로서 \'나만의 균형\'을 찾는 비결이 있다면요?',
      answer: '"제가 배운 가장 큰 깨달음은 \'완벽을 내려놓는 용기\'입니다. 예전에는 \'모든 걸 완벽하게 해내야 한다\'는 생각에 사로잡혀서 늘 스스로를 몰아붙였어요. 그런데 그 강박이 오히려 창의력을 갉아먹고, 작업을 즐기지 못하게 하더라고요.\n\n그래서 지금은 하루에 한두 가지라도 진심을 다하는 걸 목표로 해요. 그리고 쉬는 것도 \'게으름\'이 아니라 \'재충전\'이라는 마음으로 받아들이려고 해요. 이게 정말 쉽지 않지만, 점점 나아지고 있어요."'
    },
    {
      question: 'Q4. 앞으로 디자이너로서 어떤 일을 해보고 싶나요?',
      answer: '"사회 문제를 디자인이라는 시각 언어로 풀어내는 작업에 도전해보고 싶어요. 디자인이 단지 \'보기 좋은 것\'을 만드는 게 아니라, 사람들의 인식을 바꾸고 사회를 조금 더 나은 방향으로 움직이게 할 수 있다고 믿거든요.\n\n그래서 앞으로는 환경, 인권, 다양성 같은 주제에 관심을 갖고, 의미 있는 메시지를 담는 작업을 하고 싶어요. 그리고 그런 작업을 통해 저도 더 성장하고 싶고요."'
    }
  ]);

  // 섹션 4: 코멘트
  await ins(id, 'quote',
    '프리랜서 디자이너 김OO는 \'균형\'이란 완벽한 상태가 아니라, 하루하루의 미묘한 기울기를 인지하고 그에 맞게 스스로를 조절하는 유연함이라고 말한다.',
    '그는 자신을 \'완벽주의자가 아닌 균형 감각을 가진 창작자\'라 소개하며, 완벽에 얽매이지 않는 태도 속에서 진정한 창의성과 솔직함이 피어난다는 것을 몸소 보여준다.\n\n완벽함을 좇기보다 매일의 작은 균형에 집중하며, 변화하는 자신과 조금씩 타협하며 앞으로 나아가는 과정이야말로 프리랜서로 살아가는 진짜 힘임을 깨달았다.',
    'fa-solid fa-circle text-gray-400', 4);

  // 섹션 5: 청년에게 전하는 말
  await ins(id, 'checklist', '💬 청년에게 전하는 말', '"완벽을 내려놓고, 나만의 균형을 찾아요."', 'fa-solid fa-heart text-ieumAmber', 5, [
    '완벽함에서 벗어나기 — 청년 여러분, 완벽해야 한다는 부담에서 조금은 벗어나셨으면 해요. 우리는 모두 각자의 속도로 걸어가고 있고, 그 속도가 느리거나 빠르다고 해서 틀린 건 아니니까요.',
    '나를 인정하는 용기 — 내가 지금 어느 지점에 있는지 스스로 느끼고 인정하는 것이 정말 중요해요. 완벽하지 않아도 괜찮아요. 오히려 그 불완전함 속에서 진짜 나를 발견할 수 있으니까요.',
    '꾸준히, 그리고 쉬어가기 — 작은 한 걸음이라도 꾸준히 내딛는 용기를 잃지 마세요. 그리고 가끔은 멈춰서서 숨 고를 시간도 꼭 챙기세요. 그 시간이 결국 더 나은 내일을 만드는 밑거름이 됩니다.',
    '지금 이 순간이 시작입니다 — 여러분의 지금이 바로 의미 있는 시작입니다. 서로를 응원하며 천천히, 그러나 확실히 앞으로 나아가길 진심으로 바랍니다.'
  ]);

  console.log('✅ i3 인터뷰 추가 완료');
  await closeConnection();
  process.exit();
}

run();
