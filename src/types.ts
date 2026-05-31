export type Rarity = 'Common' | 'Rare' | 'Legendary' | 'Forbidden';

export type FactType = 'Funny' | 'Weird' | 'Cursed' | 'Mind-Blowing' | 'Existential';

export interface Fact {
  id: string;
  category: string;
  subheading: string;
  fact: string;
  answer: boolean; // true = True, false = Fake
  explanation: string;
  rarity: Rarity;
  type: FactType;
  classified?: boolean; // For rare classified visual style
}

export interface Category {
  id: string;
  title: string;
  subheading: string;
  emoji: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  sarcasticRemark: string;
  isUnlocked: boolean;
}

export interface LoadingMessage {
  text: string;
  rarity: 'Common' | 'Rare' | 'Legendary';
}

export interface GameStats {
  correctAnswersCount: number;
  totalAnswersCount: number;
  currentStreak: number;
  bestStreak: number;
}

declare global {
  interface ImportMeta {
    readonly glob: (pattern: string, options?: any) => Record<string, any>;
  }
}

