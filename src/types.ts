/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NewsCategory = 'cloud_transformation' | 'licensing_ea' | 'pricing_news' | 'anz_strategy';

export interface Article {
  id: string;
  title: string;
  summary: string;
  category: NewsCategory;
  url: string;
  source: string;
  publishedDate: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  impactScore: number; // 1-10
  keyTakeaways: string[];
  anzActionableAdvice?: string; // Actionable advice specifically tailored for Australia & New Zealand (ANZ) enterprise leaders
  ecifFundingEligible?: boolean; // Indicates if this activity/migration has potential ECIF funding options
}

export interface CachedNews {
  articles: Article[];
  lastUpdated: string; // ISO date
}

export interface CustomQueryResponse {
  answer: string;
  sources: { title: string; url: string }[];
}
