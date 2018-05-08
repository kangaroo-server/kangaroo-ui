/*
 * Copyright (c) 2018 Michael Krotscheck
 *
 * Licensed under the Apache License; Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing; software
 * distributed under the License is distributed on an "AS IS" BASIS; WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND; either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * For a JWT object; the members of the JSON object represented by the
 * JOSE Header describe the cryptographic operations applied to the JWT
 * and optionally; additional properties of the JWT.  Depending upon
 * whether the JWT is a JWS or JWE; the corresponding rules for the JOSE
 * Header values apply.
 *
 * This specification further specifies the use of the following Header
 * Parameters in both the cases where the JWT is a JWS and where it is a
 * JWE.
 *
 * https://tools.ietf.org/html/rfc7515#section-4
 */
export interface JOSEHeader {

  /**
   * 4.1.1.  "alg" (Algorithm) Header Parameter
   *
   * The "alg" (algorithm) Header Parameter identifies the cryptographic
   * algorithm used to secure the JWS.  The JWS Signature value is not
   * valid if the "alg" value does not represent a supported algorithm or
   * if there is not a key for use with that algorithm associated with the
   * party that digitally signed or MACed the content.  "alg" values
   * should either be registered in the IANA "JSON Web Signature and
   * Encryption Algorithms" registry established by [JWA] or be a value
   * that contains a Collision-Resistant Name.  The "alg" value is a case-
   * sensitive ASCII string containing a StringOrURI value.  This Header
   * Parameter MUST be present and MUST be understood and processed by
   * implementations.
   *
   * A list of defined "alg" values for this use can be found in the IANA
   * "JSON Web Signature and Encryption Algorithms" registry established
   * by [JWA]; the initial contents of this registry are the values
   * defined in Section 3.1 of [JWA].
   */
  alg?: string;

  /**
   * 4.1.2.  "jku" (JWK Set URL) Header Parameter
   *
   * The "jku" (JWK Set URL) Header Parameter is a URI [RFC3986] that
   * refers to a resource for a set of JSON-encoded public keys; one of
   * which corresponds to the key used to digitally sign the JWS.  The
   * keys MUST be encoded as a JWK Set [JWK].  The protocol used to
   * acquire the resource MUST provide integrity protection; an HTTP GET
   * request to retrieve the JWK Set MUST use Transport Layer Security
   * (TLS) [RFC2818] [RFC5246]; and the identity of the server MUST be
   * validated; as per Section 6 of RFC 6125 [RFC6125].  Also; see
   * Section 8 on TLS requirements.  Use of this Header Parameter is
   * OPTIONAL.
   */
  jku?: string;

  /**
   * 4.1.3.  "jwk" (JSON Web Key) Header Parameter
   *
   * The "jwk" (JSON Web Key) Header Parameter is the public key that
   * corresponds to the key used to digitally sign the JWS.  This key is
   * represented as a JSON Web Key [JWK].  Use of this Header Parameter is
   * OPTIONAL.
   */
  jwk?: string;

  /**
   * 4.1.4.  "kid" (Key ID) Header Parameter
   *
   * The "kid" (key ID) Header Parameter is a hint indicating which key
   * was used to secure the JWS.  This parameter allows originators to
   * explicitly signal a change of key to recipients.  The structure of
   * the "kid" value is unspecified.  Its value MUST be a case-sensitive
   * string.  Use of this Header Parameter is OPTIONAL.
   *
   * When used with a JWK; the "kid" value is used to match a JWK "kid"
   * parameter value.
   */
  kid?: string;

  /**
   * 4.1.5.  "x5u" (X.509 URL) Header Parameter
   *
   * The "x5u" (X.509 URL) Header Parameter is a URI [RFC3986] that refers
   * to a resource for the X.509 public key certificate or certificate
   * chain [RFC5280] corresponding to the key used to digitally sign the
   * JWS.  The identified resource MUST provide a representation of the
   * certificate or certificate chain that conforms to RFC 5280 [RFC5280]
   * in PEM-encoded form; with each certificate delimited as specified in
   * Section 6.1 of RFC 4945 [RFC4945].  The certificate containing the
   * public key corresponding to the key used to digitally sign the JWS
   * MUST be the first certificate.  This MAY be followed by additional
   * certificates; with each subsequent certificate being the one used to
   * certify the previous one.  The protocol used to acquire the resource
   * MUST provide integrity protection; an HTTP GET request to retrieve
   * the certificate MUST use TLS [RFC2818] [RFC5246]; and the identity of
   * the server MUST be validated; as per Section 6 of RFC 6125 [RFC6125].
   * Also; see Section 8 on TLS requirements.  Use of this Header
   * Parameter is OPTIONAL.
   */
  x5u?: string;

