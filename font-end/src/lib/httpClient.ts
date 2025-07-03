type RequestInterceptor = (input: RequestInfo, init: RequestInit) => Promise<[RequestInfo, RequestInit]> | [RequestInfo, RequestInit];
type ResponseInterceptor = (response: Response) => Promise<Response> | Response;

export class HttpClient {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  useRequest(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  useResponse(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  async request(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
    // Apply request interceptors
    let reqInput = input;
    let reqInit = { ...init };
    for (const interceptor of this.requestInterceptors) {
      const result = await interceptor(reqInput, reqInit);
      [reqInput, reqInit] = result;
    }

    // Send request
    let response = await fetch(reqInput, reqInit);
    
    // Apply response interceptors
    for (const interceptor of this.responseInterceptors) {
      response = await interceptor(response);
    }

    return response;
  }

  
}

// 使用範例
// const http = new HttpClient();
// http.useRequest(async (input, init) => {
//   // 加入 token
//   init.headers = { ...init.headers, Authorization: 'Bearer token' };
//   return [input, init];
// });
// http.useResponse(async (res) => {
//   if (!res.ok) throw new Error('HTTP error');
//   return res;
// });