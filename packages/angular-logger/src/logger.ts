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

import { Injectable } from '@angular/core';
import { LoggingBackend } from './logging-backend';

/**
 * A logging facade, which will rebroadcast all messages received to all
 * provided backends.
 *
 * @author Michael Krotscheck
 */
@Injectable()
export class Logger {

  /**
   * Create a logger with a specific namespace
   *
   * @param namespace The classname, or namespace.
   * @param backends All available logging backends.
   */
  constructor(public readonly namespace: string,
              private backends: LoggingBackend[]) {
  }

  /**
   * Log generic messages to the console.
   *
   * @param msgs The messages to log.
   */
  public log(...msgs: any[]): void {
    this.backends.forEach(be => be.log(this.namespace, ...msgs));
  }

  /**
   * Log a debug message to the console.
   *
   * @param msgs A list of messages to send.
   */
  public debug(...msgs: any[]) {
    this.backends.forEach(be => be.debug(this.namespace, ...msgs));
  }

  /**
   * Log an info message to the console.
   *
   * @param msgs A list of messages to send.
   */
  public info(...msgs: any[]) {
    this.backends.forEach(be => be.info(this.namespace, ...msgs));
  }

  /**
   * Log a warning message to the console.
   *
   * @param msgs A list of messages to send.
   */
  public warn(...msgs: any[]) {
    this.backends.forEach(be => be.warn(this.namespace, ...msgs));
  }

  /**
   * Log an error message to the console.
   *
   * @param msgs A list of messages to send.
   */
  public error(...msgs: any[]) {
    this.backends.forEach(be => be.error(this.namespace, ...msgs));
  }
}
