import type { IHttpServerComponent } from '@well-known-components/interfaces/dist/components/http-server'
import type { JSONSchemaType } from 'ajv/dist/types/json-schema'

export type ResponseBody =
  | IHttpServerComponent.JsonBody
  | Uint8Array
  | Buffer
  | string

export default class Response {
  status?: number
  statusText?: string
  body?: ResponseBody
  headers?: Record<string, string>

  /**
   * This interim response indicates that the client should continue the request or ignore the response if the request is already finished.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/100
   */
  static Continue = 100

  /**
   * This code is sent in response to an Upgrade request header from the client and indicates the protocol the server is switching to.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/101
   */
  static SwitchingProtocols = 101

  /**
   * This status code is primarily intended to be used with the Link header, letting the user agent start preloading resources while the server prepares a response.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103
   */
  static EarlyHints = 103

  /**
   * The request succeeded. The result meaning of "success" depends on the HTTP method:
   *
   * - GET: The resource has been fetched and transmitted in the message body.
   * - HEAD: The representation headers are included in the response without any message body.
   * - PUT or POST: The resource describing the result of the action is transmitted in the message body.
   * - TRACE: The message body contains the request message as received by the server.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
   */
  static Ok = 200

  /**
   * The request succeeded, and a new resource was created as a result. This is typically the response sent after POST requests, or some PUT requests.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
   */
  static Created = 201

  /**
   * The request has been received but not yet acted upon. It is noncommittal, since there is no way in HTTP to later send an asynchronous response indicating the outcome of the request. It is intended for cases where another process or server handles the request, or for batch processing.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/202
   */
  static Accepted = 202

  /**
   * This response code means the returned metadata is not exactly the same as is available from the origin server, but is collected from a local or a third-party copy. This is mostly used for mirrors or backups of another resource. Except for that specific case, the 200 OK response is preferred to this status.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/203
   */
  static NonAuthoritativeInformation = 203

  /**
   * There is no content to send for this request, but the headers may be useful. The user agent may update its cached headers for this resource with the new ones.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
   */
  static NoContent = 204

  /**
   * Tells the user agent to reset the document which sent this request.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/205
   */
  static ResetContent = 205

  /**
   * This response code is used when the Range header is sent from the client to request only part of a resource.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206
   */
  static PartialContent = 206

  /**
   * The request has more than one possible response. The user agent or user should choose one of them. (There is no standardized way of choosing one of the responses, but HTML links to the possibilities are recommended so the user can pick.)
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/300
   */
  static MultipleChoices = 300

  /**
   * The URL of the requested resource has been changed permanently. The new URL is given in the response.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301
   */
  static MovedPermanently = 301

  /**
   * This response code means that the URI of requested resource has been changed temporarily. Further changes in the URI might be made in the future. Therefore, this same URI should be used by the client in future requests.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/302
   */
  static Found = 302
  static MovedTemporarily = 302

  /**
   * The server sent this response to direct the client to get the requested resource at another URI with a GET request.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/303
   */
  static SeeOther = 303

  /**
   * This is used for caching purposes. It tells the client that the response has not been modified, so the client can continue to use the same cached version of the response.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304
   */
  static NotModified = 304

  /**
   * The server sends this response to direct the client to get the requested resource at another URI with same method that was used in the prior request. This has the same semantics as the 302 Found HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/307
   */
  static TemporaryRedirect = 307

  /**
   * This means that the resource is now permanently located at another URI, specified by the Location: HTTP Response header. This has the same semantics as the 301 Moved Permanently HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/308
   */
  static PermanentRedirect = 308

  /**
   * The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
   */
  static BadRequest = 400

  /**
   * Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
   */
  static Unauthorized = 401

  /**
   * The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike 401 Unauthorized, the client's identity is known to the server.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403
   */
  static Forbidden = 403

  /**
   * The server can not find the requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 Forbidden to hide the existence of a resource from an unauthorized client. This response code is probably the most well known due to its frequent occurrence on the web.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
   */
  static NotFound = 404

  /**
   * The request method is known by the server but is not supported by the target resource. For example, an API may not allow calling DELETE to remove a resource.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
   */
  static MethodNotAllowed = 405

  /**
   * This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content that conforms to the criteria given by the user agent.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/406
   */
  static NotAcceptable = 406

  /**
   * This is similar to 401 Unauthorized but authentication is needed to be done by a proxy.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/407
   */
  static ProxyAuthenticationRequired = 407

  /**
   * This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection mechanisms to speed up surfing. Also note that some servers merely shut down the connection without sending this message.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/408
   */
  static RequestTimeout = 408

  /**
   * This response is sent when a request conflicts with the current state of the server.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
   */
  static Conflict = 409

  /**
   * This response is sent when the requested content has been permanently deleted from server, with no forwarding address. Clients are expected to remove their caches and links to the resource. The HTTP specification intends this status code to be used for "limited-time, promotional services". APIs should not feel compelled to indicate resources that have been deleted with this status code.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/410
   */
  static Gone = 410

  /**
   * Server rejected the request because the Content-Length header field is not defined and the server requires it.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/411
   */
  static LengthRequired = 411

