/*
 * Copyright (c) 2017 Michael Krotscheck
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

import { async, inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { KangarooConfigurationSubject } from './kangaroo-configuration.subject';
import { AdminApiRoot } from './admin-api-root';
import { BrowserModule } from '@angular/platform-browser';
import { KangarooConfiguration } from './kangaroo-configuration';

/**
 * Unit tests for the configuration loader.
 */
describe('KangarooConfigurationSubject', () => {

  const rootUrl = `${window.location.protocol}//${window.location.host}/v1/config`;

  const testConfig: KangarooConfiguration = {
    client: 'client-id',
    scopes: [ 'scope-1', 'scope-2' ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserModule
      ],
      providers: [
        AdminApiRoot,
        KangarooConfigurationSubject
      ]
    });
  });

  it('should construct', inject([ KangarooConfigurationSubject ], (configSubject) => {
    expect(configSubject).toBeDefined();
  }));

  it('should initialize itself from a configuration API',
    async(inject([ HttpTestingController, KangarooConfigurationSubject ], (http, configSubject) => {
      configSubject.subscribe((config) => expect(config).toEqual(testConfig));
      http.expectOne(rootUrl).flush(testConfig, {status: 200, statusText: 'OK'});
    })));

  it('should be complete after load',
    async(inject([ HttpTestingController, KangarooConfigurationSubject ], (http, configSubject) => {
      configSubject.subscribe((config) => expect(configSubject.hasCompleted).toBeTruthy());
      http.expectOne(rootUrl).flush(testConfig, {status: 200, statusText: 'OK'});
    })));

  it('should throw errors.',
    async(inject([ HttpTestingController, KangarooConfigurationSubject ], (http, configSubject) => {
      configSubject
        .subscribe(
          () => fail(),
          (err) => expect(err.status).toEqual(400)
        );
      http.expectOne(rootUrl).flush(testConfig, {status: 400, statusText: 'Bad Request'});
    })));
});
