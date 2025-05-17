import { clickhouse } from '@/lib/clickhouse';
import { DateTimeString } from "@/types/dates";
import {
  RawCampaignData,
  RawCampaignDataArraySchema,
  CampaignTrendRow,
  CampaignTrendRowArraySchema,
  RawCampaignSourceBreakdownItem,
  RawCampaignSourceBreakdownArraySchema,
  RawCampaignMediumBreakdownItem,
  RawCampaignMediumBreakdownArraySchema,
  RawCampaignContentBreakdownItem,
  RawCampaignContentBreakdownArraySchema,
  RawCampaignTermBreakdownItem,
  RawCampaignTermBreakdownArraySchema,
  RawCampaignLandingPagePerformanceItem,
  RawCampaignLandingPagePerformanceArraySchema
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
): Promise<RawCampaignMediumBreakdownItem[]> {
  const query = `
    SELECT
      s.utm_medium AS medium,
      COUNT(DISTINCT s.visitor_id) AS total_visitors,
      COUNT(DISTINCT IF(s.session_pageviews = 1, s.session_id, NULL)) AS bounced_sessions,
      COUNT(DISTINCT s.session_id) AS total_sessions,
      SUM(s.session_pageviews) AS total_pageviews,
      SUM(s.session_duration_seconds) AS sum_session_duration_seconds
    FROM (
      SELECT
        visitor_id,
        session_id,
        utm_medium,
        dateDiff('second', MIN(timestamp), MAX(timestamp)) AS session_duration_seconds,
        COUNT(*) AS session_pageviews
      FROM analytics.events
      WHERE site_id = {siteId:String}
        AND timestamp BETWEEN {startDate:DateTime} AND {endDate:DateTime}
        AND event_type = 1
        AND utm_campaign IS NOT NULL AND utm_campaign != ''
        AND utm_medium IS NOT NULL AND utm_medium != ''
      GROUP BY visitor_id, session_id, utm_medium
    ) s
    GROUP BY s.utm_medium
    ORDER BY total_visitors DESC
  `;

  const resultSet = await clickhouse.query(query, {
    params: {
      siteId: siteId,
      startDate: startDate,
      endDate: endDate,
    },
  }).toPromise();
  
  return RawCampaignMediumBreakdownArraySchema.parse(resultSet);
}

export async function getCampaignContentBreakdownData(
  siteId: string,
  startDate: DateTimeString,
  endDate: DateTimeString
): Promise<RawCampaignContentBreakdownItem[]> {
  const query = `
    SELECT
      s.utm_content AS content,
      COUNT(DISTINCT s.visitor_id) AS total_visitors,
      COUNT(DISTINCT IF(s.session_pageviews = 1, s.session_id, NULL)) AS bounced_sessions,
      COUNT(DISTINCT s.session_id) AS total_sessions,
      SUM(s.session_pageviews) AS total_pageviews,
      SUM(s.session_duration_seconds) AS sum_session_duration_seconds
    FROM (
      SELECT
        visitor_id,
        session_id,
        utm_content,
        dateDiff('second', MIN(timestamp), MAX(timestamp)) AS session_duration_seconds,
        COUNT(*) AS session_pageviews
      FROM analytics.events
      WHERE site_id = {siteId:String}
        AND timestamp BETWEEN {startDate:DateTime} AND {endDate:DateTime}
        AND event_type = 1
        AND utm_campaign IS NOT NULL AND utm_campaign != ''
        AND utm_content IS NOT NULL AND utm_content != ''
      GROUP BY visitor_id, session_id, utm_content
    ) s
    GROUP BY s.utm_content
    ORDER BY total_visitors DESC
  `;

  const resultSet = await clickhouse.query(query, {
    params: {
      siteId: siteId,
      startDate: startDate,
      endDate: endDate,
    },
  }).toPromise();
  
  return RawCampaignContentBreakdownArraySchema.parse(resultSet);
}

export async function getCampaignTermBreakdownData(
  siteId: string,
  startDate: DateTimeString,
  endDate: DateTimeString
): Promise<RawCampaignTermBreakdownItem[]> {
  const query = `
    SELECT
      s.utm_term AS term,
      COUNT(DISTINCT s.visitor_id) AS total_visitors,
      COUNT(DISTINCT IF(s.session_pageviews = 1, s.session_id, NULL)) AS bounced_sessions,
      COUNT(DISTINCT s.session_id) AS total_sessions,
      SUM(s.session_pageviews) AS total_pageviews,
      SUM(s.session_duration_seconds) AS sum_session_duration_seconds
    FROM (
      SELECT
        visitor_id,
        session_id,
        utm_term,
        dateDiff('second', MIN(timestamp), MAX(timestamp)) AS session_duration_seconds,
        COUNT(*) AS session_pageviews
      FROM analytics.events
      WHERE site_id = {siteId:String}
        AND timestamp BETWEEN {startDate:DateTime} AND {endDate:DateTime}
        AND event_type = 1
        AND utm_campaign IS NOT NULL AND utm_campaign != ''
        AND utm_term IS NOT NULL AND utm_term != ''
      GROUP BY visitor_id, session_id, utm_term
    ) s
    GROUP BY s.utm_term
    ORDER BY total_visitors DESC
  `;

  const resultSet = await clickhouse.query(query, {
    params: {
      siteId: siteId,
      startDate: startDate,
      endDate: endDate,
    },
  }).toPromise();
  
  return RawCampaignTermBreakdownArraySchema.parse(resultSet);
}

export async function getCampaignLandingPagePerformanceData(
  siteId: string,
  startDate: DateTimeString,
  endDate: DateTimeString
): Promise<RawCampaignLandingPagePerformanceItem[]> {
  const query = `
    SELECT
        s.utm_campaign AS utm_campaign_name,
        s.landing_page_url,
        COUNT(DISTINCT s.visitor_id) AS total_visitors,
        COUNT(DISTINCT IF(s.session_total_pageviews = 1, s.session_id, NULL)) AS bounced_sessions,
        COUNT(DISTINCT s.session_id) AS total_sessions,
        SUM(s.session_total_pageviews) AS total_pageviews,
        SUM(s.session_total_duration_seconds) AS sum_session_duration_seconds
    FROM (
        SELECT
            e.visitor_id,
            e.session_id,
            e.utm_campaign,
            FIRST_VALUE(e.url) OVER (PARTITION BY e.session_id ORDER BY e.timestamp ASC) as landing_page_url,
            COUNT(e.url) OVER (PARTITION BY e.session_id) as session_total_pageviews,
            dateDiff('second', MIN(e.timestamp) OVER (PARTITION BY e.session_id), MAX(e.timestamp) OVER (PARTITION BY e.session_id)) as session_total_duration_seconds,
            ROW_NUMBER() OVER (PARTITION BY e.session_id ORDER BY e.timestamp ASC) as rn
        FROM analytics.events e
        WHERE e.site_id = {siteId:String}
          AND e.timestamp BETWEEN {startDate:DateTime} AND {endDate:DateTime}
          AND e.event_type = 1 -- Pageview event
          AND e.utm_campaign IS NOT NULL AND e.utm_campaign != ''
    ) s
    WHERE s.rn = 1
    GROUP BY s.utm_campaign, s.landing_page_url
    ORDER BY s.utm_campaign ASC, total_visitors DESC
  `;

  const resultSet = await clickhouse.query(query, {
    params: {
      siteId: siteId,
      startDate: startDate,
      endDate: endDate,
    },
  }).toPromise();
  
  return RawCampaignLandingPagePerformanceArraySchema.parse(resultSet);
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