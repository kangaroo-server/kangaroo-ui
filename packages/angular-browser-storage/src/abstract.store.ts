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

import { Logger } from '@kangaroo/angular-logger';

/**
 * This abstract class partially implements a type-safe key/value browser storage adapter.
 *
 * @author Michael Krotscheck
 */
export abstract class AbstractStore {

  /**
   * The list of available keys.
   */
  abstract readonly keys: string[];

  /**
   * Whether this particular storage method is supported.
   */
  abstract readonly isSupported: boolean;

  /**
   * Create a new instance.
   *
   * @param log The logger should be provided by the implementing class.
   */
  constructor(private log: Logger) {
  }

  /**
   * The number of key/value pairs available.
   */
  get length(): number {
    return this.keys.length;
  }

  /**
   * Set a key/value pair.
   *
   * @param key The key to use.
   * @param value The value to set. Will be JSON encoded.
   * @return The value.
   */
  public set(key: string, value: any): any {
    return this.supportGuard(() => {
      const rawValue = JSON.stringify(value);
      this.setRaw(key, rawValue);
      return value;
    });
  }

  /**
   * Persist a string/string value pair to the underlying storage provider.
   *
   * @param key The key to use.
   * @param value The value to set. Will be JSON encoded.
   */
  public abstract setRaw(key: string, value: string): void;

  /**
   * Get the value for a specific key.
   *
   * @param key The key.
   * @return The value, if available. Else undefined.
   */
  public get(key: string): any | undefined {
    return this.supportGuard(() => {
      const rawValue = this.getRaw(key);
      if (rawValue !== undefined) {
        return JSON.parse(rawValue);
      }
    });
  }

  /**
   * Get the value for a specific key from the underlying storage provider.
   *
   * @param key The key.
   * @return The value, if available. Else undefined.
   */
  public abstract getRaw(key: string): string | undefined;

  /**
   * Return whether this key has been stored.
   *
   * @param key The key to check.
   * @return True if the key is available, otherwise false.
   */
  abstract has(key: string): boolean;

  /**
   * Remove a specific key from this storage mechanism.
   *
   * @param key The key to clear.
   */
  abstract remove(key: string): void;

  /**
   * Clear all key/value pairs.
   */
  public clear(): void {
    return this.supportGuard(() => {
      this.keys.forEach((key) => this.remove(key));
    });
  }

  /**
   * Helper function that only executes methods if the storage engine is supported.
   *
   * @param func The function to invoke.
   * @param defaultValue A default value to return in case of failure.
   */
  protected supportGuard(func: Function, defaultValue?: any): any {
    if (this.isSupported) {
      return func();
    } else {
      this.log.warn('This storage mechanism is not supported');
      return defaultValue;
    }
  }
}
