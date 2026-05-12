import { InjectionToken } from '@angular/core';

import { AppEnvironment } from '../models/app-environment.model';

export const APP_ENVIRONMENT = new InjectionToken<AppEnvironment>(
  'APP_ENVIRONMENT'
);
