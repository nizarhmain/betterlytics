export interface PageAnalytics {
  path: string;
  title: string;
  visitors: number;
  pageviews: number;
  bounceRate: number;
  avgTime: string;
}

export interface SummaryStats {
  uniqueVisitors: number;
  pageviews: number;
  bounceRate: number;
  avgVisitDuration: number;
} 