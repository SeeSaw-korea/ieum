import { executeQuery, closeConnection } from '../lib/database.js';

async function insert(id: string, type: string, subtitle: string, body: string, iconClass: string, order: number, extraData?: string[], faqData?: {question:string, answer:string}[]) {
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

async function clearAndCreate(id: string, title: string, description: string, imageUrl: string, createdAt: string) {
  const secs = await executeQuery<any>('SELECT id FROM content_detailed_sections WHERE content_id = ?', [id]);
  for (const s of secs) {
    await executeQuery('DELETE FROM section_progress_data WHERE section_id = ?', [s.id]);
    await executeQuery('DELETE FROM section_extra_data WHERE section_id = ?', [s.id]);
    await executeQuery('DELETE FROM section_faq_data WHERE section_id = ?', [s.id]);
  }
  await executeQuery('DELETE FROM content_detailed_sections WHERE content_id = ?', [id]);
  await executeQuery('DELETE FROM content_detail_images WHERE content_id = ?', [id]);
  await executeQuery('DELETE FROM contents WHERE id = ?', [id]);
  await executeQuery(`
    INSERT INTO contents (id, title, category, description, image_url, deadline, tag, created_at, updated_at)
    VALUES (?, ?, '세미나', ?, ?, '진행완료', '강연', ?, ?)
  `, [id, title, description, imageUrl, createdAt, createdAt]);
}

async function run() {
  try {
    console.log('Starting...');

    // ── s4: 꿈의 무게와 도전의 균형 (2025.06.24) ─────────────
    await clearAndCreate(
      's4',
      '[세미나] 꿈의 무게와 도전의 균형 : 꿈꾸기를 두려워하는 시대, 다시 질문하기',
      '불확실성 속에서 꿈과 도전 사이의 균형을 찾는 20대에게, 현실과 조화를 이루며 꿈꾸는 방법을 함께 모색하는 강연.',
      '/image/dream-weight.png',
      '2025-06-24 00:00:00'
    );
    await insert('s4', 'highlight', '✅ 진행 완료 | 2025년 6월 24일 (화) 18:00', '본 강연은 2025년 6월 24일 서울 마포구 홍대 스페이스M에서 성공적으로 진행되었습니다. 참여해주신 모든 분들께 감사드립니다.', 'fa-solid fa-circle-check text-green-500', 1);
    await insert('s4', 'quote', '꿈은 무게가 있다. 그래서 혼자 들기엔 너무 무거울 때가 있다.', '현대 사회는 불확실성과 빠른 변화 속에서 꿈과 도전 사이의 균형을 찾기 어려운 시대입니다. 이번 강연은 개인의 열망과 사회적 기대 사이에서 고민하는 20대 청년들에게, 꿈꾸기를 두려워하지 않고 현실과 조화를 이루는 방법을 함께 모색했습니다.', 'fa-solid fa-quote-left text-ieumAmber', 2);
    await insert('s4', 'checklist', '📌 강연 정보', '', 'fa-solid fa-location-dot text-red-400', 3, [
      '일시: 2025년 6월 24일 (화) 오후 6시',
      '장소: 서울 마포구 서교동 양화로 15길 17 스페이스M',
      '주최: IEUM',
      '참가 대상: 20대 누구나 가능'
    ]);
    await insert('s4', 'steps', '💡 강연에서 다룬 주제', '', 'fa-solid fa-list-check text-blue-500', 4, [
      '왜 지금 세대는 꿈을 말하기 두려워하는가',
      '사회적 기대와 개인의 열망 사이에서 균형 찾기',
      '\'바이브 코딩\'으로 본 개인과 조직의 균형 잡힌 성장 사례',
      '꿈의 무게를 나누는 법 — 혼자가 아닌 함께 도전하기'
    ]);
    await insert('s4', 'faq', '💬 참여자 후기', '', 'fa-solid fa-comment text-orange-400', 5, undefined, [
      {
        question: '참여자 A (25세, 취준생)',
        answer: '"꿈이 있긴 한데 현실적으로 가능할지 몰라서 그냥 묻어두고 살았어요. 강연 들으면서 그게 저만의 얘기가 아니라는 걸 알았고, 꿈을 포기하는 게 아니라 조율하는 거라는 말이 오래 남았어요. 가볍게 왔다가 생각보다 많은 걸 가지고 간 날이었습니다."'
      },
      {
        question: '참여자 B (27세, 직장인)',
        answer: '"회사 다니면서 꿈 얘기를 꺼내면 철없어 보일까봐 오래 침묵했던 것 같아요. 강연에서 도전을 거창하게 보지 않아도 된다는 이야기가 제일 마음에 들었어요. 작은 시도들을 쌓아가는 것도 도전이라는 말이, 뭔가 막혀있던 걸 뚫어주는 느낌이었습니다."'
      },
      {
        question: '참여자 C (23세, 대학생)',
        answer: '"취업 걱정에 꿈 같은 건 사치처럼 느껴졌는데, 오늘 강연이 그 생각을 조금 바꿔줬어요. 꿈을 크게 잡는 게 아니라 지금 내가 진짜 원하는 게 뭔지부터 물어보는 것부터라는 말이 가장 기억에 남아요. 강연 끝나고 오랫동안 혼자 앉아서 생각했습니다."'
      }
    ]);
    console.log('✅ s4 done');

    // ── s5: 20살 나와 세상 사이 (2025.03.02) ─────────────────
    await clearAndCreate(
      's5',
      '[세미나] 20살, 나와 세상 사이에서 길을 찾다',
      '모두가 비슷한 길을 가야 할 것 같은 압박 속에서, 서툴러도 괜찮다고 서로에게 용기를 건네며 나만의 길을 마주하는 강연.',
      '/image/twenty-world.png',
      '2025-03-02 00:00:00'
    );
    await insert('s5', 'highlight', '✅ 진행 완료 | 2025년 3월 2일 (일) 18:00', '본 강연은 2025년 3월 2일 서울 마포구 홍대 스페이스M에서 성공적으로 진행되었습니다. 참여해주신 모든 분들께 감사드립니다.', 'fa-solid fa-circle-check text-green-500', 1);
    await insert('s5', 'quote', '서툴러도 괜찮다. 조금 돌아가도 괜찮다. 지금 네가 걷는 그 길이 네 길이다.', '모두가 비슷한 걸 선택해야 덜 불안해지는 요즘, 숨겨뒀던 나만의 길을 다시 꺼내는 시간. 누구 눈치 보지 않고, 조금 서툴러도 괜찮다고 서로에게 용기를 건네며 나와 세상 사이에서 균형을 찾아가는 이야기를 차분히 듣고 스스로의 길을 마주하는 강연이었습니다.', 'fa-solid fa-quote-left text-ieumAmber', 2);
    await insert('s5', 'checklist', '📌 강연 정보', '', 'fa-solid fa-location-dot text-red-400', 3, [
      '일시: 2025년 3월 2일 (일) 오후 6시',
      '장소: 서울 마포구 서교동 양화로 15길 17 스페이스M',
      '주최: IEUM',
      '참가 대상: 20대 누구나 가능'
    ]);
    await insert('s5', 'steps', '💡 강연에서 다룬 주제', '', 'fa-solid fa-list-check text-blue-500', 4, [
      '20대가 느끼는 \'정해진 길\'의 압박과 그 실체',
      '비교와 불안으로 가득한 시대에 나를 잃지 않는 법',
      '서툰 선택들이 모여 만들어진 이야기 — 다양한 20대의 경험 나누기',
      '나와 세상 사이에서 균형을 잡는 작은 실천들'
    ]);
    await insert('s5', 'faq', '💬 참여자 후기', '', 'fa-solid fa-comment text-orange-400', 5, undefined, [
      {
        question: '참여자 A (20세, 대학 새내기)',
        answer: '"솔직히 강연 오기 전까지 내가 뭘 원하는지 생각해본 적이 별로 없었어요. 다들 하는 대로 따라가면 되겠지 했는데, 오늘 강연 듣고 나서 처음으로 나는 어떤 사람인지 생각해봤어요. 대학 들어와서 가장 잘한 선택 중 하나인 것 같아요."'
      },
      {
        question: '참여자 B (22세, 휴학생)',
        answer: '"휴학하면서 나만 뒤처지는 것 같아서 많이 불안했는데, 오늘 강연이 그 불안을 없애주진 않았지만 왜 내가 불안한지는 알게 해줬어요. 돌아가는 것도 길이라는 말이 오래 마음에 남았어요. 다시 시작할 용기가 조금 생긴 날이었습니다."'
      },
      {
        question: '참여자 C (24세, 직장인)',
        answer: '"취직하고 나서 오히려 더 방향을 잃은 느낌이었는데, 이게 저만의 감각이 아니었다는 걸 오늘 알았어요. 강연장에서 비슷한 나이 친구들이랑 잠깐 이야기 나눈 것도 좋았고, 정답이 없다는 걸 같이 인정해주는 분위기가 편했어요."'
      }
    ]);
    console.log('✅ s5 done');

    // ── s6: 예술은 어떻게 사회를 다시 느끼게 하는가 (2025.01.17) ──
    await clearAndCreate(
      's6',
      '[세미나] 예술은 어떻게 사회를 다시 느끼게 하는가',
      '예술이 불평등과 소외, 환경, 젠더와 인권 등 사회 문제를 감각으로 전하는 방식을 탐구하고 균형과 공존의 길을 찾아가는 강연.',
      '/image/art-society.png',
      '2025-01-17 00:00:00'
    );
    await insert('s6', 'highlight', '✅ 진행 완료 | 2025년 1월 17일 (금) 18:00', '본 강연은 2025년 1월 17일 서울 마포구 서교동 국일빌딩 4층 필로버스에서 성공적으로 진행되었습니다. 참여해주신 모든 분들께 감사드립니다.', 'fa-solid fa-circle-check text-green-500', 1);
    await insert('s6', 'quote', '예술은 말로 하기 어려운 것을 감각으로 먼저 말한다.', '변화하는 사회의 표면 아래, 숨겨진 불평등과 갈등이 드러날 때가 있다. 예술은 그동안 우리가 보지 못했던 현실을 직시하게 하고, 차별과 소외, 환경, 젠더와 인권 등 다양한 사회 문제를 감각과 감성으로 전하며 질문을 던진다.', 'fa-solid fa-quote-left text-ieumAmber', 2);
    await insert('s6', 'checklist', '📌 강연 정보', '', 'fa-solid fa-location-dot text-red-400', 3, [
      '일시: 2025년 1월 17일 (금) 오후 6시',
      '장소: 서울시 마포구 서교동 449-43 국일빌딩 4층 (필로버스)',
      '주최: IEUM',
      '참가 대상: 예술과 사회에 관심 있는 누구나'
    ]);
    await insert('s6', 'steps', '💡 강연에서 다룬 주제', '', 'fa-solid fa-list-check text-blue-500', 4, [
      '거리의 벽화, 공연, 디지털 미디어 — 사회적 메시지를 담은 예술의 형태들',
      '차별과 소외를 감각으로 전하는 예술가들의 이야기',
      '예술이 사회를 \'느끼게\' 하는 방식 — 데이터가 아닌 감성으로 읽는 현실',
      '균형과 공존을 향한 예술적 실천 — 어떻게 행동으로 이어지는가'
    ]);
    await insert('s6', 'highlight', '🎨 이런 이야기를 나눴습니다', '서로 다른 삶의 경험을 가진 예술가들의 작업을 통해, 내가 미처 보지 못했던 누군가의 현실을 마주하는 시간. 예술이 사회를 비추는 거울이 되는 순간들을 함께 살펴보았습니다.', 'fa-solid fa-palette text-purple-400', 5);
    await insert('s6', 'faq', '💬 참여자 후기', '', 'fa-solid fa-comment text-orange-400', 6, undefined, [
      {
        question: '참여자 A (26세, 디자이너)',
        answer: '"예술을 좋아하긴 했는데 사회적인 맥락으로 생각해본 적은 없었어요. 강연에서 소개된 작품들이 단순히 예쁜 게 아니라 누군가의 고통이나 목소리를 담고 있다는 걸 알게 되니까, 그 뒤로 작품을 보는 눈이 달라진 것 같아요. 예술이 이렇게 무거운 것도 담을 수 있다는 게 오히려 위안이 됐습니다."'
      },
      {
        question: '참여자 B (29세, 사회복지사)',
        answer: '"일하면서 느끼는 한계들을 예술이 어떻게 표현하는지 궁금해서 왔는데, 생각보다 훨씬 많은 영감을 얻어갔어요. 말로 설명해도 안 닿는 감각을 예술이 건드려줄 수 있다는 게 저한테는 큰 힌트였어요. 현장에서 더 많이 활용하고 싶다는 생각이 들었습니다."'
      },
      {
        question: '참여자 C (23세, 미대생)',
        answer: '"예술로 밥 먹고 살 수 있냐는 질문 앞에서 항상 작아졌는데, 오늘 강연에서 예술이 사회에 어떻게 작동하는지 보니까 조금 더 당당해진 느낌이에요. 내가 만드는 것들이 누군가에게 닿을 수 있다는 가능성을 처음으로 진지하게 믿어보게 됐어요."'
      }
    ]);
    console.log('✅ s6 done');

    console.log('🎉 All seminars added!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await closeConnection();
    process.exit();
  }
}

run();
