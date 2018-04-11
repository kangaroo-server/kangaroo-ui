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

import { JWT } from './jwt';
import { pangrams } from './text-util.spec';
import { JOSEHeader, JsonWebToken } from './json-web-token';

describe('JWT', () => {

    const header: JOSEHeader = {
        'typ': 'JWT',
        'alg': 'HMAC256'
    };
    const signature = 'signature';

    it('should throw an error with an invalid token', () => {
        try {
            JWT.parse('');
            fail();
        } catch (e) {
            expect(e.message).toEqual('Invalid JWT Format');
        }

    });

    Object.keys(pangrams).forEach((key) => {
        it(`Decode JWT with '${key}' content in key`, () => {

            const original: JsonWebToken = {
                header,
                signature,
                claims: {
                    language: pangrams[key]
                }
            };

            const encoded: string = JWT.stringify(original);
            const decoded: JsonWebToken = JWT.parse(encoded);
            expect(decoded).toEqual(original);
        });
    });
});
