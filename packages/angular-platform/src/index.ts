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

import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { CsrfHttpInterceptor } from './http/csrf.http-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { locationInitializer } from './router_util';
import { NoopComponent } from './noop/noop.component';
import { CommonModule } from '@angular/common';
import { kangarooEntityIdMatcher } from './router/kangaroo_id_matcher';

export * from './api';
export { NoopComponent } from './noop/noop.component';
export { kangarooEntityIdMatcher } from './router/kangaroo_id_matcher';

/**
 * This module contains injectees and abstract classes that are consistent
 * across the entire kangaroo ecosystem.
 *
 * @author Michael Krotscheck
 */
@NgModule({
  providers: [
    {provide: HTTP_INTERCEPTORS, multi: true, useClass: CsrfHttpInterceptor},
    {provide: APP_INITIALIZER, multi: true, useFactory: locationInitializer, deps: [ Injector ]}
  ],
  imports: [
    CommonModule
  ],
  declarations: [
    NoopComponent
  ],
  exports: [
    NoopComponent
  ]
})
export class KangarooPlatformModule {
}
