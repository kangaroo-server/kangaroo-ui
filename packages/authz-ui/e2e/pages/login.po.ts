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

import { RouterUtil } from '@kangaroo/devkit/protractor';
import { By, element, ElementFinder } from 'protractor';

/**
 * The login page.
 */
export class LoginPage {

  /**
   * Navigate to the login page.
   */
  public async navigateTo(): Promise<any> {
    return RouterUtil.navigateByUrl('/login');
  }

  /**
   * Get the login field.
   */
  public async getLoginField(): Promise<ElementFinder> {
    return element(By.id('username_input'));
  }

  /**
   * Fill in the login form.
   */
  public async setLogin(login: string): Promise<void> {
    const loginField: ElementFinder = await this.getLoginField();
    return loginField.clear()
      .then(() => loginField.sendKeys(login));
  }

  /**
   * Get the password field.
   */
  public async getPasswordField(): Promise<ElementFinder> {
    return element(By.id('password_input'));
  }

  /**
   * Fill in the password form.
   */
  public async setPassword(password: string): Promise<void> {
    const passwordField: ElementFinder = await this.getPasswordField();
    return passwordField.clear()
      .then(() => passwordField.sendKeys(password));
  }

  /**
   * Get the submit button.
   */
  public async getSubmitButton(): Promise<ElementFinder> {
    return element(By.id('login_button'));
  }

  /**
   * Is the login button enabled?
   */
  public async isSubmitEnabled(): Promise<boolean> {
    return (await this.getSubmitButton()).getAttribute('disabled')
      .then((value) => !!value);
  }

  /**
   * Click the login button.
   */
  public async submit(): Promise<void> {
    return (await this.getSubmitButton()).click();
  }

  /**
   * Get the error message
   */
  public async getErrorMessage(): Promise<string> {
    return element(By.id('error_message')).getText();
  }
}
