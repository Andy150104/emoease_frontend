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

export enum SubscriptionStatus {
  AwaitPayment = "AwaitPayment",
  Active = "Active",
  Expired = "Expired",
  Cancelled = "Cancelled",
}

export enum PaymentMethodName {
  VNPay = "VNPay",
  PayOS = "PayOS",
}

export interface CreateServicePackageDto {
  name?: string | null;
  description?: string | null;
  /** @format double */
  price?: number;
  /** @format int32 */
  durationDays?: number;
}

export interface CreateServicePackageRequest {
  servicePackage?: CreateServicePackageDto;
}

export interface CreateServicePackageResponse {
  /** @format uuid */
  id?: string;
}

export interface CreateUserSubscriptionDto {
  /** @format uuid */
  patientId?: string;
  /** @format uuid */
  servicePackageId?: string;
  promoCode?: string | null;
  /** @format uuid */
  giftId?: string | null;
  /** @format date-time */
  startDate?: string;
  paymentMethodName?: PaymentMethodName;
}

export interface CreateUserSubscriptionRequest {
  userSubscription?: CreateUserSubscriptionDto;
}

export interface CreateUserSubscriptionResponse {
  /** @format uuid */
  id?: string;
  paymentUrl?: string | null;
  /** @format int64 */
  paymentCode?: number | null;
}

export interface GetServicePackageResponse {
  servicePackage?: ServicePackageDto;
}

export interface GetServicePackagesResponse {
  servicePackages?: ServicePackageDtoPaginatedResult;
}

export interface GetTotalSubscriptionResult {
  /** @format int64 */
  totalCount?: number;
}

export interface GetUserSubscriptionDto {
  /** @format uuid */
  id?: string;
  /** @format uuid */
  patientId?: string;
  /** @format uuid */
  servicePackageId?: string;
  /** @format date-time */
  startDate?: string;
  /** @format date-time */
  endDate?: string;
  /** @format uuid */
  promotionId?: string | null;
  /** @format uuid */
  giftId?: string | null;
  status?: SubscriptionStatus;
}

export interface GetUserSubscriptionDtoPaginatedResult {
  /** @format int32 */
  pageIndex?: number;
  /** @format int32 */
  pageSize?: number;
  /** @format int64 */
  totalCount?: number;
  data?: GetUserSubscriptionDto[] | null;
  /** @format int32 */
  totalPages?: number;
}

export interface GetUserSubscriptionResponse {
  userSubscription?: GetUserSubscriptionDto;
}

