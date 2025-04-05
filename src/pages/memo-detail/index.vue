<template>
  <view class="detail-container">
    <!-- 背景装饰 -->
    <view class="bg-circle bg-circle-top-left"></view>
    <view class="bg-circle bg-circle-bottom-right"></view>
    
    <!-- 备忘录详情卡片 -->
    <view class="detail-card">
      <!-- 关闭按钮 -->
      <view class="close-button" @tap="handleClose">
        <text class="close-icon">×</text>
      </view>
      
      <!-- 编辑和删除按钮 -->
      <view class="action-buttons">
        <view class="action-button edit-button" @tap="handleEdit">
          <text>编辑</text>
        </view>
        <view class="action-button delete-button" @tap="handleDelete">
          <text>删除</text>
        </view>
      </view>
      
      <!-- 标题 -->
      <text class="memo-title">{{ memoTitle }}</text>
      
      <!-- 内容 -->
      <view class="memo-content-wrapper">
        <scroll-view class="memo-content" scroll-y enable-flex>
          <text class="memo-text">{{ memoContent }}</text>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import memoApi from '../../api/index.js';

// 获取页面传递的参数
const memoId = ref(null);
const memoTitle = ref('加载中...');
const memoContent = ref('');
const isLoading = ref(false);

// 获取备忘录详情
const getMemoDetail = async (id) => {
  if (!id) return;
  
  try {
    isLoading.value = true;
    const res = await memoApi.getMemoDetail(id);
    
    if (res.code === 0) {
      memoTitle.value = res.data.title;
      memoContent.value = res.data.content;
    } else {
      uni.showToast({
        title: res.message || '获取备忘录详情失败',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('获取备忘录详情失败:', error);
    uni.showToast({
      title: '获取备忘录详情失败',
      icon: 'none'
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  const eventChannel = getOpenerEventChannel();
  if (eventChannel) {
    eventChannel.on('getMemoData', (data) => {
      memoId.value = data.id;
      
      // 先使用传递过来的数据进行显示
      memoTitle.value = data.title;
      memoContent.value = data.content;
      
      // 如果有ID，再从接口获取完整数据
      if (data.id) {
        getMemoDetail(data.id);
      }
    });
  }
});

// 删除备忘录
const handleDelete = () => {
  if (!memoId.value) {
    uni.showToast({
      title: '无法删除',
      icon: 'none'
    });
    return;
  }
  
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这条备忘录吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          uni.showLoading({ title: '删除中...' });
          
          const result = await memoApi.deleteMemo(memoId.value);
          
          if (result.code === 0) {
            uni.showToast({
              title: '删除成功',
              icon: 'success'
            });
            
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          } else {
            uni.showToast({
              title: result.message || '删除失败',
              icon: 'none'
            });
          }
        } catch (error) {
          console.error('删除备忘录失败:', error);
          uni.showToast({
            title: '删除失败',
            icon: 'none'
          });
        } finally {
          uni.hideLoading();
        }
      }
    }
  });
};

// 编辑备忘录
const handleEdit = () => {
  if (!memoId.value) {
    uni.showToast({
      title: '无法编辑',
      icon: 'none'
    });
    return;
  }
  
  try {
    uni.navigateTo({
      url: '../memo-add/index',
      success: (res) => {
        // 通过事件通道向编辑页面传送数据
        res.eventChannel.emit('editMemoData', {
          id: memoId.value,
          title: memoTitle.value,
          content: memoContent.value
        });
        
        // 监听编辑页面返回的更新数据
        res.eventChannel.on('updateMemoData', async (data) => {
          // 更新显示的内容
          memoTitle.value = data.title;
          memoContent.value = data.content;
          
          // 重新获取最新数据
          await getMemoDetail(memoId.value);
          
          // 通知列表页刷新数据，传递完整的更新数据
          const eventChannel = getOpenerEventChannel();
          if (eventChannel) {
            eventChannel.emit('memoUpdated', {
              id: memoId.value,
              title: memoTitle.value,
              content: memoContent.value
            });
          }
        });
      }
    });
  } catch (error) {
    console.error('导航到编辑页面失败:', error);
    uni.showToast({
      title: '打开编辑页面失败',
      icon: 'none'
    });
  }
};

// 关闭页面
const handleClose = () => {
  uni.navigateBack();
};

// 获取当前页面的事件通道
function getOpenerEventChannel() {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const eventChannel = currentPage.getOpenerEventChannel ? currentPage.getOpenerEventChannel() : null;
  return eventChannel;
}
</script>

<style lang="scss">
.detail-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 30px;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  padding-top: calc(30px + constant(safe-area-inset-top));
  padding-top: calc(30px + env(safe-area-inset-top));
  -webkit-overflow-scrolling: touch;
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

// 备忘录详情卡片
.detail-card {
  width: 100%;
  max-width: 500px;
  min-height: 70vh;
  background-color: white;
  border-radius: 15px;
  padding: 25px;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  z-index: 1;
  box-sizing: border-box;
  margin-top: 44px;
}

// 关闭按钮
.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 2;
}

// 关闭图标
.close-icon {
  font-size: 28px;
  color: #666;
}

// 编辑和删除按钮区域
.action-buttons {
  display: flex;
  position: absolute;
  top: 20px;
  right: 70px;
  gap: 10px;
  z-index: 2;
}

// 操作按钮基础样式
.action-button {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

// 编辑按钮
.edit-button {
  background-color: #f0f0f0;
  color: #666;
  &:active {
    background-color: #e0e0e0;
  }
}

// 删除按钮
.delete-button {
  background-color: #ffebee;
  color: #f44336;
  &:active {
    background-color: #ffe0e0;
  }
}

// 备忘录标题
.memo-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 30px 0 20px;
  padding-right: 30px;
}

// 备忘录内容包装器
.memo-content-wrapper {
  flex: 1;
  width: 100%;
  position: relative;
  margin-bottom: 20px;
}

// 备忘录内容
.memo-content {
  width: 100%;
  height: 50vh;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  z-index: 1;
  padding: 10px 0;
  -webkit-overflow-scrolling: touch;
}

// 备忘录文本
.memo-text {
  white-space: pre-wrap;
  word-break: break-all;
  width: 100%;
  font-size: 16px;
  line-height: 1.6;
  color: #555;
  box-sizing: border-box;
}
</style> 