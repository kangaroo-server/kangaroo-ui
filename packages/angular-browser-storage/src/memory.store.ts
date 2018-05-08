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

import { Inject, Injectable } from '@angular/core';
import { Logger } from '@kangaroo/angular-logger';
import { AbstractStore } from './abstract.store';
import { WINDOW } from './window';

/**
 * This provides a memory-based key/value storage mechanism. It's provided as
 * a fallback option for all other storage mechanisms, to prevent unexpected
 * runtime failures.
 *
 * @author Michael Krotscheck
 */
@Injectable()
export class MemoryStore extends AbstractStore {

  /**
   * Is this storage method supported?
   */
  public readonly isSupported = true;

  /**
   * The memory storage hash.
   */
  private store: {} = {};

  /**
   * Create a new instance of the MemorySTore
   *
   * @param window The browser window (or a mock), injected.
   * @param log Module logger.
   */
  constructor(@Inject(WINDOW) private window,
              log: Logger) {
    super(log);
    this.isSupported = true;
  }

  /**
   * Return the list of all keys in storage.
   *
   * @return A list of strings.
   */
  public get keys(): string[] {
    return this.supportGuard(() => {
      return Object.keys(this.store);
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
      return this.store.hasOwnProperty(key);
    }, false);
  }

  /**
   * Remove a specific key from this storage mechanism.
   *
   * @param key The key to clear.
   */
  public remove(key: string): void {
    return this.supportGuard(() => {
      delete this.store[ key ];
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
      this.store[ key ] = value;
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
      return this.store[ key ] || undefined;
    });
  }
}
