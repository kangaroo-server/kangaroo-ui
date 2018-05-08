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

import { MediaMatcher } from '@angular/cdk/layout';
import { FactoryProvider } from '@angular/core';

/**
 * The media type query we use for ease of injection.
 */
export class MobileMediaQuery extends MediaQueryList {
}

/**
 * Type provider factory. This is where we set our mobile breakpoint.
 *
 * @param media The media matcher from the CDK.
 */
export function providerFactory(media) {
  return media.matchMedia('(max-width: 600px)');
}

/**
 * Build the media query for the mobile transition.
 */
export const mobileMediaQueryProvider: FactoryProvider = {
  provide: MobileMediaQuery,
  useFactory: providerFactory,
  deps: [ MediaMatcher ],
};