export interface GetUserSubscriptionsResult {
  userSubscriptions?: GetUserSubscriptionDtoPaginatedResult;
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

export interface ServicePackageDto {
  /** @format uuid */
  id?: string;
  name?: string | null;
  description?: string | null;
  /** @format double */
  price?: number;
  /** @format int32 */
  durationDays?: number;
  /** @format uuid */
  imageId?: string;
  isActive?: boolean;
  purchaseStatus?: string | null;
  /** @format double */
  upgradePrice?: number | null;
}

export interface ServicePackageDtoPaginatedResult {
  /** @format int32 */
  pageIndex?: number;
  /** @format int32 */
  pageSize?: number;
  /** @format int64 */
  totalCount?: number;
  data?: ServicePackageDto[] | null;
  /** @format int32 */
  totalPages?: number;
}

export interface ServicePackageWithTotal {
  /** @format uuid */
  id?: string;
  name?: string | null;
  /** @format int64 */
  totalSubscriptions?: number;
}

export interface UpdateServicePackageDto {
  isActive?: boolean | null;
}

export interface UpdateServicePackageResponse {
  isSuccess?: boolean;
}

export interface UpdateUserSubscriptionRequest {
  userSubscription?: UserSubscriptionDto;
}

export interface UpdateUserSubscriptionResponse {
  isSuccess?: boolean;
}

export interface UpdateUserSubscriptionStatusRequest {
  /** @format uuid */
  subscriptionId?: string;
  status?: SubscriptionStatus;
}

export interface UpdateUserSubscriptionStatusResponse {
  isSuccess?: boolean;
}

export interface UpgradeUserSubscriptionDto {
  /** @format uuid */
  patientId?: string;
  /** @format uuid */
  newServicePackageId?: string;
  promoCode?: string | null;
  /** @format uuid */
  giftId?: string | null;
  /** @format date-time */
  startDate?: string;
  paymentMethodName?: PaymentMethodName;
}

export interface UpgradeUserSubscriptionRequest {
  upgradeUserSubscriptionDto?: UpgradeUserSubscriptionDto;
}

export interface UpgradeUserSubscriptionResponse {
  /** @format uuid */
  id?: string;
  paymentUrl?: string | null;
  /** @format int64 */
  paymentCode?: number | null;
}

export interface UserSubscriptionDto {
  /** @format uuid */
  id?: string;
  /** @format uuid */
  patientId?: string;
  /** @format uuid */
  servicePackageId?: string;
  /** @format uuid */
  promotionCodeId?: string | null;
  /** @format uuid */
  giftId?: string | null;
  /** @format date-time */
  startDate?: string;
  /** @format date-time */
  endDate?: string;
  status?: SubscriptionStatus;
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
  public baseUrl: string = "/subscription-service/";
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
 * @title Subscription API
 * @version v1
 * @baseUrl /subscription-service/
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  userSubscriptions = {
    /**
     * @description Get Total User Subscriptions
     *
     * @tags Dashboard
     * @name GetTotalUserSubscriptions
     * @summary Get Total User Subscriptions
     * @request GET:/user-subscriptions/total
     * @secure
     */
    getTotalUserSubscriptions: (
      query: {
        /** @format date */
        startDate: string;
        /** @format date */
        endDate: string;
        /** @format uuid */
        patientId?: string;
        status?: SubscriptionStatus;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetTotalSubscriptionResult, ProblemDetails>({
        path: `/user-subscriptions/total`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Upgrade User Subscription
     *
     * @tags UserSubscriptions
     * @name UpgradeUserSubscription
     * @summary Upgrade User Subscription
     * @request POST:/user-subscriptions/upgrade
     * @secure
     */
    upgradeUserSubscription: (
      data: UpgradeUserSubscriptionRequest,
      params: RequestParams = {},
    ) =>
      this.request<UpgradeUserSubscriptionResponse, ProblemDetails>({
        path: `/user-subscriptions/upgrade`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get All User Subscriptions
     *
     * @tags UserSubscriptions
     * @name GetUserSubscriptions
     * @summary Get All User Subscriptions
     * @request GET:/user-subscriptions
     * @secure
     */
    getUserSubscriptions: (
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
        /** @default "" */
        Search?: string;
        /** @default "StartDate" */
        SortBy?: string;
        /** @default "asc" */
        SortOrder?: string;
        /** @format uuid */
        ServicePackageId?: string;
        /** @format uuid */
        PatientId?: string;
        Status?: SubscriptionStatus;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetUserSubscriptionsResult, ProblemDetails>({
        path: `/user-subscriptions`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Create User Subscription
     *
     * @tags UserSubscriptions
     * @name CreateUserSubscription
     * @summary Create User Subscription
     * @request POST:/user-subscriptions
     * @secure
     */
    createUserSubscription: (
      data: CreateUserSubscriptionRequest,
      params: RequestParams = {},
    ) =>
      this.request<CreateUserSubscriptionResponse, ProblemDetails>({
        path: `/user-subscriptions`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get User Subscription
     *
     * @tags UserSubscriptions
     * @name GetUserSubscription
     * @summary Get User Subscription
     * @request GET:/user-subscriptions/{id}
     * @secure
     */
    getUserSubscription: (id: string, params: RequestParams = {}) =>
      this.request<GetUserSubscriptionResponse, ProblemDetails>({
        path: `/user-subscriptions/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  servicePackages = {
    /**
     * @description Get all active service packages with total active subscriptions
     *
     * @tags Dashboard
     * @name GetTotalServicePackages
     * @summary Get Service Packages with Active Subscription Count
     * @request GET:/service-packages/total
     * @secure
     */
    getTotalServicePackages: (
      query: {
        /** @format date */
        startDate: string;
        /** @format date */
        endDate: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ServicePackageWithTotal[], ProblemDetails>({
        path: `/service-packages/total`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update Service Package
     *
     * @tags Dashboard
     * @name UpdateServicePackage
     * @summary Update Service Package
     * @request PUT:/service-packages/{id}
     * @secure
     */
    updateServicePackage: (
      id: string,
      data: UpdateServicePackageDto,
      params: RequestParams = {},
    ) =>
      this.request<UpdateServicePackageResponse, ProblemDetails>({
        path: `/service-packages/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get Service Package
     *
     * @tags Subscription.API
     * @name GetServicePackage
     * @summary Get Service Package
     * @request GET:/service-packages/{id}
     * @secure
     */
    getServicePackage: (id: string, params: RequestParams = {}) =>
      this.request<GetServicePackageResponse, ProblemDetails>({
        path: `/service-packages/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description GetServicePackages
     *
     * @tags Subscription.API
     * @name GetServicePackages
     * @summary GetServicePackages
     * @request GET:/service-packages
     * @secure
     */
    getServicePackages: (
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
        /** @default "" */
        Search?: string;
        Status?: boolean;
        /** @format uuid */
        PatientId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetServicePackagesResponse, ProblemDetails>({
        path: `/service-packages`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new service package
     *
     * @tags Subscription.API
     * @name CreateServicePackage
     * @summary Create Service Package
     * @request POST:/service-packages
     * @secure
     */
    createServicePackage: (
      data: CreateServicePackageRequest,
      params: RequestParams = {},
    ) =>
      this.request<CreateServicePackageResponse, ProblemDetails>({
        path: `/service-packages`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  userSubscription = {
    /**
     * @description Update User Subscription
     *
     * @tags UserSubscriptions
     * @name UpdateUserSubscription
     * @summary Update User Subscription
     * @request PUT:/user-subscription
     * @secure
     */
    updateUserSubscription: (
      data: UpdateUserSubscriptionRequest,
      params: RequestParams = {},
    ) =>
      this.request<UpdateUserSubscriptionResponse, ProblemDetails>({
        path: `/user-subscription`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update User Subscription Status
     *
     * @tags UserSubscriptions
     * @name UpdateUserSubscriptionStatus
     * @summary Update User Subscription Status
     * @request PUT:/user-subscription/status
     * @secure
     */
    updateUserSubscriptionStatus: (
      data: UpdateUserSubscriptionStatusRequest,
      params: RequestParams = {},
    ) =>
      this.request<UpdateUserSubscriptionStatusResponse, ProblemDetails>({
        path: `/user-subscription/status`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
