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

import { InjectionToken } from '@angular/core';

/**
 * An injection token which may be used to attach an arbitrary number of logging
 * backends to the injectable Logging facade.
 */
export const LOGGING_BACKEND = new InjectionToken<LoggingBackend>('logging-backend');

/**
 * A logging adapter, extend and inject as you see fit.
 *
 * @author Michael Krotscheck
 */
export interface LoggingBackend {

    /**
     * Log generic messages to the console.
     *
     * @param msgs The messages to log.
     */
    log(...msgs: any[]): void;

    /**
     * Log a debug message to the console.
     *
     * @param msgs A list of messages to send.
     */
    debug(...msgs: any[]): void;

    /**
     * Log an info message to the console.
     *
     * @param msgs A list of messages to send.
     */
    info(...msgs: any[]): void;

    /**
     * Log a warning message to the console.
     *
     * @param msgs A list of messages to send.
     */
    warn(...msgs: any[]): void;

    /**
     * Log an error message to the console.
     *
     * @param msgs A list of messages to send.
     */
    error(...msgs: any[]): void;
}
