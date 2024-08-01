import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { IonRippleEffect } from '@ionic/angular/standalone';

type Color = 'primary' | 'secondary' | 'default' | 'transparent';
type Size = 'auto' | 'small' | 'medium' | 'large' | 'full' | 'icon';
type Type = 'normal' | 'icon';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [FaIconComponent, IonRippleEffect],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  private readonly breakPointObserver = inject(BreakpointObserver);

  color = input<Color>('primary');
  size = input<Size>('auto');
  mobileText = input(true);
  icon = input<IconName | null>(null);
  disabled = input(false);
  rounded = input(false, { transform: booleanAttribute });
  type = input<Type>('normal');

  isMobile = toSignal(
    this.breakPointObserver
      .observe('(max-width: 599px)')
      .pipe(map((breakPoint) => breakPoint.matches)),
  );
}
