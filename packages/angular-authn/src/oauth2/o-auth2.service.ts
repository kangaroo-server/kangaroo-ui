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

import { HttpBackend, HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { combineLatest, from, Observable, ObservableInput, throwError } from 'rxjs';
import { first, flatMap, map, share, switchMap, tap } from 'rxjs/operators';
import { OAUTH2_API_ROOT, OAUTH2_CLIENT_ID, OAUTH2_CLIENT_SCOPES } from './contracts';
import { OAuth2Token } from './model/o-auth2-token';
import { OAuth2TokenDetails } from './model/o-auth2-token-details';
import { OAuth2TokenSubject } from './o-auth2-token.subject';

/**
 * This service manages the token lifecycle, and ensures that there is always a valid
 * toke available.
 *
 * @author Michael Krotscheck
 */
@Injectable()
export class OAuth2Service {

  /**
   * Common http headers, usually provided by the interceptors.
   */
  private readonly commonHeaders: HttpHeaders = new HttpHeaders({
    'X-Requested-With': 'Kangaroo-Platform',
  });

  /**
   * Token endpoint.
   */
  private readonly tokenRoot: Observable<string>;

  /**
   * Introspection endpoint.
   */
  private readonly introspectRoot: Observable<string>;

  /**
   * Revocation endpoint.
   */
  private readonly revokeRoot: Observable<string>;

  /**
   * List of required scopes for this application.
   */
  private readonly scopes: Observable<string[]>;

  /**
   * The client id.
   */
  private readonly clientId: Observable<string>;

  /**
   * Privately created http client, so we can bypass any interceptors.
   */
  private readonly http: HttpClient;

  /**
   * The current list of refresh requests.
   */
  private refreshRequests: Map<string, Observable<OAuth2Token>> = new Map<string, Observable<OAuth2Token>>();

  /**
   * A new instance of this service.
   *
   * @param apiRoot The root URL off of which we build our request URL's.
   * @param clientInput The client input.
   * @param scopeInput The configured scopes.
   * @param backend The http backend.
   * @param subject The subject, used for data persistence.
   */
  constructor(@Optional() @Inject(OAUTH2_API_ROOT) apiRoot: ObservableInput<string>,
              @Inject(OAUTH2_CLIENT_ID) private clientInput: ObservableInput<string>,
              @Inject(OAUTH2_CLIENT_SCOPES) private scopeInput: ObservableInput<string[]>,
              @Inject(HttpBackend) backend: HttpBackend,
              @Inject(OAuth2TokenSubject) private subject: OAuth2TokenSubject) {
    this.http = new HttpClient(backend);
    this.scopes = from(scopeInput);
    this.clientId = from(clientInput);
    const rootObservable = from(apiRoot);

    this.tokenRoot = rootObservable.pipe(map((root) => `${root}/token`));
    this.introspectRoot = rootObservable.pipe(map((root) => `${root}/introspect`));
    this.revokeRoot = rootObservable.pipe(map((root) => `${root}/revoke`));
  }

  /**
   * For now, we only support owner credentials.
   */
  public login(user: string, password: string): Observable<OAuth2Token> {

    if (!user || !password) {
      return throwError('No login or password provided');
    }

    const loginParams: Observable<HttpParams> =
      combineLatest(this.clientId, this.scopes)
        .pipe(
          map(([ clientId, scopes ]) => new HttpParams({
            fromObject: {
              grant_type: 'password',
              client_id: clientId,
              username: user,
              password,
              scope: scopes && scopes.join(' ') || null,
            },
          })));

    return combineLatest(this.tokenRoot, loginParams)
      .pipe(
        flatMap(([ url, params ]) => this.http.post(url, params, {
          observe: 'response',
          headers: this.commonHeaders,
        })),
        map((response: HttpResponse<OAuth2Token>) => this.annotateResponseDate(response)),
        tap((token) => this.subject.next(token)),
        first(),
      );
  }

  /**
   * Refresh the oauth2 token.
   *
   * @returns An observable that will contain the refreshed token.
   */
  public refresh(token: OAuth2Token): Observable<OAuth2Token> {
    if (!token || !token.refresh_token) {
      return throwError('No Refresh Token');
    }

    const refreshToken = token.refresh_token;
    if (!this.refreshRequests.has(refreshToken)) {
      const refreshParams: Observable<HttpParams> = this.clientId
        .pipe(
          map((clientId) => new HttpParams({
            fromObject: {
              grant_type: 'refresh_token',
              client_id: clientId,
              refresh_token: token.refresh_token,
              scope: token.scope,
            },
          })),
        );

      const refreshRequest = combineLatest(this.tokenRoot, refreshParams)
        .pipe(
          first(),
          switchMap(([ url, params ]) => this.http.post(url, params, {
            observe: 'response',
            headers: this.commonHeaders,
          })),
          map((response: HttpResponse<OAuth2Token>) => this.annotateResponseDate(response)),
          tap(
            (newToken) => this.subject.next(newToken),
            () => this.subject.next(null)),
          share(),
        );

      this.refreshRequests.set(token.refresh_token, refreshRequest);
    }

    // This approach only works because JS is, effectively, single threaded.
    return this.refreshRequests.get(refreshToken);
  }

  /**
   * Introspect the current values of this token.
   *
   * @param token The token to introspect.
   * @returns An observable introspection response.
   */
  public introspect(token: OAuth2Token): Observable<OAuth2TokenDetails> {

    if (!token || !token.access_token || !token.token_type) {
      return throwError('Empty Token');
    }

    const params = new HttpParams({
      fromObject: {
        token: token.access_token,
      },
    });
    const headers = this.commonHeaders
      .append('Authorization', `${token.token_type} ${token.access_token}`);

    return this
      .introspectRoot
      .pipe(
        flatMap((apiRoot) => this.http.post<OAuth2TokenDetails>(
          apiRoot,
          params,
          {observe: 'body', headers},
        )),
        first(),
      );
  }

  /**
   * Revoke the current token.
   *
   * @param token The token to revoke.
   * @returns An empty observable.
   */
  public revoke(token: OAuth2Token): Observable<boolean> {

    if (!token || !token.access_token || !token.token_type) {
      return throwError('Empty token');
    }

    const params = new HttpParams({
      fromObject: {
        token: token.access_token,
      },
    });
    const headers = this.commonHeaders
      .append('Authorization', `${token.token_type} ${token.access_token}`);

    return this
      .revokeRoot
      .pipe(
        flatMap((apiRoot) => this.http.post(
          apiRoot,
          params, {headers, observe: 'response'},
        )),
        first(),
        map((response) => response.status === 205),
        tap(() => this.subject.next(null)),
      );
  }

  /**
   * Given an HTTP response with a valid oauth2 token, this method extracts the Date header of the response
   * and annotates the token with it, so we have an accurate representation of when the token expires.
   *
   * @param response The response to parse.
   * @returns The parsed OAuth2 Token.
   */
  private annotateResponseDate(response: HttpResponse<OAuth2Token>): OAuth2Token {
    let dateInMillis = Date.now();
    try {
      dateInMillis = Date.parse(response.headers.get('Date'));
    } catch (e) {
      // do nothing, fall back to the other value.
    }

    return Object.assign({}, response.body, {issue_date: Math.floor(dateInMillis / 1000)});
  }
}
