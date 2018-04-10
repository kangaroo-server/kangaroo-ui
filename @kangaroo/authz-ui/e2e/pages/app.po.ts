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

import { browser, by, element, ElementFinder } from 'protractor';
import { ProtractorUtil } from '../util/protractor.util';

/**
 * The application page.
 */
export class ApplicationPage {

  /**
   * Navigate to the base application.
   *
   * @returns A control-flow-supporting promise.
   */
  public async navigateTo(): Promise<void> {
    return ProtractorUtil.navigateTo(browser.baseUrl);
  }

  /**
   * Get the header text.
   */
  public async getHeaderText(): Promise<string> {
    return element(by.css('mat-toolbar #title')).getText();
  }

  /**
   * Get a reference to the logout button.
   *
   * @returns The logout button. May not exist.
   */
  public async getLogoutButton(): Promise<ElementFinder> {
    return element(by.id('logout_button'));
  }

  /**
   * Get a reference to the logout button.
   *
   * @returns The logout button. May not exist.
   */
  public async logout(): Promise<void> {
    const button = await this.getLogoutButton();
    return button.click();
  }
}
