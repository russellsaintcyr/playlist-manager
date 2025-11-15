import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AlertService {
  private toastr = inject(ToastrService);

  success(message: string, keepAfterRouteChange = false) {
    this.toastr.success(message);
  }

  error(message: string, keepAfterRouteChange = false) {
    this.toastr.error(message);
  }

  info(message: string, keepAfterRouteChange = false) {
    this.toastr.info(message);
  }

  warn(message: string, keepAfterRouteChange = false) {
    this.toastr.warning(message);
  }

}
