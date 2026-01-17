import { Component, inject } from '@angular/core';
import { Team } from '../../core/model/team';
import { Match } from '../../core/model/match';
import { MatchesService } from '../../core/services/matches.service';
import { TeamsService } from '../../core/services/teams.service';
import { RouterLink } from '@angular/router';
import { StatusBadgeComponent } from '../../share/components/status-badge/status-badge.component';
import { fadeSlide } from '../../share/animations/animation';
import { DdMmmPipe } from '../../core/pipe/dd-mmm.pipe';

@Component({
  selector: 'app-matches',
  imports: [RouterLink, StatusBadgeComponent, DdMmmPipe],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.css',
  animations: [fadeSlide]

})
export class MatchesComponent {
  private matchesService = inject(MatchesService);
  private teamsService = inject(TeamsService);

  teams: Team[] = [];
  matches: Match[] = [];

  ngOnInit(): void {
    this.teamsService.getTeams().subscribe(t => (this.teams = t));
    this.matchesService.getMatches().subscribe(m => (this.matches = m));
  }

  teamName(id: string) {
    return this.teams.find(x => x.id === id)?.name || id;
  }

  get upcoming() {
    return this.matches.filter(x => x.status === 'Upcoming');
  }

  get completed() {
    return this.matches.filter(x => x.status === 'Completed');
  }
}
