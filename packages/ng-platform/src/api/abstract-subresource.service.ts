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
import { map, switchMap } from 'rxjs/operators';
import { HttpUtil } from '../util/http-util';
import { AbstractCrudService } from './abstract-crud.service';
import { CommonModel } from './common.model';
import { ListResponse } from './list-response.model';

/**
 * This class attaches the oauth2 token credentials to API calls.
 *
 * @author Michael Krotscheck
 */
export abstract class AbstractSubresourceService<P extends CommonModel, E extends CommonModel>
  extends AbstractCrudService<E> {

  /**
   * The current calculated API root.
   */
  private readonly apiRoot: Observable<string>;

  /**
   * Create a new instance of the service.
   *
   * @param parentStub The short form stub of the parent resource at the target URL. e.g. 'role' or 'client'
   * @param resourcesStub The short form stub of the resource at the target URL. e.g. 'role' or 'client'
   * @param http The HTTP client
   * @param apiRootProvider Observable source of the root URL to the admin API. Optional.
   */
  protected constructor(private parentStub: string,
                        private resourcesStub: string,
                        http: HttpClient,
                        apiRootProvider: ObservableInput<string>) {
    super(http);
    this.apiRoot = from(apiRootProvider || [ '' ]);
  }

  /**
   * Search this group of resources.
   *
   * @param parent The parent entity.
   * @param q The search query, required.
   * @param filters A list of additional filter parameters.
   * @param offset The search result offset.
   * @param limit The number of results returned.
   * @return The search results.
   */
  public search(parent: P,
                q: string,
                filters?: { [ key: string ]: string },
                offset?: number,
                limit?: number): Observable<ListResponse<E>> {
    const params: HttpParams = HttpUtil.buildHttpParams(filters, {q, offset, limit});
    const urlObservable = this.apiRoot.pipe(map((root) => this.buildEntityRoot(root, parent, {id: 'search'} as E)));
    return this.buildListQuery(urlObservable, params);
  }

  /**
   * Browse the resources exposed by this endpoint.
   *
   * @param parent The parent entity.
   * @param filters A list of additional filter parameters.
   * @param offset The search result offset.
   * @param limit The number of results returned.
   * @param sort The field to sort on.
   * @param order The sort order, Ascending or Descending.
   * @return Browse results.
   */
  public browse(parent: P,
                filters?: { [ key: string ]: string },
                sort?: string,
                order?: string,
                offset?: number,
                limit?: number): Observable<ListResponse<E>> {
    const params: HttpParams = HttpUtil.buildHttpParams(filters, {sort, order, offset, limit});
    const urlObservable = this.apiRoot.pipe(map((root) => this.buildEntityRoot(root, parent, {id: ''} as E)));
    return this.buildListQuery(urlObservable, params);
  }

  /**
   * Create a new entity.
   *
   * @param parent The parent entity.
   * @param entity The entity for the request body.
   * @return The request results.
   */
  public create(parent: P, entity: E): Observable<E> {
    return this.apiRoot
      .pipe(
        map((root) => this.buildEntityRoot(root, parent, {id: ''} as E)),
        switchMap((url) => this.http.post<E>(url, entity)),
      );
  }

  /**
   * Read an entity by ID.
   *
   * @param parent The parent entity.
   * @param id The id of the entity to retrieve.
   * @return The request results.
   */
  public read(parent: P, id: string): Observable<E> {
    return this.apiRoot
      .pipe(
        map((root) => this.buildEntityRoot(root, parent, {id} as E)),
        switchMap((url) => this.http.get<E>(url)),
      );
  }

  /**
   * Update an entity.
   *
   * @param parent The parent entity.
   * @param entity The entity for the request body.
   * @return The request results.
   */
  public update(parent: P, entity: E): Observable<E> {
    return this.apiRoot
      .pipe(
        map((root) => this.buildEntityRoot(root, parent, entity)),
        switchMap((url) => this.http.put<E>(url, entity)),
      );
  }

  /**
   * Delete an entity.
   *
   * @param parent The parent entity.
   * @param entity The entity for the request body.
   * @return A void observable.
   */
  public destroy(parent: P, entity: E): Observable<void> {
    return this.apiRoot
      .pipe(
        map((root) => this.buildEntityRoot(root, parent, entity)),
        switchMap((url) => this.http.delete<void>(url)),
      );
  }

  /**
   * This method should return the root url for the passed entity.
   */
  private buildEntityRoot(apiRoot: string, parent: P, entity: E): string {
    return `${apiRoot}/${this.parentStub}/${parent && parent.id || ''}/${this.resourcesStub}/${entity && entity.id || ''}`;
  }
}
