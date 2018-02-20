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

import { async, inject, TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CsrfHttpInterceptor } from './csrf.http-interceptor';


/**
 * Unit tests for the CsrfHttpInterceptor.
 */
describe('CsrfHttpInterceptor', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: HTTP_INTERCEPTORS, multi: true, useClass: CsrfHttpInterceptor}
      ],
      imports: [
        HttpClientTestingModule
      ]
    });
  });

  it('should decorate API requests with the CSRF token',
    async(inject([ HttpClient, HttpTestingController ], (client, mock: HttpTestingController) => {
      client.get('http://example.com/').subscribe();

      const matches = mock.match((r) => r.url === 'http://example.com/');
      expect(matches.length).toBe(1);
      const req = matches[ 0 ];
      expect(req.request.headers.get('X-Requested-With')).toEqual('Kangaroo-Platform');
    })));
});
