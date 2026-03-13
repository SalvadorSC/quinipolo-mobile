import apiClient from './api';
import { ScraperMatch, ScraperPresetResponse, ScraperApiResponse } from './scraperTypes';

export async function fetchScraperDataV2(): Promise<{
  matches: ScraperMatch[];
  presets: ScraperPresetResponse;
  quotas: Record<string, number>;
}> {
  try {
    const response = await apiClient.get<ScraperApiResponse>('/api/scraper/matches', {
      timeout: 60000,
    });
    const data = response.data;
    return {
      matches: data.allMatches ?? [],
      presets: data.presets ?? { easy: [], moderate: [], hard: [] },
      quotas: data.quotas ?? {},
    };
  } catch (error: any) {
    if (error?.response?.status === 404) {
      throw new Error('Scraper endpoint not found at /api/scraper/matches');
    }
    throw new Error(
      `Failed to fetch matches: ${error?.message ?? 'Unknown error'}`
    );
  }
}
