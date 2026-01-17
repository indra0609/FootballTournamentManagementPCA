import { Component, inject } from '@angular/core';
import { TeamsService } from '../../core/services/teams.service';
import { Team } from '../../core/model/team';
import { fadeSlide } from '../../share/animations/animation';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-teams',
  imports: [FormsModule, RouterLink],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.css',
  animations: [fadeSlide]
})
export class TeamsComponent {
private teamsService = inject(TeamsService);
  teams: Team[] = [];
  q = '';

  ngOnInit(): void {
    this.teamsService.getTeams().subscribe(t => (this.teams = t));
  }

  get filtered() {
    const s = this.q.trim().toLowerCase();
    if (!s) return this.teams;
    return this.teams.filter(x => x.name.toLowerCase().includes(s) || (x.city || '').toLowerCase().includes(s));
  }

}
