
import React, { useState, useRef } from 'react';
import { Category, UserProfile } from '../types';
import { useRegions, useMbtiTypes } from '../hooks/useContents';
import { analyzeUserVibe } from '../services/geminiService';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const { regions } = useRegions();
  const { mbtiTypes } = useMbtiTypes();
  
  const [step, setStep] = useState(1);
  const [age, setAge] = useState<number>(25);
  const [region, setRegion] = useState('');
  const [mbti, setMbti] = useState('');
  const [interests, setInterests] = useState<Category[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Set default region when regions are loaded
  React.useEffect(() => {
    if (regions.length > 0 && !region) {
      setRegion(regions[0]);
    }
  }, [regions, region]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleInterest = (cat: Category) => {
    setInterests(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsAnalyzing(true);
      let vibe = "성실한 청년";
      if (image) {
        vibe = await analyzeUserVibe(image.split(',')[1]);
      }
      
      onComplete({
        age,
        region,
        mbti: mbti || undefined,
        interests,
        isAnalyzed: !!image,
        analysisVibe: vibe
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-10">
        <div className="h-8 flex items-center">
          <img src={`${import.meta.env.BASE_URL}ieum-logo.png`} alt="IEUM Logo" className="h-10 w-auto object-contain" />
        </div>
        <div className="text-sm font-medium text-gray-400">단계 {step} / 3</div>
      </div>

      {step === 1 && (
        <div className="flex-1 animate-fadeIn">
          <h2 className="text-xl font-bold mb-2">당신에 대해 알려주세요!</h2>
          <p className="text-gray-500 mb-8">맞춤형 매칭을 위해 필수 정보를 입력해주세요.</p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2">나이</label>
              <input 
                type="number" 
                value={age} 
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full p-4 bg-ieumLight/40 rounded-xl focus:ring-2 focus:ring-ieumAmber outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">거주 지역</label>
              <select 
                value={region} 
                onChange={(e) => setRegion(e.target.value)}
                className="w-full p-4 bg-ieumLight/40 rounded-xl focus:ring-2 focus:ring-ieumAmber outline-none appearance-none"
              >
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">MBTI (선택)</label>
              <select 
                value={mbti} 
                onChange={(e) => setMbti(e.target.value)}
                className="w-full p-4 bg-ieumLight/40 rounded-xl focus:ring-2 focus:ring-ieumAmber outline-none appearance-none"
              >
                <option value="">선택 안함</option>
                {mbtiTypes.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 animate-fadeIn">
          <h2 className="text-xl font-bold mb-2">관심 분야를 선택해주세요</h2>
          <p className="text-gray-500 mb-8">관심사에 딱 맞는 참여 기회와 콘텐츠를 추천해드릴게요.</p>
          
          <div className="grid grid-cols-2 gap-3">
            {Object.values(Category).map((cat) => (
              <button
                key={cat}
                onClick={() => toggleInterest(cat)}
                className={`p-4 rounded-xl text-sm font-bold border-2 transition-all ${
                  interests.includes(cat) 
                    ? 'border-ieumAmber bg-ieumAmber text-white shadow-lg' 
                    : 'border-ieumLight bg-ieumCream text-ieumMuted'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex-1 animate-fadeIn">
          <h2 className="text-xl font-bold mb-2">사진으로 분위기 분석하기 (선택)</h2>
          <p className="text-gray-500 mb-8">AI가 당신의 무드를 분석해 더 정교하게 매칭해줍니다.</p>
          
          <div className="flex flex-col items-center">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-48 h-48 bg-gray-100 rounded-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden relative"
            >
              {image ? (
                <img src={image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <>
                  <i className="fa-solid fa-camera text-3xl text-gray-400 mb-2"></i>
                  <span className="text-xs text-gray-400">사진 업로드</span>
                </>
              )}
            </div>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              className="hidden"
            />
            {image && (
              <button onClick={() => setImage(null)} className="mt-4 text-xs text-red-500 underline">사진 삭제</button>
            )}
          </div>
        </div>
      )}

      <button
        onClick={handleNext}
        disabled={isAnalyzing}
        className="w-full py-4 bg-ieumAmber text-white rounded-xl font-bold shadow-lg shadow-ieumAmber/30 mt-6 flex items-center justify-center"
      >
        {isAnalyzing ? (
          <>
            <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>
            매칭 정보를 생성 중입니다...
          </>
        ) : (
          step === 3 ? '시작하기' : '다음으로'
        )}
      </button>
    </div>
  );
};

export default Onboarding;
