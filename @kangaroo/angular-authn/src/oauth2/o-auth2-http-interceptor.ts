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
 */

import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { OAuth2TokenSubject } from './o-auth2-token.subject';
import { Observable } from 'rxjs/Observable';
import { TokenUtil } from './util/token.util';
import { OAuth2Token } from './model/o-auth2-token';
import { OAuth2Service } from './o-auth2.service';
import 'rxjs/add/operator/switchMap';

/**
 * This subject contains our OAuth2 token in its raw form.
 *
 * @author Michael Krotscheck
 */
@Injectable()
export class OAuth2HttpInterceptor implements HttpInterceptor {

  /**
   * New instance.
   *
   * @param tokenSubject The oauth2 authorization token subject.
   * @param authService The Authorization service used.
   */
  public constructor(private tokenSubject: OAuth2TokenSubject,
                     private authService: OAuth2Service) {

  }

  /**
   * If available, annotate the request.
   *
   * @param req The current request.
   * @param next The next handler in the chain.
   * @returns The responding event broker.
   */
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(this.addToken(req, this.tokenSubject.value))
      .catch((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.authService
            .refresh(this.tokenSubject.value)
            .catch(() => Observable.throw(error))
            .switchMap((token) => next.handle(this.addToken(req, token)));
        } else {
          return Observable.throw(error);
        }
      });
  }

  /**
   * Add the token to the passed request.
   *
   * @param req The request to annotate.
   * @returns The annotated request.
   */
  private addToken(req: HttpRequest<any>, token: OAuth2Token): HttpRequest<any> {
    console.log(token);
    if (!TokenUtil.isValid(token)) {
      return req;
    }

    return req.clone({
      setHeaders: {
        'Authorization': `${token.token_type} ${token.access_token}`
      }
    });
  }
}
