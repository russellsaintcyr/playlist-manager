import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { PlaylistsComponent } from './components/playlists/playlists.component';
import { LoginComponent } from './components/login/login.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CallbackComponent } from './components/callback/callback.component';
import { GlobalErrorHandler } from './classes/GlobalErrorHandler';
import { AlertService } from './services/alert.service';
import { NowPlayingComponent } from './components/now-playing/now-playing.component';
import { StatsComponent } from './components/stats/stats.component';
import { AlbumComponent } from './components/album/album.component';
import { ArtistComponent } from './components/artist/artist.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({ declarations: [
        AppComponent,
        NavbarComponent,
        DashboardComponent,
        FooterComponent,
        HeaderComponent,
        PlaylistsComponent,
        LoginComponent,
        PlaylistComponent,
        SettingsComponent,
        CallbackComponent,
        NowPlayingComponent,
        StatsComponent,
        AlbumComponent,
        ArtistComponent,
    ],
    bootstrap: [AppComponent], imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        FormsModule,
        AppRoutingModule
    ], providers: [
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
    ] })
export class AppModule {}
