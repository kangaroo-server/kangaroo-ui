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

import { JOSEHeader, JsonWebToken, JWTClaims } from './json-web-token';
import { TextUtil } from './text-util';

const base64Pattern = '(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?';

/**
 * JSON Web Token utilities.
 */
export namespace JWT {

    /**
     * Regular expression, matching three sequential base64 strings separated by periods.
     *
     * @type {RegExp}
     */
    const jwtRegex = new RegExp(`(${base64Pattern})\.(${base64Pattern})\.(${base64Pattern})`);

    /**
     * Given a JWT, encode it, returning the string representation
     * of the token.
     *
     * @param {JsonWebToken} token A JWT to encode.
     * @returns {string} The token as an encoded string.
     */
    export function stringify(token: JsonWebToken): string {
        const header = TextUtil.b2aUnicode(JSON.stringify(token.header));
        const claims = TextUtil.b2aUnicode(JSON.stringify(token.claims));
        const signature = TextUtil.b2aUnicode(token.signature);

        return `${header}.${claims}.${signature}`;
    }

    /**
     * Given the string representation of a JWT, return the fully decoded
     * version. This method does not validate the signature.
     *
     * @param {string} token The token to decode.
     * @returns {JsonWebToken} The decoded token.
     */
    export function parse(token: string): JsonWebToken {
        const parts = token && token.match(jwtRegex) || null;
        if (!parts) {
            throw new Error('Invalid JWT Format');
        }

        const header: JOSEHeader = JSON.parse(TextUtil.a2bUnicode(parts[1]));
        const claims: JWTClaims = JSON.parse(TextUtil.a2bUnicode(parts[2]));
        const signature = TextUtil.a2bUnicode(parts[3]);

        return { header, claims, signature };
    }
}
