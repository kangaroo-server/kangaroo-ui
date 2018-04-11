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

import { Inject, Injectable } from '@angular/core';
import { AbstractStore } from './abstract.store';
import { WINDOW } from './window';
import { Logger } from '@kangaroo/angular-logger';

/**
 * A type-safe layer on top of the browser's LocalStorage. If LocalStorage is
 * not supported, this will log a warning to the console. For a provider
 * that gracefully degrades, use the PersistentStorageService.
 *
 * @author Michael Krotscheck
 */
@Injectable()
export class LocalStore extends AbstractStore {

  /**
   * Is this storage method supported?
   */
  public readonly isSupported: boolean;

  /**
   * Create a new instance of the LocalStore
   *
   * @param window The browser window (or a mock), injected.
   * @param log Module logger.
   */
  constructor(@Inject(WINDOW) private window,
              log: Logger) {
    super(log);

    this.isSupported = this.checkSupport();
  }

  /**
   * Return the list of all keys in localstorage.
   *
   * @return A list of strings.
   */
  public get keys(): string[] {
    return this.supportGuard(() => {
      const keys = [];
      for (let i = 0; i < this.window.localStorage.length; i++) {
        keys.push(this.window.localStorage.key(i));
      }
      return keys;
    }, []);
  }

  /**
   * Return whether this key has been stored.
   *
   * @param key The key to check.
   * @return True if the key is available, otherwise false.
   */
  public has(key: string): boolean {
    return this.supportGuard(() => {
      // This is slow, but the only accurate way we can tell.
      return this.keys.indexOf(key) > -1;
    }, false);
  }

  /**
   * Remove a specific key from this storage mechanism.
   *
   * @param key The key to clear.
   */
  public remove(key: string): void {
    return this.supportGuard(() => {
      return this.window.localStorage.removeItem(key);
    });
  }

  /**
   * Persist a string/string value pair to the underlying storage provider.
   *
   * @param key The key to use.
   * @param value The value to set. Will be JSON encoded.
   */
  public setRaw(key: string, value: string): void {
    return this.supportGuard(() => {
      return this.window.localStorage.setItem(key, value);
    });
  }

  /**
   * Get the value for a specific key from the underlying storage provider.
   *
   * @param key The key.
   * @return The value, if available. Else undefined.
   */
  public getRaw(key: string): string {
    return this.supportGuard(() => {
      if (this.keys.indexOf(key) > -1) {
        return this.window.localStorage.getItem(key);
      }
      return undefined;
    });
  }

  /**
   * Check whether LocalStorage is supported.
   *
   * @return True if it is, otherwise false.
   */
  private checkSupport(): boolean {

    // Does it exist?
    if (!this.window.localStorage) {
      return false;
    }

    // Can we write to it?
    const testKey = '__' + Math.round(Math.random() * 1e7);
    try {
      this.window.localStorage.setItem(testKey, '');
      this.window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
}
