/*
 * Copyright (c) 2017 Michael Krotscheck
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

import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { OAuth2Service, OAuth2Token, OAuth2TokenSubject } from '@kangaroo/angular-authn';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

/**
 * Unit tests for the Login form component.
 */
describe('LoginComponent', () => {

  let loggedInSubject: BehaviorSubject<boolean>;
  let tokenSubject: BehaviorSubject<OAuth2Token>;
  let tokenService: OAuth2Service;
  let fixture: ComponentFixture<LoginComponent>;

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
      login: () => {
      }
    };

    TestBed.configureTestingModule({
      providers: [
        {provide: OAuth2TokenSubject, useValue: tokenSubject},
        {provide: OAuth2Service, useValue: tokenService}
      ],
      declarations: [
        LoginComponent
      ],
      imports: [
        FormsModule,
        RouterTestingModule
      ]
    });

    fixture = TestBed.createComponent(LoginComponent);
  });

  it('should construct', () => {
    expect(fixture).toBeDefined();
  });

  it('should contain a login form', () => {
    const usernameInput = fixture.debugElement.query(By.css('#username_input'));
    const passwordInput = fixture.debugElement.query(By.css('#password_input'));
    const loginButton = fixture.debugElement.query(By.css('#login_button'));

    expect(usernameInput).toBeDefined();
    expect(passwordInput).toBeDefined();
    expect(loginButton).toBeDefined();
  });

  it('should disable the button when the fields are empty', async(() => {
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        fixture.detectChanges();
        return fixture.whenStable();
      })
      .then(() => {
        const loginButton = fixture.debugElement.query(By.css('#login_button'));
        expect(loginButton.nativeElement.attributes[ 'disabled' ]).toBeDefined();

        fixture.componentInstance.username = 'login';
        fixture.componentInstance.password = 'password';
        fixture.detectChanges();
        return fixture.whenStable();
      })
      .then(() => {
        // Apparently, forms require a double wait check here.
        fixture.detectChanges();
        return fixture.whenStable();
      })
      .then(() => {
        const loginButton = fixture.debugElement.query(By.css('#login_button'));
        expect(loginButton.nativeElement.attributes[ 'disabled' ]).not.toBeDefined();
      });
  }));

  it('should automatically focus on the login input', () => {

    fixture.whenStable()
      .then(() => fixture.detectChanges())
      .then(() => {
        const usernameInput = fixture.debugElement.query(By.css('#username_input:focus'));
        expect(usernameInput.nativeElement).toBeDefined();
      });
  });

  it('should invoke the login method when clicked', () => {
    const controller: LoginComponent = fixture.componentInstance;
    const loginSpy: jasmine.Spy = spyOn(controller, 'login').and.stub();

    controller.username = 'login';
    controller.password = 'password';

    const loginButton = fixture.debugElement.query(By.css('#login_button'));

    fixture.detectChanges();

    fixture.whenStable()
      .then(() => fixture.detectChanges())
      .then(() => loginButton.nativeElement.click())
      .then(() => {
        expect(loginSpy).toHaveBeenCalled();
      });
  });

  it('should disable the form when the loading flag is set', async(() => {
    const controller: LoginComponent = fixture.componentInstance;
    controller.loading = true;

    fixture.detectChanges();

    fixture.whenStable()
      .then(() => {
        const usernameInput = fixture.debugElement.query(By.css('#username_input:disabled'));
        expect(usernameInput.nativeElement).toBeDefined();
        const passwordInput = fixture.debugElement.query(By.css('#password_input:disabled'));
        expect(passwordInput.nativeElement).toBeDefined();
        const loginButton = fixture.debugElement.query(By.css('#login_button:disabled'));
        expect(loginButton.nativeElement).toBeDefined();
      });
  }));

  it('should display an error when the error flag is set', async(() => {
    const controller: LoginComponent = fixture.componentInstance;
    controller.errored = true;

    fixture.detectChanges();

    fixture.whenStable()
      .then(() => {
        const errorMessage = fixture.debugElement.query(By.css('.alert.alert-danger'));
        expect(errorMessage.nativeElement).toBeDefined();
      });
  }));

  it('should not display an error when the error flag is not set', async(() => {
    const controller: LoginComponent = fixture.componentInstance;
    controller.errored = false;

    fixture.detectChanges();

    fixture.whenStable()
      .then(() => {
        const errorMessage = fixture.debugElement.query(By.css('.alert.alert-danger'));
        expect(errorMessage).toBeNull();
      });
  }));

  it('should permit submitting the form with enter in the username field if form valid', async(() => {
    const controller: LoginComponent = fixture.componentInstance;
    const loginSpy: jasmine.Spy = spyOn(controller, 'login').and.stub();

    controller.username = 'login';
    controller.password = 'password';
    const usernameInput = fixture.debugElement.query(By.css('#username_input'));

    fixture.detectChanges();

    fixture.whenStable()
      .then(() => usernameInput.triggerEventHandler('keyup.enter', {}))
      .then(() => {
        expect(loginSpy).toHaveBeenCalled();
      });
  }));

  it('should not permit submitting the form with enter in the username field if form invalid', async(() => {
    const controller: LoginComponent = fixture.componentInstance;
    const loginSpy: jasmine.Spy = spyOn(controller, 'login').and.stub();

    controller.username = '';
    controller.password = 'password';
    const usernameInput = fixture.debugElement.query(By.css('#username_input'));

    fixture.detectChanges();

    fixture.whenStable()
      .then(() => usernameInput.triggerEventHandler('keyup.enter', {}))
      .then(() => {
        expect(loginSpy).not.toHaveBeenCalled();
      });
  }));

  it('should permit submitting the form with enter in the password field if form valid', async(() => {
    const controller: LoginComponent = fixture.componentInstance;
    const loginSpy: jasmine.Spy = spyOn(controller, 'login').and.stub();

    controller.username = 'login';
    controller.password = 'password';
    const passwordInput = fixture.debugElement.query(By.css('#password_input'));

    fixture.detectChanges();

    fixture.whenStable()
      .then(() => passwordInput.triggerEventHandler('keyup.enter', {}))
      .then(() => {
        expect(loginSpy).toHaveBeenCalled();
      });
  }));

  it('should not permit submitting the form with enter in the password field if form invalid', async(() => {
    const controller: LoginComponent = fixture.componentInstance;
    const loginSpy: jasmine.Spy = spyOn(controller, 'login').and.stub();

    controller.username = '';
    controller.password = 'password';
    const passwordInput = fixture.debugElement.query(By.css('#password_input'));

    fixture.detectChanges();

    fixture.whenStable()
      .then(() => passwordInput.triggerEventHandler('keyup.enter', {}))
      .then(() => {
        expect(loginSpy).not.toHaveBeenCalled();
      });
  }));

  it('should show an error on a form submission failure', async(inject(
    [ OAuth2Service ], (service) => {
      const controller: LoginComponent = fixture.componentInstance;
      spyOn(service, 'login').and.returnValue(Observable.throw('failed'));
      controller.username = 'login';
      controller.password = 'password';
      fixture.debugElement.query(By.css('#login_button')).nativeElement.click();

      // This resolves immediately.
      expect(controller.errored).toBeTruthy();
      expect(controller.loading).toBeFalsy();

      const errorMessage = fixture.debugElement.query(By.css('#error_message'));
      expect(errorMessage).toBeDefined();
    })));

  it('should navigate to the dashboard on a successful login', async(inject(
    [ OAuth2Service, Router ], (service, router) => {
      const controller: LoginComponent = fixture.componentInstance;
      spyOn(service, 'login').and.returnValue(Observable.from([ true ]));
      const routerSpy = spyOn(router, 'navigate').and.callThrough();
      controller.username = 'login';
      controller.password = 'password';
      fixture.debugElement.query(By.css('#login_button')).nativeElement.click();

      // This resolves immediately.
      expect(controller.errored).toBeFalsy();
      expect(controller.loading).toBeFalsy();

      const errorMessage = fixture.debugElement.query(By.css('#error_message'));
      expect(errorMessage).toBeNull();

      expect(routerSpy).toHaveBeenCalledWith([ '' ]);
    })));
});
