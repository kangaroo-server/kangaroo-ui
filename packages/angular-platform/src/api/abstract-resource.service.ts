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

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, ObservableInput } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { CommonModel } from './common.model';
import { ListResponse } from './list-response.model';

/**
 * This class attaches the oauth2 token credentials to API calls.
 *
 * @author Michael Krotscheck
 */
export abstract class AbstractResourceService<T extends CommonModel> {

  /**
   * The current calculated API root.
   */
  private readonly apiRoot: Observable<string>;

  /**
   * Create a new instance of the service.
   *
   * @param resourcesStub The short form stub of the resource at the target URL. e.g. 'role' or 'client'
   * @param http The HTTP client
   * @param apiRootProvider Observable source of the root URL to the admin API. Optional.
   */
  protected constructor(private resourcesStub: string,
                        private http: HttpClient,
                        apiRootProvider: ObservableInput<string>) {
    this.apiRoot = from(apiRootProvider || [ '' ]);
  }

  /**
   * Search this group of resources.
   *
   * @param query The search query, required.
   * @param filters A list of additional filter parameters.
   * @param offset The search result offset.
   * @param limit The number of results returned.
   * @return The search results.
   */
  public search(query: string,
                filters?: { [ key: string ]: string },
                offset?: number,
                limit?: number): Observable<ListResponse<T>> {
    let params: HttpParams = new HttpParams();
    if (filters) {
      Object.keys(filters)
        .forEach((key) => {
          params = params.append(key, filters[ key ]);
        });
    }
    params = params
      .set('q', query)
      .set('offset', offset && offset.toString() || undefined)
      .set('limit', limit && limit.toString() || undefined);

    return this.apiRoot
      .pipe(
        map((root) => this.buildEntityRoot(root, {id: 'search'} as T)),
        mergeMap((url) => this.http.get<ListResponse<T>>(url, {params})),
      );
  }

  /**
   * Browse the resources exposed by this endpoint.
   *
   * @param filters A list of additional filter parameters.
   * @param offset The search result offset.
   * @param limit The number of results returned.
   * @param sort The field to sort on.
   * @param order The sort order, Ascending or Descending.
   * @return Browse results.
   */
  public browse(filters?: { [ key: string ]: string },
                sort?: string,
                order?: string,
                offset?: number,
                limit?: number): Observable<ListResponse<T>> {
    let params: HttpParams = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        params = params.append(key, filters[ key ]);
      });
    }
    params = params
      .set('sort', sort || undefined)
      .set('order', order || undefined)
      .set('offset', offset && offset.toString() || undefined)
      .set('limit', limit && limit.toString() || undefined);

    return this.apiRoot
      .pipe(
        map((root) => this.buildEntityRoot(root, {id: ''} as T)),
        mergeMap((url) => this.http.get<ListResponse<T>>(url, {params})),
      );
  }

  /**
   * Create a new entity.
   *
   * @param entity The entity for the request body.
   * @return The results of the request.
   */
  public create(entity: T): Observable<T> {
    return this.apiRoot
      .pipe(
        map((root) => this.buildEntityRoot(root, {id: ''} as T)),
        mergeMap((url) => this.http.post<T>(url, entity)),
      );
  }

  /**
   * Read an entity by ID.
   *
   * @param id The ID to read.
   * @return The results of the request.
   */
  public read(id: string): Observable<T> {
    return this.apiRoot
      .pipe(
        map((root) => this.buildEntityRoot(root, {id} as T)),
        mergeMap((url) => this.http.get<T>(url)),
      );
  }

  /**
   * Update an entity.
   *
   * @param entity The entity for the request body.
   * @return The results of the request.
   */
  public update(entity: T): Observable<T> {
    return this.apiRoot
      .pipe(
        map((root) => this.buildEntityRoot(root, entity)),
        mergeMap((url) => this.http.put<T>(url, entity)),
      );
  }

  /**
   * Delete an entity.
   *
   * @param entity The entity to delete.
   * @return A void observable.
   */
  public destroy(entity: T): Observable<void> {
    return this.apiRoot
      .pipe(
        map((root) => this.buildEntityRoot(root, entity)),
        mergeMap((url) => this.http.delete<void>(url)),
      );
  }

  /**
   * This method should return the root url for the passed entity.
   */
  private buildEntityRoot(apiRoot: string, entity: T): string {
    return `${apiRoot}/${this.resourcesStub}/${entity && entity.id || ''}`;
  }
}
