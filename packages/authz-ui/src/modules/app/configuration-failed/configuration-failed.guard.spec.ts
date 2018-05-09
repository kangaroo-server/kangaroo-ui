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

import { async } from '@angular/core/testing';
import { from, throwError } from 'rxjs';
import { KangarooConfigurationSubject } from '../../config';
import { ConfigurationFailedGuard } from './configuration-failed.guard';

/**
 * Unit tests for the 'configuration failed' route guard.
 */
describe('ConfigurationFailedGuard', () => {
  it('should pass if the configuration fails', async(() => {

    const testObservable: KangarooConfigurationSubject =
      throwError(new Error('Test error')) as any;

    const guard = new ConfigurationFailedGuard(testObservable);
    from(guard.canActivate(null, null))
      .subscribe((value) => expect(value).toBeTruthy());
  }));

  it('should fail if the configuration succeeds', async(() => {

    const testObservable: KangarooConfigurationSubject =
      from([ {} ]) as any;

    const guard = new ConfigurationFailedGuard(testObservable);
    from(guard.canActivate(null, null))
      .subscribe((value) => expect(value).toBeFalsy());
  }));
});
