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

import { Inject, InjectionToken, Optional } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { AbstractSubresourceService } from './abstract-subresource.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommonModel } from './common.model';
import { SortOrder } from './sort-order.enum';
import { ObservableInput } from 'rxjs/Observable';

/**
 * Test API root.
 */
export const API_ROOT: InjectionToken<ObservableInput<string>> =
  new InjectionToken<ObservableInput<string>>('API_ROOT');

/**
 * Unit tests for the AbstractSubresourceService.
 */
describe('AbstractSubresourceService', () => {

  /**
   * Private entity class.
   */
  interface TestEntity extends CommonModel {
    name: string;
  }

  /**
   * Private parent entity class.
   */
  interface ParentEntity extends CommonModel {
    name: string;
  }

  /**
   * Test class, exposing request.
   */
  class TestEntityService extends AbstractSubresourceService<ParentEntity, TestEntity> {

    constructor(http: HttpClient,
                @Optional() @Inject(API_ROOT) apiRoot: ObservableInput<string>) {
      super('parent', 'test', http, apiRoot);
    }
  }

  const validEntity: TestEntity = {
    id: 'test_id',
    createdDate: 10000,
    modifiedDate: 20000,
    name: 'test_name'
  };
  const parentEntity: TestEntity = {
    id: 'parent_id',
    createdDate: 10000,
    modifiedDate: 20000,
    name: 'test_name'
  };

  let service: TestEntityService;
  let controller: HttpTestingController;

  describe('with an API root', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          TestEntityService,
          {
            provide: API_ROOT,
            useValue: Promise.resolve('http://example.com/v1')
          }
        ],
        imports: [
          HttpClientModule,
          HttpClientTestingModule
        ]
      });

      service = TestBed.get(TestEntityService);
      controller = TestBed.get(HttpTestingController);
    });

    it('should construct', () => {
      expect(service).toBeDefined();
    });

    describe('read()', () => {
      it('should issue a GET request', async(() => {
        service.read(parentEntity, 'test_id').subscribe();

        controller.match((request) => {
          expect(request.method).toEqual('GET');
          expect(request.url).toEqual('http://example.com/v1/parent/parent_id/test/test_id');
          return true;
        });
      }));

      it('should gracefully handle no parent entity', async(() => {
        service.read(null, 'test_id').subscribe();

        controller.match((request) => {
          expect(request.method).toEqual('GET');
          expect(request.url).toEqual('http://example.com/v1/parent//test/test_id');
          return true;
        });
      }));
    });
  });

  describe('with no API root', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [ TestEntityService ],
        imports: [ HttpClientModule, HttpClientTestingModule ]
      });

      service = TestBed.get(TestEntityService);
      controller = TestBed.get(HttpTestingController);
    });

    it('should construct', () => {
      expect(service).toBeDefined();
    });

    describe('browse()', () => {

      it('should map filters to the query', async(() => {
        service
          .browse(parentEntity,
            {
              'foo': 'bar',
              'lol': 'cat'
            })
          .subscribe();

        controller.match((request) => {
          expect(request.url).toEqual('/parent/parent_id/test/');
          expect(request.params.get('foo')).toEqual('bar');
          expect(request.params.get('lol')).toEqual('cat');
          return true;
        });
      }));

      it('should map sort', async(() => {
        service.browse(parentEntity, null, 'name').subscribe();

        controller.match((request) => {
          expect(request.url).toEqual('/parent/parent_id/test/');
          expect(request.params.get('sort')).toEqual('name');
          return true;
        });
      }));

      it('should map order', async(() => {
        service.browse(parentEntity, null, null, SortOrder.Ascending).subscribe();

        controller.match((request) => {
          expect(request.url).toEqual('/parent/parent_id/test/');
          expect(request.params.get('order')).toEqual('ASC');
          return true;
        });
      }));

      it('should map offset', async(() => {
        service.browse(parentEntity, null, null, null, 10).subscribe();

        controller.match((request) => {
          expect(request.url).toEqual('/parent/parent_id/test/');
          expect(request.params.get('offset')).toEqual('10');
          return true;
        });
      }));

      it('should map limit', async(() => {
        service.browse(parentEntity, null, null, null, null, 10).subscribe();

        controller.match((request) => {
          expect(request.url).toEqual('/parent/parent_id/test/');
          expect(request.params.get('limit')).toEqual('10');
          return true;
        });
      }));
    });

    describe('search()', () => {

      it('should pass the query', async(() => {
        service.search(parentEntity, 'query').subscribe();

        controller.match((request) => {
          expect(request.url).toEqual('/parent/parent_id/test/search');
          expect(request.params.get('q')).toEqual('query');
          return true;
        });
      }));

      it('should map filters to the query', async(() => {
        service
          .search(parentEntity, 'query', {
            'foo': 'bar',
            'lol': 'cat'
          })
          .subscribe();

        controller.match((request) => {
          expect(request.url).toEqual('/parent/parent_id/test/search');
          expect(request.params.get('q')).toEqual('query');
          expect(request.params.get('foo')).toEqual('bar');
          expect(request.params.get('lol')).toEqual('cat');
          return true;
        });
      }));

      it('should map offset', async(() => {
        service.search(parentEntity, 'query', null, 10).subscribe();

        controller.match((request) => {
          expect(request.url).toEqual('/parent/parent_id/test/search');
          expect(request.params.get('q')).toEqual('query');
          expect(request.params.get('offset')).toEqual('10');
          return true;
        });
      }));

      it('should map limit', async(() => {
        service.search(parentEntity, 'query', null, null, 10).subscribe();

        controller.match((request) => {
          expect(request.url).toEqual('/parent/parent_id/test/search');
          expect(request.params.get('q')).toEqual('query');
          expect(request.params.get('limit')).toEqual('10');
          return true;
        });
      }));
    });

    describe('create()', () => {
      it('should issue a POST request', async(() => {
        service.create(parentEntity, validEntity).subscribe();

        controller.match((request) => {
          expect(request.method).toEqual('POST');
          expect(request.url).toEqual('/parent/parent_id/test/');
          expect(request.body).toEqual(validEntity);
          return true;
        });
      }));
    });

    describe('read()', () => {
      it('should issue a GET request', async(() => {
        service.read(parentEntity, 'test_id').subscribe();

        controller.match((request) => {
          expect(request.method).toEqual('GET');
          expect(request.url).toEqual('/parent/parent_id/test/test_id');
          return true;
        });
      }));

      it('should gracefully handle no parent entity', async(() => {
        service.read(null, 'test_id').subscribe();

        controller.match((request) => {
          expect(request.method).toEqual('GET');
          expect(request.url).toEqual('/parent//test/test_id');
          return true;
        });
      }));
    });

    describe('update()', () => {
      it('should issue a PUT request', async(() => {
        service.update(parentEntity, validEntity).subscribe();

        controller.match((request) => {
          expect(request.method).toEqual('PUT');
          expect(request.url).toEqual('/parent/parent_id/test/test_id');
          expect(request.body).toEqual(validEntity);
          return true;
        });
      }));
    });

    describe('destroy()', () => {
      it('should issue a DELETE request', async(() => {
        service.destroy(parentEntity, validEntity).subscribe();

        controller.match((request) => {
          expect(request.method).toEqual('DELETE');
          expect(request.url).toEqual('/parent/parent_id/test/test_id');
          return true;
        });
      }));
    });
  });
});
