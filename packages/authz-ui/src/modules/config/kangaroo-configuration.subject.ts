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

import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { AdminApiRoot } from './admin-api-root';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { KangarooConfiguration } from './kangaroo-configuration';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/switchMap';

/**
 * This subject loads the available configuration from the admin api, and publishes the results to any subscribers.
 *
 * @author Michael Krotscheck
 */
@Injectable()
export class KangarooConfigurationSubject extends AsyncSubject<KangarooConfiguration> {

  /**
   * Common http headers, usually provided by the interceptors.
   */
  private readonly commonHeaders: HttpHeaders = new HttpHeaders({
    'X-Requested-With': 'Kangaroo-Platform'
  });

  /**
   * Privately created http client, so we can bypass any interceptors.
   */
  private readonly http: HttpClient;

  /**
   * Create a new instance of the subject.
   *
   * @param apiRoot Api root.
   * @param http Angular's HTTP adapter.
   */
  constructor(private apiRoot: AdminApiRoot, private backend: HttpBackend) {
    super();

    this.http = new HttpClient(backend);

    this.apiRoot
      .switchMap((root) => this.http.get<KangarooConfiguration>(`${root}/config`, {
        headers: this.commonHeaders,
        observe: 'body'
      }))
      .subscribe(
        (config) => this.next(config),
        (err) => this.error(err),
        () => this.complete()
      );
  }
}
