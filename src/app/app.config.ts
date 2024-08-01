import {
  provideHttpClient,
  withFetch,
  //withInterceptors,
} from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
//import { ErrorResponseInterceptor } from './shared/error-response.interceptor';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      //withInterceptors(),
    ), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(),
  ],
};
