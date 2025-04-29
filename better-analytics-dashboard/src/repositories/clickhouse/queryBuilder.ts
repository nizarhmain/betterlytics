import {
  createSessionBoundariesCTE,
  createSessionGroupsCTE,
  createSessionMetricsCTE,
  createPageMetricsCTE,
} from './ctes';
import { SessionOptions } from './types';

export class ClickHouseQueryBuilder {
  private ctes: string[] = [];
  private mainQuery: string = '';
  private withClause: boolean = false;

  /**
   * Add a session boundaries CTE to the query
   */
  addSessionBoundaries(options?: SessionOptions): this {
    this.ctes.push(createSessionBoundariesCTE(options));
    return this;
  }

  /**
   * Add a session groups CTE to the query
   */
  addSessionGroups(options?: SessionOptions): this {
    this.ctes.push(createSessionGroupsCTE(options));
    return this;
  }

  /**
   * Add session metrics CTE to the query
   */
  addSessionMetrics(): this {
    this.ctes.push(createSessionMetricsCTE());
    return this;
  }

  /**
   * Add page metrics CTE to the query
   */
  addPageMetrics(): this {
    this.ctes.push(createPageMetricsCTE());
    return this;
  }

  /**
   * Set the main query
   */
  setMainQuery(query: string): this {
    this.mainQuery = query;
    return this;
  }

  /**
   * Enable or disable the WITH clause
   */
  withCTEs(enabled: boolean = true): this {
    this.withClause = enabled;
    return this;
  }

  /**
   * Build the final query string
   */
  build(): string {
    if (this.ctes.length === 0) {
      return this.mainQuery;
    }

    return `
      ${this.withClause ? 'WITH' : ''}
      ${this.ctes.join(',\n')}
      ${this.mainQuery}
    `;
  }
} 