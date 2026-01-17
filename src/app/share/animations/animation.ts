import { animate, style, transition, trigger } from '@angular/animations';

export const fadeSlide = trigger('fadeSlide', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(10px)' }),
    animate('380ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

export const popIn = trigger('popIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(.97)' }),
    animate('220ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
  ])
]);
