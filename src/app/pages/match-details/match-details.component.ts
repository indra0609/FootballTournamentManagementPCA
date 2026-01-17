import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatchesService } from '../../core/services/matches.service';
import { TeamsService } from '../../core/services/teams.service';
import { Match } from '../../core/model/match';
import { Team } from '../../core/model/team';
import { StatusBadgeComponent } from '../../share/components/status-badge/status-badge.component';
import { fadeSlide } from '../../share/animations/animation';

@Component({
  selector: 'app-match-details',
  imports: [RouterLink, StatusBadgeComponent],
  templateUrl: './match-details.component.html',
  styleUrl: './match-details.component.css',
  animations: [fadeSlide]

})
export class MatchDetailsComponent {
private route = inject(ActivatedRoute);
  private matchesService = inject(MatchesService);
  private teamsService = inject(TeamsService);

  match?: Match;
  teams: Team[] = [];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.teamsService.getTeams().subscribe(t => (this.teams = t));
    this.matchesService.getMatches().subscribe(m => {
      this.match = m.find(x => x.id === id);
    });
  }

  teamName(id: string) {
    return this.teams.find(x => x.id === id)?.name || id;
  }
}
