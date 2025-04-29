/**
 * This file contains Common Table Expressions (CTEs) that can be reused across different ClickHouse queries.
 * Each CTE is a function that returns a string containing the SQL query part.
 * The functions can accept parameters to customize the CTEs behavior.
 */

import { SessionOptions } from "./types";

/**
 * Creates a CTE that identifies session boundaries for each visitor
 * A new session starts when there's no activity for the specified timeout period
 * 
 * Dependencies: None
 */
export function createSessionBoundariesCTE(options: SessionOptions = {}): string {
  const { sessionTimeout = 1800, additionalColumns = [] } = options;
  const extraCols = additionalColumns.length > 0 ? `, ${additionalColumns.join(', ')}` : '';
  
  return `
    session_boundaries AS (
      SELECT 
        site_id,
        visitor_id,
        timestamp${extraCols},
        -- Detect session boundaries: 1 if new session, 0 if continuation
        if(dateDiff('second', lagInFrame(timestamp) OVER (PARTITION BY site_id, visitor_id ORDER BY timestamp), timestamp) > ${sessionTimeout}, 1, 0) as is_new_session
      FROM analytics.events
      WHERE site_id = {site_id:String}
        AND date BETWEEN toDate({start:String}) AND toDate({end:String})
        AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
    )`;
}

/**
 * Creates a CTE that groups events into sessions using the session boundaries
 * 
 * Dependencies: session_boundaries
 */
export function createSessionGroupsCTE(options: SessionOptions = {}): string {
  const { additionalColumns = [] } = options;
  const extraCols = additionalColumns.length > 0 ? `, ${additionalColumns.join(', ')}` : '';
  
  return `
    session_groups AS (
      SELECT 
        site_id,
        visitor_id,
        timestamp${extraCols},
        -- Create session IDs by summing the new session markers
        sum(is_new_session) OVER (PARTITION BY site_id, visitor_id ORDER BY timestamp) as session_id
      FROM session_boundaries
    )`;
}

/**
 * Creates a CTE that calculates basic session metrics
 * 
 * Dependencies: session_groups
 */
export function createSessionMetricsCTE(): string {
  return `
    session_metrics AS (
      SELECT 
        site_id,
        visitor_id,
        session_id,
        count() as page_count,
        if(count() > 1, 
          dateDiff('second', min(timestamp), max(timestamp)), 
          0) as duration
      FROM session_groups
      GROUP BY site_id, visitor_id, session_id
    )`;
}

/**
 * Creates a CTE that calculates page-specific metrics within sessions
 * 
 * Dependencies: session_groups, session_metrics
 */
export function createPageMetricsCTE(): string {
  return `
    page_metrics AS (
      SELECT
        sg.url as path,
        uniqExact(sg.visitor_id) as visitors,
        count() as pageviews,
        round(100 * countIf(sm.page_count = 1) / count(), 1) as bounce_rate,
        round(avg(sm.duration), 1) as avg_time
      FROM session_groups sg
      LEFT JOIN session_metrics sm ON 
        sg.visitor_id = sm.visitor_id AND 
        sg.session_id = sm.session_id
      GROUP BY sg.url
    )
  `;
}