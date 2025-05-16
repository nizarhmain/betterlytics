import { clickhouse } from '@/lib/clickhouse';
import { DateTimeString } from "@/types/dates";
import { RawCampaignData, RawCampaignDataArraySchema } from "@/entities/campaign";

export async function getCampaignPerformanceData(
  siteId: string,
  startDate: DateTimeString,
  endDate: DateTimeString
): Promise<RawCampaignData[]> {
  const query = `
    SELECT
      s.utm_campaign AS utm_campaign_name,
      COUNT(DISTINCT s.visitor_id) AS total_visitors,
      COUNT(DISTINCT IF(s.session_pageviews = 1, s.session_id, NULL)) AS bounced_sessions,
      COUNT(DISTINCT s.session_id) AS total_sessions,
      SUM(s.session_pageviews) AS total_pageviews,
      SUM(s.session_duration_seconds) AS sum_session_duration_seconds
    FROM (
      SELECT
        visitor_id,
        session_id,
        utm_campaign,
        dateDiff('second', MIN(timestamp), MAX(timestamp)) AS session_duration_seconds,
        COUNT(*) AS session_pageviews
      FROM analytics.events
      WHERE site_id = {siteId:String}
        AND timestamp BETWEEN {startDate:DateTime} AND {endDate:DateTime}
        AND event_type = 1
        AND utm_campaign IS NOT NULL AND utm_campaign != ''
      GROUP BY visitor_id, session_id, utm_campaign
    ) s
    GROUP BY s.utm_campaign
    ORDER BY total_visitors DESC
  `;

  const resultSet = await clickhouse.query(query, {
    params: {
      siteId: siteId,
      startDate: startDate,
      endDate: endDate,
    },
  }).toPromise();

  return RawCampaignDataArraySchema.parse(resultSet);
} 