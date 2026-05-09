import { executeQuery, closeConnection } from '../lib/database.js';

async function updateProjects() {
  try {
    console.log('Starting project update...');

    // Delete p1 and p2 related data
    for (const id of ['p1', 'p2']) {
      // Get section IDs first
      const sections = await executeQuery<any>(
        'SELECT id FROM content_detailed_sections WHERE content_id = ?', [id]
      );
      for (const section of sections) {
        await executeQuery('DELETE FROM section_progress_data WHERE section_id = ?', [section.id]);
        await executeQuery('DELETE FROM section_extra_data WHERE section_id = ?', [section.id]);
        await executeQuery('DELETE FROM section_faq_data WHERE section_id = ?', [section.id]);
      }
      await executeQuery('DELETE FROM content_detailed_sections WHERE content_id = ?', [id]);
      await executeQuery('DELETE FROM content_detail_images WHERE content_id = ?', [id]);
      await executeQuery('DELETE FROM contents WHERE id = ?', [id]);
      console.log(`✅ Deleted ${id}`);
    }

    // Insert new project p1
    await executeQuery(`
      INSERT INTO contents (id, title, category, description, image_url, deadline, tag)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      'p1',
      '[프로젝트] "함께해야 가능한 연결" 아이디어 공모전 2회',
      '프로젝트',
      '장애와 비장애인이 함께 만드는 미래, 사회적 밸런스를 실현하는 아이디어를 제안하는 공모전입니다. (분야: 기술 / 문화 / 교육)',
      '/image/contest-card.png',
      'D-6',
      '공모전'
    ]);
    console.log('✅ Inserted new p1');

    // Insert detail image for p1
    await executeQuery(
      'INSERT INTO content_detail_images (content_id, image_url, sort_order) VALUES (?, ?, ?)',
      ['p1', '/image/contest-poster.png', 1]
    );
    console.log('✅ Inserted detail image for p1');

    // Insert detailed sections for p1
    const sections = [
      {
        type: 'quote',
        subtitle: '장애를 \'도움의 대상\'이 아닌, 다른 방식의 경험으로 바라봅니다.',
        body: '본 공모전은 비장애인도 함께 참여하고 싶어지는 자연스러운 연결 구조를 만드는 아이디어를 제안하는 공모전입니다. 단순한 기능 제안이 아닌, 사람과 사람을 연결하는 구조 설계를 지향합니다.',
        iconClass: 'fa-solid fa-quote-left text-ieumAmber',
        extraData: null, faqData: null, progressData: null
      },
      {
        type: 'highlight',
        subtitle: '■ 공모 주제',
        body: '장애와 비장애인이 함께 만드는 미래\n사회적 밸런스를 실현하는 아이디어 제안\n(분야: 기술 / 문화 / 교육)',
        iconClass: 'fa-solid fa-lightbulb text-yellow-500',
        extraData: null, faqData: null, progressData: null
      },
      {
        type: 'checklist',
        subtitle: '■ 지원 자격 및 모집 기간',
        body: '서울 및 고양시 거주 20대 청년이라면 누구나 참여 가능합니다. 개인 또는 팀 참여 모두 환영합니다.',
        iconClass: 'fa-solid fa-user-check text-blue-500',
        extraData: [
          '지원 자격: 서울 및 고양시 거주 20대 청년 (개인 또는 팀 참여 가능)',
          '모집 기간: 2026년 3월 1일(화) ~ 4월 24일(금)',
          '지원 방법: 공식 홈페이지 접속 후 아이디어 직접 입력 및 제출'
        ],
        faqData: null, progressData: null
      },
      {
        type: 'steps',
        subtitle: '■ 활동 내용',
        body: '기술, 문화, 교육 분야 중 하나를 선택하여 사회적 연결을 기반으로 한 구조 설계 아이디어를 기획하고 제출합니다.',
        iconClass: 'fa-solid fa-pen-nib text-indigo-500',
        extraData: [
          '기술 / 문화 / 교육 분야 중 선택하여 아이디어 기획',
          '사회적 연결을 기반으로 한 구조 설계',
          '제출된 아이디어를 기반으로 평가 진행'
        ],
        faqData: null, progressData: null
      },
      {
        type: 'checklist',
        subtitle: '■ 활동 혜택',
        body: '우수 아이디어 참가자에게는 실질적인 커리어 성장 기회를 제공합니다.',
        iconClass: 'fa-solid fa-gift text-red-500',
        extraData: [
          '연계 기업 인턴십 기회 제공',
          '대기업 출신 멘토링 지원',
          '아이디어 실현 가능성 검토 및 네트워크 연결'
        ],
        faqData: null, progressData: null
      },
      {
        type: 'checklist',
        subtitle: '■ 시상 내역',
        body: '우수한 아이디어를 제안한 팀에게 시상과 함께 다양한 기회를 제공합니다.',
        iconClass: 'fa-solid fa-trophy text-yellow-500',
        extraData: [
          '최우수상: 200만원 + 인턴십 기회 제공',
          '우수상: 100만원 + 대기업 출신 멘토링',
          '장려상: 대기업 출신 멘토링'
        ],
        faqData: null, progressData: null
      }
    ];

    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      const result = (await executeQuery<any>(`
        INSERT INTO content_detailed_sections (content_id, type, subtitle, body, icon_class, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `, ['p1', s.type, s.subtitle, s.body, s.iconClass, i + 1])) as any;

      const sectionId = result.insertId;

      if (s.extraData) {
        for (let j = 0; j < s.extraData.length; j++) {
          await executeQuery(
            'INSERT INTO section_extra_data (section_id, data_text, sort_order) VALUES (?, ?, ?)',
            [sectionId, s.extraData[j], j + 1]
          );
        }
      }
    }

    console.log('✅ Inserted sections for p1');

    // ── p2: 이음 손편지 프로젝트 ──────────────────────────────

    // Delete p2 if exists (clean re-run)
    const p2Sections = await executeQuery<any>(
      'SELECT id FROM content_detailed_sections WHERE content_id = ?', ['p2']
    );
    for (const sec of p2Sections) {
      await executeQuery('DELETE FROM section_progress_data WHERE section_id = ?', [sec.id]);
      await executeQuery('DELETE FROM section_extra_data WHERE section_id = ?', [sec.id]);
      await executeQuery('DELETE FROM section_faq_data WHERE section_id = ?', [sec.id]);
    }
    await executeQuery('DELETE FROM content_detailed_sections WHERE content_id = ?', ['p2']);
    await executeQuery('DELETE FROM content_detail_images WHERE content_id = ?', ['p2']);
    await executeQuery('DELETE FROM contents WHERE id = ?', ['p2']);

    // Insert p2
    await executeQuery(`
      INSERT INTO contents (id, title, category, description, image_url, deadline, tag)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      'p2',
      '[프로젝트] 이음 손편지 프로젝트',
      '프로젝트',
      '당신의 작은 손편지 한 장이 전장의 영웅에게 따뜻한 위로와 10만 원의 후원금이 됩니다.',
      '/image/letter-project.jpeg',
      '~ 4월 30일',
      '손편지'
    ]);
    console.log('✅ Inserted p2');

    const p2Sections2 = [
      {
        type: 'quote',
        subtitle: '20대의 일상이 빚어낸 10만 원의 기적',
        body: '지금 우리가 누리는 평범한 일상, 노트북 앞의 커피 한 잔과 도서관에서의 여유는 70년 전, 같은 20대를 전장에서 보낸 영웅들의 희생으로 만들어졌습니다.',
        iconClass: 'fa-solid fa-quote-left text-ieumAmber',
        extraData: null
      },
      {
        type: 'highlight',
        subtitle: '✉️ 손편지 한 장이 10만 원의 후원금이 됩니다',
        body: '청년들의 따뜻한 마음을 담은 손편지 한 장이 모이면, 기업은 그 정성을 10만 원의 후원금으로 바꾸어 참전용사에게 전달합니다. 이것은 단순한 후원을 넘어, 세대를 잇는 감사의 표시이자 참전용사에 대한 지속적인 지원 구조를 만드는 첫걸음입니다.',
        iconClass: 'fa-solid fa-envelope-open-text text-blue-500',
        extraData: null
      },
      {
        type: 'checklist',
        subtitle: '■ 프로젝트 정보',
        body: '참전용사들이 겪는 현실적 어려움을 해결하기 위해 이음가 직접 기획한 프로젝트입니다.',
        iconClass: 'fa-solid fa-list-check text-green-500',
        extraData: [
          '후원 대상: 6.25 참전용사',
          '후원 규모: 손편지 1장당 10만 원',
          '참여 기간: ~ 4월 30일까지'
        ]
      },
      {
        type: 'steps',
        subtitle: '■ 참여 방법',
        body: '어렵지 않아요. 따뜻한 마음 한 줄이면 충분합니다.',
        iconClass: 'fa-solid fa-pen-nib text-indigo-500',
        extraData: [
          '참전용사에게 감사의 마음을 담은 손편지 작성',
          '이음 홈페이지 또는 SNS를 통해 제출',
          '손편지 1장당 기업이 10만 원 후원금으로 전환하여 전달'
        ]
      },
      {
        type: 'checklist',
        subtitle: '■ 참여 혜택',
        body: '참여하신 분들께 특별한 리워드를 드립니다.',
        iconClass: 'fa-solid fa-gift text-red-500',
        extraData: [
          '참전용사 직접 후원 및 감사 전달의 보람',
          '프로젝트 한정판 "꽃무늬 키캡" 리워드 증정'
        ]
      }
    ];

    for (let i = 0; i < p2Sections2.length; i++) {
      const s = p2Sections2[i];
      const result = (await executeQuery<any>(`
        INSERT INTO content_detailed_sections (content_id, type, subtitle, body, icon_class, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `, ['p2', s.type, s.subtitle, s.body, s.iconClass, i + 1])) as any;

      const sectionId = result.insertId;

      if (s.extraData) {
        for (let j = 0; j < s.extraData.length; j++) {
          await executeQuery(
            'INSERT INTO section_extra_data (section_id, data_text, sort_order) VALUES (?, ?, ?)',
            [sectionId, s.extraData[j], j + 1]
          );
        }
      }
    }

    console.log('✅ Inserted sections for p2');
    console.log('🎉 Update completed!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await closeConnection();
    process.exit();
  }
}

updateProjects();
