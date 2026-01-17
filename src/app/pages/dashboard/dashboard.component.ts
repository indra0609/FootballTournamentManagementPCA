// import { Component, OnInit, inject } from '@angular/core';
// import { Team } from '../../core/model/team';
// import { Match } from '../../core/model/match';
// import { TeamsService } from '../../core/services/teams.service';
// import { MatchesService } from '../../core/services/matches.service';
// import { fadeSlide, popIn } from '../../share/animations/animation';
// import { RouterLink } from '@angular/router';

// @Component({
//   selector: 'app-dashboard',
//   imports: [RouterLink],
//   templateUrl: './dashboard.component.html',
//   styleUrl: './dashboard.component.css',
//   animations: [fadeSlide, popIn]
// })
// export class DashboardComponent {
//   private teamsService = inject(TeamsService);
//   private matchesService = inject(MatchesService);

//   teams: Team[] = [];
//   matches: Match[] = [];

//   ngOnInit(): void {
//     this.teamsService.getTeams().subscribe(t => (this.teams = t));
//     this.matchesService.getMatches().subscribe(m => (this.matches = m));
//   }

//   get upcomingCount() {
//     return this.matches.filter(x => x.status === 'Upcoming').length;
//   }
//   get completedCount() {
//     return this.matches.filter(x => x.status === 'Completed').length;
//   }
// }
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Team } from '../../core/model/team';
import { Match } from '../../core/model/match';
import { TeamsService } from '../../core/services/teams.service';
import { MatchesService } from '../../core/services/matches.service';

import { fadeSlide, popIn } from '../../share/animations/animation';
import { DdMmmPipe } from '../../core/pipe/dd-mmm.pipe';
import { ShortNamePipe } from '../../core/pipe/short-name.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DdMmmPipe, ShortNamePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  animations: [fadeSlide, popIn]
})
export class DashboardComponent implements OnInit {
  private teamsService = inject(TeamsService);
  private matchesService = inject(MatchesService);

  teams: Team[] = [];
  matches: Match[] = [];

  // ✅ countdown
  countdownText: string = '--:--:--';
  private timerId: any;

  ngOnInit(): void {
    this.teamsService.getTeams().subscribe(t => (this.teams = t));

    this.matchesService.getMatches().subscribe(m => {
      this.matches = m;
      this.startCountdown();
    });
  }

  ngOnDestroy(): void {
    if (this.timerId) clearInterval(this.timerId);
  }

  teamName(id: string): string {
    return this.teams.find(t => t.id === id)?.name ?? id;
  }

  get upcomingCount(): number {
    return this.matches.filter(x => x.status === 'Upcoming').length;
  }

  get completedCount(): number {
    return this.matches.filter(x => x.status === 'Completed').length;
  }

  // ✅ next 2 upcoming matches ASC
  get upcomingTop2(): Match[] {
    return this.matches
      .filter(x => x.status === 'Upcoming')
      .sort((a, b) => +new Date(a.matchDateTime) - +new Date(b.matchDateTime))
      .slice(0, 2);
  }

  // ✅ last 2 completed matches DESC
  get completedTop2(): Match[] {
    return this.matches
      .filter(x => x.status === 'Completed')
      .sort((a, b) => +new Date(b.matchDateTime) - +new Date(a.matchDateTime))
      .slice(0, 2);
  }

  // ✅ latest completed match
  get latestResult(): Match | undefined {
    return this.matches
      .filter(x => x.status === 'Completed')
      .sort((a, b) => +new Date(b.matchDateTime) - +new Date(a.matchDateTime))[0];
  }

  // ✅ next upcoming match
  get nextMatch(): Match | undefined {
    return this.matches
      .filter(x => x.status === 'Upcoming')
      .sort((a, b) => +new Date(a.matchDateTime) - +new Date(b.matchDateTime))[0];
  }

  scoreText(m: Match): string {
    const a = m.teamAScore ?? '-';
    const b = m.teamBScore ?? '-';
    return `${a} : ${b}`;
  }

  winnerText(m: Match): string {
    if (!m.winnerTeamId) return 'Draw';
    return this.teamName(m.winnerTeamId);
  }

  // ✅ LIVE COUNTDOWN
  private startCountdown() {
    if (this.timerId) clearInterval(this.timerId);

    this.timerId = setInterval(() => {
      const match = this.nextMatch;
      if (!match) {
        this.countdownText = 'No upcoming match';
        return;
      }

      const target = new Date(match.matchDateTime).getTime();
      const now = Date.now();
      let diff = Math.max(0, target - now);

      const hh = Math.floor(diff / (1000 * 60 * 60));
      diff %= (1000 * 60 * 60);
      const mm = Math.floor(diff / (1000 * 60));
      diff %= (1000 * 60);
      const ss = Math.floor(diff / 1000);

      const pad = (n: number) => String(n).padStart(2, '0');
      this.countdownText = `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
    }, 1000);
  }
}
