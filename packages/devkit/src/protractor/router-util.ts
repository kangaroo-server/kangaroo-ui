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

import { browser, promise } from 'protractor';

/**
 * Setting new property 'navigateByUrl' to window object and declared it as a global.
 */
declare global {
  interface Window {
    routerNavigateByUrl: Function;
  }
}

/**
 * This utility exposes a static method which may be used to trigger the above navigation method.
 */
export class RouterUtil {

  /**
   * Navigate by _internal_ router URL.
   *
   * @param url The internal router URL.
   * @return {wdpromise.Promise<any>}
   */
  public static navigateByUrl(url): promise.Promise<any> {
    return browser
      .wait(() => browser.executeScript(() => window.routerNavigateByUrl != null))
      .then(() => browser.executeScript((route) => window.routerNavigateByUrl(route), url));
  }
}
