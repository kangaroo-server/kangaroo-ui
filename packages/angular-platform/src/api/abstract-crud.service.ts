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

import { HttpClient, HttpParams } from '@angular/common/http';
import { merge, Observable, Subject } from 'rxjs';
import { filter, map, repeatWhen, startWith, switchMap, tap, throttleTime } from 'rxjs/operators';
import { CommonModel } from './common.model';
import { ListResponse } from './list-response.model';

/**
 * Cross-service implementation methods and utilities.
 *
 * @author Michael Krotscheck
 */
export abstract class AbstractCrudService<T extends CommonModel> {

  /**
   * This subject emits whenever a new entity has been created.
   */
  public readonly entityCreated: Subject<T> = new Subject<T>();

  /**
   * This subject emits whenever an entity has been successfully removed from the system. The
   */
  public readonly entityRemoved: Subject<T> = new Subject<T>();

  /**
   * This event broker emits whenever new state information is available for a specific resource. Think of this as
   * a stream of the 'most recent' version of every entity, at least as far as regular GET and PUT requests are aware
   * of.  Instantiated result sets may listen to this stream and modify themselves as necessary.
   */
  public readonly entityUpdated: Subject<T> = new Subject<T>();

  /**
   * Create a new instance of the service.
   *
   * @param http The HTTP client
   */
  protected constructor(protected http: HttpClient) {
  }

  /**
   * Given a url and some http parameters, construct a list request observable that is updated as new data comes in.
   *
   * @param requestUrl The request URL.
   * @param params The HTTP params.
   */
  protected buildListQuery(requestUrl: Observable<string>, params: HttpParams): Observable<ListResponse<T>> {
    return requestUrl
      .pipe(
        repeatWhen(() => merge(this.entityCreated, this.entityRemoved)),
        switchMap((url) => this.http.get<ListResponse<T>>(url, {params})),
        tap((result: ListResponse<T>) => {
          result.results.forEach((value: T) => this.entityUpdated.next(value));
        }),
        switchMap((requestResult) => {
          const indexMap = {}; // Index-based memory pointers to the data we may want to update.
          requestResult.results.forEach((result) => {
            indexMap[ result.id ] = result;
          });

          // If an entity updates from a different channel, merge it into the result set and
          // re-emit it.
          return this.entityUpdated
            .pipe(
              filter((item) => indexMap.hasOwnProperty(item.id)),
              filter((item) => indexMap[ item.id ].modifiedDate < item.modifiedDate),
              tap((item) => Object.assign(indexMap[ item.id ], item)),
              map(() => requestResult),
              throttleTime(500),
              startWith(requestResult),
            );
        }),
        // Deep clone the result, so that downstream doesn't see changes in our data.
        map((result) => JSON.parse(JSON.stringify(result))),
      );
  }
}
