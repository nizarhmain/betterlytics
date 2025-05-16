'server-only';

import { getCampaignPerformanceData } from "@/repositories/clickhouse/campaign";
import { CampaignPerformance, CampaignPerformanceArraySchema, RawCampaignData } from "@/entities/campaign";
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