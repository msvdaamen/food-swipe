import { animate, style, transition, trigger } from '@angular/animations';

export const menuAnimation = [
  trigger('menuAnimation', [
    transition(':enter', [
      style({ height: 0, marginTop: 0 }),
      animate('250ms ease-in-out', style({ height: '*', marginTop: '*' })),
    ]),
    transition(':leave', [
      animate('250ms ease-in-out', style({ height: 0, marginTop: 0 })),
    ]),
  ]),
];
