export type LeagueId =
  | 'DHM'
  | 'DHF'
  | 'PDM'
  | 'PDF'
  | 'SDM'
  | 'CL'
  | 'CLF'
  | 'SEL. M'
  | 'SEL. F';

export type MatchDifficulty = 'easy' | 'moderate' | 'hard' | 'unknown';

export interface ScraperMatch {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string; // ISO string
  leagueId: LeagueId;
  leagueName: string;
  difficulty: MatchDifficulty;
  closeness: number;
  isChampionsLeague?: boolean;
  replacementLeagueId?: LeagueId | null;
}

export interface ScraperPresetResponse {
  easy: string[];
  moderate: string[];
  hard: string[];
}

export interface ScraperApiResponse {
  allMatches?: ScraperMatch[];
  presets?: ScraperPresetResponse;
  quotas?: Record<string, number>;
}

export interface MatchResult {
  matchNumber: number;
  leagueId: LeagueId;
  leagueName: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  homeScore: number;
  awayScore: number;
  status?: string;
  wentToPenalties?: boolean;
  homeRegulationScore?: number;
  awayRegulationScore?: number;
  outcome: string;
  confidence: number;
}

export interface ResultsResponse {
  matches: MatchResult[];
  window: { start: string; end: string };
  totalResults: number;
  matchedCount: number;
}
