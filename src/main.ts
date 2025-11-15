import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { ErrorHandler, importProvidersFrom } from '@angular/core';
import { GlobalErrorHandler } from './app/classes/GlobalErrorHandler';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AlertService } from './app/services/alert.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app/app-routing/app-routing.module';
import { AppComponent } from './app/app.component';

if (environment.production) {
  // Production mode enabled for performance optimizations.
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, ToastrModule.forRoot(), FormsModule, AppRoutingModule),
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler,
        },
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy,
        },
        AlertService,
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations()
    ]
})
  .catch((err) => console.error(err));
