export interface Match {
    id: string;
  teamAId: string;
  teamBId: string;
  matchDateTime: string;
  status: MatchStatus;
  venue?: string;
  teamAScore?: number;
  teamBScore?: number;
  winnerTeamId?: string;
}

export type MatchStatus = 'Upcoming' | 'Completed';
