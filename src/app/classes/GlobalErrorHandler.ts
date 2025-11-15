import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    // console.log('GlobalErrorHandler handleError', error);
    if (error.message === 'Unauthorized') {
      // this.alertService.warn('Need to re-authorize');
      console.log('GlobalErrorHandler: Need to re-authorize');
      // window.open(this._spotifyService.getAuthorizeURL(), '_self');
    } else {
      console.log(`GlobalErrorHandler`, error);
    }
    // throw new Error(error.message);
  }
}
