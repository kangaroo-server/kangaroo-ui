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

import { FactoryProvider, InjectionToken } from '@angular/core';

/**
 * Window injection token.
 */
export const WINDOW: InjectionToken<Window> = new InjectionToken('window');

/**
 * A small injection factory that provides a reference to the browser window.
 *
 * @return The browser window.
 */
export function windowFactory(): Window {
  return window;
}

/**
 * Provider for the browser's window instance.
 */
export const windowProvider: FactoryProvider = {
  provide: WINDOW,
  useFactory: windowFactory,
};
