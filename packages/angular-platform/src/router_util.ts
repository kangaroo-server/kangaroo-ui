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
import { NgZone } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Setting new property 'navigateByUrl' to window object and declared it as a global.
 *
 */
declare global {
  interface Window {
    routerNavigateByUrl: (route: string) => void;
  }
}

/**
 * This utility is a workaround for protractor's default use of the url bar for in-app navigation.
 * It exposes a window-level function that reaches into Angular's injection context, and invokes
 * the internal `navigateByUrl` method. If you don't need to do a full page refresh, you may then use
 * the static RouterUtil.navigateByUrl method (packaged in the devkit) in your e2e tests to avoid a full page load.
 */
export function locationInitializer(injector) {
  return () => {
    const router = injector.get(Router);
    const ngZone = injector.get(NgZone);

    window.routerNavigateByUrl = (route) => {
      ngZone.run(() => {
        router.navigateByUrl(route, {skipLocationChange: false, replaceUrl: true});
      });
    };
    // Resolve this initializer.
    return Promise.resolve();
  };
}
