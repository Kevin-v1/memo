<template>
  <view class="login-container">
    <!-- 背景装饰 -->
    <view class="bg-circle bg-circle-top-left"></view>
    <view class="bg-circle bg-circle-bottom-right"></view>
    
    <!-- Logo -->
    <view class="logo">
      <text class="icon-shield"></text>
    </view>
    
    <!-- 标题 -->
    <text class="title">欢迎登录</text>
    
    <!-- 表单 -->
    <view class="login-form">
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
      
      <!-- 记住我 -->
      <view class="remember-me">
        <checkbox 
          :checked="formData.remember" 
          @tap="formData.remember = !formData.remember"
          color="#a777e3"
        />
        <text @tap="formData.remember = !formData.remember">记住我</text>
      </view>
      
      <!-- 登录按钮 -->
      <button class="login-button" @tap="handleLogin">登录</button>
      
      <!-- 底部链接区域 -->
      <view class="bottom-links">
        <!-- 忘记密码 -->
        <text class="forgot-password" @tap="handleForgotPassword">忘记密码?</text>
        <!-- 注册账号 -->
        <text class="register-link" @tap="handleRegister">注册账号</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import authApi from '../../api/auth';

// 表单数据
const formData = reactive({
  username: '',
  password: '',
  remember: false
});

// 是否显示密码
const showPassword = ref(false);

// 登录处理
const handleLogin = async () => {
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
  
  try {
    uni.showLoading({
      title: '登录中...'
    });
    
    const res = await authApi.login({
      username: formData.username,
      password: formData.password
    });
    
    if (res.code === 0) {
      // 保存token
      uni.setStorageSync('token', res.data.token);
      
      // 如果选择了记住我，保存用户名
      if (formData.remember) {
        uni.setStorageSync('login_username', formData.username);
      } else {
        uni.removeStorageSync('login_username');
      }
      
      // 获取用户信息
      const userInfo = await authApi.getUserInfo();
      if (userInfo.code === 0) {
        // 保存用户信息
        uni.setStorageSync('userInfo', userInfo.data);
      }
      
      uni.showToast({
        title: '登录成功',
        icon: 'success'
      });
      
      // 登录成功后跳转到备忘录列表页
      setTimeout(() => {
        uni.reLaunch({
          url: '../memo/index'
        });
      }, 1500);
    } else {
      uni.showToast({
        title: res.message || '登录失败',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('登录失败:', error);
    uni.showToast({
      title: '登录失败，请稍后重试',
      icon: 'none'
    });
  } finally {
    uni.hideLoading();
  }
};

// 忘记密码处理
const handleForgotPassword = () => {
  uni.showToast({
    title: '忘记密码功能开发中',
    icon: 'none'
  });
};

// 跳转到注册页
const handleRegister = () => {
  try {
    uni.navigateTo({
      url: '../register/index'
    });
  } catch (error) {
    console.error('导航错误:', error);
    // 尝试替代方案
    try {
      uni.redirectTo({
        url: '../register/index'
      });
    } catch (err) {
      console.error('重定向失败:', err);
      uni.showToast({
        title: '页面跳转失败',
        icon: 'none'
      });
    }
  }
};

// 页面加载时检查是否有保存的用户名
onMounted(() => {
  const savedUsername = uni.getStorageSync('login_username');
  if (savedUsername) {
    formData.username = savedUsername;
    formData.remember = true;
  }
});
</script>

<style lang="scss">
.login-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 150px 30px 30px;
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

// 登录表单
.login-form {
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

// 记住我
.remember-me {
  display: flex;
  align-items: center;
  padding-left: 5px;
  margin-top: 5px;
  
  checkbox {
    transform: scale(0.8);
    margin-right: 5px;
    border-radius: 2px;
  }
  
  text {
    color: white;
    font-size: 14px;
    margin-left: 5px;
  }
}

// 登录按钮
.login-button {
  width: 100%;
  height: 55px;
  line-height: 55px;
  background-color: white;
  border: none;
  border-radius: 40px;
  color: #a777e3;
  font-size: 16px;
  font-weight: 600;
  margin-top: 60px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

// 底部链接区域
.bottom-links {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 15px;
}

// 忘记密码
.forgot-password {
  color: white;
  font-size: 14px;
}

// 注册链接
.register-link {
  color: white;
  font-size: 14px;
}
</style> 