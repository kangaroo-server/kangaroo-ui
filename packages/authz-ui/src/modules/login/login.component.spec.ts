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
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuth2Service, OAuth2Token, OAuth2TokenSubject } from '@kangaroo/angular-authn';
import { BehaviorSubject, from, throwError } from 'rxjs';
import { KangarooLayoutModule } from '../layout';
import { LoginComponent } from './login.component';

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
    token_type: 'Bearer',
  };

  beforeEach(() => {

    loggedInSubject = new BehaviorSubject(true);
    tokenSubject = new BehaviorSubject(validToken);
    tokenService = {
      login: () => {
      },
    } as any;

    TestBed.configureTestingModule({
      providers: [
        {provide: OAuth2TokenSubject, useValue: tokenSubject},
        {provide: OAuth2Service, useValue: tokenService},
      ],
      declarations: [
        LoginComponent,
      ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        NoopAnimationsModule,

        KangarooLayoutModule,
      ],
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

        fixture.componentInstance.loginGroup.setValue({login: 'login', password: 'password'});

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

  it('should invoke the login method when clicked', () => {
    const controller: LoginComponent = fixture.componentInstance;
    const loginSpy: jasmine.Spy = spyOn(controller, 'login').and.stub();

    fixture.componentInstance.loginGroup.setValue({login: 'login', password: 'password'});

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
    controller.loginGroup.disable();

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

  it('should properly parse error messages from form controls', async(() => {
    const controller: LoginComponent = fixture.componentInstance;

    const unrecognizedMessage = controller.getErrorMessage({hasError: () => false} as any);
    const recognizedMessage = controller.getErrorMessage({hasError: () => true} as any);

    expect(unrecognizedMessage).toBe('');
    expect(recognizedMessage).toBe('You must enter a value');
  }));

  it('should not display an error when there are none', async(() => {
    const controller: LoginComponent = fixture.componentInstance;
    controller.loginGroup.setErrors([]);

    fixture.detectChanges();

    fixture.whenStable()
      .then(() => {
        const errorMessage = fixture.debugElement.query(By.css('mat-error'));
        expect(errorMessage).toBeNull();
      });
  }));

  it('should permit submitting the form with enter in the username field if form valid', async(() => {
    const controller: LoginComponent = fixture.componentInstance;
    const loginSpy: jasmine.Spy = spyOn(controller, 'login').and.stub();

    fixture.componentInstance.loginGroup.setValue({login: 'login', password: 'password'});
    const usernameInput = fixture.debugElement.query(By.css('#username_input'));

    fixture.detectChanges();

    fixture.whenStable()
      .then(() => usernameInput.triggerEventHandler('keyup.enter', {}))
      .then(() => fixture.detectChanges())
      .then(() => fixture.whenStable())
      .then(() => {
        expect(loginSpy).toHaveBeenCalled();
      });
  }));

  it('should not permit submitting the form with enter in the username field if form invalid', async(() => {
    const controller: LoginComponent = fixture.componentInstance;
    const loginSpy: jasmine.Spy = spyOn(controller, 'login').and.stub();

    fixture.componentInstance.loginGroup.setValue({login: '', password: 'password'});
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

    fixture.componentInstance.loginGroup.setValue({login: 'login', password: 'password'});
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

    fixture.componentInstance.loginGroup.setValue({login: '', password: 'password'});
    const passwordInput = fixture.debugElement.query(By.css('#password_input'));

    fixture.detectChanges();

    fixture.whenStable()
      .then(() => passwordInput.triggerEventHandler('keyup.enter', {}))
      .then(() => {
        expect(loginSpy).not.toHaveBeenCalled();
      });
  }));

  it('should show an error on a form submission failure', async(inject(
    [ OAuth2Service, MatSnackBar ], (service, snackbar) => {
      const snackSpy = spyOn(snackbar, 'open').and.stub();
      const controller: LoginComponent = fixture.componentInstance;
      spyOn(service, 'login').and.returnValue(throwError('failed'));
      fixture.componentInstance.loginGroup.setValue({login: 'login', password: 'password'});
      fixture.debugElement.query(By.css('#login_button')).nativeElement.click();

      // This resolves immediately.
      expect(controller.loginGroup.errors).toBeFalsy();
      expect(controller.loginGroup.disabled).toBeFalsy();

      expect(snackSpy).toHaveBeenCalled();
    })));

  it('should navigate to the dashboard on a successful login', async(inject(
    [ OAuth2Service, Router ], (service, router) => {
      const controller: LoginComponent = fixture.componentInstance;
      spyOn(service, 'login').and.returnValue(from([ true ]));
      const routerSpy = spyOn(router, 'navigate').and.stub();
      fixture.componentInstance.loginGroup.setValue({login: 'login', password: 'password'});
      fixture.debugElement.query(By.css('#login_button')).nativeElement.click();

      // This resolves immediately.
      expect(controller.loginGroup.errors).toBeFalsy();
      expect(controller.loginGroup.disabled).toBeFalsy();

      const errorMessage = fixture.debugElement.query(By.css('#error_message'));
      expect(errorMessage).toBeNull();

      expect(routerSpy).toHaveBeenCalledWith([ '' ]);
    })));
});
