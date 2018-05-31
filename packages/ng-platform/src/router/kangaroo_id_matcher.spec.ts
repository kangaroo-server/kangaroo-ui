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

import { UrlSegment } from '@angular/router';
import { kangarooEntityIdMatcher } from './kangaroo_id_matcher';

/**
 * Unit test for the route matcher factory.
 */
describe('KangarooIdMatcher', () => {

  const nonmatchingSegment = new UrlSegment('non-matching-path', {});
  const matchingSegment = new UrlSegment('09876543210987654321098765432109', {});

  const matcher = kangarooEntityIdMatcher('testId');

  it('should output a url matcher', () => {
    const result = matcher([ nonmatchingSegment ], null, null);
    expect(result).toBeNull();
  });

  it('should match against base-16 encoded bigints, and return the parameter', () => {
    const result = matcher([ matchingSegment, nonmatchingSegment ], null, null);
    expect(result.consumed).toContain(matchingSegment);
    expect(result.posParams[ 'testId' ]).toBe(matchingSegment);
  });

  it('should not match regular strings', () => {
    const result = matcher([ nonmatchingSegment, nonmatchingSegment ], null, null);
    expect(result).toBeNull();

  });

  it('should not match empty segments', () => {
    const result = matcher([], null, null);
    expect(result).toBeNull();
  });

  it('should not match null segments', () => {
    const result = matcher([], null, null);
    expect(result).toBeNull();
  });

  it('should not match extra, unmatched segments', () => {
    const result = matcher([ matchingSegment, nonmatchingSegment ], null, null);
    expect(result.consumed).toContain(matchingSegment);
    expect(result.consumed.length).toEqual(1);
  });

  it('should only match the first segment', () => {
    const result = matcher([ nonmatchingSegment, matchingSegment ], null, null);
    expect(result).toBeNull();
  });
});
