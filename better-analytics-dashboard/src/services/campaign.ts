'server-only';

import {
  getCampaignPerformanceData,
  getCampaignSourceBreakdownData,
  getCampaignVisitorTrendData,
  getCampaignMediumBreakdownData,
  getCampaignContentBreakdownData,
  getCampaignTermBreakdownData,
  getCampaignLandingPagePerformanceData,
} from "@/repositories/clickhouse/campaign";
import {
  CampaignPerformance,
  CampaignPerformanceArraySchema,
  CampaignSourceBreakdownItem,
  CampaignSourceBreakdownArraySchema,
  RawCampaignData,
  RawCampaignSourceBreakdownItem,
  CampaignTrendRow,
  PivotedCampaignVisitorTrendItem,
  PivotedCampaignVisitorTrendArraySchema,
  CampaignMediumBreakdownItem,
  CampaignMediumBreakdownArraySchema,
  RawCampaignMediumBreakdownItem,
  RawCampaignContentBreakdownItem,
  CampaignContentBreakdownItem,
  CampaignContentBreakdownArraySchema,
  RawCampaignTermBreakdownItem,
  CampaignTermBreakdownItem,
  CampaignTermBreakdownArraySchema,
  RawCampaignLandingPagePerformanceItem,
  CampaignLandingPagePerformanceItem,
  CampaignLandingPagePerformanceArraySchema,
} from "@/entities/campaign";
import { toDateTimeString } from '@/utils/dateFormatters';
import { formatDuration } from '@/utils/dateFormatters';

export async function fetchCampaignPerformance(
  siteId: string,
  startDate: string,
  endDate: string
): Promise<CampaignPerformance[]> {
  const startDateTime = toDateTimeString(startDate);
  const endDateTime = toDateTimeString(endDate);

  const rawCampaignData: RawCampaignData[] = await getCampaignPerformanceData(siteId, startDateTime, endDateTime);

  const transformedData: CampaignPerformance[] = rawCampaignData.map((raw: RawCampaignData) => {
    const bounceRate = raw.total_sessions > 0 ? (raw.bounced_sessions / raw.total_sessions) * 100 : 0;
    const avgSessionDurationSeconds = raw.total_sessions > 0 ? raw.sum_session_duration_seconds / raw.total_sessions : 0;
    const pagesPerSession = raw.total_sessions > 0 ? raw.total_pageviews / raw.total_sessions : 0;
    const avgSessionDurationFormatted = formatDuration(avgSessionDurationSeconds);

    return {
      name: raw.utm_campaign_name,
      visitors: raw.total_visitors,
      bounceRate: parseFloat(bounceRate.toFixed(1)),
      avgSessionDuration: avgSessionDurationFormatted,
      pagesPerSession: parseFloat(pagesPerSession.toFixed(1)),
    };
  });

  return CampaignPerformanceArraySchema.parse(transformedData);
}

export async function fetchCampaignSourceBreakdown(
  siteId: string,
  startDate: string,
  endDate: string
): Promise<CampaignSourceBreakdownItem[]> {
  const startDateTime = toDateTimeString(startDate);
  const endDateTime = toDateTimeString(endDate);

  const rawSourceData: RawCampaignSourceBreakdownItem[] = await getCampaignSourceBreakdownData(siteId, startDateTime, endDateTime);

  const transformedData: CampaignSourceBreakdownItem[] = rawSourceData.map((raw: RawCampaignSourceBreakdownItem) => {
    const bounceRate = raw.total_sessions > 0 ? (raw.bounced_sessions / raw.total_sessions) * 100 : 0;
    const avgSessionDurationSeconds = raw.total_sessions > 0 ? raw.sum_session_duration_seconds / raw.total_sessions : 0;
    const pagesPerSession = raw.total_sessions > 0 ? raw.total_pageviews / raw.total_sessions : 0;
    const avgSessionDurationFormatted = formatDuration(avgSessionDurationSeconds);

    return {
      source: raw.source,
      visitors: raw.total_visitors,
      bounceRate: parseFloat(bounceRate.toFixed(1)),
      avgSessionDuration: avgSessionDurationFormatted,
      pagesPerSession: parseFloat(pagesPerSession.toFixed(1)),
    };
  });

  return CampaignSourceBreakdownArraySchema.parse(transformedData);
}

export async function fetchCampaignMediumBreakdown(
  siteId: string,
  startDate: string,
  endDate: string
): Promise<CampaignMediumBreakdownItem[]> {
  const startDateTime = toDateTimeString(startDate);
  const endDateTime = toDateTimeString(endDate);

  const rawMediumData: RawCampaignMediumBreakdownItem[] = await getCampaignMediumBreakdownData(siteId, startDateTime, endDateTime);

  const transformedData: CampaignMediumBreakdownItem[] = rawMediumData.map((raw: RawCampaignMediumBreakdownItem) => {
    const bounceRate = raw.total_sessions > 0 ? (raw.bounced_sessions / raw.total_sessions) * 100 : 0;
    const avgSessionDurationSeconds = raw.total_sessions > 0 ? raw.sum_session_duration_seconds / raw.total_sessions : 0;
    const pagesPerSession = raw.total_sessions > 0 ? raw.total_pageviews / raw.total_sessions : 0;
    const avgSessionDurationFormatted = formatDuration(avgSessionDurationSeconds);

    return {
      medium: raw.medium,
      visitors: raw.total_visitors,
      bounceRate: parseFloat(bounceRate.toFixed(1)),
      avgSessionDuration: avgSessionDurationFormatted,
      pagesPerSession: parseFloat(pagesPerSession.toFixed(1)),
    };
  });

  return CampaignMediumBreakdownArraySchema.parse(transformedData);
}

