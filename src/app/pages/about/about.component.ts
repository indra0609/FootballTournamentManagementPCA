import { Component } from '@angular/core';
import { fadeSlide } from '../../share/animations/animation';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  animations: [fadeSlide]
})
export class AboutComponent {

}
