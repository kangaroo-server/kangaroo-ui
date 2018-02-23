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
import { Observable } from 'rxjs/Observable';
import { KangarooConfigurationSubject } from '../../config';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/from';
import { ConfigurationSucceededGuard } from './configuration-succeeded.guard';

/**
 * Unit tests for the 'configuration failed' route guard.
 */
describe('ConfigurationSucceededGuard', () => {
  it('should fail if the configuration fails', async(() => {

    const testObservable: KangarooConfigurationSubject =
      <any> Observable.throw(new Error('Test error'));

    const guard = new ConfigurationSucceededGuard(testObservable);
    Observable
      .from(guard.canActivate(null, null))
      .subscribe((value) => expect(value).toBeFalsy());
  }));

  it('should pass if the configuration succeeds', async(() => {

    const testObservable: KangarooConfigurationSubject =
      <any> Observable.from([ {} ]);

    const guard = new ConfigurationSucceededGuard(testObservable);
    Observable
      .from(guard.canActivate(null, null))
      .subscribe((value) => expect(value).toBeTruthy());
  }));
});
