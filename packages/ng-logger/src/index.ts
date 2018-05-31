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

import { ModuleWithProviders, NgModule } from '@angular/core';
import { consoleBackendProvider } from './console-logger';
import { Logger } from './logger';
import { LOGGING_BACKEND, LoggingBackend } from './logging-backend';

export { Logger } from './logger';
export { LOGGING_BACKEND, LoggingBackend } from './logging-backend';

/**
 * This module contains a simple Logging façade, injectable for Angular2 applications.
 *
 * @author Michael Krotscheck
 */
@NgModule({providers: [ Logger ]})
export class LoggerModule {

  /**
   * Inject the default root logger for an application.
   */
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: LoggerModule,
      providers: [ consoleBackendProvider ],
    };
  }
}
