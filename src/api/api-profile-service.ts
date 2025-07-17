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

export enum UserGender {
  Male = "Male",
  Female = "Female",
  Else = "Else",
}

export enum PersonalityTrait {
  None = "None",
  Introversion = "Introversion",
  Extroversion = "Extroversion",
  Adaptability = "Adaptability",
}

export enum MedicalRecordStatus {
  Processing = "Processing",
  Done = "Done",
}

export enum EducationLevel {
  Elementary = "Elementary",
  MiddleSchool = "MiddleSchool",
  Student = "Student",
  HighSchool = "HighSchool",
  College = "College",
  Bachelor = "Bachelor",
  Master = "Master",
  Doctorate = "Doctorate",
  PhD = "PhD",
  Other = "Other",
}

export interface AddMedicalHistoryRequest {
  /** @format uuid */
  patientProfileId?: string;
  description?: string | null;
  /** @format date-time */
  diagnosedAt?: string;
  specificMentalDisorderIds?: string[] | null;
  physicalSymptomIds?: string[] | null;
}

export interface AddMedicalRecordRequest {
  /** @format uuid */
  patientProfileId?: string;
  /** @format uuid */
  doctorId?: string;
  notes?: string | null;
  status?: MedicalRecordStatus;
  existingDisorderIds?: string[] | null;
}

export interface AddMedicalRecordResponse {
  isSuccess?: boolean;
}

export interface ContactInfo {
  address?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
}

export interface CreateDoctorProfileDto {
  fullName?: string | null;
  gender?: UserGender;
  contactInfo?: ContactInfo;
  qualifications?: string | null;
  /** @format int32 */
  yearsOfExperience?: number;
  bio?: string | null;
}

export interface CreateDoctorProfileRequest {
  doctorProfile?: CreateDoctorProfileDto;
}

export interface CreateDoctorProfileResponse {
  /** @format uuid */
  id?: string;
}

export interface CreatePatientProfileDto {
  /** @format uuid */
  userId?: string;
  fullName?: string | null;
  gender?: UserGender;
  allergies?: string | null;
  personalityTraits?: PersonalityTrait;
  contactInfo?: ContactInfo;
  /** @format uuid */
  jobId?: string | null;
  /** @format date */
  birthDate?: string | null;
}

export interface CreatePatientProfileRequest {
  patientProfileCreate?: CreatePatientProfileDto;
}

export interface CreatePatientProfileResponse {
  /** @format uuid */
  id?: string;
}

export interface DoctorProfileDto {
  /** @format uuid */
  id?: string;
  /** @format uuid */
  userId?: string;
  fullName?: string | null;
  gender?: UserGender;
  contactInfo?: ContactInfo;
  specialties?: SpecialtyDto[] | null;
  qualifications?: string | null;
  /** @format int32 */
  yearsOfExperience?: number;
  bio?: string | null;
  /** @format float */
  rating?: number;
}

export interface DoctorProfileDtoPaginatedResult {
  /** @format int32 */
  pageIndex?: number;
  /** @format int32 */
  pageSize?: number;
  /** @format int64 */
  totalCount?: number;
  data?: DoctorProfileDto[] | null;
  /** @format int32 */
  totalPages?: number;
}

export interface GetAllDoctorProfilesResponse {
  doctorProfiles?: DoctorProfileDtoPaginatedResult;
}

export interface GetAllIndustryResponse {
  industries?: IndustryDtoPaginatedResult;
}

export interface GetAllMedicalRecordsResponse {
  medicalRecords?: MedicalRecordDtoPaginatedResult;
}

export interface GetAllMentalDisordersResponse {
  paginatedResult?: MentalDisorderDtoPaginatedResult;
}

export interface GetAllPatientProfilesResponse {
  paginatedResult?: GetPatientProfileDtoPaginatedResult;
}

export interface GetAllPhysicalSymptomResponse {
  physicalSymptom?: PhysicalSymptomDtoPaginatedResult;
}

export interface GetAllSpecialtiesResponse {
  specialties?: SpecialtyDto[] | null;
}

