import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {Location, LocationStrategy, PathLocationStrategy} from "@angular/common";

@Component({
  selector: 'callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css'],
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})
export class CallbackComponent implements OnInit {

  public accessToken: string;
  public tokenType: string;
  public expiresIn: string;
  public queryStringArray: Array<string>;

  constructor(private location: Location, private router: Router) {
    console.log('CallbackComponent constructor');
    const queryString = this.location.path(true).substring(10);
    this.queryStringArray = queryString.split('&');
  }

  getQueryVariable(variable) {
    for (let i = 0; i < this.queryStringArray.length; i++) {
      const pair = this.queryStringArray[i].split('=');
      if (decodeURIComponent(pair[0]) == variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    console.log('Query variable %s not found', variable);
  }

  ngOnInit() {
    console.log('CallbackComponent initialized');
    // feedback
    this.accessToken = this.getQueryVariable('access_token');
    this.tokenType = this.getQueryVariable('token_type');
    this.expiresIn = this.getQueryVariable('expires_in');
    // set token
    localStorage.setItem('bearerToken', this.accessToken);
    console.log('CallbackComponent Updated bearerToken locally', this.accessToken);
    // redirect
    const savedState = localStorage.getItem('savedState');
    if (savedState !== null && savedState !== undefined) {
      console.log('Navigating to saved state of ' + savedState);
      this.router.navigateByUrl('/' + savedState);
    }
  }

}
