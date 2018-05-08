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

/**
 * Setting new property 'navigateByUrl' to window object and declared it as a global.
 * This is technically never used during the protractor runtime - it only serves to create
 * the object references used by the remote selenium script executor, so that typescript doesn't
 * complain.
 */
declare global {
  interface Window {
    routerNavigateByUrl: (url: string) => void;
  }
}

/**
 * Navigate by _internal_ router URL.
 *
 * @param url The internal router URL.
 * @return A promise which will resolve once the route command has been passed to angular.
 */
export async function navigateByUrl(url: string): Promise<void> {
  await browser.wait(browser.executeScript(() => window.routerNavigateByUrl != null));
  await browser.executeScript((route: string) => window.routerNavigateByUrl(route), url);
}
