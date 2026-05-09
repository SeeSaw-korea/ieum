import { executeQuery, closeConnection } from '../lib/database.js';

const projects = [
  {
    id: 'p3',
    title: '[프로젝트] 익명의 온도',
    description: '이름 없이, 관계 없이, 지금의 감정을 그대로 남길 수 있는 공간. 누구에게도 전하지 못했던 말을 익명으로 꺼내보는 작은 시도.',
    imageUrl: '/image/project-anon.jpg',
    deadline: '진행완료',
    tag: '완료',
    createdAt: '2025-09-01 00:00:00',
    sections: [
      {
        type: 'highlight',
        subtitle: '✅ 진행 완료 | 2025년 9월 12일 ~ 9월 14일 / 서울 성수동',
        body: '오프라인 편지 부스를 통해 186명이 참여하여 243통의 편지를 작성한 프로젝트입니다. 현장 평균 체류 시간은 약 12분이었습니다.',
        iconClass: 'fa-solid fa-circle-check text-green-500',
        extraData: null
      },
      {
        type: 'quote',
        subtitle: '사람들은 말하지 않는 것이 아니라, 말할 수 있는 방식이 없었을지도 모른다.',
        body: '\'익명의 온도\'는 이름 없이, 관계 없이, 지금의 감정을 그대로 남길 수 있는 공간을 만들기 위해 시작되었다. 누군가에게 전하지 못한 말, 스스로에게조차 정리하지 못했던 마음을 익명이라는 방식으로 꺼내보는 작은 시도였다.',
        iconClass: 'fa-solid fa-quote-left text-ieumAmber',
        extraData: null
      },
      {
        type: 'checklist',
        subtitle: '🧩 진행 방식',
        body: '',
        iconClass: 'fa-solid fa-list-check text-indigo-500',
        extraData: [
          '오프라인 편지 부스 설치 (성수동 팝업 공간)',
          '주제 없이 자유 작성',
          '일부 편지는 현장 전시, 일부는 랜덤 전달'
        ]
      },
      {
        type: 'checklist',
        subtitle: '🎯 프로젝트 결과',
        body: '',
        iconClass: 'fa-solid fa-chart-bar text-blue-500',
        extraData: [
          '총 참여자: 약 186명',
          '작성된 편지 수: 243통',
          '현장 체류 시간 평균: 약 12분'
        ]
      },
      {
        type: 'faq',
        subtitle: '💬 참여자 후기',
        body: '',
        iconClass: 'fa-solid fa-comment text-orange-400',
        faqData: [
          { question: '참여자 A', answer: '"누구한테도 말 못 했던 얘기를 처음 써봤어요. 이름 안 적어도 된다는 게 생각보다 큰 용기였어요."' },
          { question: '참여자 B', answer: '"그냥 지나가려다가 앉았는데, 쓰다 보니까 내가 이런 생각을 하고 있었구나 싶었어요."' },
          { question: '참여자 C', answer: '"누가 읽을지 모르는데도 이상하게 진짜 마음을 쓰게 되더라고요."' }
        ]
      }
    ]
  },
  {
    id: 'p4',
    title: '[프로젝트] 취향 교환소',
    description: '누군가의 취향을 경험하고, 나의 취향을 누군가에게 건네는 과정 속에서 서로를 이해하는 연결이 시작됩니다.',
    imageUrl: '/image/project-taste.jpg',
    deadline: '진행완료',
    tag: '완료',
    createdAt: '2025-10-01 00:00:00',
    sections: [
      {
        type: 'highlight',
        subtitle: '✅ 진행 완료 | 2025년 10월 3일 ~ 10월 24일 / 온라인 & 오프라인 혼합',
        body: '60명이 참여하여 30쌍이 매칭되었으며, 후기 제출률 87%를 기록한 프로젝트입니다.',
        iconClass: 'fa-solid fa-circle-check text-green-500',
        extraData: null
      },
      {
        type: 'quote',
        subtitle: '취향은 발견되는 것이 아니라 드러나는 것이다.',
        body: '\'취향 교환소\'는 "내가 좋아하는 게 맞는 걸까?"라는 멈춤을 깨기 위해 만들어진 프로젝트다. 누군가의 취향을 경험하고, 또 나의 취향을 누군가에게 건네는 과정 속에서 서로를 이해하는 연결이 시작된다.',
        iconClass: 'fa-solid fa-quote-left text-ieumAmber',
        extraData: null
      },
      {
        type: 'steps',
        subtitle: '🧩 진행 방식',
        body: '',
        iconClass: 'fa-solid fa-rotate text-indigo-500',
        extraData: [
          '참여자 사전 신청 (총 60명 선발)',
          '취향 카드 작성 (음악 / 공간 / 콘텐츠 등)',
          '1:1 랜덤 매칭',
          '상대 취향 직접 경험 후 기록 공유'
        ]
      },
      {
        type: 'checklist',
        subtitle: '🎯 프로젝트 결과',
        body: '',
        iconClass: 'fa-solid fa-chart-bar text-blue-500',
        extraData: [
          '참여자: 60명',
          '매칭 횟수: 30쌍',
          '후기 제출률: 87%'
        ]
      },
      {
        type: 'faq',
        subtitle: '💬 참여자 후기',
        body: '',
        iconClass: 'fa-solid fa-comment text-orange-400',
        faqData: [
          { question: '참여자 A', answer: '"남이 추천해준 걸 일부러 경험해본 건 처음이었어요. 생각보다 제 취향이 더 확실해졌어요."' },
          { question: '참여자 B', answer: '"제가 좋아하는 걸 설명하면서 처음으로 \'이걸 왜 좋아하지?\'를 생각해봤어요."' },
          { question: '참여자 C', answer: '"이게 별거 아닌 것 같았는데, 나를 설명하는 연습 같았어요."' }
        ]
      }
    ]
  },
  {
    id: 'p5',
    title: '[프로젝트] 같이 버티는 공간',
    description: '결과를 공유하기보다 과정을 함께 버티는 경험에 집중한 프로젝트. 같은 공간에서 각자의 일을 하며 서로의 존재로 지속할 수 있는 환경.',
    imageUrl: '/image/project-together.jpg',
    deadline: '진행완료',
    tag: '완료',
    createdAt: '2025-11-01 00:00:00',
    sections: [
      {
        type: 'highlight',
        subtitle: '✅ 진행 완료 | 2025년 11월 18일 ~ 11월 22일 / 서울 합정',
        body: '28명이 참여하여 하루 평균 5시간 이상 체류했으며, 재참여 의사가 92%에 달한 프로젝트입니다.',
        iconClass: 'fa-solid fa-circle-check text-green-500',
        extraData: null
      },
      {
        type: 'quote',
        subtitle: '환경은 생각보다 많은 것을 바꾼다.',
        body: '\'같이 버티는 공간\'은 결과를 공유하기보다 과정을 함께 버티는 경험에 집중한 프로젝트다. 같은 공간에서 각자의 일을 하며 서로의 존재만으로도 지속할 수 있는 환경을 만들고자 했다.',
        iconClass: 'fa-solid fa-quote-left text-ieumAmber',
        extraData: null
      },
      {
        type: 'checklist',
        subtitle: '🧩 진행 방식',
        body: '',
        iconClass: 'fa-solid fa-list-check text-indigo-500',
        extraData: [
          '5일간 오프라인 공동 작업 공간 운영',
          '참여자: 취준생 / 창작자 / 프리랜서 혼합 구성',
          '하루 1회 짧은 목표 공유',
          '자유 작업 (강제 프로그램 없음)'
        ]
      },
      {
        type: 'checklist',
        subtitle: '🎯 프로젝트 결과',
        body: '',
        iconClass: 'fa-solid fa-chart-bar text-blue-500',
        extraData: [
          '참여자: 28명',
          '평균 체류 시간: 하루 5시간 이상',
          '재참여 의사: 92%'
        ]
      },
      {
        type: 'faq',
        subtitle: '💬 참여자 후기',
        body: '',
        iconClass: 'fa-solid fa-comment text-orange-400',
        faqData: [
          { question: '참여자 A', answer: '"아무 말 안 해도 누가 옆에서 계속 하고 있다는 게 힘이 됐어요."' },
          { question: '참여자 B', answer: '"혼자 집에서 할 때보다 훨씬 덜 불안했어요."' },
          { question: '참여자 C', answer: '"이상하게 여기 오면 계속 해도 될 것 같은 느낌이 들어요."' }
        ]
      }
    ]
  }
];

