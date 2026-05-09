import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type ResultType = 
  | '조직을 이끄는 전략적 지도자형'
  | '민중을 깨우는 불꽃 같은 실천가형'
  | '결정적 순간을 위해 준비하는 결단형'
  | '조용히 모든 것을 바치는 헌신형';

const QUESTIONS = [
  {
    id: 1,
    text: "1919년, 만세 운동의 계획을 들은 당신의 첫 반응은?",
    options: [
      { text: "은밀히 자금을 모아 실행을 준비한다", score: { '조직을 이끄는 전략적 지도자형': 2, '결정적 순간을 위해 준비하는 결단형': 1 } },
      { text: "가장 앞장서서 사람들을 불러모은다", score: { '민중을 깨우는 불꽃 같은 실천가형': 2, '조직을 이끄는 전략적 지도자형': 1 } }
    ]
  },
  {
    id: 2,
    text: "일본 경찰의 감시가 강화된 상황, 당신의 행동은?",
    options: [
      { text: "신분을 감추고 조용히 후원을 이어간다", score: { '조용히 모든 것을 바치는 헌신형': 2, '결정적 순간을 위해 준비하는 결단형': 1 } },
      { text: "새로운 아지트를 찾아 동지들을 규합한다", score: { '조직을 이끄는 전략적 지도자형': 2, '민중을 깨우는 불꽃 같은 실천가형': 1 } }
    ]
  },
  {
    id: 3,
    text: "독립 선언문을 배포해야 할 때 당신의 역할은?",
    options: [
      { text: "안전한 배포 경로와 타이밍을 계산한다", score: { '결정적 순간을 위해 준비하는 결단형': 2, '조직을 이끄는 전략적 지도자형': 1 } },
      { text: "위험을 감수하고 직접 거리에 뿌리며 외친다", score: { '민중을 깨우는 불꽃 같은 실천가형': 2, '조용히 모든 것을 바치는 헌신형': 1 } }
    ]
  }
];

const ProjectTest: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: intro, 1~3: qs, 4: calculating, 5: result
  const [scores, setScores] = useState<Record<string, number>>({
    '조직을 이끄는 전략적 지도자형': 0,
    '민중을 깨우는 불꽃 같은 실천가형': 0,
    '결정적 순간을 위해 준비하는 결단형': 0,
    '조용히 모든 것을 바치는 헌신형': 0,
  });

  const handleStart = () => setStep(1);

  const handleAnswer = (optionScore: Record<string, number>) => {
    const newScores = { ...scores };
    Object.keys(optionScore).forEach(key => {
      newScores[key] += optionScore[key];
    });
    setScores(newScores);

    if (step < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      setStep(4);
      setTimeout(() => setStep(5), 1500); // 1.5s delay for effect
    }
  };

  const getMatchedResult = (): ResultType => {
    let maxObj = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    return maxObj as ResultType;
  };

  return (
    <div className="min-h-screen bg-ieumCream animate-fadeIn flex flex-col pb-20">
      <header className="sticky top-0 bg-ieumCream/90 backdrop-blur-md px-5 py-4 flex justify-between items-center z-10">
        <button onClick={step === 5 ? () => navigate('/') : onBack} className="p-1">
          <i className="fa-solid fa-xmark text-xl text-gray-800"></i>
        </button>
      </header>

      {/* Intro Step */}
      {step === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
          <div className="text-6xl mb-6">🔥</div>
          <h1 className="text-2xl font-bold text-ieumDark mb-4 leading-tight">나는 어떤<br/>독립운동가 유형일까?</h1>
          <p className="text-gray-500 mb-10 text-sm">1900년대 격동의 시대로 돌아가<br/>당신의 가치관과 선택을 확인해보세요.</p>
          <button 
            onClick={handleStart}
            className="w-full bg-ieumAmber text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-ieumGold transition-all transform active:scale-95"
          >
            테스트 시작하기
          </button>
        </div>
      )}

      {/* Questions Step */}
      {step > 0 && step <= QUESTIONS.length && (
        <div className="flex-1 flex flex-col p-6 animate-fadeIn">
          <div className="mb-8">
            <div className="flex justify-between text-xs text-gray-400 font-bold mb-2">
              <span>진행률</span>
              <span>{step} / {QUESTIONS.length}</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-ieumAmber h-full transition-all duration-300" 
                style={{ width: `${(step / QUESTIONS.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-ieumDark mb-10 leading-relaxed text-center mt-10">
            {QUESTIONS[step - 1].text}
          </h2>

          <div className="space-y-4 w-full mt-auto mb-10">
            {QUESTIONS[step - 1].options.map((opt, idx) => (
              <button 
                key={idx}
                onClick={() => handleAnswer(opt.score)}
                className="w-full bg-white border border-ieumLight p-5 rounded-xl text-left shadow-sm hover:border-ieumAmber hover:shadow-md transition-all active:bg-gray-50 text-[15px] font-medium text-gray-800"
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading Step */}
      {step === 4 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-ieumAmber mb-4"></i>
          <p className="font-bold text-gray-700 animate-pulse">당신의 선택을 분석하고 있습니다...</p>
        </div>
      )}

      {/* Result Step */}
      {step === 5 && (
        <div className="flex-1 flex flex-col p-6 animate-fadeIn overflow-y-auto">
          <div className="text-center mt-10 mb-8">
            <h3 className="text-gray-500 font-bold text-sm mb-2">당신은 격동의 시대 속,</h3>
            <h1 className="text-2xl font-black text-ieumAmber leading-tight mb-6">
              "{getMatchedResult()}"
            </h1>
            <div className="w-32 h-32 bg-white rounded-full mx-auto shadow-md border border-ieumLight flex items-center justify-center text-5xl">
              {getMatchedResult().includes('지도자') && '🧭'}
              {getMatchedResult().includes('실천가') && '🧨'}
              {getMatchedResult().includes('결단형') && '⚖️'}
              {getMatchedResult().includes('헌신형') && '🕯️'}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-ieumLight space-y-4 mb-8">
            <p className="text-sm leading-relaxed text-gray-700 text-center">
              당신과 같은 수많은 분들이 각자의 위치에서 헌신했기에 오늘날의 우리가 있습니다. 하지만 아직 그 후손들 중 일부는 우리 사회의 보이지 않는 곳에서 어려움을 겪고 있습니다. 
            </p>
            <p className="text-xs font-bold text-center text-ieumAmber">
              IEUM와 함께 작은 연대를 시작해볼까요?
            </p>
          </div>

          <div className="space-y-3 mt-auto pb-8">
            <button 
              onClick={() => navigate('/form-independence')}
              className="w-full bg-ieumAmber text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-ieumGold transition-colors"
            >
              캠페인 동참하기
            </button>
            <button 
              onClick={() => alert('공유하기 기능은 준비 중입니다.')}
              className="w-full bg-white text-gray-800 font-bold text-sm py-4 rounded-xl border border-gray-200"
            >
              내 결과 공유하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTest;
