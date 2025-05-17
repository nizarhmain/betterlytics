import { clickhouse } from '@/lib/clickhouse';
import { DateTimeString } from "@/types/dates";
import {
  RawCampaignData,
  RawCampaignDataArraySchema,
  CampaignSourceBreakdownItem,
  CampaignSourceBreakdownArraySchema,
  CampaignTrendRow,
  CampaignTrendRowArraySchema,
  CampaignMediumBreakdownItem,
  CampaignMediumBreakdownArraySchema,
  RawCampaignSourceBreakdownItem,
  RawCampaignSourceBreakdownArraySchema,
} from "@/entities/campaign";

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

export async function getCampaignSourceBreakdownData(
  siteId: string,
  startDate: DateTimeString,
  endDate: DateTimeString
): Promise<RawCampaignSourceBreakdownItem[]> {
  const query = `
    SELECT
      s.utm_source AS source,
      COUNT(DISTINCT s.visitor_id) AS total_visitors,
      COUNT(DISTINCT IF(s.session_pageviews = 1, s.session_id, NULL)) AS bounced_sessions,
      COUNT(DISTINCT s.session_id) AS total_sessions,
      SUM(s.session_pageviews) AS total_pageviews,
      SUM(s.session_duration_seconds) AS sum_session_duration_seconds
    FROM (
      SELECT
        visitor_id,
        session_id,
        utm_source,
        dateDiff('second', MIN(timestamp), MAX(timestamp)) AS session_duration_seconds,
        COUNT(*) AS session_pageviews
      FROM analytics.events
      WHERE site_id = {siteId:String}
        AND timestamp BETWEEN {startDate:DateTime} AND {endDate:DateTime}
        AND event_type = 1
        AND utm_campaign IS NOT NULL AND utm_campaign != ''
        AND utm_source IS NOT NULL AND utm_source != ''
      GROUP BY visitor_id, session_id, utm_source
    ) s
    GROUP BY s.utm_source
    ORDER BY total_visitors DESC
  `;

  const resultSet = await clickhouse.query(query, {
    params: {
      siteId: siteId,
      startDate: startDate,
      endDate: endDate,
    },
  }).toPromise();
  
  return RawCampaignSourceBreakdownArraySchema.parse(resultSet);
}

export async function getCampaignMediumBreakdownData(
  siteId: string,
  startDate: DateTimeString,
  endDate: DateTimeString
): Promise<CampaignMediumBreakdownItem[]> {
  const query = `
    SELECT
      utm_medium AS medium,
      COUNT(DISTINCT visitor_id) AS visitors
    FROM analytics.events
    WHERE site_id = {siteId:String}
      AND timestamp BETWEEN {startDate:DateTime} AND {endDate:DateTime}
      AND utm_campaign != ''
      AND utm_medium != ''
    GROUP BY utm_medium
    ORDER BY visitors DESC
  `;

  const resultSet = await clickhouse.query(query, {
    params: {
      siteId: siteId,
      startDate: startDate,
      endDate: endDate,
    },
  }).toPromise();
  
  return CampaignMediumBreakdownArraySchema.parse(resultSet);
}

export async function getCampaignVisitorTrendData(
  siteId: string,
  startDate: DateTimeString,
  endDate: DateTimeString
): Promise<CampaignTrendRow[]> {
  const query = `
    SELECT
      toDate(timestamp) AS event_date,
      utm_campaign,
      COUNT(DISTINCT visitor_id) AS visitors
    FROM analytics.events
    WHERE site_id = {siteId:String}
      AND timestamp BETWEEN {startDate:DateTime} AND {endDate:DateTime}
      AND utm_campaign IS NOT NULL AND utm_campaign != ''
    GROUP BY event_date, utm_campaign
    ORDER BY event_date ASC, utm_campaign ASC
  `;

  const resultSet = await clickhouse.query(query, {
    params: {
      siteId: siteId,
      startDate: startDate,
      endDate: endDate,
    },
  }).toPromise();

  return CampaignTrendRowArraySchema.parse(resultSet);
} 