async function addPastProjects() {
  try {
    console.log('Starting...');

    for (const proj of projects) {
      // Delete if exists
      const secs = await executeQuery<any>(
        'SELECT id FROM content_detailed_sections WHERE content_id = ?', [proj.id]
      );
      for (const sec of secs) {
        await executeQuery('DELETE FROM section_progress_data WHERE section_id = ?', [sec.id]);
        await executeQuery('DELETE FROM section_extra_data WHERE section_id = ?', [sec.id]);
        await executeQuery('DELETE FROM section_faq_data WHERE section_id = ?', [sec.id]);
      }
      await executeQuery('DELETE FROM content_detailed_sections WHERE content_id = ?', [proj.id]);
      await executeQuery('DELETE FROM content_detail_images WHERE content_id = ?', [proj.id]);
      await executeQuery('DELETE FROM contents WHERE id = ?', [proj.id]);

      // Insert content with older created_at so it appears last
      await executeQuery(`
        INSERT INTO contents (id, title, category, description, image_url, deadline, tag, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        proj.id, proj.title, '프로젝트', proj.description,
        proj.imageUrl, proj.deadline, proj.tag,
        proj.createdAt, proj.createdAt
      ]);

      // Insert sections
      for (let i = 0; i < proj.sections.length; i++) {
        const s = proj.sections[i];
        const result = (await executeQuery<any>(`
          INSERT INTO content_detailed_sections (content_id, type, subtitle, body, icon_class, sort_order)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [proj.id, s.type, s.subtitle, s.body, s.iconClass, i + 1])) as any;

        const sectionId = result.insertId;

        if (s.extraData) {
          for (let j = 0; j < s.extraData.length; j++) {
            await executeQuery(
              'INSERT INTO section_extra_data (section_id, data_text, sort_order) VALUES (?, ?, ?)',
              [sectionId, s.extraData[j], j + 1]
            );
          }
        }

        if ((s as any).faqData) {
          const faqData = (s as any).faqData;
          for (let j = 0; j < faqData.length; j++) {
            await executeQuery(
              'INSERT INTO section_faq_data (section_id, question, answer, sort_order) VALUES (?, ?, ?, ?)',
              [sectionId, faqData[j].question, faqData[j].answer, j + 1]
            );
          }
        }
      }

      console.log(`✅ Inserted ${proj.id}: ${proj.title}`);
    }

    console.log('🎉 All done!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await closeConnection();
    process.exit();
  }
}

addPastProjects();
