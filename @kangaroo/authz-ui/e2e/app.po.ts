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

import { browser, by, element } from 'protractor';
import { By, promise, until } from 'selenium-webdriver';

/**
 * The root application page.
 */
export class AppPage {

  /**
   * Navigate to the base application.
   *
   * @returns A control-flow-supporting promise.
   */
  public navigateTo() {
    const driver = browser.driver;
    const url = browser.baseUrl;

    return driver.getCurrentUrl()
      .then((current) => current.indexOf(url) > -1)
      .then((isLoaded) => <any> (isLoaded ? promise.fullyResolved(true) : driver.get(url)))
      .then(() => driver.wait(until.elementLocated(By.css('kng-header'))))
      .then((e) => driver.wait(until.elementIsVisible(e)))
      .then(() => true);
  }

  /**
   * Get the header text.
   */
  public getHeaderText(): promise.Promise<string> {
    return element(by.css('kng-header #title')).getText();
  }
}
