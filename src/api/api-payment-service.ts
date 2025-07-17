/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum PaymentType {
  BuySubscription = "BuySubscription",
  Booking = "Booking",
  UpgradeSubscription = "UpgradeSubscription",
}

export enum PaymentStatus {
  Pending = "Pending",
  Completed = "Completed",
  Failed = "Failed",
  Cancelled = "Cancelled",
}

export enum PaymentMethodName {
  VNPay = "VNPay",
  PayOS = "PayOS",
}

export interface BuyBookingDto {
  /** @format double */
  finalPrice?: number;
  /** @format uuid */
  patientId?: string;
  paymentMethod?: PaymentMethodName;
  /** @format uuid */
  bookingId?: string;
  /** @format uuid */
  doctorId?: string;
  patientEmail?: string | null;
  /** @format date */
  date?: string;
  /** @format time */
  startTime?: string;
  /** @format int32 */
  duration?: number;
  promoCode?: string | null;
  /** @format uuid */
  giftCodeId?: string | null;
  bookingCode?: string | null;
  paymentType?: PaymentType;
}

export interface BuySubscriptionDto {
  /** @format double */
  finalPrice?: number;
  /** @format uuid */
  patientId?: string;
  paymentMethod?: PaymentMethodName;
  /** @format uuid */
  subscriptionId?: string;
  /** @format uuid */
  servicePackageId?: string;
  patientEmail?: string | null;
  promoCode?: string | null;
  /** @format uuid */
  giftId?: string | null;
  /** @format int32 */
  durationDays?: number;
  paymentType?: PaymentType;
  servicePackageName?: string | null;
}

export interface CancelPaymentLinkRequest {
  /** @format int64 */
  paymentCode?: number;
  cancellationReason?: string | null;
}

export interface CancelPaymentLinkResponse {
  paymentInfo?: PaymentLinkInformation;
  message?: string | null;
}

export interface CreatePayOSCallBackUrlForBookingRequest {
  buyBooking?: BuyBookingDto;
}

export interface CreatePayOSCallBackUrlForBookingResponse {
  url?: string | null;
}

export interface CreatePayOSCallBackUrlForSubscriptionRequest {
  buySubscription?: BuySubscriptionDto;
}

export interface CreatePayOSCallBackUrlForSubscriptionResponse {
  url?: string | null;
}

export interface CreatePayOSCallBackUrlForUpgradeSubscriptionRequest {
  upgradeSubscription?: UpgradeSubscriptionDto;
}

export interface CreatePayOSCallBackUrlForUpgradeSubscriptionResponse {
  url?: string | null;
}

export interface CreateVnPayCallBackUrlForBookingRequest {
  buyBooking?: BuyBookingDto;
}

export interface CreateVnPayCallBackUrlForBookingResponse {
  url?: string | null;
}

export interface CreateVnPayCallBackUrlForSubscriptionRequest {
  buySubscription?: BuySubscriptionDto;
}

export interface CreateVnPayCallBackUrlForSubscriptionResponse {
  url?: string | null;
}

export interface CreateVnPayCallBackUrlForUpgradeSubscriptionRequest {
  upgradeSubscription?: UpgradeSubscriptionDto;
}

export interface CreateVnPayCallBackUrlForUpgradeSubscriptionResponse {
  url?: string | null;
}

export interface DailyRevenue {
  /** @format date */
  date?: string;
  /** @format double */
  totalRevenue?: number;
  /** @format float */
  totalPayment?: number;
}

export interface GetAllPaymentsResponse {
  payments?: PaymentDtoPaginatedResult;
}

export interface GetDailyRevenueResult {
  revenues?: DailyRevenue[] | null;
}

export interface GetRevenueResult {
  /** @format double */
  totalRevenue?: number;
}

export interface PaymentDto {
  /** @format uuid */
  id?: string;
  /** @format uuid */
  patientProfileId?: string;
  /** @format double */
  totalAmount?: number;
  /** @format uuid */
  subscriptionId?: string | null;
  /** @format uuid */
  bookingId?: string | null;
  status?: PaymentStatus;
  paymentType?: PaymentType;
  /** @format uuid */
  paymentMethodId?: string;
  externalTransactionCode?: string | null;
  /** @format date-time */
  createdAt?: string;
}

export interface PaymentDtoPaginatedResult {
  /** @format int32 */
  pageIndex?: number;
  /** @format int32 */
  pageSize?: number;
  /** @format int64 */
  totalCount?: number;
  data?: PaymentDto[] | null;
  /** @format int32 */
  totalPages?: number;
}

