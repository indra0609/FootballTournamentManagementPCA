import { Injectable } from '@angular/core';
import { Player } from '../model/player';
import { GoogleSheetService } from './google-sheet.service';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  constructor(private api: GoogleSheetService) {}

  getPlayers() {
    return this.api.post<Player[]>('getPlayers');
  }

  addPlayer(player: Player, token = '') {
    return this.api.post('addPlayer', { token, data: player });
  }

  updatePlayer(player: Player, token = '') {
    return this.api.post('updatePlayer', { token, data: player });
  }

  deletePlayer(id: string, token = '') {
    return this.api.post('deletePlayer', { token, id });
  }
}
