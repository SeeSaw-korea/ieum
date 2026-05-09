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

async function clear(id: string) {
  const secs = await executeQuery<any>('SELECT id FROM content_detailed_sections WHERE content_id = ?', [id]);
  for (const s of secs) {
    await executeQuery('DELETE FROM section_progress_data WHERE section_id = ?', [s.id]);
    await executeQuery('DELETE FROM section_extra_data WHERE section_id = ?', [s.id]);
    await executeQuery('DELETE FROM section_faq_data WHERE section_id = ?', [s.id]);
  }
  await executeQuery('DELETE FROM content_detailed_sections WHERE content_id = ?', [id]);
  await executeQuery('DELETE FROM content_detail_images WHERE content_id = ?', [id]);
  await executeQuery('DELETE FROM contents WHERE id = ?', [id]);
}

async function createContent(id: string, title: string, desc: string, imageUrl: string, date: string) {
  await executeQuery(`
    INSERT INTO contents (id, title, category, description, image_url, deadline, tag, created_at, updated_at)
    VALUES (?, ?, '인터뷰', ?, ?, ?, '스토리', ?, ?)
  `, [id, title, desc, imageUrl, date, date, date]);
}

async function run() {
  try {
    console.log('Starting...');

    // ── i1, i2 삭제 ──────────────────────────────────────────
    for (const id of ['i1', 'i2']) {
      await clear(id);
      console.log(`✅ Deleted ${id}`);
    }

    // ── i4: 공간이 바뀌면 생각도 달라집니다 (곽OO, 2025.07.15) ──
    await clear('i4');
    await createContent('i4',
      '[인터뷰] "공간이 바뀌면 생각도 달라집니다" With 공유 오피스 기획자 곽OO',
      '혼자 버티는 게 당연하다고 느끼는 청년들에게. 공유 오피스 기획자 곽OO가 말하는, 공간이 만들어내는 작은 용기와 연결의 이야기.',
      '/image/one-space.jpg',
      '2025-07-15 00:00:00'
    );
    await ins('i4', 'image', '대표 이미지', '/image/space-detail.jpg', '', 1);
    await ins('i4', 'quote',
      '"하나의 공간이 작은 용기를 키우는 토양이 될 수 있어요."',
      '📃 Editor\'s Note\n\n많은 창업자들이 공유 오피스를 단순히 비용 절감을 위한 선택이라고 말한다. 그러나 곽OO은 조금 다른 시선을 가지고 있다. \'같은 공간에 머문다는 것\'이 사람의 태도를 바꾸고, 혼자였다면 하지 못했을 시도를 가능하게 한다고 그는 말한다. 오늘, 그가 기획해온 공간의 풍경과, 그곳에서 자라는 작은 변화들을 들여다본다.',
      'fa-solid fa-quote-left text-ieumAmber', 2);
    await ins('i4', 'faq', '🎤 Interview', '', 'fa-solid fa-microphone text-indigo-400', 3, undefined, [
      {
        question: 'Q1. 공유 오피스를 기획하게 된 계기가 무엇이었나요?',
        answer: '"처음에는 정말 실용적인 이유였어요. 저도 창업 초기였고, 매달 사무실 임대료를 감당하기가 버거웠어요. 마침 같은 상황에 놓인 친구 몇 명과 자연스럽게 테이블을 나누게 됐죠.\n\n그렇게 시작한 공간에서, 다들 비슷한 고민을 하고 있다는 사실이 위안이 되었어요. \'아, 이게 단순한 임대가 아니라 서로를 버티게 하는 환경이구나\'라고 느꼈어요. 그 순간부터 이 일을 더 넓게 해보고 싶다고 생각했어요."'
      },
      {
        question: 'Q2. 공간을 설계할 때 가장 중요하게 생각하는 기준은요?',
        answer: '"\'심리적 안전감\'을 줄 수 있는 환경이에요. 혼자 방에서 일할 때는 작은 실패도 크게 느껴지는데, 같은 공간에 다른 사람들이 있다는 사실만으로 마음이 단단해질 때가 있어요.\n\n그래서 인테리어나 좌석 배치, 커뮤니티 게시판까지 전부 \'여기서는 어떤 시도도 괜찮다\'는 메시지를 담으려 해요. 그게 결국 더 많은 시도를 가능하게 만드는 힘이 되더라고요."'
      },
      {
        question: 'Q3. 공유 오피스를 운영하며 가장 어려웠던 점은 무엇인가요?',
        answer: '"\'공유\'에 대한 기대치가 사람마다 다르다는 거예요. 어떤 분은 활발하게 네트워킹하기를 원하고, 어떤 분은 정말 조용히 혼자 일하길 바라요. 이 두 가지가 충돌할 때가 종종 있어요.\n\n공간 기획자로서 그 온도를 조율하는 과정이 쉽지는 않아요. 하지만 오히려 그 고민이 이 일의 매력이기도 해요. 어떻게 하면 서로 존중하며 공존할 수 있을까, 매일 배우고 있어요."'
      },
      {
        question: 'Q4. 기억에 남는 순간이 있다면요?',
        answer: '"한 입주 팀이 자금 문제로 거의 문을 닫을 뻔한 적이 있어요. 그 팀 대표님이 퇴실하기 전날 저에게 "그래도 여기서 일하니까 버텼어요"라고 하시더라고요. "누군가가 늦게까지 불 켜놓고 일하는 걸 보면서 이상하게 힘이 났다"고요.\n\n그 말을 들었을 때, 공간이 단순한 장소 이상이 될 수 있다는 걸 다시 확인했어요. 그게 지금도 제 일의 동력이에요."'
      },
      {
        question: 'Q5. 공간이 커뮤니티가 되려면 어떤 조건이 필요할까요?',
        answer: '"\'같이 있는 시간이 쌓이는 것\'이 제일 중요해요. 처음에는 모두 낯설고 경계하죠. 하지만 같은 커피머신을 쓰고, 같은 회의실을 빌리면서 조금씩 말을 트게 돼요.\n\n그 작은 순간들이 모여 어느 날 자연스럽게 응원과 책임이 생겨요. 커뮤니티란 결국 시간이 만든 신뢰 같아요."'
      },
      {
        question: 'Q6. 앞으로 어떤 공간을 만들고 싶으신가요?',
        answer: '"물리적 공간에 머물지 않고, 배움과 네트워크가 자라는 플랫폼을 만들고 싶어요. 책상과 의자를 빌려주는 일로 끝나는 게 아니라, 서로의 실패와 고민을 편하게 나눌 수 있는 곳이요.\n\n언젠가 \'여기서 새로운 시도를 해볼 수 있겠다\'고 생각하는 사람이 더 많아지면 좋겠어요."'
      },
      {
        question: 'Q7. 같은 길을 고민하는 청년들에게 전하고 싶은 말이 있다면요?',
        answer: '"혼자 버티는 게 어렵다고 느껴진다면, 먼저 환경을 바꿔보세요. 공간이 달라지면 생각도 바뀌어요. 그게 별것 아닌 것 같아 보여도, 실제로는 굉장히 큰 전환점이 될 수 있어요.\n\n그리고 무엇보다, 같은 자리에 있는 사람들끼리 주고받는 작은 기운이 있어요. 그걸 믿어보면 좋겠어요."'
      }
    ]);
    await ins('i4', 'quote',
      '공간은 언제나 \'물리\'가 아니라 \'관계\'였다.',
      '무언가를 시작할 때, 우리는 종종 \'자신감\'이 아니라 \'환경\'을 먼저 잃는다. 불안한 시도, 어색한 시작, 반복되는 실패 속에서 공간은 묵묵히 사람들의 무게를 버텨주고, 가까운 타인의 존재는 우리가 다시 일어설 수 있게 만든다.\n\n곽OO의 공간은 사무실이라는 말보다, 태도의 집합이라는 말이 더 어울린다. 이 인터뷰가, 혼자 시도하고 있는 누군가에게 \'장소\'보다 먼저 \'관계\'가 시작되는 계기가 되길 바란다.',
      'fa-solid fa-circle text-gray-400', 4);
    await ins('i4', 'checklist', '💬 청년에게 전하는 말', '"공간은 곧 관계의 시작점이에요. 혼자라고 느껴질 때, 그 시작점을 찾아보세요."', 'fa-solid fa-heart text-ieumAmber', 5, [
      '환경을 바꿔보세요 — 혼자 버티는 게 어렵다면, 공간을 먼저 바꿔보세요. 공간이 달라지면 생각도 달라지고, 새로운 가능성이 보이기 시작합니다.',
      '주변의 기운을 믿으세요 — 같은 자리에 있는 사람들이 주고받는 작은 기운이 있어요. 완벽히 준비되지 않아도, 그 기운이 당신을 조금 더 담대하게 만들어줄 거예요.',
      '시작은 작아도 괜찮아요 — 오늘 할 수 있는 만큼의 준비와 용기로도 충분해요. 그 작은 시작이 쌓여 결국 당신만의 길이 됩니다.'
    ]);
    console.log('✅ i4 done');

    // ── i5: 취향이란 결국 나를 설명하는 언어 (양OO, 2025.08.19) ──
    await clear('i5');
    await createContent('i5',
      '[인터뷰] "취향이란 결국 나를 설명하는 언어예요" With 문화 콘텐츠 기획자 양OO',
      '불완전함을 두려워하는 청년들에게. 문화 콘텐츠 기획자 양OO가 전하는, 취향을 말하는 용기와 낯섦을 공감으로 바꾸는 기획의 이야기.',
      '/image/preference.jpg',
      '2025-08-19 00:00:00'
    );
    await ins('i5', 'image', '대표 이미지', '/image/preference-detail.jpg', '', 1);
    await ins('i5', 'quote',
      '"문화는 거창한 게 아니라, 작은 공감을 나누는 순간부터 시작돼요."',
      '📃 Editor\'s Note\n\n많은 사람들이 \'문화 기획자\'라 하면 화려한 기획서와 유명한 전시를 떠올린다. 하지만 양OO이 말하는 기획은 더 소박하다. 누군가의 취향이 \'틀리지 않다\'고 확인받는 일, 그 작은 인정이 어떻게 삶을 바꾸는지를 그는 매일 목격한다. 낯섦을 지나 공감에 닿는 그 과정을, 오늘 그에게 들어본다.',
      'fa-solid fa-quote-left text-ieumAmber', 2);
    await ins('i5', 'faq', '🎤 Interview', '', 'fa-solid fa-microphone text-indigo-400', 3, undefined, [
      {
        question: 'Q1. 기획자로 일하게 된 계기가 궁금합니다.',
        answer: '"사실 처음부터 이 길이 목표는 아니었어요. 대학에 다닐 때도 진로에 대해 확신이 없었고, 여러 전시나 북토크를 구경하는 게 그저 취미였어요. 주변에서는 "그걸로 무슨 밥벌이를 하겠냐"는 말을 자주 들었고요.\n\n하지만 이상하게도, 집에 돌아오면 그날 본 전시나 강연의 여운이 가장 오래 남더라고요. \'왜 나는 이런 순간에 기운이 날까?\'를 자꾸 고민하게 됐어요. 그래서 처음에는 작은 독립서점에서 기획 일을 거들다가, 점점 규모가 큰 프로젝트를 맡게 됐어요."'
      },
      {
        question: 'Q2. 기획할 때 가장 중요하게 생각하는 건 무엇인가요?',
        answer: '"\'낯섦을 두려워하지 않는 태도\'예요. 문화 기획을 하다 보면, 대중에게 익숙하지 않은 주제를 다룰 때가 많아요. 그럴 때 \'이거 너무 어렵다고 느끼면 어떡하지?\' 하는 걱정이 들어요.\n\n하지만 오히려 그 낯섦이 대화를 여는 지점이 되더라고요. "이게 뭔지 잘 모르겠다"는 참여자들의 말에서 시작되는 대화가 제일 흥미로워요. 그 대화를 통해 결국 공감이 만들어지고, 누군가는 새로운 관심사를 발견하게 되니까요."'
      },
      {
        question: 'Q3. 최근 기억에 남는 프로젝트가 있다면요?',
        answer: '"지역서점과 협업해서 \'나만의 취향을 발견하는 독서모임\'을 기획했어요. 이번엔 "남들이 좋다고 한 책 말고, 내가 좋다고 느낀 책에 대해 이야기하자"는 취지였어요.\n\n처음엔 다들 "제가 고른 책이 별로일까봐 걱정돼요"라고 하셨는데, 마지막에는 "이 책이 제 인생에 어떤 자리를 차지했는지 처음으로 말해봤어요"라고 하시더라고요. 취향을 말할 용기를 드린 것 같아서, 기획자로서 가장 보람을 느꼈어요."'
      },
      {
        question: 'Q4. 기획자로서 가장 어려웠던 순간은 언제인가요?',
        answer: '"처음엔 \'기획자라면 뭔가 특별하고 독창적인 걸 내놔야 한다\'는 부담이 컸어요. 그래서 괜히 어렵게 기획서를 쓰고, 큰 예산이 필요한 아이디어만 고민했어요.\n\n그런데 정작 참여자들은 화려한 기획보다 \'내 이야기를 할 수 있는 자리\'를 더 소중하게 여기더라고요. 그걸 깨닫고부터는, 기획의 초점을 \'얼마나 멋져 보이느냐\'가 아니라 \'얼마나 편하게 참여할 수 있느냐\'에 맞추게 됐어요."'
      },
      {
        question: 'Q5. 앞으로 어떤 기획을 해보고 싶으신가요?',
        answer: '"사람들이 \'취향\'이라는 단어에 덜 위축되면 좋겠어요. 특히 청년들 중엔 "난 특별히 좋아하는 게 없어요"라고 말하는 분들이 많아요. 사실 그건 취향이 없는 게 아니라, 말할 기회를 못 가졌을 뿐이라고 생각해요.\n\n그래서 앞으로는 더 다양한 방식으로 \'취향의 언어\'를 만드는 프로젝트를 해보고 싶어요. 전시, 독서모임, 워크숍, 온라인 플랫폼까지 경계를 두지 않고요. 문화는 결국 삶을 바꾸는 언어라는 걸 계속 보여주고 싶어요."'
      }
    ]);
    await ins('i5', 'quote',
      '양OO의 기획노트엔 늘 같은 문장이 적혀 있다. "문화는 공감을 확인하는 가장 작은 단위."',
      '그에게 기획은 삶의 다른 얼굴을 마주하게 하는 작업이다. 낯선 것을 두려워하지 않는 태도, 사소해 보이는 이야기를 존중하는 마음. 그게 바로 \'취향\'의 시작점이라고 그는 말한다.\n\n오늘도 그는 새로운 큐레이션 아이디어를 모으며, 누군가가 \'나도 이런 걸 좋아해요\'라고 말하는 순간을 기다린다.',
      'fa-solid fa-circle text-gray-400', 4);
    console.log('✅ i5 done');

    // ── i6: 불완전함을 두려워하지 않는 연습 (이OO, 2025.09.24) ──
    await clear('i6');
    await createContent('i6',
      '[인터뷰] "불완전함을 두려워하지 않는 연습" With 스타트업 창업가 이OO',
      '불완전함을 두려워하는 청년들에게. 스타트업 창업가 이OO가 말하는, 완벽한 준비보다 먼저 움직이는 용기의 이야기.',
      '/image/imperfect.jpg',
      '2025-09-24 00:00:00'
    );
    await ins('i6', 'quote',
      '"모든 답을 찾아야 시작할 수 있다고 믿으면, 결국 아무것도 시작할 수 없습니다."',
      '📃 Editor\'s Note\n\n아직 아무것도 보장되지 않은 상태에서 \'내 일\'을 시작하는 사람들은 언제나 같은 두려움에 맞선다. \'내가 해도 될까?\'라는 질문, 그리고 그 질문이 만들어내는 긴 망설임. 이OO 창업가는 그 망설임을 끝까지 붙들지 않기로 선택했다. 그가 말하는 건 완벽보다 중요한 것, 바로 시작 자체의 힘이다.',
      'fa-solid fa-quote-left text-ieumAmber', 1);
    await ins('i6', 'faq', '🎤 Interview', '', 'fa-solid fa-microphone text-indigo-400', 2, undefined, [
      {
        question: 'Q1. 창업을 결심하게 된 계기는 무엇이었나요?',
        answer: '"원래 안정적인 대기업에 다녔어요. 그런데 이상하게도 퇴근길만 되면 \'내가 매일 만드는 이 결과물이 나한테 어떤 의미일까?\'라는 질문이 떠나질 않았어요.\n\n\'완벽히 준비되면 그때 시작하자\'는 생각으로 몇 년을 미뤘는데, 결국 아무것도 달라진 게 없었어요. 그게 더 두려웠어요. 그래서 준비가 다 안 됐어도 그냥 시작했어요."'
      },
      {
        question: 'Q2. 창업 초기에는 어떤 어려움이 있었나요?',
        answer: '"\'부족한 나\'를 드러내야 하는 게 가장 힘들었어요. 처음 만들었던 베타 버전 서비스가 너무 조악해서, 시연할 때 민망할 정도였어요. 고객들도 솔직하게 피드백을 주셨고요.\n\n처음에는 매번 마음이 쿵 하고 내려앉았는데, 나중에는 \'그래도 이걸 써주는 사람이 있구나\'에 더 집중하기로 했어요. 그 작은 지지들이 없었다면 아마 포기했을 거예요."'
      },
      {
        question: 'Q3. 지금 운영 중인 서비스에 대해 소개해주세요.',
        answer: '"\'열심히\'보다는 \'지속가능하게\' 일하도록 돕는 생산성 툴이에요. 사람들이 매일의 루틴을 기록하고, 동료나 친구들과 작은 목표를 공유하며 서로 응원할 수 있게 설계했어요.\n\n처음에는 단순히 \'투두리스트 앱\'을 만들고 싶었는데, 사용자 인터뷰를 하다 보니 다들 \'일을 하는 방식\'에 지치고 있더라고요. 그래서 생산성 그 자체보다 \'일의 감정\'을 다루는 데 집중하게 됐어요."'
      },
      {
        question: 'Q4. 실패를 대하는 본인만의 태도가 있나요?',
        answer: '"저는 완벽한 답을 찾기 전에 일단 작게라도 시도하는 편이에요. \'이게 정말 맞을까?\'라는 고민은 끝이 없더라고요. 그래서 60%만 확신이 생기면 일단 실행해요.\n\n실패하면 최소한 \'이 길은 아니구나\'라는 학습은 얻잖아요. 그게 아무것도 안 하고 계속 머무르는 것보다는 훨씬 낫다고 생각해요."'
      },
      {
        question: 'Q5. 창업 과정에서 배운 가장 큰 교훈은 무엇이었나요?',
        answer: '"\'문제 정의를 절대 서두르지 말자\'는 거예요. 처음에는 그냥 \'이런 서비스가 있으면 좋겠다\'는 생각으로 시작했어요. 그런데 막상 사람들을 만나보니, 문제의 본질이 제가 처음 상상했던 것과 완전히 달랐어요.\n\n그래서 어떤 기능을 추가하기 전에 \'이게 누구의 어떤 어려움을 줄이는가\'를 정말 많이 묻고 또 묻습니다."'
      },
      {
        question: 'Q6. 앞으로 어떤 목표를 가지고 계신가요?',
        answer: '"일하는 방식을 바꾸고 싶어요. 더 이상 \'무조건 열심히\'가 미덕이 아닌 시대잖아요. 청년들이 과로와 번아웃에 스스로를 소모하지 않도록, 일에 대한 건강한 문화를 만드는 데 기여하고 싶어요.\n\n그리고 언젠가는 이 서비스가 한국뿐 아니라 다른 나라에서도 쓰이길 꿈꿉니다."'
      }
    ]);
    await ins('i6', 'quote',
      '이OO 창업가는 "늦게 시작하면 완벽해질 것"이라는 환상을 버리라고 말한다.',
      '불완전함에 익숙해지는 것. 그것이 새로운 시대의 창업가가 가져야 할 가장 중요한 태도일지도 모른다.',
      'fa-solid fa-circle text-gray-400', 3);
    await ins('i6', 'checklist', '💬 청년에게 전하는 말', '"불안해도 시작해보세요. 움직이는 동안에만 배울 수 있어요."', 'fa-solid fa-heart text-ieumAmber', 4, [
      '60%의 확신으로도 시작할 수 있어요 — 완벽한 준비를 기다리면 영원히 시작할 수 없어요. 절반의 확신이 생겼다면, 그게 이미 충분한 이유입니다.',
      '실패는 학습이에요 — 틀린 방향을 발견하는 것도 전진입니다. 아무것도 안 하고 멈춰있는 것보다, 시도하고 배우는 쪽이 훨씬 빠릅니다.',
      '문제 정의를 서두르지 마세요 — 무엇을 만들지보다, 누구의 어떤 문제를 해결하는지를 먼저 깊이 생각해보세요. 그 질문이 방향을 만들어요.'
    ]);
    console.log('✅ i6 done');

    console.log('🎉 All done!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await closeConnection();
    process.exit();
  }
}

run();
