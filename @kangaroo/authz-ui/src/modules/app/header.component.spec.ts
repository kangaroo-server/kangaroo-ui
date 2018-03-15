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

import { async, inject, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { LoggedInSubject, OAuth2Service, OAuth2Token, OAuth2TokenSubject } from '@kangaroo/angular-authn';
import { ClrNavigationModule } from '@clr/angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';

/**
 * Unit tests for the Header component.
 */
describe('HeaderComponent', () => {

  let loggedInSubject: BehaviorSubject<boolean>;
  let tokenSubject: BehaviorSubject<OAuth2Token>;
  let tokenService: OAuth2Service;

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const validToken: OAuth2Token = {
    access_token: 'access_token_1',
    refresh_token: 'refresh_token_1',
    issue_date: nowInSeconds - 100,
    expires_in: 3600,
    token_type: 'Bearer'
  };

  beforeEach(() => {

    loggedInSubject = new BehaviorSubject(true);
    tokenSubject = new BehaviorSubject(validToken);
    tokenService = <any> {
      revoke: () => {
      }
    };


    TestBed.configureTestingModule({
      providers: [
        {provide: LoggedInSubject, useValue: loggedInSubject},
        {provide: OAuth2TokenSubject, useValue: tokenSubject},
        {provide: OAuth2Service, useValue: tokenService}
      ],
      declarations: [
        HeaderComponent
      ],
      imports: [
        ClrNavigationModule,
        RouterTestingModule,
        HttpClientTestingModule
      ]
    });
  });

  it('should construct', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    expect(fixture).toBeDefined();
  });

  it('should contain the application title', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const titleSpan = fixture.debugElement.query(By.css('.header .branding a .title'));
    expect(titleSpan).toBeDefined();
    expect(titleSpan.nativeElement.textContent).toContain('Kangaroo: Administration');
  });

  it('should display a logout button when logged in, but not when logged out', async(inject(
    [ LoggedInSubject ], (loggedIn) => {
      const fixture = TestBed.createComponent(HeaderComponent);
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
      const spy = spyOn(service, 'revoke').and.returnValue(Observable.of([ true ]));
      const fixture = TestBed.createComponent(HeaderComponent);
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => fixture.debugElement.query(By.css('#logout_button')).nativeElement.click())
        .then(() => expect(spy).toHaveBeenCalledWith(validToken));
    })));
});
