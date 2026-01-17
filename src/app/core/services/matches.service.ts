import { Injectable } from '@angular/core';
import { Match } from '../model/match';
import { GoogleSheetService } from './google-sheet.service';

@Injectable({
  providedIn: 'root'
})
export class MatchesService {

  constructor(private api: GoogleSheetService) {}

  getMatches() {
    return this.api.post<Match[]>('getMatches');
  }

  addMatch(match: Match, token = '') {
    return this.api.post('addMatch', { token, data: match });
  }

  updateMatch(match: Match, token = '') {
    return this.api.post('updateMatch', { token, data: match });
  }

  deleteMatch(id: string, token = '') {
    return this.api.post('deleteMatch', { token, id });
  }

}
