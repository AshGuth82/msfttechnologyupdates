/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NewsCategory = 'financial' | 'product_tech' | 'licensing_pricing' | 'leadership';

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
}

export interface CachedNews {
  articles: Article[];
  lastUpdated: string; // ISO date
}

export interface CustomQueryResponse {
  answer: string;
  sources: { title: string; url: string }[];
}
