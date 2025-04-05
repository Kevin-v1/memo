export default function wxAdapter(config) {
  return new Promise((resolve, reject) => {
    const { url, method, data, headers, baseURL } = config;
    
    // 组合完整的URL
    const fullURL = baseURL ? baseURL + url : url;
    
    // 处理请求头，微信小程序中使用header而不是headers
    const header = {
      ...headers,
      'content-type': headers['Content-Type'] || 'application/json'
    };
    
    // 删除可能导致问题的header
    delete header['Content-Type'];
    
    // 发起请求
    const requestTask = uni.request({
      url: fullURL,
      method: method.toUpperCase(),
      data: data,
      header: header,
      success: (response) => {
        const { data: responseData, statusCode, header } = response;
        
        // 构造类似axios的响应对象
        const responseObject = {
          data: responseData,
          status: statusCode,
          statusText: `${statusCode}`,
          headers: header,
          config,
          request: requestTask
        };
        
        resolve(responseObject);
      },
      fail: (error) => {
        const errorObject = {
          config,
          code: error.errMsg,
          message: '请求失败',
          request: requestTask,
          response: null,
          isAxiosError: true,
          toJSON: () => ({
            message: error.errMsg,
            name: 'AxiosError',
            code: error.errMsg
          })
        };
        
        reject(errorObject);
      }
    });
  });
} 