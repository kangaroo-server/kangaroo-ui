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

import { ApplicationPage, LoginPage } from './pages';
import { ProtractorUtil } from './util/protractor.util';
import { browser, ElementFinder } from 'protractor';

/**
 * Login/logout page.
 */
describe('Login page', () => {
  const application = new ApplicationPage();
  const loginPage = new LoginPage();

  beforeAll(async () => {
    await application.navigateTo();
  });

  beforeEach(async () => {
    await loginPage.navigateTo();
  });

  afterEach(async () => {
    await ProtractorUtil.logout();
  });

  it('should render a login page', async () => {
    await loginPage.navigateTo();

    const loginField: ElementFinder = await loginPage.getLoginField();
    const passwordField: ElementFinder = await loginPage.getPasswordField();
    const submitButton: ElementFinder = await loginPage.getSubmitButton();

    // Assert that the form exists.
    expect(await loginField.isPresent()).toBeTruthy();
    expect(await passwordField.isPresent()).toBeTruthy();
    expect(await submitButton.isPresent()).toBeTruthy();

    // Assert that the submit button is disabled.
    expect(await submitButton.getAttribute('disabled')).toBeTruthy();

    // Enter login/password
    await loginPage.setLogin('login');
    await loginPage.setPassword('password');

    // Assert that the submit button is enabled.
    expect(await submitButton.getAttribute('disabled')).toBeFalsy();
  });

  it('should permit logging in', async () => {
    await loginPage.navigateTo();

    // Enter login/password
    await loginPage.setLogin('admin');
    await loginPage.setPassword('admin');

    // Click submit
    await loginPage.submit();

    // Assert that we on the dashboard
    expect(await browser.getCurrentUrl())
      .toContain('/dashboard');

    // Assert that we have a token in local storage.
    const token = await browser.driver.executeScript(() => {
      return window.localStorage.getItem('_kangaroo_token');
    });
    const decodedToken = JSON.parse(<string> token);
    expect(decodedToken).toBeDefined();

    // Assert that there's a logout button
    const logoutButton = await application.getLogoutButton();
    expect(await logoutButton.isPresent()).toBeTruthy();

    // Click the logout button
    await application.logout();

    // Assert that we're on the login page.
    expect(await browser.getCurrentUrl())
      .toContain('/login');

    // Assert that the token in localStorage is gone.
    const deletedToken = await browser.driver.executeScript(() => {
      return window.localStorage.getItem('_kangaroo_token');
    });
    expect(deletedToken).toBe('null');
  });
});