export async function fetchCampaignContentBreakdown(
  siteId: string,
  startDate: string,
  endDate: string
): Promise<CampaignContentBreakdownItem[]> {
  const startDateTime = toDateTimeString(startDate);
  const endDateTime = toDateTimeString(endDate);

  const rawContentData: RawCampaignContentBreakdownItem[] = await getCampaignContentBreakdownData(siteId, startDateTime, endDateTime);

  const transformedData: CampaignContentBreakdownItem[] = rawContentData.map((raw: RawCampaignContentBreakdownItem) => {
    const bounceRate = raw.total_sessions > 0 ? (raw.bounced_sessions / raw.total_sessions) * 100 : 0;
    const avgSessionDurationSeconds = raw.total_sessions > 0 ? raw.sum_session_duration_seconds / raw.total_sessions : 0;
    const pagesPerSession = raw.total_sessions > 0 ? raw.total_pageviews / raw.total_sessions : 0;
    const avgSessionDurationFormatted = formatDuration(avgSessionDurationSeconds);

    return {
      content: raw.content,
      visitors: raw.total_visitors,
      bounceRate: parseFloat(bounceRate.toFixed(1)),
      avgSessionDuration: avgSessionDurationFormatted,
      pagesPerSession: parseFloat(pagesPerSession.toFixed(1)),
    };
  });

  return CampaignContentBreakdownArraySchema.parse(transformedData);
}

export async function fetchCampaignTermBreakdown(
  siteId: string,
  startDate: string,
  endDate: string
): Promise<CampaignTermBreakdownItem[]> {
  const startDateTime = toDateTimeString(startDate);
  const endDateTime = toDateTimeString(endDate);

  const rawTermData: RawCampaignTermBreakdownItem[] = await getCampaignTermBreakdownData(siteId, startDateTime, endDateTime);

  const transformedData: CampaignTermBreakdownItem[] = rawTermData.map((raw: RawCampaignTermBreakdownItem) => {
    const bounceRate = raw.total_sessions > 0 ? (raw.bounced_sessions / raw.total_sessions) * 100 : 0;
    const avgSessionDurationSeconds = raw.total_sessions > 0 ? raw.sum_session_duration_seconds / raw.total_sessions : 0;
    const pagesPerSession = raw.total_sessions > 0 ? raw.total_pageviews / raw.total_sessions : 0;
    const avgSessionDurationFormatted = formatDuration(avgSessionDurationSeconds);

    return {
      term: raw.term,
      visitors: raw.total_visitors,
      bounceRate: parseFloat(bounceRate.toFixed(1)),
      avgSessionDuration: avgSessionDurationFormatted,
      pagesPerSession: parseFloat(pagesPerSession.toFixed(1)),
    };
  });

  return CampaignTermBreakdownArraySchema.parse(transformedData);
}

export async function fetchCampaignLandingPagePerformance(
  siteId: string,
  startDate: string,
  endDate: string
): Promise<CampaignLandingPagePerformanceItem[]> {
  const startDateTime = toDateTimeString(startDate);
  const endDateTime = toDateTimeString(endDate);

  const rawLandingPageData: RawCampaignLandingPagePerformanceItem[] = 
    await getCampaignLandingPagePerformanceData(siteId, startDateTime, endDateTime);

  const transformedData: CampaignLandingPagePerformanceItem[] = rawLandingPageData.map((raw: RawCampaignLandingPagePerformanceItem) => {
    const bounceRate = raw.total_sessions > 0 ? (raw.bounced_sessions / raw.total_sessions) * 100 : 0;
    const avgSessionDurationSeconds = raw.total_sessions > 0 ? raw.sum_session_duration_seconds / raw.total_sessions : 0;
    const pagesPerSession = raw.total_sessions > 0 ? raw.total_pageviews / raw.total_sessions : 0;
    const avgSessionDurationFormatted = formatDuration(avgSessionDurationSeconds);

    return {
      campaignName: raw.utm_campaign_name,
      landingPageUrl: raw.landing_page_url,
      visitors: raw.total_visitors,
      bounceRate: parseFloat(bounceRate.toFixed(1)),
      avgSessionDuration: avgSessionDurationFormatted,
      pagesPerSession: parseFloat(pagesPerSession.toFixed(1)),
    };
  });

  return CampaignLandingPagePerformanceArraySchema.parse(transformedData);
}

export async function fetchCampaignVisitorTrend(
  siteId: string,
  startDate: string,
  endDate: string
): Promise<PivotedCampaignVisitorTrendItem[]> {
  const startDateTime = toDateTimeString(startDate);
  const endDateTime = toDateTimeString(endDate);

  const rawTrendData: CampaignTrendRow[] = await getCampaignVisitorTrendData(siteId, startDateTime, endDateTime);

  if (rawTrendData.length === 0) {
    return [];
  }

  const pivotedDataMap = new Map<string, PivotedCampaignVisitorTrendItem>();

  const allCampaignNames = Array.from(new Set(rawTrendData.map(item => item.utm_campaign)));

  rawTrendData.forEach(item => {
    let dailyData = pivotedDataMap.get(item.event_date);

    if (!dailyData) {
      dailyData = {
        date: item.event_date,
        campaignValues: Object.fromEntries(
          allCampaignNames.map(campaignName => [campaignName, 0])
        ),
      };
      pivotedDataMap.set(item.event_date, dailyData);
    }

    dailyData.campaignValues[item.utm_campaign] += item.visitors;
  });

  return PivotedCampaignVisitorTrendArraySchema.parse(Array.from(pivotedDataMap.values()));
} 