export interface PaymentLinkInformation {
  id?: string | null;
  /** @format int64 */
  orderCode?: number;
  /** @format int32 */
  amount?: number;
  /** @format int32 */
  amountPaid?: number;
  /** @format int32 */
  amountRemaining?: number;
  status?: string | null;
  createdAt?: string | null;
  transactions?: Transaction[] | null;
  canceledAt?: string | null;
  cancellationReason?: string | null;
}

export interface ProblemDetails {
  type?: string | null;
  title?: string | null;
  /** @format int32 */
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  [key: string]: any;
}

export interface Transaction {
  reference?: string | null;
  /** @format int32 */
  amount?: number;
  accountNumber?: string | null;
  description?: string | null;
  transactionDateTime?: string | null;
  virtualAccountName?: string | null;
  virtualAccountNumber?: string | null;
  counterAccountBankId?: string | null;
  counterAccountBankName?: string | null;
  counterAccountName?: string | null;
  counterAccountNumber?: string | null;
}

export interface UpgradeSubscriptionDto {
  /** @format double */
  finalPrice?: number;
  /** @format uuid */
  patientId?: string;
  paymentMethod?: PaymentMethodName;
  /** @format uuid */
  subscriptionId?: string;
  /** @format uuid */
  servicePackageId?: string;
  patientEmail?: string | null;
  promoCode?: string | null;
  /** @format uuid */
  giftId?: string | null;
  /** @format int32 */
  durationDays?: number;
  paymentType?: PaymentType;
  /** @format double */
  oldSubscriptionPrice?: number;
  servicePackageName?: string | null;
}

