<template>
  <view class="register-container">
    <!-- 背景装饰 -->
    <view class="bg-circle bg-circle-top-left"></view>
    <view class="bg-circle bg-circle-bottom-right"></view>
    
    <!-- Logo -->
    <view class="logo">
      <text class="icon-shield"></text>
    </view>
    
    <!-- 标题 -->
    <text class="title">账号注册</text>
    
    <!-- 表单 -->
    <view class="register-form">
      <!-- 账号输入 -->
      <view class="input-group">
        <text class="iconfont icon-user"></text>
        <input 
          type="text"
          placeholder="请输入账号"
          v-model="formData.username"
          placeholder-class="input-placeholder"
        />
      </view>
      
      <!-- 密码输入 -->
      <view class="input-group">
        <text class="iconfont icon-password"></text>
        <input
          :type="showPassword ? 'text' : 'password'"
          placeholder="请输入密码"
          v-model="formData.password"
          placeholder-class="input-placeholder"
        />
      </view>
      
      <!-- 确认密码输入 -->
      <view class="input-group">
        <text class="iconfont icon-password"></text>
        <input
          :type="showPassword ? 'text' : 'password'"
          placeholder="请确认密码"
          v-model="formData.confirmPassword"
          placeholder-class="input-placeholder"
        />
      </view>
      
      <!-- 注册按钮 -->
      <button class="register-button" @tap="handleRegister">注册</button>
      
      <!-- 返回登录 -->
      <text class="back-to-login" @tap="handleBackToLogin">已有账号? 返回登录</text>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import authApi from '../../api/auth';

// 表单数据
const formData = reactive({
  username: '',
  password: '',
  confirmPassword: ''
});

// 是否显示密码
const showPassword = ref(false);

// 注册处理
const handleRegister = async () => {
  if (!formData.username) {
    uni.showToast({
      title: '请输入账号',
      icon: 'none'
    });
    return;
  }
  
  if (!formData.password) {
    uni.showToast({
      title: '请输入密码',
      icon: 'none'
    });
    return;
  }
  
  if (formData.password !== formData.confirmPassword) {
    uni.showToast({
      title: '两次密码输入不一致',
      icon: 'none'
    });
    return;
  }
  
  try {
    uni.showLoading({
      title: '注册中...'
    });
    
    const res = await authApi.register({
      username: formData.username,
      password: formData.password
    });
    
    if (res.code === 0) {
      uni.showToast({
        title: '注册成功',
        icon: 'success'
      });
      
      // 注册成功后自动登录
      const loginRes = await authApi.login({
        username: formData.username,
        password: formData.password
      });
      
      if (loginRes.code === 0) {
        // 保存token
        uni.setStorageSync('token', loginRes.data.token);
        
        // 获取用户信息
        const userInfo = await authApi.getUserInfo();
        if (userInfo.code === 0) {
          // 保存用户信息
          uni.setStorageSync('userInfo', userInfo.data);
        }
        
        // 跳转到备忘录列表页
        setTimeout(() => {
          uni.reLaunch({
            url: '../memo/index'
          });
        }, 1500);
      } else {
        // 如果自动登录失败，跳转到登录页
        setTimeout(() => {
          try {
            uni.navigateBack();
          } catch (error) {
            console.error('返回失败:', error);
            uni.redirectTo({
              url: '../login/index'
            });
          }
        }, 1500);
      }
    } else {
      uni.showToast({
        title: res.message || '注册失败',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('注册失败:', error);
    uni.showToast({
      title: '注册失败，请稍后重试',
      icon: 'none'
    });
  } finally {
    uni.hideLoading();
  }
};

// 返回登录
const handleBackToLogin = () => {
  try {
    uni.navigateBack();
  } catch (error) {
    console.error('返回失败:', error);
    uni.redirectTo({
      url: '../login/index'
    });
  }
};
</script>

<style lang="scss">
.register-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120px 30px 30px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
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

// Logo
.logo {
  width: 80px;
  height: 80px;
  background-color: white;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  z-index: 1;
  position: relative;
  
  .icon-shield {
    width: 40px;
    height: 40px;
  }
}

// 标题
.title {
  color: white;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 50px;
  z-index: 1;
}

// 注册表单
.register-form {
  width: 100%;
  max-width: 330px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 1;
  padding: 0 15px;
  box-sizing: border-box;
}

// 输入组
.input-group {
  position: relative;
  width: 100%;
  height: 55px;
  background-color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  
  .iconfont {
    position: absolute;
    left: 20px;
    width: 20px;
    height: 20px;
  }
  
  input {
    flex: 1;
    height: 100%;
    padding: 0 30px 0 50px;
    border: none;
    font-size: 16px;
    color: #333;
    background-color: transparent;
  }
}

.input-placeholder {
  color: #999;
}

// 注册按钮
.register-button {
  width: 100%;
  height: 55px;
  line-height: 55px;
  background-color: white;
  border: none;
  border-radius: 40px;
  color: #a777e3;
  font-size: 16px;
  font-weight: 600;
  margin-top: 40px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

// 返回登录
.back-to-login {
  color: white;
  font-size: 14px;
  text-align: center;
  margin-top: 15px;
}
</style> 