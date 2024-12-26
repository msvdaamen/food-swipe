import { ContentChildren, Directive, EventEmitter, HostBinding, Input, Output, QueryList, } from '@angular/core';
import { CdkMenu } from '@angular/cdk/menu';
import { MenuItemDirective } from './menu-item.directive';

let nextId = 0;

@Directive({
  selector: '[appMenu]',
  exportAs: 'appMenu',
  standalone: true,
})
export class MenuDirective extends CdkMenu {

  @Input() override id = `cdk-menu-${nextId++}`;

  @Output('appMenuClosed') override readonly closed = new EventEmitter<void>();

  @ContentChildren(MenuItemDirective, { descendants: true })
  override readonly items!: QueryList<MenuItemDirective>;

  @HostBinding('class') elementClass = ['menu'];
}
