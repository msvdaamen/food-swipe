import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';

export class Service {
  protected readonly http = inject(HttpClient);
  protected readonly api = environment.api + '/v1';
}
