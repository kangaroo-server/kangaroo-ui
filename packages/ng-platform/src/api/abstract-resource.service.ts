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
import { from, Observable, ObservableInput } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { HttpUtil } from '../util/http-util';
import { AbstractCrudService } from './abstract-crud.service';
import { CommonModel } from './common.model';
import { ListResponse } from './list-response.model';

/**
 * An abstract implementation of the common resource api pattern.
 *
 * @author Michael Krotscheck
 */
export abstract class AbstractResourceService<T extends CommonModel> extends AbstractCrudService<T> {

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
                        http: HttpClient,
                        apiRootProvider: ObservableInput<string>) {
    super(http);
    this.apiRoot = from(apiRootProvider || [ '' ]);
  }

  /**
   * Search this group of resources.
   *
   * The resulting observable will re-emit the list if the user - for some reason or other - makes a modification
   * to any of the entities of the list.
   *
   * @param q The search query, required.
   * @param filters A list of additional filter parameters.
   * @param offset The search result offset.
   * @param limit The number of results returned.
   * @return The search results.
   */
  public search(q: string,
                filters?: { [ key: string ]: string },
                offset?: number,
                limit?: number): Observable<ListResponse<T>> {
    const params: HttpParams = HttpUtil.buildHttpParams(filters, {q, offset, limit});
    const urlObservable = this.apiRoot.pipe(map((root) => this.buildEntityRoot(root, {id: 'search'} as T)));
    return this.buildListQuery(urlObservable, params);
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
    const params: HttpParams = HttpUtil.buildHttpParams(filters, {sort, order, offset, limit});
    const urlObservable = this.apiRoot.pipe(map((root) => this.buildEntityRoot(root, {id: ''} as T)));
    return this.buildListQuery(urlObservable, params);
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
        switchMap((url) => this.http.post<T>(url, entity)),
        tap((result) => this.entityCreated.next(result)),
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
        switchMap((url) => this.http.get<T>(url)),
        tap((result: T) => this.entityUpdated.next(result)),
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
        switchMap((url) => this.http.put<T>(url, entity)),
        tap((result: T) => this.entityUpdated.next(result)),
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
        switchMap((url) => this.http.delete<void>(url)),
        tap(() => this.entityRemoved.next(entity)),
      );
  }

  /**
   * This method should return the root url for the passed entity.
   */
  private buildEntityRoot(apiRoot: string, entity: T): string {
    return `${apiRoot}/${this.resourcesStub}/${entity && entity.id || ''}`;
  }
}
