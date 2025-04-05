import axios from 'axios';
import wxAdapter from '../utils/wxAdapter';

// 创建 axios 实例
const request = axios.create({
  baseURL: 'https://kqhsdclnqvle.sealosbja.site/api/v1',
  timeout: 10000,
  adapter: wxAdapter,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 从本地存储获取token
    const token = uni.getStorageSync('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    let message = '请求失败';
    if (error.response) {
      // 服务器返回错误信息
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // 未授权或token过期，清除本地存储并跳转到登录页
          uni.removeStorageSync('token');
          uni.removeStorageSync('userInfo');
          
          // 获取当前页面路径
          const pages = getCurrentPages();
          const currentPage = pages[pages.length - 1];
          const currentPath = currentPage ? currentPage.route : '';
          
          // 如果当前不在登录页，则跳转到登录页
          if (!currentPath.includes('login')) {
            uni.reLaunch({
              url: '/pages/login/index'
            });
          }
          message = '登录已过期，请重新登录';
          break;
        case 404:
          message = '资源不存在';
          break;
        case 400:
          message = data.message || '请求参数错误';
          break;
        case 500:
          message = '服务器内部错误';
          break;
        default:
          message = data.message || '请求失败';
      }
    } else if (error.request) {
      // 请求发送但没有收到响应
      message = '网络连接失败';
    }
    
    uni.showToast({
      title: message,
      icon: 'none'
    });
    
    return Promise.reject(error);
  }
);

export default request; 