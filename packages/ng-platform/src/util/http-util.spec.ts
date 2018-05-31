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

import { HttpUtil } from './http-util';

/**
 * Unit tests for the http util.
 */
describe('HttpUtil', () => {

  describe('buildHttpParams', () => {
    it('should return an empty instance when nothing is passed', () => {
      const result = HttpUtil.buildHttpParams();
      expect(result).toBeDefined();
      expect(result.keys().length).toEqual(0);
    });

    it('should return an empty instance if multiple empty values are passed', () => {
      const result = HttpUtil.buildHttpParams(null, undefined, {});
      expect(result).toBeDefined();
      expect(result.keys().length).toEqual(0);
    });

    it('should return a collated instance if interpolated with null values.', () => {
      const result = HttpUtil.buildHttpParams(null, {foo: 'bar'}, undefined);
      expect(result).toBeDefined();
      expect(result.keys().length).toEqual(1);
      expect(result.getAll('foo')).toEqual([ 'bar' ]);
    });

    it('should concatenate multiple values with the same key.', () => {
      const result = HttpUtil.buildHttpParams({foo: 'cat'}, {foo: 'bar'});
      expect(result).toBeDefined();
      expect(result.keys().length).toEqual(1);
      expect(result.getAll('foo')).toEqual([ 'cat', 'bar' ]);
    });

    it('should properly merge values.', () => {
      const result = HttpUtil.buildHttpParams({lol: 'cat'}, {foo: 'bar'});
      expect(result).toBeDefined();
      expect(result.keys().length).toEqual(2);
      expect(result.getAll('foo')).toEqual([ 'bar' ]);
      expect(result.getAll('lol')).toEqual([ 'cat' ]);
    });
  });
});
