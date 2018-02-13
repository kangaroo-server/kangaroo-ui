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

import { LOGGING_BACKEND, LoggingBackend } from './logging-backend';
import { ClassProvider, Injectable } from '@angular/core';

/**
 * A simple facade on top of console.log.
 *
 * @author Michael Krotscheck
 */
// tslint:disable:no-console
@Injectable()
export class ConsoleLogger implements LoggingBackend {

    /**
     * Log generic messages to the console.
     *
     * @param namespace The namespace which issued this logging message.
     * @param msgs The messages to log.
     */
    public log(namespace: string, ...msgs: any[]): void {
        console.log(namespace, ...msgs);
    }

    /**
     * Log a debug message to the console.
     *
     * @param namespace The namespace which issued this logging message.
     * @param msgs A list of messages to send.
     */
    public debug(namespace: string, ...msgs: any[]) {
        console.debug(namespace, ...msgs);
    }

    /**
     * Log an info message to the console.
     *
     * @param namespace The namespace which issued this logging message.
     * @param msgs A list of messages to send.
     */
    public info(namespace: string, ...msgs: any[]) {
        console.info(namespace, ...msgs);
    }

    /**
     * Log a warning message to the console.
     *
     * @param namespace The namespace which issued this logging message.
     * @param msgs A list of messages to send.
     */
    public warn(namespace: string, ...msgs: any[]) {
        console.warn(namespace, ...msgs);
    }

    /**
     * Log an error message to the console.
     *
     * @param namespace The namespace which issued this logging message.
     * @param msgs A list of messages to send.
     */
    public error(namespace: string, ...msgs: any[]) {
        console.error(namespace, ...msgs);
    }
}

/**
 * The injection provider for the default console logger.
 */
export const consoleBackendProvider: ClassProvider = {
    provide: LOGGING_BACKEND,
    multi: true,
    useClass: ConsoleLogger
};
