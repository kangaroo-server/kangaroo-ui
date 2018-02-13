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

/**
 * In order to properly encode and decode non-ASCII characters into a JWT,
 * we need to "downgrade", or encode, these into text byte sequences.
 *
 * The full process, and justification, is described here:
 * https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
 *
 * We don't actually do the full hard-byte conversion ourselves, as that
 * doesn't seem to be necessary, and creates a 'custom' encoding which diverges
 * from public practices.
 */
export namespace TextUtil {

    /**
     * Provided a string that represents a base-64 encoded unicode string,
     * convert it back to a regular DOMstring with appropriate character escaping.
     *
     * @param encoded The encoded string to decode.
     * @returns The decoded string.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
     */
    export function a2bUnicode(encoded) {
        return decodeURIComponent(Array.prototype.map.call(atob(encoded), function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }

    /**
     * Provided a DOMstring, encoded it into a base64 representation, while escaping
     * any 16-byte characters.
     *
     * @param original The original string to decode.
     * @returns The encoded string.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
     */
    export function b2aUnicode(original) {
        return btoa(encodeURIComponent(original).replace(/%([0-9A-F]{2})/g, function (match, p1) {
            return String.fromCharCode(parseInt(p1, 16));
        }));
    }
}
