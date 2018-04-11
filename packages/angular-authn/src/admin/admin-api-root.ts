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

import { ObservableInput } from 'rxjs/Observable';
import { InjectionToken } from '@angular/core';

/**
 * Use this injection token to provide an external API root.
 */
export const ADMIN_API_ROOT: InjectionToken<ObservableInput<string>> =
  new InjectionToken<ObservableInput<string>>('ADMIN_API_ROOT');
