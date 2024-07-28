import {ChangeDetectionStrategy, Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {NavbarComponent} from "@common/components/ui/navbar/navbar.component";
import {FormCheckboxComponent} from "@common/components/ui/form/form-checkbox/form-checkbox.component";
import {FormRadioComponent} from "@common/components/ui/form/form-radio/form-radio.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FormCheckboxComponent, FormRadioComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {

}
