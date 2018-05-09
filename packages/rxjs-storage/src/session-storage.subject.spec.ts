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

import { SessionStorageSubject } from './session-storage.subject';

describe('SessionStorageSubject', () => {

  const testValue = {
    stringValue: 'string',
    intValue: 100,
    doubleValue: 1.234,
    booleanValue: true,
  };
  let s: SessionStorageSubject<any>;

  beforeEach(() => {
    window.sessionStorage.clear();
    s = new SessionStorageSubject<any>('test_key');
  });

  afterEach(() => {
    s.unsubscribe();
    s = null;
  });

  it('should permit subscription to a key.', () => {
    let recipient = null;

    s.subscribe((value) => recipient = value);
    s.next('Foo');
    expect(recipient).toEqual('Foo');
    s.next('Bar');
    expect(recipient).toEqual('Bar');
  });

  it('should permit access via value and getValue', () => {
    s.next(testValue);

    expect(s.getValue()).toEqual(testValue);
    expect(s.value).toEqual(testValue);
  });

  it('should throw an error on getValue if an error was reported', () => {
    s.error('this is an error');
    try {
      s.getValue();
      fail();
    } catch (e) {
      // pass
    }
  });

  it('should throw an error on getValue if closed', () => {
    s.unsubscribe();
    try {
      s.getValue();
      fail();
    } catch (e) {
      // pass
    }
  });

  it('should be type-safe', () => {
    s.next(testValue);
    s.subscribe((value) => expect(value).toEqual(testValue));
  });

  it('should broadcast the last value on subscription', () => {
    s.next(testValue);
    s.subscribe((value) => expect(value).toEqual(testValue));
  });

  it('should load values from existing storage', () => {
    window.sessionStorage.setItem('test_key', JSON.stringify(testValue));
    s.subscribe((value) => expect(value).toEqual(testValue));
  });

  it('should return undefined on empty', () => {
    s.subscribe((value) => expect(value).toBeUndefined());
  });

  it('should return undefined on parse error', () => {
    window.sessionStorage.setItem('test_key', JSON.stringify(testValue).slice(0, 10));
    s.subscribe((value) => expect(value).toBeUndefined());
  });

  it('should not emit a value if the subject is complete.', () => {
    s.complete();
    s.subscribe(() => fail());
  });

  it('should throw an error if an error has been reported.', () => {
    s.error('This is an error');
    s.subscribe(
      () => fail(),
      () => {
      },
    );
  });
});