  /**
   * The client has indicated preconditions in its headers which the server does not meet.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412
   */
  static PreconditionFailed = 412

  /**
   * Request entity is larger than limits defined by server. The server might close the connection or return an Retry-After header field.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/413
   */
  static PayloadTooLarge = 413

  /**
   * The URI requested by the client is longer than the server is willing to interpret.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/414
   */
  static URITooLong = 414

  /**
   * The media format of the requested data is not supported by the server, so the server is rejecting the request.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415
   */
  static UnsupportedMediaType = 415

  /**
   * The range specified by the Range header field in the request cannot be fulfilled. It's possible that the range is outside the size of the target URI's data.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/416
   */
  static RangeNotSatisfiable = 416

  /**
   * This response code means the expectation indicated by the Expect request header field cannot be met by the server.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/417
   */
  static ExpectationFailed = 417

  /**
   * The server refuses the attempt to brew coffee with a teapot.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418
   */
  static IAmATeapot = 418

  /**
   * The request was well-formed but was unable to be followed due to semantic errors.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422
   */
  static UnprocessableEntity = 422

  /**
   * Indicates that the server is unwilling to risk processing a request that might be replayed.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/425
   */
  static TooEarly = 425

  /**
   * The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol. The server sends an Upgrade header in a 426 response to indicate the required protocol(s).
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/426
   */
  static UpgradeRequired = 426

  /**
   * The origin server requires the request to be conditional. This response is intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/428
   */
  static PreconditionRequired = 428

  /**
   * The user has sent too many requests in a given amount of time ("rate limiting").
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429
   */
  static TooManyRequests = 429

  /**
   * The server is unwilling to process the request because its header fields are too large. The request may be resubmitted after reducing the size of the request header fields.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/431
   */
  static RequestHeaderFieldsTooLarge = 431

  /**
   * The user agent requested a resource that cannot legally be provided, such as a web page censored by a government.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/451
   */
  static UnavailableForLegalReasons = 451

  /**
   * The server has encountered a situation it does not know how to handle.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500
   */
  static InternalServerError = 500

  /**
   * The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/501
   */
  static NotImplemented = 501

  /**
   * This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/502
   */
  static BadGateway = 502

  /**
   * The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This response should be used for temporary conditions and the Retry-After HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503
   */
  static ServiceUnavailable = 503

  /**
   * This error response is given when the server is acting as a gateway and cannot get a response in time.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504
   */
  static GatewayTimeout = 504

  /**
   * The HTTP version used in the request is not supported by the server.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/505
   */
  static HTTPVersionNotSupported = 505

  /**
   * The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/506
   */
  static VariantAlsoNegotiates = 506

  /**
   * The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/507
   */
  static InsufficientStorage = 507

  /**
   * The server detected an infinite loop while processing the request.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/508
   */
  static LoopDetected = 508

  /**
   * Further extensions to the request are required for the server to fulfill it.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/510
   */
  static NotExtended = 510

  /**
   * Indicates that the client needs to authenticate to gain network access.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/511
   */
  static NetworkAuthenticationRequired = 511

  static StatusText = {
    [Response.Continue]: 'Continue',
    [Response.SwitchingProtocols]: 'Switching Protocols',
    [Response.EarlyHints]: 'Early Hints',
    [Response.Ok]: 'Ok',
    [Response.Created]: 'Created',
    [Response.Accepted]: 'Accepted',
    [Response.NonAuthoritativeInformation]: 'Non-Authoritative Information',
    [Response.NoContent]: 'No Content',
    [Response.ResetContent]: 'Reset Content',
    [Response.PartialContent]: 'Partial Content',
    [Response.MultipleChoices]: 'Multiple Choices',
    [Response.MovedPermanently]: 'Moved Permanently',
    [Response.Found]: 'Found',
    [Response.SeeOther]: 'See Other',
    [Response.NotModified]: 'Not Modified',
    [Response.TemporaryRedirect]: 'Temporary Redirect',
    [Response.PermanentRedirect]: 'Permanent Redirect',
    [Response.BadRequest]: 'Bad Request',
    [Response.Unauthorized]: 'Unauthorized',
    [Response.Forbidden]: 'Forbidden',
    [Response.NotFound]: 'Not Found',
    [Response.MethodNotAllowed]: 'Method Not Allowed',
    [Response.NotAcceptable]: 'Not Acceptable',
    [Response.ProxyAuthenticationRequired]: 'Proxy Authentication Required',
    [Response.RequestTimeout]: 'Request Timeout',
    [Response.Conflict]: 'Conflict',
    [Response.Gone]: 'Gone',
    [Response.LengthRequired]: 'Length Required',
    [Response.PreconditionFailed]: 'Precondition Failed',
    [Response.PayloadTooLarge]: 'Payload Too Large',
    [Response.URITooLong]: 'URI Too Long',
    [Response.UnsupportedMediaType]: 'Unsupported Media Type',
    [Response.RangeNotSatisfiable]: 'Range Not Satisfiable',
    [Response.ExpectationFailed]: 'Expectation Failed',
    [Response.IAmATeapot]: "I'm A Teapot",
    [Response.UnprocessableEntity]: 'Unprocessable Entity',
    [Response.TooEarly]: 'Too Early',
    [Response.UpgradeRequired]: 'Upgrade Required',
    [Response.PreconditionRequired]: 'Precondition Required',
    [Response.TooManyRequests]: 'Too Many Requests',
    [Response.RequestHeaderFieldsTooLarge]: 'Request Header Fields Too Large',
    [Response.UnavailableForLegalReasons]: 'Unavailable For Legal Reasons',
    [Response.InternalServerError]: 'Internal Server Error',
    [Response.NotImplemented]: 'Not Implemented',
    [Response.BadGateway]: 'Bad Gateway',
    [Response.ServiceUnavailable]: 'Service Unavailable',
    [Response.GatewayTimeout]: 'Gateway Timeout',
    [Response.HTTPVersionNotSupported]: 'HTTP Version Not Supported',
    [Response.VariantAlsoNegotiates]: 'Variant Also Negotiates',
    [Response.InsufficientStorage]: 'Insufficient Storage',
    [Response.LoopDetected]: 'Loop Detected',
    [Response.NotExtended]: 'Not Extended',
    [Response.NetworkAuthenticationRequired]: 'Network Authentication Required',
  }

