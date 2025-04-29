export interface SessionOptions {
  /** The time in seconds after which a new session starts. Defaults to 1800 (30 minutes) */
  sessionTimeout?: number;
  /** Additional columns to include in the session boundaries */
  additionalColumns?: string[];
} 