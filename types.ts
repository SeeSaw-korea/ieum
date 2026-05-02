
export enum Category {
  PROJECTS = '프로젝트',
  SEMINARS = '세미나',
  INSIGHTS = '인사이트',
  CAMPAIGNS = '캠페인',
  INTERVIEWS = '인터뷰',
  ESSAYS = '에세이/칼럼',
  TYPE_TEST = '유형테스트'
}

export interface UserProfile {
  age: number;
  region: string;
  mbti?: string;
  interests: Category[];
  isAnalyzed: boolean;
  analysisVibe?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  category: Category;
  description: string;
  imageUrl: string;
  detailImages?: string[];
  externalLink?: string;
  deadline?: string;
  tag?: string;
  isWishlisted?: boolean;
  detailedSections?: {
    type?: 'default' | 'quote' | 'highlight' | 'steps' | 'progress' | 'checklist' | 'faq' | 'image';
    subtitle?: string;
    body: string;
    iconClass?: string;
    extraData?: string[]; // For steps or checklist
    progressData?: { current: number; target: number; label: string };
    faqData?: { question: string; answer: string }[];
  }[];
}

export interface AppState {
  isFirstLogin: boolean;
  user: UserProfile | null;
  wishlist: string[];
}
