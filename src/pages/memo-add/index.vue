<template>
  <view class="add-container">
    <!-- 背景装饰 -->
    <view class="bg-circle bg-circle-top-left"></view>
    <view class="bg-circle bg-circle-bottom-right"></view>
    
    <!-- 添加备忘录卡片 -->
    <view class="add-card">
      <!-- 顶部操作区 -->
      <view class="top-actions">
        <text class="title-text">{{ isEdit ? '编辑备忘录' : '新建备忘录' }}</text>
        <view class="save-button" @tap="handleSave" :class="{ disabled: isLoading }">
          <text>保存</text>
        </view>
      </view>
      
      <!-- 标题输入 -->
      <input 
        class="memo-title-input" 
        type="text" 
        v-model="memoTitle" 
        placeholder="输入标题"
        placeholder-class="input-placeholder"
        maxlength="50"
      />
      
      <!-- 内容输入 -->
      <view class="memo-content-wrapper">
        <textarea 
          class="memo-content-input" 
          v-model="memoContent" 
          placeholder="输入内容..."
          placeholder-class="input-placeholder"
          maxlength="2000"
          auto-height
          :style="{ height: contentHeight + 'px' }"
        ></textarea>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import memoApi from '../../api/index.js';

// 备忘录标题和内容
const memoTitle = ref('');
const memoContent = ref('');
const memoId = ref('');
const isEdit = ref(false);
const isLoading = ref(false);
const contentHeight = ref(400); // 默认高度

// 计算内容区域高度
const updateContentHeight = () => {
  // 获取设备高度并减去其他元素的高度预留
  const windowHeight = uni.getSystemInfoSync().windowHeight;
  // 预估其他元素（标题栏、顶部操作区等）的高度，留出合理空间
  contentHeight.value = windowHeight - 250;
  if (contentHeight.value < 200) contentHeight.value = 200;
};

// 页面加载时检查是否是编辑模式
onMounted(() => {
  updateContentHeight();
  
  // 监听窗口大小变化
  window.addEventListener('resize', updateContentHeight);
  
  const eventChannel = getOpenerEventChannel();
  if (eventChannel) {
    // 尝试获取编辑数据
    eventChannel.on('editMemoData', (data) => {
      if (data && data.id) {
        memoId.value = data.id;
        memoTitle.value = data.title || '';
        memoContent.value = data.content || '';
        isEdit.value = true;
      }
    });
  }
});

onBeforeUnmount(() => {
  // 移除事件监听器
  window.removeEventListener('resize', updateContentHeight);
});

// 是否有未保存的更改
const hasUnsavedChanges = () => {
  return memoTitle.value.trim() !== '' || memoContent.value.trim() !== '';
};

// 关闭页面
const handleClose = () => {
  if (hasUnsavedChanges()) {
    uni.showModal({
      title: '提示',
      content: '有未保存的内容，确定要离开吗？',
      success: (res) => {
        if (res.confirm) {
          uni.navigateBack();
        }
      }
    });
  } else {
    uni.navigateBack();
  }
};

// 保存或更新备忘录
const handleSave = async () => {
  if (memoTitle.value.trim() === '') {
    uni.showToast({
      title: '请输入标题',
      icon: 'none'
    });
    return;
  }
  
  if (memoContent.value.trim() === '') {
    uni.showToast({
      title: '请输入内容',
      icon: 'none'
    });
    return;
  }
  
  try {
    isLoading.value = true;
    uni.showLoading({
      title: isEdit.value ? '更新中...' : '保存中...'
    });
    
    const memoData = {
      title: memoTitle.value.trim(),
      content: memoContent.value.trim()
    };
    
    let res;
    
    if (isEdit.value && memoId.value) {
      // 更新备忘录
      res = await memoApi.updateMemo(memoId.value, memoData);
    } else {
      // 创建新备忘录
      res = await memoApi.createMemo(memoData);
    }
    
    if (res.code === 0) {
      // 获取页面栈
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      
      // 获取事件通道
      const eventChannel = getOpenerEventChannel();
      
      // 构建完整的备忘录数据
      const updatedMemo = {
        id: isEdit.value ? memoId.value : res.data.id,
        title: memoData.title,
        content: memoData.content
      };
      
      // 先通知更新
      if (eventChannel) {
        if (prevPage && prevPage.route.includes('memo-detail')) {
          // 如果上一页是详情页，发送详细数据
          eventChannel.emit('updateMemoData', updatedMemo);
        }
        // 无论是哪个页面，都发送刷新通知
        eventChannel.emit('memoUpdated', updatedMemo);
      }
      
      // 延迟显示提示和返回
      setTimeout(() => {
        uni.showToast({
          title: isEdit.value ? '更新成功' : '保存成功',
          icon: 'success',
          duration: 1500
        });
        
        // 再延迟返回
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }, 100);
    } else {
      uni.showToast({
        title: res.message || (isEdit.value ? '更新失败' : '保存失败'),
        icon: 'none'
      });
    }
  } catch (error) {
    console.error(isEdit.value ? '更新备忘录失败:' : '创建备忘录失败:', error);
    uni.showToast({
      title: isEdit.value ? '更新失败' : '保存失败',
      icon: 'none'
    });
  } finally {
    isLoading.value = false;
    uni.hideLoading();
  }
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
.add-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 30px 15px;
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

// 添加备忘录卡片
.add-card {
  width: 100%;
  max-width: 500px;
  background-color: white;
  border-radius: 20px;
  padding: 25px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1;
  box-sizing: border-box;
  margin-top: 20px;
}

// 顶部操作区
.top-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 25px;
  padding: 0 5px;
}

// 标题文本
.title-text {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

// 保存按钮
.save-button {
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  border-radius: 30px;
  padding: 10px 25px;
  font-size: 16px;
  font-weight: 500;
  
  &.disabled {
    opacity: 0.5;
  }
}

// 备忘录标题输入
.memo-title-input {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  padding: 15px 5px;
  border-bottom: 1px solid #eee;
  width: 100%;
  margin-bottom: 20px;
  height: 60px;
}

// 备忘录内容包装器
.memo-content-wrapper {
  width: 100%;
  flex: 1;
  padding: 0 5px;
}

// 备忘录内容输入
.memo-content-input {
  width: 100%;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  padding: 10px 0;
  box-sizing: border-box;
  border: none;
}

// 输入框占位符样式
.input-placeholder {
  color: #bbb;
}
</style> 