export type LeagueData = {
  quinipolosToAnswer: any[];
  leaguesToCorrect: any[];
  moderatorArray: string[];
  league_name: string;
  id: string;
  created_at?: string;
  created_by?: string;
  creator?: {
    username: string;
    full_name?: string;
  };
  description?: string;
  icon_style?: {
    icon?: string;
    icon_color?: string;
    accent_color?: string;
  };
  moderatorPetitions: any[];
  participantPetitions: any[];
  participants: {
    user_id: string;
    username: string;
    role: string;
  }[];
  isPrivate: boolean;
};

export type LeaderboardScore = {
  username: string;
  nQuinipolosParticipated: number;
  points: number;
  totalPoints?: number;
  fullCorrectQuinipolos: number;
  averagePoints?: number;
};





