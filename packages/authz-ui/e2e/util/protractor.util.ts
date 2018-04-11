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

import { browser } from 'protractor';
import { By, until } from 'selenium-webdriver';

/**
 * This utility assists in managing login/logout sessions for the application.
 */
export class ProtractorUtil {

  /**
   * Destroy the current session, and reload the applicaiton.
   */
  public static async logout() {
    // Flush the existing token.
    await browser.executeScript(() => {
      window.localStorage.removeItem('_kangaroo_token');
    });
    return ProtractorUtil.navigateTo(browser.baseUrl);
  }

  /**
   * An angular-safe navigateTo method.
   *
   * @param url The url to navigate to.
   * @returns {Promise<void>}
   */
  public static async navigateTo(url) {
    const driver = browser.driver;
    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl.indexOf(url) === -1) {
      await browser.get(url);
      const e = await driver.wait(until.elementLocated(By.css('mat-toolbar')));
      await driver.wait(until.elementIsVisible(e));
    }
  }
}
