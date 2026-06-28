/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NewsCategory = 'technology_updates' | 'licensing_pricing' | 'anz_strategy' | 'cloud_transformations';

export interface PartnerReview {
  id: string;
  reviewer: string;
  rating: number;
  comment: string;
  date: string;
}

export interface MicrosoftPartner {
  id: string;
  name: string;
  location: string;
  rating: number;
  ratingCount: number;
  promoted: boolean;
  specialization: string[];
  description: string;
  caseStudyTitle: string;
  caseStudyContext: string;
  contactEmail: string;
  reviews: PartnerReview[];
  websiteUrl?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  category: string;
}

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

export interface PriceAlert {
  id: string;
  targetPrice: number;
  condition: "above" | "below";
  createdAt: string;
  isTriggered: boolean;
  triggeredAt?: string;
  triggeredPrice?: number;
}
