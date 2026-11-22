import {
  hasPendingPetition,
  isUserInLeague,
  participantCount,
} from '../leagueMembership';

const listPayload = {
  id: 'league-1',
  league_name: 'Global 26-27',
  is_private: false,
  current_participants: 401,
  participantsCount: 401,
  participantPetitions: [],
};

describe('league list membership', () => {
  it('does not read participants when the list payload omits them', () => {
    expect(
      Object.prototype.hasOwnProperty.call(listPayload, 'participants')
    ).toBe(false);
    expect(() =>
      isUserInLeague(listPayload, {
        username: 'ada',
        leagues: ['league-1'],
        userLeagues: [{ league_id: 'league-1', role: 'user' }],
      })
    ).not.toThrow();
  });

  it('treats profile league ids as membership', () => {
    expect(
      isUserInLeague(listPayload, {
        username: 'ada',
        leagues: ['league-1'],
        userLeagues: [],
      })
    ).toBe(true);
    expect(
      isUserInLeague(listPayload, {
        username: 'ada',
        leagues: [],
        userLeagues: [{ league_id: 'other', role: 'user' }],
      })
    ).toBe(false);
  });

  it('still recognises a legacy participants array', () => {
    expect(
      isUserInLeague(
        {
          id: 'league-2',
          participants: [{ username: 'ada', role: 'user' }],
        },
        { username: 'ada', leagues: [], userLeagues: [] }
      )
    ).toBe(true);
  });

  it('uses participantsCount, then current_participants, then the array', () => {
    expect(participantCount(listPayload)).toBe(401);
    expect(participantCount({ current_participants: 3 })).toBe(3);
    expect(participantCount({ participants: [{}, {}] })).toBe(2);
    expect(participantCount({})).toBe(0);
  });

  it('ignores a missing petition list', () => {
    expect(hasPendingPetition({}, 'ada')).toBe(false);
    expect(
      hasPendingPetition(
        {
          participantPetitions: [{ username: 'ada', status: 'pending' }],
        },
        'ada'
      )
    ).toBe(true);
  });
});
