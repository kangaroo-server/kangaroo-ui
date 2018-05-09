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

import { LocalStorageSubject } from './local-storage.subject';

describe('LocalStorageSubject', () => {

  const testValue = {
    stringValue: 'string',
    intValue: 100,
    doubleValue: 1.234,
    booleanValue: true,
  };
  let l: LocalStorageSubject<any>;

  beforeEach(() => {
    window.localStorage.clear();
    l = new LocalStorageSubject<any>('test_key');
  });

  afterEach(() => {
    l.unsubscribe();
    l = null;
  });

  it('should permit subscription to a key.', () => {
    let recipient = null;

    l.subscribe((value) => recipient = value);
    l.next('Foo');
    expect(recipient).toEqual('Foo');
    l.next('Bar');
    expect(recipient).toEqual('Bar');
  });

  it('should permit access via value and getValue', () => {
    l.next(testValue);

    expect(l.getValue()).toEqual(testValue);
    expect(l.value).toEqual(testValue);
  });

  it('should throw an error on getValue if an error was reported', () => {
    l.error('this is an error');
    try {
      l.getValue();
      fail();
    } catch (e) {
      // pass
    }
  });

  it('should throw an error on getValue if closed', () => {
    l.unsubscribe();
    try {
      l.getValue();
      fail();
    } catch (e) {
      // pass
    }
  });

  it('should be type-safe', () => {
    l.next(testValue);
    l.subscribe((value) => expect(value).toEqual(testValue));
  });

  it('should broadcast the last value on subscription', () => {
    l.next(testValue);
    l.subscribe((value) => expect(value).toEqual(testValue));
  });

  it('should load values from existing storage', () => {
    window.localStorage.setItem('test_key', JSON.stringify(testValue));
    l.subscribe((value) => expect(value).toEqual(testValue));
  });

  it('should return undefined on empty', () => {
    l.subscribe((value) => expect(value).toBeUndefined());
  });

  it('should return undefined on parse error', () => {
    window.localStorage.setItem('test_key', JSON.stringify(testValue).slice(0, 10));
    l.subscribe((value) => expect(value).toBeUndefined());
  });

  it('should not emit a value if the subject is complete.', () => {
    l.complete();
    l.subscribe(() => fail());
  });

  it('should not throw an NPE when complete is called twice.', () => {
    l.complete();
    l.complete();
  });

  it('should emit a value if the window broadcasts a valid storage event.', () => {
    const e = new StorageEvent('storage', {
      url: window.location.href,
      key: 'test_key',
      newValue: 'new value',
    });

    let recipient = null;
    l.subscribe((value) => recipient = value);
    l.next('Foo');
    expect(recipient).toEqual('Foo');
    window.localStorage.setItem('test_key', JSON.stringify(e.newValue));
    window.dispatchEvent(e);
    expect(recipient).toEqual('new value');
  });

  it('should not a value if the window broadcasts an invalid storage event.', () => {
    const e = new StorageEvent('storage', {
      url: window.location.href,
      key: 'other_key',
      newValue: 'new value',
    });

    let recipient = null;
    l.subscribe((value) => recipient = value);
    l.next('Foo');
    expect(recipient).toEqual('Foo');
    window.localStorage.setItem('other_key', JSON.stringify(e.newValue));
    window.dispatchEvent(e);
    expect(recipient).toEqual('Foo');
  });

  it('should throw an error if an error has been reported.', () => {
    l.error('This is an error');
    l.subscribe(
      () => fail(),
      () => {
      });
  });
});
