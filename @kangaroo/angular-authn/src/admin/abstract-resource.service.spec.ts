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

import { Inject, Optional } from '@angular/core';
import { AbstractResourceService } from './abstract-resource.service';
import { CommonModel, SortOrder } from './model';
import { async, TestBed } from '@angular/core/testing';
import { ADMIN_API_ROOT, AdminApiRootProvider } from './admin-api-root';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

/**
 * Unit tests for the AbstractResourceService.
 */
describe('AbstractResourceService', () => {

  /**
   * Private entity class.
   */
  interface TestEntity extends CommonModel {
    name: string;
  }

  /**
   * Test class, exposing request.
   */
  class TestEntityService extends AbstractResourceService<TestEntity> {
    constructor(http: HttpClient, @Optional() @Inject(ADMIN_API_ROOT) apiRoot: AdminApiRootProvider) {
      super('test', http, apiRoot);
    }
  }

  let service: TestEntityService;
  let controller: HttpTestingController;
  const validEntity: TestEntity = {
    id: 'test_id',
    createdDate: 10000,
    modifiedDate: 20000,
    name: 'test_name'
  };

  describe('with an API root', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          TestEntityService,
          {
            provide: ADMIN_API_ROOT,
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
        service.read('test_id').subscribe();

        controller.match((request) => {
          expect(request.method).toEqual('GET');
          expect(request.url).toEqual('http://example.com/v1/test/test_id');
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
          .browse({
            'foo': 'bar',
            'lol': 'cat'
          })
          .subscribe();

        controller.match((request) => {
          expect(request.url).toEqual('/test/');
          expect(request.params.get('foo')).toEqual('bar');
          expect(request.params.get('lol')).toEqual('cat');
          return true;
        });
      }));

      it('should map sort', async(() => {
        service.browse(null, 'name').subscribe();

        controller.match((request) => {
          expect(request.url).toEqual('/test/');
          expect(request.params.get('sort')).toEqual('name');
          return true;
        });
      }));

      it('should map order', async(() => {
        service.browse(null, null, SortOrder.Ascending).subscribe();

        controller.match((request) => {
          expect(request.url).toEqual('/test/');
          expect(request.params.get('order')).toEqual('ASC');
          return true;
        });
      }));

      it('should map offset', async(() => {
        service.browse(null, null, null, 10).subscribe();

        controller.match((request) => {
          expect(request.url).toEqual('/test/');
          expect(request.params.get('offset')).toEqual('10');
          return true;
        });
      }));

      it('should map limit', async(() => {
        service.browse(null, null, null, null, 10).subscribe();

        controller.match((request) => {
          expect(request.url).toEqual('/test/');
          expect(request.params.get('limit')).toEqual('10');
          return true;
        });
      }));
    });

    describe('search()', () => {

      it('should pass the query', async(() => {
        service.search('query').subscribe();

        controller.match((request) => {
          expect(request.url).toEqual('/test/search');
          expect(request.params.get('q')).toEqual('query');
          return true;
        });
      }));

      it('should map filters to the query', async(() => {
        service
          .search('query', {
            'foo': 'bar',
            'lol': 'cat'
          })
          .subscribe();

        controller.match((request) => {
          expect(request.url).toEqual('/test/search');
          expect(request.params.get('q')).toEqual('query');
          expect(request.params.get('foo')).toEqual('bar');
          expect(request.params.get('lol')).toEqual('cat');
          return true;
        });
      }));

      it('should map offset', async(() => {
        service.search('query', null, 10).subscribe();

        controller.match((request) => {
          expect(request.url).toEqual('/test/search');
          expect(request.params.get('q')).toEqual('query');
          expect(request.params.get('offset')).toEqual('10');
          return true;
        });
      }));

      it('should map limit', async(() => {
        service.search('query', null, null, 10).subscribe();

        controller.match((request) => {
          expect(request.url).toEqual('/test/search');
          expect(request.params.get('q')).toEqual('query');
          expect(request.params.get('limit')).toEqual('10');
          return true;
        });
      }));
    });

    describe('create()', () => {
      it('should issue a POST request', async(() => {
        service.create(validEntity).subscribe();

        controller.match((request) => {
          expect(request.method).toEqual('POST');
          expect(request.url).toEqual('/test/');
          expect(request.body).toEqual(validEntity);
          return true;
        });
      }));
    });

    describe('read()', () => {
      it('should issue a GET request', async(() => {
        service.read('test_id').subscribe();

        controller.match((request) => {
          expect(request.method).toEqual('GET');
          expect(request.url).toEqual('/test/test_id');
          return true;
        });
      }));
    });

    describe('update()', () => {
      it('should issue a PUT request', async(() => {
        service.update(validEntity).subscribe();

        controller.match((request) => {
          expect(request.method).toEqual('PUT');
          expect(request.url).toEqual('/test/test_id');
          expect(request.body).toEqual(validEntity);
          return true;
        });
      }));
    });

    describe('destroy()', () => {
      it('should issue a DELETE request', async(() => {
        service.destroy(validEntity).subscribe();

        controller.match((request) => {
          expect(request.method).toEqual('DELETE');
          expect(request.url).toEqual('/test/test_id');
          return true;
        });
      }));
    });
  });
});
