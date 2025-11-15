import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { PlaylistsComponent } from '../components/playlists/playlists.component';
import { LoginComponent } from '../components/login/login.component';
import { PlaylistComponent } from '../components/playlist/playlist.component';
import { SettingsComponent } from '../components/settings/settings.component';
import { CallbackComponent } from '../components/callback/callback.component';
import { NowPlayingComponent } from '../components/now-playing/now-playing.component';
import { StatsComponent } from '../components/stats/stats.component';
import { AlbumComponent } from '../components/album/album.component';
import { ArtistComponent } from '../components/artist/artist.component';

const routes: Routes = [
  {
    path: '',
    component: PlaylistsComponent,
  },
  {
    path: 'artist',
    component: ArtistComponent,
  },
  {
    path: 'album',
    component: AlbumComponent,
  },
  {
    path: 'search',
    component: DashboardComponent,
  },
  {
    path: 'playlists',
    component: PlaylistsComponent,
  },
  {
    path: 'playlist',
    component: PlaylistComponent,
  },
  {
    path: 'nowplaying',
    component: NowPlayingComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'stats',
    component: StatsComponent,
  },
  {
    path: 'callback',
    component: CallbackComponent,
  },
  // Wildcard route must be last - catches any unmatched routes including callback with fragments
  {
    path: '**',
    component: CallbackComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
