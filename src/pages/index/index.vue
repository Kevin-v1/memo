<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">备忘录</text>
      <text class="subtitle">正在加载...</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: '备忘录',
    }
  },
  onLoad() {
    // 检查是否已登录
    const token = uni.getStorageSync('token');
    if (token) {
      // 已登录，跳转到备忘录列表页
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/memo/index'
        });
      }, 1000);
    } else {
      // 未登录，跳转到登录页
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/login/index'
        });
      }, 1000);
    }
  }
}
</script>

<style>
.content {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  box-sizing: border-box;
  padding-top: calc(30px + constant(safe-area-inset-top));
  padding-top: calc(30px + env(safe-area-inset-top));
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: 50rpx;
  font-weight: bold;
  color: white;
  margin-bottom: 20rpx;
}

.subtitle {
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.8);
}
</style>
