'server-only';

import {
  getCampaignPerformanceData,
  getCampaignSourceBreakdownData,
  getCampaignVisitorTrendData,
  getCampaignMediumBreakdownData,
} from "@/repositories/clickhouse/campaign";
import {
  CampaignPerformance,
  CampaignPerformanceArraySchema,
  CampaignSourceBreakdownItem,
  RawCampaignData,
  CampaignTrendRow,
  PivotedCampaignVisitorTrendItem,
  PivotedCampaignVisitorTrendArraySchema,
  CampaignMediumBreakdownItem,
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

  return await getCampaignSourceBreakdownData(siteId, startDateTime, endDateTime);
}

export async function fetchCampaignMediumBreakdown(
  siteId: string,
  startDate: string,
  endDate: string
): Promise<CampaignMediumBreakdownItem[]> {
  const startDateTime = toDateTimeString(startDate);
  const endDateTime = toDateTimeString(endDate);

  return await getCampaignMediumBreakdownData(siteId, startDateTime, endDateTime);
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