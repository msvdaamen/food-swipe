import { Component, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: 'app-tab-content',
  template: `<ng-template><ng-content></ng-content></ng-template>`,
})
export class TabContentComponent {
  template = viewChild.required(TemplateRef);
}
