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

import { InjectionToken } from '@angular/core';
import { ObservableInput } from 'rxjs';

/**
 * Use this injection token to provide an external API root.
 */
export const OAUTH2_API_ROOT: InjectionToken<ObservableInput<string>> =
  new InjectionToken<ObservableInput<string>>('OAUTH2_API_ROOT');

/**
 * Use this injection token to provide the client ID.
 */
export const OAUTH2_CLIENT_ID: InjectionToken<ObservableInput<string>> =
  new InjectionToken<ObservableInput<string>>('OAUTH2_API_ROOT');

/**
 * Use this injection token to provide the list of required scopes.
 */
export const OAUTH2_CLIENT_SCOPES: InjectionToken<ObservableInput<string[]>> =
  new InjectionToken<ObservableInput<string[]>>('OAUTH2_SCOPES');
