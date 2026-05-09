import { executeQuery, closeConnection } from '../lib/database.js';

async function insertSection(contentId: string, type: string, subtitle: string, body: string, iconClass: string, sortOrder: number, extraData?: string[], faqData?: {question: string, answer: string}[]) {
  const result = (await executeQuery<any>(`
    INSERT INTO content_detailed_sections (content_id, type, subtitle, body, icon_class, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [contentId, type, subtitle, body, iconClass, sortOrder])) as any;

  const sectionId = result.insertId;

  if (extraData) {
    for (let j = 0; j < extraData.length; j++) {
      await executeQuery('INSERT INTO section_extra_data (section_id, data_text, sort_order) VALUES (?, ?, ?)', [sectionId, extraData[j], j + 1]);
    }
  }
  if (faqData) {
    for (let j = 0; j < faqData.length; j++) {
      await executeQuery('INSERT INTO section_faq_data (section_id, question, answer, sort_order) VALUES (?, ?, ?, ?)', [sectionId, faqData[j].question, faqData[j].answer, j + 1]);
    }
  }
}

async function prependCompletionSection(id: string, dateText: string, desc: string) {
  await executeQuery('UPDATE content_detailed_sections SET sort_order = sort_order + 1 WHERE content_id = ?', [id]);
  await insertSection(id, 'highlight', `✅ 진행 완료 | ${dateText}`, desc, 'fa-solid fa-circle-check text-green-500', 1);
  await executeQuery("UPDATE contents SET deadline = '진행완료' WHERE id = ?", [id]);
}

async function clearSections(id: string) {
  const secs = await executeQuery<any>('SELECT id FROM content_detailed_sections WHERE content_id = ?', [id]);
  for (const s of secs) {
    await executeQuery('DELETE FROM section_progress_data WHERE section_id = ?', [s.id]);
    await executeQuery('DELETE FROM section_extra_data WHERE section_id = ?', [s.id]);
    await executeQuery('DELETE FROM section_faq_data WHERE section_id = ?', [s.id]);
  }
  await executeQuery('DELETE FROM content_detailed_sections WHERE content_id = ?', [id]);
}

async function run() {
  try {
    console.log('Starting campaign update...');

    // ── c2: 단체 대신 알려드립니다 (진행중 유지, 섹션 보강) ──
    await clearSections('c2');
    await insertSection('c2', 'quote', '좋은 활동을 해도 잘 알려지지 않습니다.', '사회 곳곳에서 목소리를 내기 어려운 훌륭한 단체들이 있습니다. 긍정적인 활동을 하고 있음에도 홍보할 여력이 없는 경우가 많죠. 그래서 청년들이 직접 펜을 들었습니다.', 'fa-solid fa-quote-left text-ieumAmber', 1);
    await insertSection('c2', 'progress', '우리가 조명한 사회의 불빛', '지금까지 숨겨진 보석 같은 단체들을 발굴해 세상에 알렸습니다.', 'fa-solid fa-bullhorn text-orange-500', 2);
    await executeQuery(`INSERT INTO section_progress_data (section_id, current_value, target_value, label) VALUES (LAST_INSERT_ID(), 42, 100, '홍보 지원 단체 발굴 달성률')`);
    await insertSection('c2', 'steps', '어떤 과정으로 홍보가 진행되나요?', '단체 발굴부터 콘텐츠 기획, SNS 배포까지 전 과정을 청년의 시각으로 재탄생시킵니다.', 'fa-solid fa-pen-nib text-indigo-500', 3, ['도움이 필요한 소규모 사회단체 발굴 및 활동 취재', '청년 눈높이에 맞춘 카드뉴스 및 숏폼 기획', 'SNS 릴레이 배포 및 응원 해시태그 대확산']);
    await insertSection('c2', 'checklist', '이런 분들을 확성기로 모십니다!', '글쓰기나 디자인을 몰라도 괜찮습니다. 따뜻한 마음만 있으면 충분합니다.', 'fa-solid fa-microphone-lines text-red-400', 4, ['사회 복지, 환경 문제 등에 관심 많은 청년', '카드뉴스·숏폼 콘텐츠에 흥미를 느끼는 분', '협업의 가치를 배우고 싶은 분']);
    await insertSection('c2', 'faq', '자주 묻는 질문', '', 'fa-solid fa-circle-question text-green-500', 5, undefined, [
      { question: '지원할 수 있는 단체의 기준이 있나요?', answer: '상근 인력 5인 미만이거나 홍보 예산이 없는 공익 목적의 소규모 단체를 최우선으로 지원합니다.' },
      { question: '글솜씨가 없는데 참여 가능한가요?', answer: '전혀 문제없습니다! 콘텐츠를 자신의 SNS에 공유(리포스팅)하는 것만으로도 훌륭한 역할이 됩니다.' }
    ]);
    console.log('✅ c2 done');

    // ── c3: 청년 ON Project → 진행완료 2025.03 ──────────────
    await clearSections('c3');
    await prependCompletionSection('c3', '2025년 3월 1일 ~ 3월 31일', '청년 ON Project는 2025년 3월 한 달간 진행되었으며, 총 25개의 소모임이 성공적으로 운영되었습니다.');
    await insertSection('c3', 'quote', '진정한 온기는 만남 속에서 피어납니다.', '동시대를 살아가는 청년들이 평소 하고 싶었던 이야기, 나누고 싶었던 고민들. 온라인의 짧은 글을 넘어 오프라인에서 진짜 대화를 나눌 수 있는 따뜻한 기회를 마련했습니다.', 'fa-solid fa-users text-blue-400', 2);
    await insertSection('c3', 'progress', '함께 켜진 온기의 스위치', '운영된 소모임들의 숫자입니다.', 'fa-solid fa-face-laugh-squint text-orange-500', 3);
    await executeQuery(`INSERT INTO section_progress_data (section_id, current_value, target_value, label) VALUES (LAST_INSERT_ID(), 25, 50, '소모임 개설 달성률')`);
    await insertSection('c3', 'checklist', '소모임 지원 내역', '참여자들의 빛나는 기획을 현실로 만들어드렸습니다.', 'fa-solid fa-gift text-red-500', 4, ['오프라인 모임 공간 대여 지원', '다과비 및 게스트 초청 예산 최대 30만원 지원', '전담 매니저 매칭']);
    await insertSection('c3', 'faq', '자주 묻는 질문', '', 'fa-solid fa-circle-question text-amber-500', 5, undefined, [
      { question: '1회성 모임도 지원받을 수 있었나요?', answer: '네, 가능했습니다! 3회 이상 정기모임의 경우 우선 배정 혜택을 드렸습니다.' },
      { question: '최소 모집 인원 기준이 있었나요?', answer: '호스트 제외 최소 3인 이상이 모였을 때부터 정식 소모임 지원이 시작되었습니다.' }
    ]);
    console.log('✅ c3 done');

    // ── c4: 1일 활동가 체험 → 진행완료 2025.05 ──────────────
    await clearSections('c4');
    await prependCompletionSection('c4', '2025년 5월 1일 ~ 5월 31일', '1일 활동가 체험 캠페인은 2025년 5월 한 달간 진행되었으며, 다양한 분야의 사회단체에서 총 74명의 청년이 체험에 참여했습니다.');
    await insertSection('c4', 'quote', '나도 활동가처럼 살아보고 싶은데... 가능할까?', '참여할 기회가 적거나 어렵게 느껴졌던 청년들을 위해 준비했어요. 사회단체 활동, 더 이상 막연하고 멀게 느끼지 않아도 됩니다.', 'fa-solid fa-person-hiking text-green-600', 2);
    await insertSection('c4', 'highlight', '☀️ 단 하루, 세상을 바꾸는 쪽으로 걸어보기', '환경, 인권, 청소년, 노동 등 다양한 분야의 사회단체에서 1일 활동가로 참여했어요. 그 뜻깊은 하루가 인생의 방향을 긍정적으로 바꾸는 시작이 되었습니다.', 'fa-solid fa-sun text-yellow-500', 3);
    await insertSection('c4', 'checklist', '🎯 활동 결과', '', 'fa-solid fa-chart-bar text-blue-500', 4, ['총 참여 청년: 74명', '참여 사회단체: 12곳', '체험 분야: 환경 / 인권 / 청소년 / 노동 / 문화']);
    await insertSection('c4', 'steps', '이런 경험들을 함께했습니다', '단 하루 동안의 깊이 있는 체험과 만남을 통해 청년과 단체가 가까워졌습니다.', 'fa-solid fa-shoe-prints text-indigo-400', 5, ['관심 분야 사회단체 선택 및 1일 체험 매칭 신청', '현장에서 활동가와 함께 직접 업무를 돕고 실천 경험', '체험 후 내가 가진 가치와 사회문제의 연결점 회고 네트워킹 진행']);
    await insertSection('c4', 'faq', '참여자 후기', '', 'fa-solid fa-comment text-orange-400', 6, undefined, [
      { question: '참여자 A', answer: '"하루였는데 이렇게 많은 걸 느낄 수 있는지 몰랐어요. 진로에 대한 생각이 달라졌습니다."' },
      { question: '참여자 B', answer: '"활동가분들이 얼마나 열심히 하시는지 직접 보니까 존경스러웠어요. 저도 뭔가 하고 싶어졌어요."' }
    ]);
    console.log('✅ c4 done');

    // ── c5: 단체 한입 소개소 → 진행완료 2025.07 ─────────────
    await clearSections('c5');
    await prependCompletionSection('c5', '2025년 7월 1일 ~ 7월 31일', '단체 한입 소개소는 2025년 7월 온라인으로 진행되었으며, 총 38개 단체를 한입 크기로 소개하는 콘텐츠가 제작되었습니다.');
    await insertSection('c5', 'quote', '사회단체를 알고 싶은데, 너무 어렵고 복잡해요.', '무수한 단체들 중 나에게 맞는 곳을 찾기 막막하셨나요? 진입장벽을 낮추기 위해 직관적이고 유쾌한 한입 크기 전시를 제안합니다.', 'fa-solid fa-cookie-bite text-amber-500', 2);
    await insertSection('c5', 'highlight', '🏛️ 알기 쉬운 하이브리드 사회단체 전시회', '짧은 숏폼 영상, 재치 있는 카드뉴스, 명료한 한 줄 설명으로 단체의 핵심을 한입에 알아볼 수 있도록 보여드렸습니다.', 'fa-solid fa-building-columns text-indigo-500', 3);
    await insertSection('c5', 'checklist', '🎯 활동 결과', '', 'fa-solid fa-chart-bar text-blue-500', 4, ['소개된 단체 수: 38곳', '콘텐츠 총 조회수: 약 12,000회', '콘텐츠 형식: 카드뉴스 / 숏폼 영상 / 한 줄 소개']);
    await insertSection('c5', 'checklist', '이런 분들을 위한 전시였습니다', '사회단체를 쉽게 이해하고 연결고리를 찾길 원하는 청년들을 환영했습니다.', 'fa-solid fa-magnifying-glass text-green-500', 5, ['공익활동에 관심은 많으나 어떻게 접근할지 막막했던 분', '보고서 대신 숏폼과 시각자료로 정보를 얻고 싶은 분', '가치관에 맞는 활동 단체를 발견하고 싶은 분']);
    console.log('✅ c5 done');

    // ── c6: 청년 공익제안 Challenge → 진행완료 2025.08 ───────
    await clearSections('c6');
    await prependCompletionSection('c6', '2025년 8월 1일 ~ 8월 31일', '청년 공익제안 Challenge는 2025년 8월 한 달간 진행되었으며, 총 51건의 공익 제안이 접수되어 17건이 사회단체와 매칭되었습니다.');
    await insertSection('c6', 'quote', '문제가 보이는데... 왜 아무도 나서지 않을까?', '우리 동네, 우리 사회의 불편하고 시급한 문제를 그저 보고만 있을 수 없던 청년들을 위해 이 캠페인이 기획되었습니다.', 'fa-solid fa-lightbulb text-yellow-500', 2);
    await insertSection('c6', 'highlight', '😀 내가 제안하고, 단체와 함께 바꾼다', '청년이 지역과 사회 문제를 직접 발굴해 제안하면, 전문 사회단체와 1:1로 매칭됩니다. 속으로만 생각하던 아쉬움이 훌륭한 기획으로 탄생했습니다.', 'fa-regular fa-face-smile text-orange-400', 3);
    await insertSection('c6', 'checklist', '🎯 활동 결과', '', 'fa-solid fa-chart-bar text-blue-500', 4, ['접수된 공익 제안: 51건', '사회단체 매칭 성사: 17건', '실행 진행 프로젝트: 9건']);
    await insertSection('c6', 'steps', '청년 공익 실험의 여정', '단순 제보자가 아닌, 아이디어의 공동 실행자가 되어 변화를 실현했습니다.', 'fa-solid fa-seedling text-green-500', 5, ['우리 주변의 작지만 의미 있는 사회 문제 제안서 작성', '해당 분야 사회단체 매칭 및 실행 플랜 수립', '함께 계획한 프로젝트를 행동으로 옮겨 변화 확인']);
    await insertSection('c6', 'faq', '참여자 후기', '', 'fa-solid fa-comment text-orange-400', 6, undefined, [
      { question: '참여자 A', answer: '"평소에 불편하다고만 생각했던 걸 실제로 제안할 수 있다는 게 신기했어요. 단체랑 연결까지 되니까 진짜 뭔가 바뀔 것 같았습니다."' },
      { question: '참여자 B', answer: '"제 아이디어가 실제 프로젝트가 된다는 게 믿기지 않았어요. 청년도 사회를 바꿀 수 있다는 걸 느꼈습니다."' }
    ]);
    console.log('✅ c6 done');

    // ── c7: 익명 편지 프로젝트 → 진행완료 2025.10 ────────────
    await clearSections('c7');
    await prependCompletionSection('c7', '2025년 10월 1일 ~ 10월 31일', '익명 편지 프로젝트는 2025년 10월 한 달간 진행되었으며, 총 312통의 편지가 모여 오프라인 전시로 마무리되었습니다.');
    await insertSection('c7', 'quote', '관계는 많지만 정작 외롭습니다.', '말하지 못한 말들은 마음 속에 흩어져 있습니다. 사람과 사람 사이에 잃어버린 감정의 온기를 회복하기 위해, 미처 전하지 못했던 말들을 모아보는 프로젝트였습니다.', 'fa-solid fa-envelope-open-text text-indigo-400', 2);
    await insertSection('c7', 'highlight', '💌 말하지 못했던 그 마음을, 익명으로 전합니다', '오프라인 공간에 마련된 우체통에서 누군가를 향한 고마움, 미안함, 그리움, 응원의 감정을 남겨주세요. 익명이지만 그 안에 담긴 감정만큼은 진실한 순간이 되었습니다.', 'fa-solid fa-heart text-red-400', 3);
    await insertSection('c7', 'checklist', '🎯 활동 결과', '', 'fa-solid fa-chart-bar text-blue-500', 4, ['수집된 편지: 312통', '전시 관람객: 약 520명', '전시 기간: 2025년 11월 1일 ~ 11월 7일 (오프라인 전시)']);
    await insertSection('c7', 'faq', '이음의 공익 철학', '우리는 왜 정보가 아닌 마음을 나눌까요?', 'fa-solid fa-circle-question text-purple-400', 5, undefined, [
      { question: '왜 편지를 남기는 프로젝트를 기획했나요?', answer: '우리 사회는 많은 문제를 인지하지만, 서로에게 온기를 건네는 일에는 갈수록 인색해지고 있습니다. \'정보\'가 아닌 \'감정\'의 연결을 통해 잃어버렸던 사회적 감각을 회복하고자 했습니다.' },
      { question: '익명으로 적으면 대상에게 전달이 되나요?', answer: '수신자에게 보내기 위한 목적보다는, 익명이 보장된 안전한 공간에서 억눌린 감정을 표출하고, 그것들이 모인 전시를 통해 집단적인 위로와 순환을 이끌어내는 취지입니다.' }
    ]);
    await insertSection('c7', 'faq', '참여자 후기', '', 'fa-solid fa-comment text-orange-400', 6, undefined, [
      { question: '참여자 A', answer: '"누가 읽을지도 모르는데 진짜 마음을 쓰게 됐어요. 이상하게 쓰고 나서 마음이 가벼워졌습니다."' },
      { question: '참여자 B', answer: '"전시에서 다른 사람들의 편지를 읽으면서 혼자가 아니라는 걸 느꼈어요."' }
    ]);
    console.log('✅ c7 done');

    console.log('🎉 All campaigns updated!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await closeConnection();
    process.exit();
  }
}

run();
