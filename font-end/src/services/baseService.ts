import { HttpActionResponse } from "@/model/httpActionResponse";
import { HttpClient } from "../lib/httpClient";
enum HttpResponseStatus {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export class BaseService {
  private http: HttpClient = new HttpClient();

  constructor() {
    // 可以在這裡添加全局的請求攔截器或響應攔截器
    this.http.useRequest(async (input, init) => {
      // 加入 token
      init.headers = { ...init.headers, Authorization: "Bearer token" };
      return [input, init];
    });
    this.http.useResponse(async (res) => {
      switch (res.status) {
        case HttpResponseStatus.OK:
          return res;
        case HttpResponseStatus.BAD_REQUEST:
          throw new Error(res.statusText);
        case HttpResponseStatus.UNAUTHORIZED:
          throw new Error("Unauthorized access. Please log in again.");
        case HttpResponseStatus.NOT_FOUND:
          throw new Error("The requested resource was not found.");
        case HttpResponseStatus.INTERNAL_SERVER_ERROR:
          throw new Error("Internal server error. Please try again later.");
        default:
          throw new Error(`Unexpected error: ${res.statusText}`);
      }
    });
  }
  async get(
    url: string,
    params?: Record<string, string | number | unknown>,
    init: RequestInit = {}
  ): Promise<HttpActionResponse> {
    let query = "";
    if (params) {
      const usp = new URLSearchParams(
        params as Record<string, string>
      ).toString();
      query = usp ? `?${usp}` : "";
    }
    const response = await this.http.request(url + query, {
      ...init,
      method: "GET",
    });
    return await response.json();
  }

  async post(
    url: string,
    body?: unknown,
    init: RequestInit = {}
  ): Promise<HttpActionResponse> {
    const response = await this.http.request(url, {
      ...init,
      method: "POST",
      headers: { "Content-Type": "application/json", ...(init.headers || {}) },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return await response.json();
  }

  async put(
    url: string,
    body?: any,
    init: RequestInit = {}
  ): Promise<Response> {
    return this.http.request(url, {
      ...init,
      method: "PUT",
      headers: { "Content-Type": "application/json", ...(init.headers || {}) },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  async patch(
    url: string,
    body?: any,
    init: RequestInit = {}
  ): Promise<Response> {
    return this.http.request(url, {
      ...init,
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...(init.headers || {}) },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  async delete(url: string, init: RequestInit = {}): Promise<Response> {
    return this.http.request(url, {
      ...init,
      method: "DELETE",
    });
  }
}
