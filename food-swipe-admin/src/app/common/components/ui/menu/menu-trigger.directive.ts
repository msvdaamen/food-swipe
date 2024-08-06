import {
  Directive,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import {
  CdkMenuTrigger,
  MENU_TRIGGER,
  PARENT_OR_NEW_MENU_STACK_PROVIDER,
} from '@angular/cdk/menu';
import {
  ConnectedPosition,
  HorizontalConnectionPos,
  Overlay,
  STANDARD_DROPDOWN_BELOW_POSITIONS,
  VerticalConnectionPos,
} from '@angular/cdk/overlay';

@Directive({
  selector: '[appMenuTrigger]',
  exportAs: 'appMenuTrigger',
  standalone: true,
  providers: [
    { provide: MENU_TRIGGER, useExisting: CdkMenuTrigger },
    PARENT_OR_NEW_MENU_STACK_PROVIDER,
  ],
})
export class MenuTriggerDirective extends CdkMenuTrigger {
  @Input('appMenuTrigger') override menuTemplateRef!: TemplateRef<any> | null;
  @Input('appMenuTriggerData') override menuData!: unknown;
  @Input('appMenuPosition') override menuPosition!: ConnectedPosition[];

  @Output('appMenuClosed') override readonly opened = new EventEmitter<void>();
  @Output('appMenuOpened') override readonly closed = new EventEmitter<void>();
}
