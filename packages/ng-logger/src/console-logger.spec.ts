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

import {ConsoleLogger} from './console-logger';

/**
 * Unit tests for the console logger.
 */
describe('ConsoleLogger', () => {

  const logger = new ConsoleLogger();

  it('should permit log()', () => {
    const logSpy = spyOn(console as any, 'log');

    logger.log('test', 'one', 'two');
    expect(logSpy).toHaveBeenCalledWith('test', 'one', 'two');

  });

  it('should permit debug()', () => {
    const debugSpy = spyOn(console as any, 'debug');

    logger.debug('test', 'one', 'two');
    expect(debugSpy).toHaveBeenCalledWith('test', 'one', 'two');

  });

  it('should permit info()', () => {
    const infoSpy = spyOn(console as any, 'info');

    logger.info('test', 'one', 'two');
    expect(infoSpy).toHaveBeenCalledWith('test', 'one', 'two');
  });

  it('should permit warn()', () => {
    const warnSpy = spyOn(console as any, 'warn');

    logger.warn('test', 'one', 'two');
    expect(warnSpy).toHaveBeenCalledWith('test', 'one', 'two');
  });

  it('should permit error()', () => {
    const errorSpy = spyOn(console as any, 'error');

    logger.error('test', 'one', 'two');
    expect(errorSpy).toHaveBeenCalledWith('test', 'one', 'two');
  });
});
