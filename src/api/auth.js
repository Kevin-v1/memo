import request from './request';

const authApi = {
  /**
   * 用户登录
   * @param {Object} data 登录数据 {username, password}
   * @returns {Promise} 返回登录结果和token
   */
  login(data) {
    return request({
      url: '/auth/login',
      method: 'post',
      data
    });
  },
  
  /**
   * 用户注册
   * @param {Object} data 注册数据 {username, password}
   * @returns {Promise} 返回注册结果
   */
  register(data) {
    return request({
      url: '/auth/register',
      method: 'post',
      data
    });
  },
  
  /**
   * 获取当前用户信息
   * @returns {Promise} 返回用户信息
   */
  getUserInfo() {
    return request({
      url: '/auth/user-info',
      method: 'get'
    });
  },
  
  /**
   * 退出登录
   * @returns {Promise} 返回操作结果
   */
  logout() {
    return request({
      url: '/auth/logout',
      method: 'post'
    });
  }
};

export default authApi; 