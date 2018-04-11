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

import { UrlMatcher, UrlMatchResult, UrlSegment } from '@angular/router';

/**
 * This method builds kangaroo entity ID router matchers, and assigns the extracted
 * value to the passed parameter name in the routing context.
 *
 * @param paramName The parameter name to provide.
 * @returns A URLMatcher function that can be used in ROUTES.
 */
export function kangarooEntityIdMatcher(paramName: string): UrlMatcher {
  return (url: UrlSegment[]): UrlMatchResult => {
    if (url.length === 0) {
      return null;
    }

    const reg = /^([0-9a-fA-F]{32})$/;
    const param = url[ 0 ].toString();

    if (param.match(reg)) {
      const posParams = {};
      posParams[ paramName ] = url[0];

      return ({
        consumed: [ url[ 0 ] ],
        posParams
      });
    }

    return null;
  };
}
