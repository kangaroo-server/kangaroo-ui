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

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Inject, InjectionToken, Optional } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { ObservableInput } from 'rxjs';
import { AbstractResourceService } from './abstract-resource.service';
import { CommonModel } from './common.model';
import { ListResponse } from './list-response.model';
import { SortOrder } from './sort-order.enum';
import createSpy = jasmine.createSpy;

/**
 * Test API root.
 */
export const API_ROOT: InjectionToken<ObservableInput<string>> =
  new InjectionToken<ObservableInput<string>>('API_ROOT');

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
    constructor(@Inject(HttpClient) http: HttpClient,
                @Optional() @Inject(API_ROOT) apiRoot: ObservableInput<string>) {
      super('test', http, apiRoot);
    }
  }

  let service: TestEntityService;
  let controller: HttpTestingController;
  const validEntity: TestEntity = {
    id: 'test_id',
    createdDate: 10000,
    modifiedDate: 20000,
    name: 'test_name',
  };

  describe('with an API root', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          TestEntityService,
          {
            provide: API_ROOT,
            useValue: Promise.resolve('http://example.com/v1'),
          },
        ],
        imports: [
          HttpClientModule,
          HttpClientTestingModule,
        ],
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
        imports: [ HttpClientModule, HttpClientTestingModule ],
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
            foo: 'bar',
            lol: 'cat',
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

      describe('result set subscription', () => {
        let sampleTestResults: ListResponse<TestEntity>;

        beforeEach(() => {
          sampleTestResults = {
            total: 0,
            offset: 0,
            limit: 10,
            results: [],
            sort: 'id',
            order: SortOrder.Ascending,
          };
          for (let i = 0; i < 10; i++) {
            const testEntity: TestEntity = {
              id: i.toString(10),
              createdDate: i * 1000,
              modifiedDate: i * 1000 + 1,
              name: `Test Name ${i}`,
            };
            sampleTestResults.results.push(testEntity);
          }
        });

        it('should emit the result set but not complete()', async(() => {
          const subscription = service
            .browse(null, null, null, 10)
            .subscribe((result) => expect(result).toEqual(sampleTestResults), fail, fail);

          // Send the response....
          controller.expectOne((request) => request.url === '/test/').flush(sampleTestResults);

          subscription.unsubscribe();
        }));

        it('should not emit the result set if a GET/PUT event loads an unmodified resource', async(() => {
          const spy = createSpy();

          const subscription = service
            .browse(null, null, null, 10)
            .subscribe(spy, fail, fail);

          // Send the response....
          controller
            .expectOne((request) => request.url === '/test/')
            .flush(sampleTestResults);

          // Simulate entity GET.
          service.entityUpdated.next(sampleTestResults.results[ 2 ]);

          expect(spy).toHaveBeenCalledTimes(1);

          subscription.unsubscribe();
        }));

        it('should not emit the result set if a GET/PUT event loads a resource outside the page', async(() => {
          const spy = createSpy();

          const subscription = service
            .browse(null, null, null, 10)
            .subscribe(spy, fail, fail);

          // Send the response....
          controller
            .expectOne((request) => request.url === '/test/')
            .flush(sampleTestResults);

          // Simulate entity GET.
          service.entityUpdated.next({id: 'outside-id', name: 'hello'});

          expect(spy).toHaveBeenCalledTimes(1);

          subscription.unsubscribe();
        }));

        it('should emit the result set if a GET/PUT event loads a modified resource', async(() => {
          const spy = createSpy();

          const subscription = service
            .browse(null, null, null, 10)
            .subscribe(spy, fail, fail);

          // Send the response....
          controller
            .expectOne((request) => request.url === '/test/')
            .flush(sampleTestResults);

          // Simulate entity GET.
          service.entityUpdated.next({id: '2', name: 'Updated', modifiedDate: 10000, createdDate: 2000});

          expect(spy).toHaveBeenCalledTimes(2);

          subscription.unsubscribe();
        }));

        it('should re-request and emit the page if a POST request succeeds.', async(() => {
          const subscription = service
            .browse(null, null, null, 10)
            .subscribe((result) => expect(result).toEqual(sampleTestResults), fail, fail);

          // Send the response....
          controller
            .expectOne((request) => request.url === '/test/')
            .flush(sampleTestResults);

          // Simulate entity creation.
          service.entityCreated.next({id: 'test', name: 'test'});

          // Expect that the GET request has been re-issued.
          controller
            .expectOne((request) => request.url === '/test/')
            .flush(sampleTestResults);

          subscription.unsubscribe();
        }));

        it('should re-request and emit the page if a DELETE request succeeds.', async(() => {
          const subscription = service
            .browse(null, null, null, 10)
            .subscribe((result) => expect(result).toEqual(sampleTestResults), fail, fail);

          // Send the response....
          controller
            .expectOne((request) => request.url === '/test/')
            .flush(sampleTestResults);

          // Simulate entity creation.
          service.entityRemoved.next({id: 'test', name: 'test'});

          // Expect that the GET request has been re-issued.
          controller.expectOne((request) => request.url === '/test/').flush(sampleTestResults);

          subscription.unsubscribe();
        }));
      });
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
            foo: 'bar',
            lol: 'cat',
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

      describe('result set subscription', () => {
        let sampleTestResults: ListResponse<TestEntity>;

        beforeEach(() => {
          sampleTestResults = {
            total: 0,
            offset: 0,
            limit: 10,
            results: [],
            sort: 'id',
            order: SortOrder.Ascending,
          };
          for (let i = 0; i < 10; i++) {
            const testEntity: TestEntity = {
              id: i.toString(10),
              createdDate: i * 1000,
              modifiedDate: i * 1000 + 1,
              name: `Test Name ${i}`,
            };
            sampleTestResults.results.push(testEntity);
          }
        });

        it('should emit the result set but not complete()', async(() => {
          const subscription = service
            .search('', null, null, 10)
            .subscribe((result) => expect(result).toEqual(sampleTestResults), fail, fail);

          // Send the response....
          controller.expectOne((request) => request.url === '/test/search').flush(sampleTestResults);

          subscription.unsubscribe();
        }));

        it('should not emit the result set if a GET/PUT event loads an unmodified resource', async(() => {
          const spy = createSpy();

          const subscription = service
            .search('', null, null, 10)
            .subscribe(spy, fail, fail);

          // Send the response....
          controller
            .expectOne((request) => request.url === '/test/search')
            .flush(sampleTestResults);

          // Simulate entity GET.
          service.entityUpdated.next(sampleTestResults.results[ 2 ]);

          expect(spy).toHaveBeenCalledTimes(1);

          subscription.unsubscribe();
        }));

        it('should not emit the result set if a GET/PUT event loads a resource outside the page', async(() => {
          const spy = createSpy();

          const subscription = service
            .search('', null, null, 10)
            .subscribe(spy, fail, fail);

          // Send the response....
          controller
            .expectOne((request) => request.url === '/test/search')
            .flush(sampleTestResults);

          // Simulate entity GET.
          service.entityUpdated.next({id: 'outside-id', name: 'hello'});

          expect(spy).toHaveBeenCalledTimes(1);

          subscription.unsubscribe();
        }));

        it('should emit the result set if a GET/PUT event loads a modified resource', async(() => {
          const spy = createSpy();

          const subscription = service
            .search('', null, null, 10)
            .subscribe(spy, fail, fail);

          // Send the response....
          controller
            .expectOne((request) => request.url === '/test/search')
            .flush(sampleTestResults);

          // Simulate entity GET.
          service.entityUpdated.next({id: '2', name: 'Updated', modifiedDate: 10000, createdDate: 2000});

          expect(spy).toHaveBeenCalledTimes(2);

          subscription.unsubscribe();
        }));

        it('should re-request and emit the page if a POST request succeeds.', async(() => {
          const subscription = service
            .search('', null, null, 10)
            .subscribe((result) => expect(result).toEqual(sampleTestResults), fail, fail);

          // Send the response....
          controller
            .expectOne((request) => request.url === '/test/search')
            .flush(sampleTestResults);

          // Simulate entity creation.
          service.entityCreated.next({id: 'test', name: 'test'});

          // Expect that the GET request has been re-issued.
          controller
            .expectOne((request) => request.url === '/test/search')
            .flush(sampleTestResults);

          subscription.unsubscribe();
        }));

        it('should re-request and emit the page if a DELETE request succeeds.', async(() => {
          const subscription = service
            .search('', null, null, 10)
            .subscribe((result) => expect(result).toEqual(sampleTestResults), fail, fail);

          // Send the response....
          controller
            .expectOne((request) => request.url === '/test/search')
            .flush(sampleTestResults);

          // Simulate entity creation.
          service.entityRemoved.next({id: 'test', name: 'test'});

          // Expect that the GET request has been re-issued.
          controller.expectOne((request) => request.url === '/test/search').flush(sampleTestResults);

          subscription.unsubscribe();
        }));
      });

    });

    describe('create()', () => {
      it('should issue a POST request', async(() => {
        service.create(validEntity).subscribe();
        service.entityCreated.subscribe((e) => expect(e).toEqual(validEntity));

        controller
          .expectOne((request) => {
            expect(request.method).toEqual('POST');
            expect(request.url).toEqual('/test/');
            expect(request.body).toEqual(validEntity);
            return true;
          })
          .flush(validEntity);
      }));
    });

    describe('read()', () => {
      it('should issue a GET request', async(() => {
        service.read('test_id').subscribe();
        service.entityUpdated.subscribe((e) => expect(e).toEqual(validEntity));

        controller
          .expectOne((request) => {
            expect(request.method).toEqual('GET');
            expect(request.url).toEqual('/test/test_id');
            return true;
          })
          .flush(validEntity);
      }));
    });

    describe('update()', () => {
      it('should issue a PUT request', async(() => {
        service.update(validEntity).subscribe();
        service.entityUpdated.subscribe((e) => expect(e).toEqual(validEntity));

        controller
          .expectOne((request) => {
            expect(request.method).toEqual('PUT');
            expect(request.url).toEqual('/test/test_id');
            expect(request.body).toEqual(validEntity);
            return true;
          })
          .flush(validEntity);
      }));
    });

    describe('destroy()', () => {
      it('should issue a DELETE request', async(() => {
        service.destroy(validEntity).subscribe();
        service.entityRemoved.subscribe((e) => expect(e).toEqual(validEntity));

        controller
          .expectOne((request) => {
            expect(request.method).toEqual('DELETE');
            expect(request.url).toEqual('/test/test_id');
            return true;
          })
          .flush(validEntity);
      }));
    });
  });
});
