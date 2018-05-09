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

import { LayoutModule } from '@angular/cdk/layout';
import { Location } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationCancel, Router, RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggedInSubject, OAuth2Service, OAuth2Token, OAuth2TokenSubject } from '@kangaroo/angular-authn';
import { NoopComponent } from '@kangaroo/angular-platform';
import { BehaviorSubject, of } from 'rxjs';
import { ConfigModule } from '../config';
import { KangarooLayoutModule, MobileMediaQuery } from '../layout';
import { AppComponent } from './app.component';

describe('AppComponent', () => {

  let loggedInSubject: BehaviorSubject<boolean>;
  let tokenSubject: BehaviorSubject<OAuth2Token>;
  let tokenService: OAuth2Service;
  let mockMediaQuery;

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const validToken: OAuth2Token = {
    access_token: 'access_token_1',
    refresh_token: 'refresh_token_1',
    issue_date: nowInSeconds - 100,
    expires_in: 3600,
    token_type: 'Bearer',
  };

  beforeEach(() => {
    loggedInSubject = new BehaviorSubject(true);
    tokenSubject = new BehaviorSubject(validToken);
    tokenService = {
      revoke: () => {
      },
    } as any;
    mockMediaQuery = {
      listeners: [],
      addListener: (listener) => {
        mockMediaQuery.listeners.push(listener);
      },
      removeListener: () => {
      },
    };

    TestBed.configureTestingModule({
      providers: [
        {provide: LoggedInSubject, useValue: loggedInSubject},
        {provide: OAuth2TokenSubject, useValue: tokenSubject},
        {provide: OAuth2Service, useValue: tokenService},
      ],
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'configuration-failed', component: NoopComponent},
          {path: 'login', component: NoopComponent},
          {path: 'dashboard', component: NoopComponent},
        ]),
        ConfigModule,
        HttpClientTestingModule,
        KangarooLayoutModule,
        NoopAnimationsModule,
        LayoutModule,
      ],
      declarations: [
        NoopComponent,
        AppComponent,
      ],
    })
      .overrideProvider(MobileMediaQuery, {
        useValue: mockMediaQuery,
      });
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should contain a header`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const header = fixture.debugElement.query(By.css('mat-toolbar'));
    expect(header).toBeDefined();
  }));

  it('should contain a router outlet', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const outlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(outlet).toBeDefined();
  }));

  it('should redirect if the configuration fails',
    async(inject([ HttpTestingController, Location ], (http, location) => {
      const fixture = TestBed.createComponent(AppComponent);

      http
        .expectOne((req) => {
          return req.url.indexOf('/v1/config') > -1;
        })
        .error(null, {status: 404, statusText: 'not found'});

      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          expect(location.path()).toBe('/configuration-failed');
        });
    })));

  it('should redirect to /login if a /dashboard nav cancels.',
    async(inject([ Router ], (router) => {
      TestBed.createComponent(AppComponent);
      const navSpy = spyOn(router, 'navigateByUrl').and.callThrough();
      router.events.next(new NavigationCancel(1, '/dashboard', ''));
      expect(navSpy).toHaveBeenCalledWith('/login');
    })));

  it('should redirect to /dashboard if a /login nav cancels.',
    async(inject([ Router ], (router) => {
      TestBed.createComponent(AppComponent);
      const navSpy = spyOn(router, 'navigateByUrl').and.callThrough();
      router.events.next(new NavigationCancel(1, '/login', ''));
      expect(navSpy).toHaveBeenCalledWith('/dashboard');
    })));

  it('should automatically navigate to /login if the user logs out.',
    async(inject([ Router, LoggedInSubject ], (router, loggedIn) => {
      TestBed.createComponent(AppComponent);
      const navSpy = spyOn(router, 'navigateByUrl').and.callThrough();
      loggedIn.next(false);
      expect(navSpy).toHaveBeenCalledWith('/login');
    })));

  it('should contain the application title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const titleSpan = fixture.debugElement.query(By.css('#title'));
    expect(titleSpan).toBeDefined();
    expect(titleSpan.nativeElement.textContent).toContain('Kangaroo: Administration');
  });

  it('should display a logout button when logged in, but not when logged out', async(inject(
    [ LoggedInSubject ], (loggedIn) => {
      const fixture = TestBed.createComponent(AppComponent);
      loggedIn.next(false);
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => expect(fixture.componentInstance.loggedIn).toBeFalsy())
        .then(() => fixture.debugElement.query(By.css('#logout_button')))
        .then((element) => expect(element).toBeFalsy())
        .then(() => loggedIn.next(true))
        .then(() => fixture.detectChanges())
        .then(() => fixture.whenStable())
        .then(() => expect(fixture.componentInstance.loggedIn).toBeTruthy())
        .then(() => fixture.debugElement.query(By.css('#logout_button')))
        .then((element) => expect(element).toBeTruthy());
    })));

  it('should revoke the token on logout', async(inject(
    [ OAuth2Service ], (service) => {
      const spy = spyOn(service, 'revoke').and.returnValue(of([ true ]));
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => fixture.debugElement.query(By.css('#logout_button')).nativeElement.click())
        .then(() => expect(spy).toHaveBeenCalledWith(validToken));
    })));

  it('should trigger change detection if the media model changes',
    inject([ MobileMediaQuery ], (mediaQuery) => {
      const fixture = TestBed.createComponent(AppComponent);

      expect(mediaQuery.listeners.length).toEqual(1);
      mediaQuery.listeners[ 0 ]();
    }));
});
