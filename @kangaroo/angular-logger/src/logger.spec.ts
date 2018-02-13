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

import { LoggingBackend } from './logging-backend';
import { Logger } from './logger';

/**
 * Unit tests for our injected logger.
 */
describe('Logger Tests', () => {

  const defaultBackend: LoggingBackend = {
    log: () => {
    },
    debug: () => {
    },
    error: () => {
    },
    warn: () => {
    },
    info: () => {
    }
  };


  it('should permit log()', () => {
    const logSpy = spyOn(defaultBackend, 'log');
    const logger = new Logger('namespace', [ defaultBackend ]);

    logger.log('test', 'one', 'two');
    expect(logSpy).toHaveBeenCalledWith('namespace', 'test', 'one', 'two');

  });

  it('should permit debug()', () => {
    const debugSpy = spyOn(defaultBackend, 'debug');
    const logger = new Logger('namespace', [ defaultBackend ]);

    logger.debug('test', 'one', 'two');
    expect(debugSpy).toHaveBeenCalledWith('namespace', 'test', 'one', 'two');

  });

  it('should permit info()', () => {
    const infoSpy = spyOn(defaultBackend, 'info');
    const logger = new Logger('namespace', [ defaultBackend ]);

    logger.info('test', 'one', 'two');
    expect(infoSpy).toHaveBeenCalledWith('namespace', 'test', 'one', 'two');
  });

  it('should permit warn()', () => {
    const warnSpy = spyOn(defaultBackend, 'warn');
    const logger = new Logger('namespace', [ defaultBackend ]);

    logger.warn('test', 'one', 'two');
    expect(warnSpy).toHaveBeenCalledWith('namespace', 'test', 'one', 'two');
  });

  it('should permit error()', () => {
    const errorSpy = spyOn(defaultBackend, 'error');
    const logger = new Logger('namespace', [ defaultBackend ]);

    logger.error('test', 'one', 'two');
    expect(errorSpy).toHaveBeenCalledWith('namespace', 'test', 'one', 'two');
  });
});
