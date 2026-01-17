import { Component, Input } from '@angular/core';
import { MatchStatus } from '../../../core/model/match';

@Component({
  selector: 'app-status-badge',
  imports: [],
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.css'
})
export class StatusBadgeComponent {
@Input() status: MatchStatus = 'Upcoming';
}
