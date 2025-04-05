import request from './request';

const memoApi = {
  /**
   * 获取备忘录列表
   * @param {Object} params 查询参数 {page, limit, sort}
   * @returns {Promise} 返回备忘录列表数据
   */
  getMemos(params) {
    return request({
      url: '/memos',
      method: 'get',
      params
    });
  },
  
  /**
   * 获取备忘录详情
   * @param {string} id 备忘录ID 
   * @returns {Promise} 返回备忘录详情数据
   */
  getMemoDetail(id) {
    return request({
      url: `/memos/${id}`,
      method: 'get'
    });
  },
  
  /**
   * 创建备忘录
   * @param {Object} data 备忘录数据 {title, content}
   * @returns {Promise} 返回创建的备忘录数据
   */
  createMemo(data) {
    return request({
      url: '/memos',
      method: 'post',
      data
    });
  },
  
  /**
   * 更新备忘录
   * @param {string} id 备忘录ID
   * @param {Object} data 更新数据 {title, content} 
   * @returns {Promise} 返回更新后的备忘录数据
   */
  updateMemo(id, data) {
    return request({
      url: `/memos/${id}`,
      method: 'put',
      data
    });
  },
  
  /**
   * 删除备忘录
   * @param {string} id 备忘录ID
   * @returns {Promise} 返回操作结果
   */
  deleteMemo(id) {
    return request({
      url: `/memos/${id}`,
      method: 'delete'
    });
  },
  
  /**
   * 批量删除备忘录
   * @param {Array} ids 备忘录ID数组
   * @returns {Promise} 返回操作结果
   */
  batchDeleteMemos(ids) {
    return request({
      url: '/memos/batch-delete',
      method: 'post',
      data: { ids }
    });
  }
};

export default memoApi; 