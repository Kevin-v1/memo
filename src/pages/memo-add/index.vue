<template>
  <view class="add-container">
    <!-- 背景装饰 -->
    <view class="bg-circle bg-circle-top-left"></view>
    <view class="bg-circle bg-circle-bottom-right"></view>
    
    <!-- 添加备忘录卡片 -->
    <view class="add-card">
      <!-- 关闭按钮 -->
      <view class="close-button" @tap="handleClose">
        <text class="close-icon">×</text>
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
      <textarea 
        class="memo-content-input" 
        v-model="memoContent" 
        placeholder="输入内容"
        placeholder-class="input-placeholder"
        maxlength="2000"
      />
      
      <!-- 保存按钮 -->
      <button class="save-button" @tap="handleSave" :disabled="isLoading">{{ isEdit ? '更新' : '保存' }}</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import memoApi from '../../api/index.js';

// 备忘录标题和内容
const memoTitle = ref('');
const memoContent = ref('');
const memoId = ref('');
const isEdit = ref(false);
const isLoading = ref(false);

// 页面加载时检查是否是编辑模式
onMounted(() => {
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
        id: memoId.value,
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
  justify-content: center;
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  overflow-y: auto;
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
  max-width: 600px;
  min-height: 90vh;
  background-color: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 1;
  margin: 20px 0;
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
}

// 关闭图标
.close-icon {
  font-size: 28px;
  color: #666;
}

// 备忘录标题输入
.memo-title-input {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  width: 100%;
}

// 备忘录内容输入
.memo-content-input {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  flex: 1;
  width: 100%;
  margin-bottom: 20px;
  padding: 10px 0;
}

// 输入框占位符样式
.input-placeholder {
  color: #bbb;
}

// 保存按钮
.save-button {
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 0;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(167, 119, 227, 0.3);
  margin-top: 10px;
  width: 160px;
  align-self: center;
  
  &[disabled] {
    opacity: 0.7;
    background: #ccc;
  }
}
</style> 