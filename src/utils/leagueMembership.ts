export type LeagueParticipant = {
  user_id?: string;
  username?: string;
  role?: string;
};

export type LeaguePetition = {
  userId?: string;
  username?: string;
  status?: string;
  date?: string;
};

export type LeagueListItem = {
  id: string;
  league_name?: string;
  is_private?: boolean;
  status?: string;
  participants?: LeagueParticipant[];
  participantsCount?: number;
  current_participants?: number;
  participantPetitions?: LeaguePetition[];
  icon_style?: {
    icon?: string;
    icon_color?: string;
    accent_color?: string;
  };
};

export type MembershipUser = {
  username?: string;
  leagues?: Array<string | { leagueId?: string; league_id?: string }>;
  userLeagues?: Array<{ league_id?: string; leagueId?: string; role?: string }>;
};

/**
 * Player count for a league row.
 * GET /api/leagues no longer includes `participants`; it sends
 * `participantsCount` and `current_participants` instead.
 */
export const participantCount = (league: {
  participantsCount?: number;
  current_participants?: number;
  participants?: unknown[] | null;
}): number => {
  if (typeof league.participantsCount === 'number')
    return league.participantsCount;
  if (typeof league.current_participants === 'number')
    return league.current_participants;
  if (Array.isArray(league.participants)) return league.participants.length;
  return 0;
};

export const isUserInLeague = (
  league: { id: string; participants?: LeagueParticipant[] | null },
  user: MembershipUser,
  joinedIds?: ReadonlySet<string>
): boolean => {
  if (joinedIds?.has(league.id)) return true;

  if (
    user.username &&
    Array.isArray(league.participants) &&
    league.participants.some(
      participant => participant.username === user.username
    )
  ) {
    return true;
  }

  if (
    (user.userLeagues ?? []).some(
      membership =>
        membership.league_id === league.id || membership.leagueId === league.id
    )
  ) {
    return true;
  }

  return (user.leagues ?? []).some(entry => {
    if (typeof entry === 'string') return entry === league.id;
    return entry.leagueId === league.id || entry.league_id === league.id;
  });
};

export const hasPendingPetition = (
  league: { participantPetitions?: LeaguePetition[] | null },
  username?: string
): boolean => {
  if (!username) return false;
  return (league.participantPetitions ?? []).some(
    petition => petition.username === username && petition.status === 'pending'
  );
};
