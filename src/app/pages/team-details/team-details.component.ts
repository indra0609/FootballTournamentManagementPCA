import { Component, inject } from '@angular/core';
import { Team } from '../../core/model/team';
import { ActivatedRoute } from '@angular/router';
import { TeamsService } from '../../core/services/teams.service';
import { PlayersService } from '../../core/services/players.service';
import { Player } from '../../core/model/player';
import { fadeSlide } from '../../share/animations/animation';

@Component({
  selector: 'app-team-details',
  imports: [],
  templateUrl: './team-details.component.html',
  styleUrl: './team-details.component.css',
  animations: [fadeSlide]

})
export class TeamDetailsComponent {
  private route = inject(ActivatedRoute);
  private teamsService = inject(TeamsService);
  private playersService = inject(PlayersService);

  team?: Team;
  players: Player[] = [];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.teamsService.getTeams().subscribe(ts => {
      this.team = ts.find(x => x.id === id);
    });
    this.playersService.getPlayers().subscribe(ps => {
      this.players = ps.filter(x => x.teamId === id);
    });
  }
}
