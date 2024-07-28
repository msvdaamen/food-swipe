import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

type Color = 'primary' | 'secondary' | 'default';
type Size = 'auto' | 'small' | 'medium' | 'large' | 'full';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [FaIconComponent],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  private readonly breakPointObserver = inject(BreakpointObserver);

  @Input() color: Color = 'primary';
  @Input() size: Size = 'auto';
  @Input() mobileText = true;
  @Input() icon: IconName | null = null;
  @Input() disabled = false;

  isMobile = toSignal(
    this.breakPointObserver
      .observe('(max-width: 599px)')
      .pipe(map((breakPoint) => breakPoint.matches)),
  );
}
