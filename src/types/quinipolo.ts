// Quinipolo Types - Mobile
export type GameType = "waterpolo" | "football" | "basketball" | "handball" | "tennis";

export const GAME_15_ALLOWED_SPORTS: GameType[] = ["waterpolo", "football"];

export const NO_TIE_SPORTS: GameType[] = ["tennis"];

export interface SurveyData {
  gameType: GameType;
  homeTeam: string;
  awayTeam: string;
  date: Date | null;
  isGame15: boolean;
  leagueId?: string;
  leagueName?: string;
}

export interface TeamOption {
  name: string;
  sport: GameType;
  gender: "m" | "f" | null;
  aliases?: string[];
}

export type TeamOptionsBySport = Record<GameType, TeamOption[]>;

export interface CorrectAnswer {
  matchNumber: number;
  chosenWinner: string;
  goalsHomeTeam: string;
  goalsAwayTeam: string;
  isGame15: boolean;
}

// Supabase Quinipolo structure (what comes from the database)
export interface SupabaseQuinipolo {
  id: string;
  league_id: string;
  quinipolo: SurveyData[];
  end_date: string;
  has_been_corrected: boolean;
  creation_date: string;
  is_deleted: boolean;
  participants_who_answered?: string[];
  correct_answers?: CorrectAnswer[];
  answered?: boolean;
}

// Answer Statistics structure
export interface AnswerStatistics {
  computed_at: string;
  total_responses: number;
  matches: Array<{
    matchNumber: number;
    homeTeam: string;
    awayTeam: string;
    statistics: {
      homeTeam: { count: number; percentage: number };
      awayTeam: { count: number; percentage: number };
      empat: { count: number; percentage: number };
      goals?: {
        homeTeam: {
          "-": { count: number; percentage: number };
          "11/12": { count: number; percentage: number };
          "+": { count: number; percentage: number };
        };
        awayTeam: {
          "-": { count: number; percentage: number };
          "11/12": { count: number; percentage: number };
          "+": { count: number; percentage: number };
        };
      };
    };
  }>;
}

// Frontend Quinipolo structure (what the frontend expects)
export interface QuinipoloType {
  id: string;
  league_id: string;
  league_name: string;
  quinipolo: SurveyData[];
  end_date: string;
  has_been_corrected: boolean;
  creation_date: string;
  is_deleted: boolean;
  participants_who_answered?: string[];
  correct_answers?: CorrectAnswer[];
  answered?: boolean;
  answer_statistics?: AnswerStatistics;
}

// API Response types
export interface QuinipoloCreateResponseType {
  id: string;
  league_name: string;
  league_id: string;
  quinipolo: SurveyData[];
  end_date: string;
  has_been_corrected: boolean;
  creation_date: string;
}

// Component Props
export interface QuinipoloCardProps {
  quinipolo: QuinipoloType;
  deadlineIsInPast: boolean;
  username: string;
  userLeagues: Array<{ league_id: string; role: string }>;
}

export interface QuinipolosToAnswerProps {
  leagueId?: string;
  wrapperLoading?: boolean;
  appLocation?: "league-dashboard" | "user-dashboard";
}

export interface TabPanelContentProps {
  quinipolos: QuinipoloType[];
  username: string;
  userLeagues: Array<{ league_id: string; role: string }>;
  fallBackText?: string;
}





