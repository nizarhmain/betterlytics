'use client';

import { TimeRangeValue, getRangeForValue } from "@/utils/timeRanges";
import { TIME_RANGE_PRESETS } from "@/utils/timeRanges";
import { useMemo, useState } from "react";

const STEP_OPTIONS = [1, 2, 3, 4, 5];
const JOURNEY_OPTIONS = [5, 10, 20, 50];

export default function UserJourneyClient() {
    const [range, setRange] = useState<TimeRangeValue>("7d");
    const [numberOfSteps, setNumberOfSteps] = useState<number>(3);
    const [numberOfJourneys, setNumberOfJourneys] = useState<number>(10);
    const { startDate, endDate } = useMemo(() => getRangeForValue(range), [range]);

    return (
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">User Journey</h1>
              <p className="text-sm text-gray-500">Analytics and insights for your website</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative inline-block text-left">
                <label htmlFor="steps-select" className="sr-only">Number of Steps</label>
                <select
                  id="steps-select"
                  className="border rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={numberOfSteps}
                  onChange={e => setNumberOfSteps(Number(e.target.value))}
                >
                  {STEP_OPTIONS.map(steps => (
                    <option key={steps} value={steps}>{steps} Steps</option>
                  ))}
                </select>
              </div>
              <div className="relative inline-block text-left">
                <label htmlFor="journeys-select" className="sr-only">Number of Journeys</label>
                <select
                  id="journeys-select"
                  className="border rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={numberOfJourneys}
                  onChange={e => setNumberOfJourneys(Number(e.target.value))}
                >
                  {JOURNEY_OPTIONS.map(journeys => (
                    <option key={journeys} value={journeys}>{journeys} Journeys</option>
                  ))}
                </select>
              </div>
              <div className="relative inline-block text-left">
                <label htmlFor="range-select" className="sr-only">Time Range</label>
                <select
                  id="range-select"
                  className="border rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={range}
                  onChange={e => setRange(e.target.value as TimeRangeValue)}
                >
                  {TIME_RANGE_PRESETS.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
    )
}
