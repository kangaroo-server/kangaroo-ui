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
import { inject, TestBed } from '@angular/core/testing';
import { AbstractStore } from '@kangaroo/ng-browser-storage/src/abstract.store';
import { Logger, LoggerModule } from '@kangaroo/ng-logger';
import { BrowserStorageModule } from './index';
import { LocalStore } from './local.store';
import { MemoryStore } from './memory.store';
import { SessionStore } from './session.store';

/**
 * Unit tests for the MemoryStore.
 */
describe('Storage Tests', () => {

  const storageOptions = [ LocalStore, SessionStore, MemoryStore ];
  const mockLogger: Logger = new Logger([]);

  storageOptions.forEach((type) => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          BrowserStorageModule,
          LoggerModule,
        ],
      });
    });

    afterEach(() => {
      const storageImpl = TestBed.get(type);
      storageImpl.clear();
    });

    describe(type.name, () => {

      describe('isSupported', () => {

        if (type === MemoryStore) {
          it('should be true', inject([ MemoryStore ], (store) => {
            expect(store.isSupported).toBeTruthy();
          }));
        }

        if (type === LocalStore || type === SessionStore) {

          it('should be true if available', () => {
            const store = new type(window, mockLogger);
            expect(store.isSupported).toBeTruthy();
          });

          it('should be false if not available', () => {
            const store = new type({} as any, mockLogger);
            expect(store.isSupported).toBeFalsy();
          });

          it('should be false if available, but erroring', () => {
            const store = new type({
              localStorage: {},
              sessionStorage: {},
            } as any, mockLogger);
            expect(store.isSupported).toBeFalsy();
          });
        }
      });

      describe('keys', () => {
        it('should start empty with no content', inject([ type ], (testStore) => {
          expect(testStore.keys.length).toEqual(0);
        }));

        it('should accurately represent set() and remove()', inject([ type ], (testStore) => {
          expect(testStore.keys.length).toEqual(0);

          testStore.set('one', 'one');
          expect(testStore.keys.length).toEqual(1);
          expect(testStore.keys).toContain('one');

          testStore.set('two', 'two');
          expect(testStore.keys.length).toEqual(2);
          expect(testStore.keys).toContain('one', 'two');

          testStore.remove('one');
          expect(testStore.keys.length).toEqual(1);
          expect(testStore.keys).toContain('two');

          testStore.clear();
          expect(testStore.keys.length).toEqual(0);
        }));
      });

      describe('length', () => {
        it('should start at 9 with no content', inject([ type ], (testStore) => {
          expect(testStore.length).toEqual(0);
        }));

        it('should accurately represent set() and remove()', inject([ type ], (testStore) => {
          expect(testStore.length).toEqual(0);

          testStore.set('one', 'one');
          expect(testStore.length).toEqual(1);

          testStore.set('two', 'two');
          expect(testStore.length).toEqual(2);

          testStore.remove('one');
          expect(testStore.length).toEqual(1);

          testStore.clear();
          expect(testStore.length).toEqual(0);
        }));
      });

      describe('get() and set()', () => {
        it('should return undefined on invalid value', inject([ type ], (testStore) => {
          expect(testStore.get('invalid')).toBeUndefined();
        }));

        it('should correctly return typed data if set', inject([ type ], (testStore) => {
          testStore.set('string', 'string');
          testStore.set('number', 100);
          testStore.set('object', {foo: 'bar'});
          testStore.set('boolean', true);

          expect(testStore.get('string')).toBe('string');
          expect(testStore.get('number')).toBe(100);
          expect(testStore.get('object')).toEqual({foo: 'bar'});
          expect(testStore.get('boolean')).toBe(true);
        }));
      });

      describe('has()', () => {
        it('should return false when a value is not set', inject([ type ], (testStore) => {
          expect(testStore.has('invalid')).toEqual(false);
        }));

        it('should return true if a value is set', inject([ type ], (testStore) => {
          testStore.set('test', 'test');
          expect(testStore.has('test')).toEqual(true);
        }));
      });

      describe('remove()', () => {
        it('should return if the value is not set', inject([ type ], (testStore) => {
          try {
            testStore.remove('invalid');
          } catch (e) {
            fail(e);
          }
        }));

        it('should remove a value', inject([ type ], (testStore) => {
          testStore.set('test', 'test');
          expect(testStore.has('test')).toEqual(true);
          testStore.remove('test');
          expect(testStore.has('test')).toEqual(false);
        }));
      });

      describe('clear()', () => {
        it('should do nothing if empty', inject([ type ], (testStore) => {
          expect(testStore.keys.length).toEqual(0);
          try {
            testStore.clear();
          } catch (e) {
            fail(e);
          }
        }));

        it('clear values if set', inject([ type ], (testStore) => {
          testStore.set('string', 'string');
          testStore.set('number', 100);
          testStore.set('object', {foo: 'bar'});
          testStore.set('boolean', true);

          expect(testStore.keys).toContain('string');
          expect(testStore.keys).toContain('number');
          expect(testStore.keys).toContain('object');
          expect(testStore.keys).toContain('boolean');
          testStore.clear();
          expect(testStore.keys.length).toEqual(0);
        }));
      });
    });
  });

  describe('AbstractStore', () => {

    class TestStore extends AbstractStore {
      readonly keys: string[] = [];

      constructor(public readonly isSupported, log: Logger) {
        super(log);
      }

      getRaw(key: string): string | undefined {
        return undefined;
      }

      has(key: string): boolean {
        return false;
      }

      remove(key: string): void {
      }

      setRaw(key: string, value: string): void {
      }
    }

    let testLogger: Logger;
    let unsupportedStore: TestStore;

    beforeEach(() => {
      testLogger = new Logger([]);
      unsupportedStore = new TestStore(false, testLogger);
    });

    describe('supportGuard', () => {
      it('should log a warning if not supported', () => {
        const warnSpy: jasmine.Spy = spyOn(testLogger, 'warn').and.stub();
        unsupportedStore.set('foo', 'bar');
        expect(warnSpy).toHaveBeenCalledWith('This storage mechanism is not supported');
      });
    });
  });
});