export interface VnPayCallbackResult {
  payment?: PaymentDto;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "/payment-service/";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Payment API
 * @version v1
 * @baseUrl /payment-service/
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  payments = {
    /**
     * @description Create VnPay CallBack Url For Booking
     *
     * @tags Booking Payments
     * @name CreateVnPayCallBackUrlForBooking
     * @summary Create VnPay CallBack Url For Booking
     * @request POST:/payments/vnpay/booking
     * @secure
     */
    createVnPayCallBackUrlForBooking: (
      data: CreateVnPayCallBackUrlForBookingRequest,
      params: RequestParams = {},
    ) =>
      this.request<CreateVnPayCallBackUrlForBookingResponse, ProblemDetails>({
        path: `/payments/vnpay/booking`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get All Payments
     *
     * @tags Dashboard
     * @name GetAllPayments
     * @summary Get All Payments
     * @request GET:/payments
     * @secure
     */
    getAllPayments: (
      query?: {
        /**
         * @format int32
         * @default 1
         */
        PageIndex?: number;
        /**
         * @format int32
         * @default 10
         */
        PageSize?: number;
        /** @format uuid */
        PatientProfileId?: string;
        Status?: PaymentStatus;
        /** @format date */
        CreatedAt?: string;
        PaymentType?: PaymentType;
        /** @default "desc" */
        SortOrder?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetAllPaymentsResponse, ProblemDetails>({
        path: `/payments`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get Daily Revenue
     *
     * @tags Dashboard
     * @name GetDailyRevenue
     * @summary Get Daily Revenue
     * @request GET:/payments/daily-revenue
     * @secure
     */
    getDailyRevenue: (
      query: {
        /** @format date */
        startTime: string;
        /** @format date */
        endTime: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetDailyRevenueResult, ProblemDetails>({
        path: `/payments/daily-revenue`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get Revenue
     *
     * @tags Dashboard
     * @name GetRevenue
     * @summary Get Revenue
     * @request GET:/payments/revenue
     * @secure
     */
    getRevenue: (
      query: {
        /** @format date */
        startTime: string;
        /** @format date */
        endTime: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetRevenueResult, ProblemDetails>({
        path: `/payments/revenue`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description VnPay Callback Endpoint
     *
     * @tags Payments
     * @name VnPayCallback
     * @summary Handle VnPay Callback
     * @request GET:/payments/callback
     * @secure
     */
    vnPayCallback: (
      query: {
        vnp_TransactionStatus?: string;
        vnp_TransactionNo?: string;
        vnp_TxnRef?: string;
        vnp_ResponseCode?: string;
        vnp_OrderInfo?: string;
        /** @format double */
        vnp_Amount: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<VnPayCallbackResult, ProblemDetails>({
        path: `/payments/callback`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cancels a specific payment link with optional cancellation reason
     *
     * @tags PayOS Payments
     * @name CancelPaymentLink
     * @summary Cancel Payment Link
     * @request POST:/payments/payos/cancel
     * @secure
     */
    cancelPaymentLink: (
      data: CancelPaymentLinkRequest,
      params: RequestParams = {},
    ) =>
      this.request<CancelPaymentLinkResponse, ProblemDetails>({
        path: `/payments/payos/cancel`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create PayOS CallBack Url For Booking
     *
     * @tags PayOS Payments
     * @name CreatePayOsCallBackUrlForBooking
     * @summary Create PayOS CallBack Url For Booking
     * @request POST:/payments/payos/booking
     * @secure
     */
    createPayOsCallBackUrlForBooking: (
      data: CreatePayOSCallBackUrlForBookingRequest,
      params: RequestParams = {},
    ) =>
      this.request<CreatePayOSCallBackUrlForBookingResponse, ProblemDetails>({
        path: `/payments/payos/booking`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create PayOS CallBack Url For Subscription
     *
     * @tags PayOS Payments
     * @name CreatePayOsCallBackUrlForSubscription
     * @summary Create PayOS CallBack Url For Subscription
     * @request POST:/payments/payos/subscription
     * @secure
     */
    createPayOsCallBackUrlForSubscription: (
      data: CreatePayOSCallBackUrlForSubscriptionRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        CreatePayOSCallBackUrlForSubscriptionResponse,
        ProblemDetails
      >({
        path: `/payments/payos/subscription`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create PayOS CallBack Url For Upgrade Subscription
     *
     * @tags PayOS Payments
     * @name CreatePayOsCallBackUrlForUpgradeSubscription
     * @summary Create PayOS CallBack Url For Upgrade Subscription
     * @request POST:/payments/payos/upgrade-subscription
     * @secure
     */
    createPayOsCallBackUrlForUpgradeSubscription: (
      data: CreatePayOSCallBackUrlForUpgradeSubscriptionRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        CreatePayOSCallBackUrlForUpgradeSubscriptionResponse,
        ProblemDetails
      >({
        path: `/payments/payos/upgrade-subscription`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves information about a specific payment link
     *
     * @tags PayOS Payments
     * @name GetPaymentLinkInformation
     * @summary Get Payment Link Information
     * @request GET:/payments/payos/link-information/{paymentCode}
     * @secure
     */
    getPaymentLinkInformation: (
      paymentCode: number,
      params: RequestParams = {},
    ) =>
      this.request<void, ProblemDetails>({
        path: `/payments/payos/link-information/${paymentCode}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Confirms the PayOS webhook URL for receiving payment notifications
     *
     * @tags PayOS Payments
     * @name ConfirmPayOsWebhook
     * @summary Confirm PayOS Webhook URL
     * @request POST:/payments/payos/confirm-webhook
     * @secure
     */
    confirmPayOsWebhook: (params: RequestParams = {}) =>
      this.request<void, ProblemDetails>({
        path: `/payments/payos/confirm-webhook`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Processes incoming PayOS webhook notifications for payment status updates
     *
     * @tags PayOS Payments
     * @name ProcessPayOsWebhook
     * @summary Process PayOS Webhook
     * @request POST:/payments/payos/webhook
     * @secure
     */
    processPayOsWebhook: (params: RequestParams = {}) =>
      this.request<void, ProblemDetails>({
        path: `/payments/payos/webhook`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Create VnPay CallBack Url For Subscription
     *
     * @tags Subscription Payments
     * @name CreateVnPayCallBackUrlForSubscription
     * @summary Create VnPay CallBack Url For Subscription
     * @request POST:/payments/vnpay/subscription
     * @secure
     */
    createVnPayCallBackUrlForSubscription: (
      data: CreateVnPayCallBackUrlForSubscriptionRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        CreateVnPayCallBackUrlForSubscriptionResponse,
        ProblemDetails
      >({
        path: `/payments/vnpay/subscription`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create VnPay CallBack Url For Upgrade Subscription
     *
     * @tags Upgrade Subscription Payments
     * @name CreateVnPayCallBackUrlForUpgradeSubscription
     * @summary Create VnPay CallBack Url For Upgrade Subscription
     * @request POST:/payments/vnpay/subscription/upgrade
     * @secure
     */
    createVnPayCallBackUrlForUpgradeSubscription: (
      data: CreateVnPayCallBackUrlForUpgradeSubscriptionRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        CreateVnPayCallBackUrlForUpgradeSubscriptionResponse,
        ProblemDetails
      >({
        path: `/payments/vnpay/subscription/upgrade`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
