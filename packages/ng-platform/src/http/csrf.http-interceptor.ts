/*
 * Copyright (c) 2018 Michael Krotscheck
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Kangaroo-based API servers require that a CSRF header is included in all requests. This
 * injector provides this value.
 */
export class CsrfHttpInterceptor implements HttpInterceptor {

  /**
   * Decorate all requests with a CSRF header.
   *
   * @param request The incoming request.
   * @param next The next handler.
   * @returns The handled request.
   */
  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        'X-Requested-With': 'Kangaroo-Platform',
      },
    });
    return next.handle(request);
  }
}