export interface GetAllSpecificMentalDisordersResponse {
  specificMentalDisorder?: SpecificMentalDisorderDtoPaginatedResult;
}

export interface GetCreatedPatientProfileDto {
  /** @format date-time */
  date?: string;
  profiles?: SimplifiedPatientProfileDtoPaginatedResult;
}

export interface GetDoctorProfileByEventResponse {
  patientExists?: boolean;
  /** @format uuid */
  id?: string;
  fullName?: string | null;
  gender?: UserGender;
  allergies?: string | null;
  personalityTraits?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
}

export interface GetDoctorProfileResponse {
  doctorProfileDto?: DoctorProfileDto;
}

export interface GetDoctorsBySpecialitiesResponse {
  doctorProfiles?: DoctorProfileDtoPaginatedResult;
}

export interface GetJobByIndustryIdResponse {
  jobs?: JobDto[] | null;
}

export interface GetMedicalHistoryResponse {
  history?: MedicalHistoryDto;
}

export interface GetMedicalRecordResponse {
  record?: MedicalRecordDto;
}

export interface GetPatientProfileDto {
  /** @format uuid */
  id?: string;
  /** @format uuid */
  userId?: string;
  fullName?: string | null;
  gender?: UserGender;
  allergies?: string | null;
  personalityTraits?: PersonalityTrait;
  contactInfo?: ContactInfo;
  medicalHistory?: MedicalHistoryDto;
  job?: Job;
  /** @format date */
  birthDate?: string;
  medicalRecords?: MedicalRecordDto[] | null;
}

export interface GetPatientProfileDtoPaginatedResult {
  /** @format int32 */
  pageIndex?: number;
  /** @format int32 */
  pageSize?: number;
  /** @format int64 */
  totalCount?: number;
  data?: GetPatientProfileDto[] | null;
  /** @format int32 */
  totalPages?: number;
}

export interface GetPatientProfileResponse {
  patientProfileDto?: GetPatientProfileDto;
}

export interface GetPatientProfilesCreatedEndpointResponse {
  datapoints?: GetCreatedPatientProfileDto[] | null;
}

export interface Industry {
  /** @format uuid */
  id?: string;
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  /** @format date-time */
  lastModified?: string | null;
  lastModifiedBy?: string | null;
  industryName?: string | null;
  description?: string | null;
  jobs?: Job[] | null;
}

export interface IndustryDto {
  /** @format uuid */
  id?: string;
  industryName?: string | null;
}

export interface IndustryDtoPaginatedResult {
  /** @format int32 */
  pageIndex?: number;
  /** @format int32 */
  pageSize?: number;
  /** @format int64 */
  totalCount?: number;
  data?: IndustryDto[] | null;
  /** @format int32 */
  totalPages?: number;
}

export interface Job {
  /** @format uuid */
  id?: string;
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  /** @format date-time */
  lastModified?: string | null;
  lastModifiedBy?: string | null;
  /** @format uuid */
  industryId?: string;
  jobTitle?: string | null;
  educationLevel?: EducationLevel;
  industry?: Industry;
}

export interface JobDto {
  /** @format uuid */
  id?: string;
  jobTitle?: string | null;
  educationLevel?: string | null;
}

export interface MedicalHistoryDto {
  description?: string | null;
  /** @format date-time */
  diagnosedAt?: string;
  specificMentalDisorders?: SpecificMentalDisorderDto[] | null;
  physicalSymptoms?: PhysicalSymptomDto[] | null;
}

export interface MedicalRecordDto {
  /** @format uuid */
  id?: string;
  /** @format uuid */
  patientProfileId?: string;
  /** @format uuid */
  doctorProfileId?: string;
  medicalHistory?: MedicalHistoryDto;
  notes?: string | null;
  status?: MedicalRecordStatus;
  specificMentalDisorders?: SpecificMentalDisorderDto[] | null;
  /** @format date-time */
  createdAt?: string | null;
}

