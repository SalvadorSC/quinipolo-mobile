export interface AnswerType {
  matchNumber: number;
  chosenWinner: string;
  isGame15: boolean;
  goalsHomeTeam: string;
  goalsAwayTeam: string;
  cancelled?: boolean;
}

export interface Match {
  homeTeam: string;
  awayTeam: string;
  gameType: 'waterpolo' | 'football' | 'basketball' | 'handball' | 'tennis';
  leagueId?: string;
  leagueName?: string;
}

export interface QuinipoloData {
  id: string;
  league_id: string;
  league_name: string;
  quinipolo: Match[];
  end_date: string;
  has_been_corrected: boolean;
  creation_date: string;
  is_deleted: boolean;
  participants_who_answered: string[];
  correct_answers?: AnswerType[];
  answered?: boolean;
}

export interface AnswerSubmissionPayload {
  username: string;
  quinipoloId: string;
  answers: AnswerType[];
}

export interface AnswerResponse {
  message: string;
  points?: number;
}

export interface MatchStatistics {
  homeTeam: { count: number; percentage: number };
  awayTeam: { count: number; percentage: number };
  empat: { count: number; percentage: number };
}

export interface AnswerStatistics {
  total_responses: number;
  computed_at: string;
  matches: Array<{
    matchNumber: number;
    homeTeam: string;
    awayTeam: string;
    statistics: MatchStatistics;
  }>;
}
