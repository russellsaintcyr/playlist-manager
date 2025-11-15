import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { AlertService } from '../../services/alert.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [SpotifyService],
    standalone: true,
})
export class LoginComponent implements OnInit {
  constructor(
    private _spotifyService: SpotifyService,
    private alertService: AlertService
  ) {}

  ngOnInit() {}

  authorizeUser() {
    window.open(this._spotifyService.getAuthorizeURL(), '_self');
  }
}
