'server-only';

import { getUserSequentialPaths } from '@/repositories/clickhouse/userJourney';
import { SankeyData, SankeyNode, SankeyLink, SequentialPath } from '@/entities/userJourney';
import { toDateTimeString } from '@/utils/dateFormatters';

/**
 * Fetches user journey data and transforms it into Sankey diagram format
 */
export async function getUserJourneyForSankeyDiagram(
  siteId: string, 
  startDate: string, 
  endDate: string, 
  maxSteps: number = 3,
  limit: number = 50
): Promise<SankeyData> {
  const formattedStart = toDateTimeString(startDate);
  const formattedEnd = toDateTimeString(endDate);
  
  const sequentialPaths = await getUserSequentialPaths(
    siteId, 
    formattedStart, 
    formattedEnd,
    maxSteps,
    limit
  );
  
  return transformSequentialPathsToSankeyData(sequentialPaths, maxSteps);
}

/**
 * Transforms sequential journey data into Sankey format
 */
export function transformSequentialPathsToSankeyData(
  sequentialPaths: SequentialPath[],
  maxSteps: number = 3
): SankeyData {
  // Track unique nodes and their indices
  const nodeMap = new Map<string, number>(); // nodeId -> index
  const nodes: SankeyNode[] = [];
  
  // Track links and their values
  const linkMap = new Map<string, number>(); // linkId key is formatted as 'sourceIndex|targetIndex'
  
  // Process each user journey path from each session
  sequentialPaths.forEach(({ path, count }) => {
    // Limit to maxSteps nodes
    const limitedPath = path.slice(0, maxSteps);
    
    // Process each sequential step in the path
    for (let i = 0; i < limitedPath.length - 1; i++) {
      // Get current and next pages
      const currentPage = limitedPath[i];
      const nextPage = limitedPath[i + 1];
      
      // Create unique node IDs based on page and position
      const sourceId = `${currentPage}_${i}`;
      const targetId = `${nextPage}_${i + 1}`;
      
      // Get or create source node index
      let sourceIndex = nodeMap.get(sourceId);
      if (sourceIndex === undefined) {
        sourceIndex = nodes.length;
        nodeMap.set(sourceId, sourceIndex);
        nodes.push({
          id: sourceId,
          name: currentPage,
          depth: i
        });
      }
      
      // Get or create target node index
      let targetIndex = nodeMap.get(targetId);
      if (targetIndex === undefined) {
        targetIndex = nodes.length;
        nodeMap.set(targetId, targetIndex);
        nodes.push({
          id: targetId,
          name: nextPage,
          depth: i + 1
        });
      }
      
      // Create or update link counter
      const linkId = `${sourceIndex}|${targetIndex}`;
      linkMap.set(linkId, (linkMap.get(linkId) || 0) + count);
    }
  });
  
  // Convert link map to SankeyLinks
  const links: SankeyLink[] = Array.from(linkMap.entries()).map(([linkId, value]): SankeyLink => {
    const [source, target] = linkId.split('|').map(Number);
    return { source, target, value };
  });
  
  return { nodes, links };
}