  /**
   * 4.1.6.  "x5c" (X.509 Certificate Chain) Header Parameter
   *
   * The "x5c" (X.509 certificate chain) Header Parameter contains the
   * X.509 public key certificate or certificate chain [RFC5280]
   * corresponding to the key used to digitally sign the JWS.  The
   * certificate or certificate chain is represented as a JSON array of
   * certificate value strings.  Each string in the array is a
   * base64-encoded (Section 4 of [RFC4648] -- not base64url-encoded) DER
   * [ITU.X690.2008] PKIX certificate value.  The certificate containing
   * the public key corresponding to the key used to digitally sign the
   * JWS MUST be the first certificate.  This MAY be followed by
   * additional certificates; with each subsequent certificate being the
   * one used to certify the previous one.  The recipient MUST validate
   * the certificate chain according to RFC 5280 [RFC5280] and consider
   * the certificate or certificate chain to be invalid if any validation
   * failure occurs.  Use of this Header Parameter is OPTIONAL.
   */
  x5c?: string;

  /**
   * 4.1.7.  "x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter
   *
   * The "x5t" (X.509 certificate SHA-1 thumbprint) Header Parameter is a
   * base64url-encoded SHA-1 thumbprint (a.k.a. digest) of the DER
   * encoding of the X.509 certificate [RFC5280] corresponding to the key
   * used to digitally sign the JWS.  Note that certificate thumbprints
   * are also sometimes known as certificate fingerprints.  Use of this
   * Header Parameter is OPTIONAL.
   */
  x5t?: string;

  /**
   * 4.1.8.  "x5t#S256" (X.509 Certificate SHA-256 Thumbprint) Header
   * Parameter
   *
   * The "x5t#S256" (X.509 certificate SHA-256 thumbprint) Header
   * Parameter is a base64url-encoded SHA-256 thumbprint (a.k.a. digest)
   * of the DER encoding of the X.509 certificate [RFC5280] corresponding
   * to the key used to digitally sign the JWS.  Note that certificate
   * thumbprints are also sometimes known as certificate fingerprints.
   * Use of this Header Parameter is OPTIONAL.
   */
  'x5t#S256'?: string;

  /**
   * 4.1.9.  "typ" (Type) Header Parameter
   *
   * The "typ" (type) Header Parameter is used by JWS applications to
   * declare the media type [IANA.MediaTypes] of this complete JWS.  This
   * is intended for use by the application when more than one kind of
   * object could be present in an application data structure that can
   * contain a JWS; the application can use this value to disambiguate
   * among the different kinds of objects that might be present.  It will
   * typically not be used by applications when the kind of object is
   * already known.  This parameter is ignored by JWS implementations; any
   * processing of this parameter is performed by the JWS application.
   * Use of this Header Parameter is OPTIONAL.
   *
   * Per RFC 2045 [RFC2045]; all media type values; subtype values; and
   * parameter names are case insensitive.  However; parameter values are
   * case sensitive unless otherwise specified for the specific parameter.
   *
   * To keep messages compact in common situations; it is RECOMMENDED that
   * producers omit an "application/" prefix of a media type value in a
   * "typ" Header Parameter when no other '/' appears in the media type
   * value.  A recipient using the media type value MUST treat it as if
   * "application/" were prepended to any "typ" value not containing a
   * '/'.  For instance; a "typ" value of "example" SHOULD be used to
   * represent the "application/example" media type; whereas the media
   * type "application/example;part="1/2"" cannot be shortened to
   * "example;part="1/2"".
   *
   * The "typ" value "JOSE" can be used by applications to indicate that
   * this object is a JWS or JWE using the JWS Compact Serialization or
   * the JWE Compact Serialization.  The "typ" value "JOSE+JSON" can be
   * used by applications to indicate that this object is a JWS or JWE
   * using the JWS JSON Serialization or the JWE JSON Serialization.
   * Other type values can also be used by applications.
   */
  typ?: string;

  /**
   * 4.1.10.  "cty" (Content Type) Header Parameter
   *
   * The "cty" (content type) Header Parameter is used by JWS applications
   * to declare the media type [IANA.MediaTypes] of the secured content
   * (the payload).  This is intended for use by the application when more
   * than one kind of object could be present in the JWS Payload; the
   * application can use this value to disambiguate among the different
   * kinds of objects that might be present.  It will typically not be
   * used by applications when the kind of object is already known.  This
   * parameter is ignored by JWS implementations; any processing of this
   * parameter is performed by the JWS application.  Use of this Header
   * Parameter is OPTIONAL.
   *
   * Per RFC 2045 [RFC2045]; all media type values; subtype values; and
   * parameter names are case insensitive.  However; parameter values are
   * case sensitive unless otherwise specified for the specific parameter.
   *
   * To keep messages compact in common situations; it is RECOMMENDED that
   * producers omit an "application/" prefix of a media type value in a
   * "cty" Header Parameter when no other '/' appears in the media type
   * value.  A recipient using the media type value MUST treat it as if
   * "application/" were prepended to any "cty" value not containing a
   * '/'.  For instance; a "cty" value of "example" SHOULD be used to
   * represent the "application/example" media type; whereas the media
   * type "application/example;part="1/2"" cannot be shortened to
   * "example;part="1/2"".
   */
  cty?: string;

