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

import { ChangeDetectorRef, Component } from '@angular/core';
import { KangarooConfigurationSubject } from '../config';
import { NavigationCancel, Router } from '@angular/router';
import { LoggedInSubject, OAuth2Service, OAuth2TokenSubject } from '@kangaroo/angular-authn';
import 'rxjs/add/observable/if';
import { MobileMediaQuery } from '../layout';

/**
 * Our root application component. Upon initialization, it will make sure that the application has been
 * properly configured. If the configuration errors out, then it will replace the entire UI route tree with the
 * cannot-configure routes.
 *
 * @author Michael Krotscheck
 */
@Component({
  selector: 'kng-app',
  templateUrl: './app.component.html',
  styleUrls: [ 'app.component.scss' ]
})
export class AppComponent {

  /**
   * Is the user currently logged in?
   */
  public loggedIn = false;

  /**
   * Internal toggle, controlling whether the side menu's open.
   */
  public menuOpened = false;

  /**
   * Persistent event listener reference for screen size changes.
   */
  private _mobileQueryListener: () => void;

  /**
   * On initialization, watch the configuration load. If it fails, redirect
   * to configuration-failed.
   *
   * @param configProvider Configuration Provider.
   * @param loggedInSubject Is the user logged in?
   * @param router The router.
   * @param changeDetectorRef The application change detector.
   * @param mobileQuery Mobile Media Query, providing an event dispatcher for listening for when the screen changes.
   */
  constructor(private configProvider: KangarooConfigurationSubject,
              private loggedInSubject: LoggedInSubject,
              private tokenSubject: OAuth2TokenSubject,
              private tokenService: OAuth2Service,
              private router: Router,
              changeDetectorRef: ChangeDetectorRef,
              public mobileQuery: MobileMediaQuery) {

    // Setup the change watcher for the media query.
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    // If we cannot configure the application, redirect to /configuration-failed.
    this.configProvider
      .subscribe(
        null,
        () => router.navigateByUrl('/configuration-failed'));

    // If one of our route guards fails, redirect the user to the root of the application.
    this.router.events
      .filter((e) => (e instanceof NavigationCancel))
      .map((e: NavigationCancel) => {
        switch (e.url) {
          case '/dashboard':
            return '/login';
          default:
            return '/dashboard';
        }
      })
      .subscribe((nextRoute) => this.router.navigateByUrl(nextRoute));

    // If the user suddenly logs out, redirect to logout.
    this.loggedInSubject
      .do((loggedIn) => this.loggedIn = loggedIn)
      .filter((loggedIn) => !loggedIn)
      .do(() => this.menuOpened = false)
      .subscribe(() => this.router.navigateByUrl('/login'));
  }

  /**
   * Issue a token revocation request with the current token.
   */
  public logout() {
    this.tokenSubject
      .switchMap((token) => this.tokenService.revoke(token))
      .subscribe();
  }
}