export interface MedicalRecordDtoPaginatedResult {
  /** @format int32 */
  pageIndex?: number;
  /** @format int32 */
  pageSize?: number;
  /** @format int64 */
  totalCount?: number;
  data?: MedicalRecordDto[] | null;
  /** @format int32 */
  totalPages?: number;
}

export interface MentalDisorderDto {
  /** @format uuid */
  id?: string;
  name?: string | null;
  description?: string | null;
}

export interface MentalDisorderDtoPaginatedResult {
  /** @format int32 */
  pageIndex?: number;
  /** @format int32 */
  pageSize?: number;
  /** @format int64 */
  totalCount?: number;
  data?: MentalDisorderDto[] | null;
  /** @format int32 */
  totalPages?: number;
}

export interface PhysicalSymptomDto {
  /** @format uuid */
  id?: string;
  name?: string | null;
  description?: string | null;
}

export interface PhysicalSymptomDtoPaginatedResult {
  /** @format int32 */
  pageIndex?: number;
  /** @format int32 */
  pageSize?: number;
  /** @format int64 */
  totalCount?: number;
  data?: PhysicalSymptomDto[] | null;
  /** @format int32 */
  totalPages?: number;
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

export interface SimplifiedPatientProfileDto {
  /** @format uuid */
  id?: string;
  fullName?: string | null;
  gender?: UserGender;
  /** @format date */
  birthDate?: string | null;
  /** @format date-time */
  createdAt?: string | null;
}

export interface SimplifiedPatientProfileDtoPaginatedResult {
  /** @format int32 */
  pageIndex?: number;
  /** @format int32 */
  pageSize?: number;
  /** @format int64 */
  totalCount?: number;
  data?: SimplifiedPatientProfileDto[] | null;
  /** @format int32 */
  totalPages?: number;
}

export interface SpecialtyDto {
  /** @format uuid */
  id?: string;
  name?: string | null;
}

export interface SpecificMentalDisorderDto {
  /** @format uuid */
  id?: string;
  mentalDisorderName?: string | null;
  name?: string | null;
  description?: string | null;
}

export interface SpecificMentalDisorderDtoPaginatedResult {
  /** @format int32 */
  pageIndex?: number;
  /** @format int32 */
  pageSize?: number;
  /** @format int64 */
  totalCount?: number;
  data?: SpecificMentalDisorderDto[] | null;
  /** @format int32 */
  totalPages?: number;
}

export interface UpdateDoctorProfileDto {
  fullName?: string | null;
  gender?: UserGender;
  contactInfo?: ContactInfo;
  specialtyIds?: string[] | null;
  qualifications?: string | null;
  /** @format int32 */
  yearsOfExperience?: number | null;
  bio?: string | null;
}

export interface UpdateDoctorProfileRequest {
  doctorProfileUpdate?: UpdateDoctorProfileDto;
}

export interface UpdateDoctorProfileResponse {
  /** @format uuid */
  id?: string;
}

export interface UpdateMedicalHistoryRequest {
  /** @format uuid */
  patientProfileId?: string;
  description?: string | null;
  /** @format date-time */
  diagnosedAt?: string;
  disorderIds?: string[] | null;
  physicalSymptomIds?: string[] | null;
}

export interface UpdateMedicalHistoryResponse {
  isSuccess?: boolean;
}

export interface UpdateMedicalRecordRequest {
  /** @format uuid */
  patientProfileId?: string;
  /** @format uuid */
  doctorId?: string;
  /** @format uuid */
  medicalRecordId?: string;
  notes?: string | null;
  status?: MedicalRecordStatus;
  disorderIds?: string[] | null;
}

export interface UpdateMedicalRecordResponse {
  isSuccess?: boolean;
}

export interface UpdatePatientProfileDto {
  fullName?: string | null;
  gender?: UserGender;
  allergies?: string | null;
  personalityTraits?: PersonalityTrait;
  contactInfo?: ContactInfo;
  /** @format uuid */
  jobId?: string | null;
  /** @format date */
  birthDate?: string | null;
}

export interface UpdatePatientProfileRequest {
  patientProfileUpdate?: UpdatePatientProfileDto;
}

export interface UpdatePatientProfileResponse {
  /** @format uuid */
  id?: string;
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
  public baseUrl: string = "/profile-service/";
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
 * @title Profile API
 * @version v1
 * @baseUrl /profile-service/
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  patients = {
    /**
     * @description Get Created Patient Profiles
     *
     * @tags Dashboard
     * @name GetPatientProfilesCreated
     * @summary Get Created Patient Profiles
     * @request GET:/patients/created
     * @secure
     */
    getPatientProfilesCreated: (
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
        /** @format date-time */
        StartDate?: string;
        /** @format date-time */
        EndDate?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetPatientProfilesCreatedEndpointResponse, ProblemDetails>({
        path: `/patients/created`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update Patient Profile
     *
     * @tags PatientProfiles
     * @name UpdatePatientProfile
     * @summary Update Patient Profile
     * @request PUT:/patients/{id}
     * @secure
     */
    updatePatientProfile: (
      id: string,
      data: UpdatePatientProfileRequest,
      params: RequestParams = {},
    ) =>
      this.request<UpdatePatientProfileResponse, ProblemDetails>({
        path: `/patients/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get Patient Profile
     *
     * @tags PatientProfiles
     * @name GetPatientProfile
     * @summary Get Patient Profile
     * @request GET:/patients/{id}
     * @secure
     */
    getPatientProfile: (id: string, params: RequestParams = {}) =>
      this.request<GetPatientProfileResponse, ProblemDetails>({
        path: `/patients/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update Medical Record
     *
     * @tags PatientProfiles
     * @name UpdateMedicalRecord
     * @summary Update Medical Record
     * @request PUT:/patients/medical-record
     * @secure
     */
    updateMedicalRecord: (
      data: UpdateMedicalRecordRequest,
      params: RequestParams = {},
    ) =>
      this.request<UpdateMedicalRecordResponse, ProblemDetails>({
        path: `/patients/medical-record`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Add Medical Record
     *
     * @tags PatientProfiles
     * @name AddMedicalRecord
     * @summary Add Medical Record
     * @request POST:/patients/medical-record
     * @secure
     */
    addMedicalRecord: (
      data: AddMedicalRecordRequest,
      params: RequestParams = {},
    ) =>
      this.request<AddMedicalRecordResponse, ProblemDetails>({
        path: `/patients/medical-record`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update Medical History
     *
     * @tags PatientProfiles
     * @name UpdateMedicalHistory
     * @summary Update Medical History
     * @request PUT:/patients/medical-history
     * @secure
     */
    updateMedicalHistory: (
      data: UpdateMedicalHistoryRequest,
      params: RequestParams = {},
    ) =>
      this.request<UpdateMedicalHistoryResponse, ProblemDetails>({
        path: `/patients/medical-history`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Add Medical History
     *
     * @tags PatientProfiles
     * @name AddMedicalHistory
     * @summary Add Medical History
     * @request POST:/patients/medical-history
     * @secure
     */
    addMedicalHistory: (
      data: AddMedicalHistoryRequest,
      params: RequestParams = {},
    ) =>
      this.request<AddMedicalRecordResponse, ProblemDetails>({
        path: `/patients/medical-history`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description GetTotalPatientProfile
     *
     * @tags PatientProfiles
     * @name GetTotalPatientProfile
     * @summary Get Total Patient Profiles
     * @request GET:/patients/total
     * @secure
     */
    getTotalPatientProfile: (
      query: {
        /** @format date */
        startDate: string;
        /** @format date */
        endDate: string;
        gender?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<number, ProblemDetails>({
        path: `/patients/total`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get MedicalHistory By PatientId
     *
     * @tags PatientProfiles
     * @name GetMedicalHistoryByPatientId
     * @summary Get MedicalHistory By PatientId
     * @request GET:/patients/{patientId}/medical-history
     * @secure
     */
    getMedicalHistoryByPatientId: (
      patientId: string,
      params: RequestParams = {},
    ) =>
      this.request<GetMedicalHistoryResponse, ProblemDetails>({
        path: `/patients/${patientId}/medical-history`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get All Patient Profiles
     *
     * @tags PatientProfiles
     * @name GetAllPatientProfiles
     * @summary Get All Patient Profiles
     * @request GET:/patients
     * @secure
     */
    getAllPatientProfiles: (
      query: {
        /** @format int32 */
        PageIndex: number;
        /** @format int32 */
        PageSize: number;
        /** @default "" */
        Search?: string;
        /** @default "fullname" */
        SortBy?: string;
        /** @default "asc" */
        SortOrder?: string;
        Gender?: UserGender;
        MedicalRecordStatusStatus?: MedicalRecordStatus;
        PersonalityTrait?: PersonalityTrait;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetAllPatientProfilesResponse, ProblemDetails>({
        path: `/patients`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Create Patient Profile
     *
     * @tags PatientProfiles
     * @name CreatePatientProfile
     * @summary Create Patient Profile
     * @request POST:/patients
     * @secure
     */
    createPatientProfile: (
      data: CreatePatientProfileRequest,
      params: RequestParams = {},
    ) =>
      this.request<CreatePatientProfileResponse, ProblemDetails>({
        path: `/patients`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  doctors = {
    /**
     * @description Update Doctor Profile
     *
     * @tags DoctorProfiles
     * @name UpdateDoctorProfile
     * @summary Update Doctor Profile
     * @request PUT:/doctors/{id}
     * @secure
     */
    updateDoctorProfile: (
      id: string,
      data: UpdateDoctorProfileRequest,
      params: RequestParams = {},
    ) =>
      this.request<UpdateDoctorProfileResponse, ProblemDetails>({
        path: `/doctors/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get Doctor Profile
     *
     * @tags DoctorProfiles
     * @name GetDoctorProfile
     * @summary Get Doctor Profile
     * @request GET:/doctors/{id}
     * @secure
     */
    getDoctorProfile: (id: string, params: RequestParams = {}) =>
      this.request<GetDoctorProfileResponse, ProblemDetails>({
        path: `/doctors/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get Doctor Profiles by Specialties
     *
     * @tags DoctorProfiles
     * @name GetDoctorsBySpecialities
     * @summary Get Doctor Profiles by Specialties
     * @request GET:/doctors/specialties
     * @secure
     */
    getDoctorsBySpecialities: (
      query: {
        specialties: string;
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
      },
      params: RequestParams = {},
    ) =>
      this.request<GetDoctorsBySpecialitiesResponse, ProblemDetails>({
        path: `/doctors/specialties`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get All Doctor Profiles
     *
     * @tags DoctorProfiles
     * @name GetAllDoctorProfiles
     * @summary Get All Doctor Profiles
     * @request GET:/doctors
     * @secure
     */
    getAllDoctorProfiles: (
      query: {
        /** @format int32 */
        PageIndex: number;
        /** @format int32 */
        PageSize: number;
        /** @default "" */
        Search?: string;
        /** @default "rating" */
        SortBy?: string;
        /** @default "asc" */
        SortOrder?: string;
        /** @format uuid */
        Specialties?: string;
        /** @format date-time */
        StartDate?: string;
        /** @format date-time */
        EndDate?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetAllDoctorProfilesResponse, ProblemDetails>({
        path: `/doctors`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  doctorProfiles = {
    /**
     * @description Create Doctor Profile
     *
     * @tags DoctorProfiles
     * @name CreateDoctorProfile
     * @summary Create Doctor Profile
     * @request POST:/doctor-profiles
     * @secure
     */
    createDoctorProfile: (
      data: CreateDoctorProfileRequest,
      params: RequestParams = {},
    ) =>
      this.request<CreateDoctorProfileResponse, ProblemDetails>({
        path: `/doctor-profiles`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  mentalDisorders = {
    /**
     * @description Get All Mental Disorders
     *
     * @tags MentalDisorders
     * @name GetAllMentalDisorders
     * @summary Get All Mental Disorders
     * @request GET:/mental-disorders
     * @secure
     */
    getAllMentalDisorders: (
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
      },
      params: RequestParams = {},
    ) =>
      this.request<GetAllMentalDisordersResponse, ProblemDetails>({
        path: `/mental-disorders`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  profiles = {
    /**
     * @description Get patient profile by event
     *
     * @tags PatientProfiles
     * @name GetPatientProfileByEvent
     * @summary Get patient profile by event
     * @request GET:/profiles/get-by-event
     * @secure
     */
    getPatientProfileByEvent: (
      query: {
        /** @format uuid */
        DoctorId: string;
        /** @format uuid */
        UserId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetDoctorProfileByEventResponse, void>({
        path: `/profiles/get-by-event`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  medicalRecords = {
    /**
     * @description Get MedicalRecord
     *
     * @tags PatientProfiles
     * @name GetMedicalRecordById
     * @summary Get MedicalRecord
     * @request GET:/medical-records/{medicalRecordId}
     * @secure
     */
    getMedicalRecordById: (
      medicalRecordId: string,
      params: RequestParams = {},
    ) =>
      this.request<GetMedicalRecordResponse, ProblemDetails>({
        path: `/medical-records/${medicalRecordId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns paginated list of medical records based on optional filters.
     *
     * @tags PatientProfiles
     * @name GetAllMedicalRecords
     * @summary Get All Medical Records
     * @request GET:/medical-records
     * @secure
     */
    getAllMedicalRecords: (
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
        Search?: string;
        /** @default "CreatedAt" */
        SortBy?: string;
        /** @default "asc" */
        SortOrder?: string;
        /** @format uuid */
        PatientId?: string;
        /** @format uuid */
        DoctorId?: string;
        Status?: MedicalRecordStatus;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetAllMedicalRecordsResponse, ProblemDetails>({
        path: `/medical-records`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  industries = {
    /**
     * @description Get all jobs by IndustryId
     *
     * @tags PatientProfiles
     * @name GetJobByIndustryId
     * @summary Get all jobs by IndustryId
     * @request GET:/industries/{industryId}/jobs
     * @secure
     */
    getJobByIndustryId: (industryId: string, params: RequestParams = {}) =>
      this.request<GetJobByIndustryIdResponse, ProblemDetails>({
        path: `/industries/${industryId}/jobs`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get all industries
     *
     * @tags PatientProfiles
     * @name GetAllIndustries
     * @summary Get all industries
     * @request GET:/industries
     * @secure
     */
    getAllIndustries: (
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
        /** @default "Name" */
        SortBy?: string;
        /** @default "asc" */
        SortOrder?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetAllIndustryResponse, ProblemDetails>({
        path: `/industries`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  physicalSymptoms = {
    /**
     * @description GetAllPhysicalSymptoms
     *
     * @tags PhysicalSymptoms
     * @name GetAllPhysicalSymptoms
     * @summary GetAllPhysicalSymptoms
     * @request GET:/physical-symptoms
     * @secure
     */
    getAllPhysicalSymptoms: (
      query: {
        /** @format int32 */
        PageIndex: number;
        /** @format int32 */
        PageSize: number;
        /** @default "" */
        Search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetAllPhysicalSymptomResponse, ProblemDetails>({
        path: `/physical-symptoms`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  specialties = {
    /**
     * @description Get All Specialties
     *
     * @tags Specialties
     * @name GetAllSpecialties
     * @summary Get All Specialties
     * @request GET:/specialties
     * @secure
     */
    getAllSpecialties: (
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
      },
      params: RequestParams = {},
    ) =>
      this.request<GetAllSpecialtiesResponse, ProblemDetails>({
        path: `/specialties`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  specificMentalDisorders = {
    /**
     * @description GetAllSpecificMentalDisorders
     *
     * @tags SpecificMentalDisorders
     * @name GetAllSpecificMentalDisorders
     * @summary GetAllSpecificMentalDisorders
     * @request GET:/specific-mental-disorders
     * @secure
     */
    getAllSpecificMentalDisorders: (
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
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetAllSpecificMentalDisordersResponse, ProblemDetails>({
        path: `/specific-mental-disorders`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
