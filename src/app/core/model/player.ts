export interface Player {
     id: string;
  teamId: string;
  name: string;
  position: PlayerPosition;
  jerseyNumber: number;
  photoUrl?: string;
}

export type PlayerPosition = 'GK' | 'DF' | 'MF' | 'FW';

