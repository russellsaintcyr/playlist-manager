import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'callback',
    templateUrl: './callback.component.html',
    styleUrls: ['./callback.component.css'],
})
export class CallbackComponent implements OnInit {
  // Injected dependencies
  private router = inject(Router);

  // Public properties
  public accessToken: string | undefined;
  public tokenType: string | undefined;
  public expiresIn: string | undefined;
  public queryStringArray: Array<string> = [];

  constructor() {
    console.log('CallbackComponent constructor called');
    // Extract the fragment from the URL)
    const fragment = window.location.hash.substring(2); // Remove the #/
    console.log('Fragment decoded:', decodeURIComponent(fragment));
    
    if (fragment && fragment.length > 0) {
      this.queryStringArray = decodeURIComponent(fragment).split('&');
      console.log('Query string array:', this.queryStringArray);
    }
  }

  getQueryVariable(variable: string): string | undefined {
    for (let i = 0; i < this.queryStringArray.length; i++) {
      const pair = this.queryStringArray[i].split('=');
      if (pair[0] === variable) {
        return pair[1];
      }
    }
    console.log('Query variable %s not found', variable);
    return undefined;
  }

  ngOnInit() {
    // feedback
    this.accessToken = this.getQueryVariable('access_token');
    this.tokenType = this.getQueryVariable('token_type');
    this.expiresIn = this.getQueryVariable('expires_in');
    // console.log('Extracted token:', this.accessToken);
    
    // set token if we got one
    if (this.accessToken) {
      localStorage.setItem('bearerToken', this.accessToken);
      console.log('CallbackComponent Updated bearerToken locally', this.accessToken);
      
      // redirect to saved state
      const savedState = localStorage.getItem('savedState');
      if (savedState !== null && savedState !== undefined) {
        console.log('Navigating to saved state of ' + savedState);
        this.router.navigateByUrl('/' + savedState);
      } else {
        console.log('No saved state found, navigating to home');
        this.router.navigateByUrl('/');
      }
    } else {
      console.log('No access token found in URL');
      // If no token in URL, check if we already have one in localStorage
      const existingToken = localStorage.getItem('bearerToken');
      if (!existingToken) {
        // Redirect to login if no token at all
        this.router.navigateByUrl('/login');
      }
    }
  }
}
