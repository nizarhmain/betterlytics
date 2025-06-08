# Dashboard refactor

## Migrating from MVC to DDD

Instead of having the current flat structure directly in the `/src` folder:

```
/auth
/entities
/repositories
/services
```

We could move to the following structure - still in the `/src` folder:

```
/modules
  /reporting  <-- our analytics domain code
  /auth       <-- auth related code
  /admin      <-- potential admin code
  /core       <-- shared types/code
```

### Diving into the `/reporting` folder

The `/reporting` folder could look something like

```ts
// Shared folders
/utils
  filters.utils.ts
  ...
/schemas
  chart.schemas.ts
  table.schemas.ts
  ...
/presenters
  chart.presenter.ts
  ...
// Acutal metrics implementation
/metrics
  /pages
    pages.metrics.ts
    pages.schemas.ts
  /events
    events.metrics.ts
  /user-journey
    user-journey.metrics.ts
    user-journey.schemas.ts
    user-journey.entities.ts
    user-journey.presenter.ts
  ...
```

**Defintions:**

`*.utils.ts`\
Could contain utilities, such as `filters`/`time` utilities.

`*.schemas.ts`\
Could contain our Zod schemas.\
We could introduce the following naming conventions:\
Input: `*InputSchema`, e.g. `metricsInputSchema`.\
Internal/domain: `*DomainSchema`, e.g. `metricsDomainSchema`.\
Output: `*ResponseSchema`, e.g. `metricsResponseSchema`.

`*.entities.ts`\
Contains the transformations from raw `ClickHouse` queries into clean objects.

`*.presenter.ts`\
Could contain "mappings", such as mapping a `domain model` to a `table model`/`chart model`.\
This way we will not have to perform data processing in the dashboard.

`*.metrics.ts`\
Will contain the actual `ClickHouse` queries and use basic entities to transform the data.

### Why this setup might help

In our server actions right now, we have (as an example):

```ts
export const fetchTopPagesAction = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    startDate: Date,
    endDate: Date,
    limit: number,
    queryFilters: QueryFilter[],
  ): Promise<TopPageRow[]> => {
    return getTopPagesForSite(ctx.siteId, startDate, endDate, limit, queryFilters);
  },
);
```

What the new setup could look like for the action, is that we can tie the action to the visual presentation of the data, and use base schemas for input:

```ts
export const fetchTopPagesTableAction = withDashboardAuthContext(
  async (ctx: AuthContext, input: MetricsInput): Promise<TablePresenter<TopPage[]>> => {
    const topPages = await getTopPages(ctx.siteId, input);
    return tablePresenter(topPages);
  },
);
```

If we wanted to then also add it as a pie chart, it would be as simple as:

```ts
export const fetchTopPagesPieAction = withDashboardAuthContext(
  async (ctx: AuthContext, input: MetricsInput): Promise<PiePresenter<TopPage[]>> => {
    const topPages = await getTopPages(ctx.siteId, input);
    return piePresenter(topPages);
  },
);
```

This might look like it's just moving resposibility, however, if we want to implement API at some point, we could still return the base-representation, without tying it to a specific presentation - such as a table presentation:

```ts
export function GET(request: NextRequest) {
  ...
  const topPages = await getTopPages(siteId, inputs);
  return Response.json(topPages);
}
```