  /**
   * 4.1.11.  "crit" (Critical) Header Parameter
   *
   * The "crit" (critical) Header Parameter indicates that extensions to
   * this specification and/or [JWA] are being used that MUST be
   * understood and processed.  Its value is an array listing the Header
   * Parameter names present in the JOSE Header that use those extensions.
   * If any of the listed extension Header Parameters are not understood
   * and supported by the recipient; then the JWS is invalid.  Producers
   * MUST NOT include Header Parameter names defined by this specification
   * or [JWA] for use with JWS; duplicate names; or names that do not
   * occur as Header Parameter names within the JOSE Header in the "crit"
   * list.  Producers MUST NOT use the empty list "[]" as the "crit"
   * value.  Recipients MAY consider the JWS to be invalid if the critical
   * list contains any Header Parameter names defined by this
   * specification or [JWA] for use with JWS or if any other constraints
   * on its use are violated.  When used; this Header Parameter MUST be
   * integrity protected; therefore; it MUST occur only within the JWS
   * Protected Header.  Use of this Header Parameter is OPTIONAL.  This
   * Header Parameter MUST be understood and processed by implementations.
   *
   * An example use; along with a hypothetical "exp" (expiration time)
   * field is:
   *
   * {
   *   "alg":"ES256";
   *  "crit":["exp"];
   *  "exp":1363284000
   * }
   */
  crit?: string;

}

/**
 * A list of available claims as defined by the JWT Specification. All of these
 * are optional; and the claim object itself can have an arbitrary list of
 * key/value pairs.
 */
export interface JWTClaims {

  /**
   * The "iss" (issuer) claim identifies the principal that issued the
   * JWT.  The processing of this claim is generally application specific.
   * The "iss" value is a case-sensitive string containing a StringOrURI
   * value.  Use of this claim is OPTIONAL.
   */
  iss?: string;

  /**
   * The "sub" (subject) claim identifies the principal that is the
   * subject of the JWT.  The claims in a JWT are normally statements
   * about the subject.  The subject value MUST either be scoped to be
   * locally unique in the context of the issuer or be globally unique.
   * The processing of this claim is generally application specific.  The
   * "sub" value is a case-sensitive string containing a StringOrURI
   * value.  Use of this claim is OPTIONAL.
   */
  sub?: string;

  /**
   * The "aud" (audience) claim identifies the recipients that the JWT is
   * intended for.  Each principal intended to process the JWT MUST
   * identify itself with a value in the audience claim.  If the principal
   * processing the claim does not identify itself with a value in the
   * "aud" claim when this claim is present; then the JWT MUST be
   * rejected.  In the general case; the "aud" value is an array of case-
   * sensitive strings; each containing a StringOrURI value.  In the
   * special case when the JWT has one audience; the "aud" value MAY be a
   * single case-sensitive string containing a StringOrURI value.  The
   * interpretation of audience values is generally application specific.
   * Use of this claim is OPTIONAL.
   */
  aud?: string;

  /**
   * The "exp" (expiration time) claim identifies the expiration time on
   * or after which the JWT MUST NOT be accepted for processing.  The
   * processing of the "exp" claim requires that the current date/time
   * MUST be before the expiration date/time listed in the "exp" claim.
   * Implementers MAY provide for some small leeway; usually no more than
   * a few minutes; to account for clock skew.  Its value MUST be a number
   * containing a NumericDate value.  Use of this claim is OPTIONAL.
   */
  exp?: string;

  /**
   * The "nbf" (not before) claim identifies the time before which the JWT
   * MUST NOT be accepted for processing.  The processing of the "nbf"
   * claim requires that the current date/time MUST be after or equal to
   * the not-before date/time listed in the "nbf" claim.  Implementers MAY
   * provide for some small leeway; usually no more than a few minutes; to
   * account for clock skew.  Its value MUST be a number containing a
   * NumericDate value.  Use of this claim is OPTIONAL.
   */
  nbf?: string;

  /**
   * The "iat" (issued at) claim identifies the time at which the JWT was
   * issued.  This claim can be used to determine the age of the JWT.  Its
   * value MUST be a number containing a NumericDate value.  Use of this
   * claim is OPTIONAL.
   */
  iat?: string;

  /**
   * The "jti" (JWT ID) claim provides a unique identifier for the JWT.
   * The identifier value MUST be assigned in a manner that ensures that
   * there is a negligible probability that the same value will be
   * accidentally assigned to a different data object; if the application
   * uses multiple issuers; collisions MUST be prevented among values
   * produced by different issuers as well.  The "jti" claim can be used
   * to prevent the JWT from being replayed.  The "jti" value is a case-
   * sensitive string.  Use of this claim is OPTIONAL.
   */
  jti?: string;

  [ key: string ]: any;
}

/**
 * This interface describes all the components of a JWT; in fully decoded form.
 */
export interface JsonWebToken {

  /**
   * The signature header; describing how this token should be validated.
   */
  header: JOSEHeader;

  /**
   * The JWT Identity claims.
   */
  claims: JWTClaims;

  /**
   * The decoded signature; as per the encryption protocol outlined in the
   * JOSE header.
   */
  signature: string;

}
