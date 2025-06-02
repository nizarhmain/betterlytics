'use client';

import { use, useState } from 'react';
import { fetchUserJourneyAction } from '@/app/actions/userJourney';
import UserJourneyChart from '@/app/dashboard/[dashboardId]/user-journey/UserJourneyChart';
import { useTimeRangeContext } from '@/contexts/TimeRangeContextProvider';
import { useQueryFiltersContext } from '@/contexts/QueryFiltersContextProvider';
import { useDashboardId } from '@/hooks/use-dashboard-id';
import { useUserJourneyFilter } from '@/contexts/UserJourneyFilterContextProvider';

const STEP_OPTIONS = [1, 2, 3, 4, 5];
const JOURNEY_OPTIONS = [5, 10, 20, 50, 100];

type UserJourneySectionProps = {
  userJourneyPromise: ReturnType<typeof fetchUserJourneyAction>;
};

export default function UserJourneySection({ userJourneyPromise }: UserJourneySectionProps) {
  const dashboardId = useDashboardId();
  const { numberOfSteps, setNumberOfSteps, numberOfJourneys, setNumberOfJourneys } = useUserJourneyFilter();
  const [currentPromise, setCurrentPromise] = useState(userJourneyPromise);

  const { startDate, endDate } = useTimeRangeContext();
  const { queryFilters } = useQueryFiltersContext();

  const journeyData = use(currentPromise);

  const handleParameterChange = (newSteps?: number, newJourneys?: number) => {
    const steps = newSteps ?? numberOfSteps;
    const journeys = newJourneys ?? numberOfJourneys;

    const newPromise = fetchUserJourneyAction(dashboardId, startDate, endDate, steps, journeys, queryFilters);

    setCurrentPromise(newPromise);
  };

  const handleStepsChange = (steps: number) => {
    setNumberOfSteps(steps);
    handleParameterChange(steps, undefined);
  };

  const handleJourneysChange = (journeys: number) => {
    setNumberOfJourneys(journeys);
    handleParameterChange(undefined, journeys);
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-end space-x-4'>
        <div className='relative inline-block text-left'>
          <label htmlFor='steps-select' className='sr-only'>
            Number of Steps
          </label>
          <select
            id='steps-select'
            className='text-foreground bg-background focus:ring-ring rounded border px-3 py-2 focus:ring-2 focus:outline-none'
            value={numberOfSteps}
            onChange={(e) => handleStepsChange(Number(e.target.value))}
          >
            {STEP_OPTIONS.map((steps) => (
              <option key={steps} value={steps}>
                {steps} Steps
              </option>
            ))}
          </select>
        </div>
        <div className='relative inline-block text-left'>
          <label htmlFor='journeys-select' className='sr-only'>
            Number of Journeys
          </label>
          <select
            id='journeys-select'
            className='text-foreground bg-background focus:ring-ring rounded border px-3 py-2 focus:ring-2 focus:outline-none'
            value={numberOfJourneys}
            onChange={(e) => handleJourneysChange(Number(e.target.value))}
          >
            {JOURNEY_OPTIONS.map((journeys) => (
              <option key={journeys} value={journeys}>
                Top {journeys} Journeys
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='relative min-h-[400px]'>
        {journeyData && journeyData.nodes.length > 0 && (
          <div className='bg-card text-card-foreground rounded-lg p-4 shadow'>
            <UserJourneyChart data={journeyData} />
          </div>
        )}

        {journeyData?.nodes.length === 0 && (
          <div className='bg-muted rounded-md p-8 text-center'>
            <p className='text-muted-foreground'>No journey data available for the selected criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
