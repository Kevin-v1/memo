<template>
  <view class="memo-container">
    <!-- 背景装饰 -->
    <view class="bg-circle bg-circle-top-left"></view>
    <view class="bg-circle bg-circle-bottom-right"></view>
    
    <!-- 标题区域 -->
    <view class="header">
      <text class="title">我的备忘录</text>
      <!-- 添加退出登录按钮 -->
      <view class="logout-button" @tap="handleLogout">
        <text>退出</text>
      </view>
    </view>
    
    <!-- 备忘录列表 -->
    <view class="memo-list" v-if="memoList.length > 0">
      <!-- 备忘录项 -->
      <view class="memo-item" v-for="(item, index) in memoList" :key="item.id" @tap="viewMemo(item)">
        <text class="memo-title">{{ item.title }}</text>
        <text class="memo-content">{{ item.content }}</text>
      </view>
    </view>
    
    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <text class="empty-text">还没有备忘录，点击下方按钮添加</text>
    </view>
    
    <!-- 添加按钮 -->
    <view class="add-button" @tap="addMemo">
      <text class="add-icon">+</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import memoApi from '../../api/index.js';
import authApi from '../../api/auth';

// 备忘录列表数据
const memoList = ref([]);
const isLoading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const needRefresh = ref(false);

// 加载备忘录列表
const loadMemoList = async (force = false) => {
  // 如果不是强制刷新且正在加载中，则跳过
  if (!force && isLoading.value) return;
  
  try {
    isLoading.value = true;
    
    const params = {
      page: currentPage.value,
      limit: 20,
      sort: 'created_desc'
    };
    
    const res = await memoApi.getMemos(params);
    
    if (res.code === 0) {
      // 如果是第一页，直接替换数据
      if (currentPage.value === 1) {
        memoList.value = res.data.memos || [];
      } else {
        // 否则追加数据
        memoList.value = [...memoList.value, ...(res.data.memos || [])];
      }
      totalPages.value = Math.ceil(res.data.total / res.data.limit) || 1;
    } else {
      uni.showToast({
        title: res.message || '获取备忘录失败',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('加载备忘录列表失败:', error);
    uni.showToast({
      title: '获取备忘录失败',
      icon: 'none'
    });
  } finally {
    isLoading.value = false;
    needRefresh.value = false;
    // 停止下拉刷新
    uni.stopPullDownRefresh();
  }
};

// 查看备忘录详情
const viewMemo = (memo) => {
  try {
    uni.navigateTo({
      url: '../memo-detail/index',
      success: (res) => {
        // 通过事件通道向被打开页面传送数据
        res.eventChannel.emit('getMemoData', {
          id: memo.id,
          title: memo.title,
          content: memo.content
        });
        
        // 监听详情页的更新事件
        res.eventChannel.on('memoUpdated', (data) => {
          if (data && data.id) {
            // 更新对应的备忘录数据
            const index = memoList.value.findIndex(item => item.id === data.id);
            if (index !== -1) {
              // 使用Vue的响应式更新方法
              memoList.value = memoList.value.map(item => 
                item.id === data.id ? { ...item, ...data } : item
              );
            }
          } else {
            // 如果没有收到完整数据，则刷新整个列表
            currentPage.value = 1;
            loadMemoList(true);
          }
        });
      }
    });
  } catch (error) {
    console.error('导航到详情页失败:', error);
    uni.showToast({
      title: '打开详情失败',
      icon: 'none'
    });
  }
};

// 添加新备忘录
const addMemo = () => {
  uni.navigateTo({
    url: '../memo-add/index',
    success: (res) => {
      // 监听更新事件
      res.eventChannel.on('memoUpdated', (data) => {
        if (data && data.id) {
          // 如果是编辑现有备忘录，更新对应的数据
          const index = memoList.value.findIndex(item => item.id === data.id);
          if (index !== -1) {
            memoList.value[index] = data;
          } else {
            // 如果是新增备忘录，添加到列表开头
            memoList.value.unshift(data);
          }
        } else {
          // 如果没有具体数据，则刷新整个列表
          currentPage.value = 1;
          loadMemoList(true);
        }
      });
    }
  });
};

// 退出登录处理
const handleLogout = () => {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出登录吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          uni.showLoading({ title: '退出中...' });
          
          const result = await authApi.logout();
          
          // 无论退出接口是否成功，都清除本地存储并返回登录页
          uni.removeStorageSync('token');
          uni.removeStorageSync('userInfo');
          
          uni.showToast({
            title: '已退出登录',
            icon: 'success'
          });
          
          setTimeout(() => {
            uni.reLaunch({
              url: '../login/index'
            });
          }, 1500);
        } catch (error) {
          console.error('退出登录失败:', error);
          // 即使接口调用失败，也强制退出
          uni.removeStorageSync('token');
          uni.removeStorageSync('userInfo');
          uni.reLaunch({
            url: '../login/index'
          });
        } finally {
          uni.hideLoading();
        }
      }
    }
  });
};

// 页面加载时获取数据
onMounted(() => {
  loadMemoList(true);
});

// 每次显示页面时检查是否需要刷新
onShow(() => {
  if (needRefresh.value) {
    currentPage.value = 1;
    loadMemoList(true);
  }
});

// 定义页面下拉刷新事件
onPullDownRefresh(() => {
  currentPage.value = 1;
  loadMemoList(true);
});

// 定义页面上拉触底事件
onReachBottom(() => {
  if (currentPage.value < totalPages.value && !isLoading.value) {
    currentPage.value++;
    loadMemoList();
  }
});
</script>

<style lang="scss">
.memo-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  display: flex;
  flex-direction: column;
  padding: 30px 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: calc(20px + constant(safe-area-inset-top));
  padding-top: calc(20px + env(safe-area-inset-top));
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
}

// 背景装饰圆形
.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  z-index: 0;
  
  &-top-left {
    top: -50px;
    left: -50px;
    width: 200px;
    height: 200px;
  }
  
  &-bottom-right {
    bottom: -80px;
    right: -80px;
    width: 300px;
    height: 300px;
  }
}

// 标题区域
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  z-index: 1;
  margin-top: 44px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

// 标题
.title {
  color: white;
  font-size: 24px;
  font-weight: 600;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // 添加文字阴影提高可读性
}

// 退出登录按钮
.logout-button {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  
  text {
    color: white;
    font-size: 14px;
  }
  
  &:active {
    background-color: rgba(255, 255, 255, 0.3);
  }
}

// 备忘录列表
.memo-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 70px;
  z-index: 1;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

// 备忘录项
.memo-item {
  background-color: white;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-height: 150px;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  transform: translateZ(0);
}

// 备忘录标题
.memo-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

// 备忘录内容
.memo-content {
  font-size: 14px;
  color: #666;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  word-break: break-all;
  white-space: pre-wrap;
  line-height: 1.4;
}

// 添加按钮
.add-button {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: 60px;
  height: 60px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

// 添加图标
.add-icon {
  font-size: 32px;
  color: #a777e3;
  font-weight: 300;
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  z-index: 1;
}

// 空状态文本
.empty-text {
  color: white;
  font-size: 16px;
  text-align: center;
}
</style> 