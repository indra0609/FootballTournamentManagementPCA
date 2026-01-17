import { Injectable } from '@angular/core';
import { Team } from '../model/team';
import { GoogleSheetService } from './google-sheet.service';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  constructor(private api: GoogleSheetService) {}

  getTeams() {
    return this.api.post<Team[]>('getTeams');
  }

  addTeam(team: Team, token = '') {
    return this.api.post('addTeam', { token, data: team });
  }

  updateTeam(team: Team, token = '') {
    return this.api.post('updateTeam', { token, data: team });
  }

  deleteTeam(id: string, token = '') {
    return this.api.post('deleteTeam', { token, id });
  }
}
