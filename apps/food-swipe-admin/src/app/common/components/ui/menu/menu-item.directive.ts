import { Directive, EventEmitter, HostBinding, Output } from '@angular/core';
import { CdkMenuItem } from '@angular/cdk/menu';

@Directive({
  selector: '[appMenuItem]',
  exportAs: 'appMenuItem',
  standalone: true,
})
export class MenuItemDirective extends CdkMenuItem {
  @Output('appMenuItemTriggered') override readonly triggered =
    new EventEmitter<void>();

  @HostBinding('class') elementClass = ['menu-item'];
}
