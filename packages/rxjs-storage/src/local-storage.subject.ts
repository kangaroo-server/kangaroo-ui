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

import { Subject } from 'rxjs/Subject';
import { ObjectUnsubscribedError } from 'rxjs/Rx'; // tslint:disable-line
import { Subscriber } from 'rxjs/Subscriber';
import { ISubscription, Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

/**
 * This subject behaves much like a BehaviorSubject, however the value is
 * backed by the browser's localStorage.
 */
export class LocalStorageSubject<T> extends Subject<T> {

  /**
   * Our hot subscription which keeps our subject alive.
   */
  private eventSubscription: Subscription;

  /**
   * Reference to the local storage instance.
   */
  private readonly storage: Storage;

  /**
   * Create a new behavior subject instance.
   *
   * @param _key The storage key.
   */
  constructor(private _key: string) {
    super();

    this.storage = window.localStorage;

    // Listen to localstorage events, for changes in other browser windows.
    // This event is then passed to super.next() to bypass our internal storage,
    // as the value will already have been stored by another browser.
    this.eventSubscription = Observable
      .fromEvent(window, 'storage')
      .filter((e: StorageEvent) => e.key === this._key)
      .map(() => this.decodedValue())
      .subscribe((value) => super.next(value));
  }

  /**
   * Convenience accessor for the current value.
   *
   * @returns The current value.
   */
  get value(): T {
    return this.getValue();
  }

  /**
   * Finish usage of this subject.
   */
  public complete() {
    super.complete();

    if (this.eventSubscription && !this.eventSubscription.closed) {
      this.eventSubscription.unsubscribe();
    }
    this.eventSubscription = null;
  }

  /**
   * Unsubscribe this subject from its upstream components.
   */
  public unsubscribe() {
    super.unsubscribe();

    if (this.eventSubscription && !this.eventSubscription.closed) {
      this.eventSubscription.unsubscribe();
    }
  }

  /**
   * Return the current value.
   */
  public getValue(): T {
    if (this.hasError) {
      throw this.thrownError;
    } else if (this.closed) {
      throw new ObjectUnsubscribedError();
    } else {
      return this.decodedValue();
    }
  }

  /**
   * Send the next value, persisting it to local storage.
   *
   * @param value The next value.
   */
  public next(value: T): void {
    const v = JSON.stringify(value);
    this.storage.setItem(this._key, v);
    super.next(value);
  }

  /**
   * When subscribed, begin by emitting the current value of the subject.
   *
   * @param subscriber The subscriber.
   * @returns An active subscription.
   */
  public _subscribe(subscriber: Subscriber<T>): Subscription {
    const subscription = super._subscribe(subscriber); // tslint:disable-line
    if (subscription && !(<ISubscription>subscription).closed) {
      subscriber.next(this.decodedValue());
    }
    return subscription;
  }

  /**
   * Lifecycle-decoupled value decoder.
   *
   * @returns The type-decoded value from the local storage.
   */
  private decodedValue(): T {
    const rawValue = this.storage.getItem(this._key);
    if (rawValue === null) {
      return undefined;
    }
    try {
      return JSON.parse(rawValue);
    } catch (e) {
      return undefined;
    }
  }
}
