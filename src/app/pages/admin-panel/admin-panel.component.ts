import { Component, inject } from '@angular/core';
import { TeamsService } from '../../core/services/teams.service';
import { Team } from '../../core/model/team';
import { Player } from '../../core/model/player';
import { Match } from '../../core/model/match';
import { AuthService } from '../../core/services/auth.service';
import { MatchesService } from '../../core/services/matches.service';
import { PlayersService } from '../../core/services/players.service';
import { fadeSlide } from '../../share/animations/animation';
import { FormsModule } from '@angular/forms';
import { IdUtil } from '../../core/utils/IdUtil';

@Component({
  selector: 'app-admin-panel',
  imports: [FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
  animations: [fadeSlide]
})
export class AdminPanelComponent {
 private teamsService = inject(TeamsService);
  private playersService = inject(PlayersService);
  private matchesService = inject(MatchesService);
  private auth = inject(AuthService);

  teams: Team[] = [];
  players: Player[] = [];
  matches: Match[] = [];

  // forms
  newTeamName: string = '';
  newMatchVenue: string = '';
  teamAId: string = '';
  teamBId: string = '';

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.teamsService.getTeams().subscribe({
      next: (t) => (this.teams = t),
      error: (err) => console.error('Teams load error', err),
    });

    this.playersService.getPlayers().subscribe({
      next: (p) => (this.players = p),
      error: (err) => console.error('Players load error', err),
    });

    this.matchesService.getMatches().subscribe({
      next: (m) => (this.matches = m),
      error: (err) => console.error('Matches load error', err),
    });
  }

  token(): string {
    return this.auth.getToken();
  }

  // -------------------------------
  // Teams CRUD
  // -------------------------------
  addTeam(): void {
    const name = this.newTeamName.trim();
    if (!name) return;

    const team: Team = {
      id: IdUtil.short('T'), // ✅ FIXED
      name: name,
      logoUrl: 'https://cdn-icons-png.flaticon.com/512/857/857455.png',
      city: 'Parbatipur',
      coach: 'Coach',
      createdOn: new Date().toISOString().slice(0, 10),
    };

    this.teamsService.addTeam(team, this.token()).subscribe({
      next: () => {
        this.newTeamName = '';
        this.loadAll();
      },
      error: (err) => console.error('Add Team error', err),
    });
  }

  deleteTeam(id: string): void {
    if (!confirm('Delete team?')) return;

    this.teamsService.deleteTeam(id, this.token()).subscribe({
      next: () => this.loadAll(),
      error: (err) => console.error('Delete Team error', err),
    });
  }

  // -------------------------------
  // Players CRUD (Quick Add)
  // -------------------------------
  addPlayerQuick(teamId: string): void {
    const name = prompt('Player Name?')?.trim();
    if (!name) return;

    const p: Player = {
      id: IdUtil.short('P'), // ✅ FIXED
      teamId,
      name,
      position: 'MF',
      jerseyNumber: Math.floor(Math.random() * 30) + 1,
      photoUrl: 'https://i.ibb.co/3mV2Yh5/player1.png',
    };

    this.playersService.addPlayer(p, this.token()).subscribe({
      next: () => this.loadAll(),
      error: (err) => console.error('Add Player error', err),
    });
  }

  // -------------------------------
  // Matches CRUD
  // -------------------------------
  addMatch(): void {
    if (!this.teamAId || !this.teamBId || this.teamAId === this.teamBId) {
      alert('Please select two different teams.');
      return;
    }

    const m: Match = {
      id: IdUtil.short('M'), // ✅ FIXED
      teamAId: this.teamAId,
      teamBId: this.teamBId,
      matchDateTime: new Date(Date.now() + 86400000).toISOString(),
      status: 'Upcoming',
      venue: this.newMatchVenue?.trim() || 'Parbatipur Stadium',
    };

    this.matchesService.addMatch(m, this.token()).subscribe({
      next: () => {
        this.teamAId = '';
        this.teamBId = '';
        this.newMatchVenue = '';
        this.loadAll();
      },
      error: (err) => console.error('Add Match error', err),
    });
  }

  markCompleted(match: Match): void {
    const a = Number(prompt('Team A score?', String(match.teamAScore ?? 0)));
    const b = Number(prompt('Team B score?', String(match.teamBScore ?? 0)));

    if (Number.isNaN(a) || Number.isNaN(b) || a < 0 || b < 0) {
      alert('Invalid score.');
      return;
    }

    const updated: Match = {
      ...match,
      teamAScore: a,
      teamBScore: b,
      status: 'Completed',
      winnerTeamId: a === b ? '' : a > b ? match.teamAId : match.teamBId,
    };

    this.matchesService.updateMatch(updated, this.token()).subscribe({
      next: () => this.loadAll(),
      error: (err) => console.error('Update Match error', err),
    });
  }

  deleteMatch(id: string): void {
    if (!confirm('Delete match?')) return;

    this.matchesService.deleteMatch(id, this.token()).subscribe({
      next: () => this.loadAll(),
      error: (err) => console.error('Delete Match error', err),
    });
  }

  // -------------------------------
  // Helpers
  // -------------------------------
  teamName(id: string): string {
    return this.teams.find((x) => x.id === id)?.name || id;
  }

  playersOf(teamId: string): Player[] {
    return this.players.filter((p) => p.teamId === teamId);
  }
}