  static StatusCode = {
    [Response.Continue]: 'continue',
    [Response.SwitchingProtocols]: 'switching_protocols',
    [Response.EarlyHints]: 'early_hints',
    [Response.Ok]: 'ok',
    [Response.Created]: 'created',
    [Response.Accepted]: 'accepted',
    [Response.NonAuthoritativeInformation]: 'non_authoritative_information',
    [Response.NoContent]: 'no_content',
    [Response.ResetContent]: 'reset_content',
    [Response.PartialContent]: 'partial_content',
    [Response.MultipleChoices]: 'multiple_choices',
    [Response.MovedPermanently]: 'moved_permanently',
    [Response.Found]: 'found',
    [Response.MovedTemporarily]: 'moved_temporarily',
    [Response.SeeOther]: 'see_other',
    [Response.NotModified]: 'not_modified',
    [Response.TemporaryRedirect]: 'temporary_redirect',
    [Response.PermanentRedirect]: 'permanent_redirect',
    [Response.BadRequest]: 'bad_request',
    [Response.Unauthorized]: 'unauthorized',
    [Response.Forbidden]: 'forbidden',
    [Response.NotFound]: 'not_found',
    [Response.MethodNotAllowed]: 'method_not_allowed',
    [Response.NotAcceptable]: 'not_acceptable',
    [Response.ProxyAuthenticationRequired]: 'proxy_authentication_required',
    [Response.RequestTimeout]: 'request_timeout',
    [Response.Conflict]: 'conflict',
    [Response.Gone]: 'gone',
    [Response.LengthRequired]: 'length_required',
    [Response.PreconditionFailed]: 'precondition_failed',
    [Response.PayloadTooLarge]: 'payload_too_large',
    [Response.URITooLong]: 'uri_too_long',
    [Response.UnsupportedMediaType]: 'unsupported_media_type',
    [Response.RangeNotSatisfiable]: 'range_not_satisfiable',
    [Response.ExpectationFailed]: 'expectation_failed',
    [Response.IAmATeapot]: 'i_am_a_teapot',
    [Response.UnprocessableEntity]: 'unprocessable_entity',
    [Response.TooEarly]: 'too_early',
    [Response.UpgradeRequired]: 'upgrade_required',
    [Response.PreconditionRequired]: 'precondition_required',
    [Response.TooManyRequests]: 'too_many_requests',
    [Response.RequestHeaderFieldsTooLarge]: 'request_header_fields_too_large',
    [Response.UnavailableForLegalReasons]: 'unavailable_for_legal_reasons',
    [Response.InternalServerError]: 'internal_server_error',
    [Response.NotImplemented]: 'not_implemented',
    [Response.BadGateway]: 'bad_gateway',
    [Response.ServiceUnavailable]: 'service_unavailable',
    [Response.GatewayTimeout]: 'gateway_timeout',
    [Response.HTTPVersionNotSupported]: 'http_version_not_supported',
    [Response.VariantAlsoNegotiates]: 'variant_also_negotiates',
    [Response.InsufficientStorage]: 'insufficient_storage',
    [Response.LoopDetected]: 'loop_detected',
    [Response.NotExtended]: 'not_extended',
    [Response.NetworkAuthenticationRequired]: 'network_authentication_required',
  }

  /**
   * Copy the values of from one response source to a target response also mergin their headers. Returns the target response.
   * @param target The target response to copy to.
   * @param source The source response from which to copy properties.
   */
  static assign(target: Response, ...sources: Response[]): Response {
    const targetHeaders = target.headers

    for (const source of sources) {
      const sourceHeaders = source.headers
      Object.assign(target, source)

      if (targetHeaders && sourceHeaders) {
        target.headers = Object.assign(targetHeaders, sourceHeaders)
      }
    }

    return target
  }
}
