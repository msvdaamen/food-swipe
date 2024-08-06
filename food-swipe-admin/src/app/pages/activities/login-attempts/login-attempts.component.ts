import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login-attempts',
  standalone: true,
  imports: [FaIconComponent],
  templateUrl: './login-attempts.component.html',
  styleUrl: './login-attempts.component.scss',
})
export default class LoginAttemptsComponent {
  protected readonly faArrowUp = faArrowUp;
}
