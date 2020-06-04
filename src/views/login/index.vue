<template>
  <div class="login-container">
    <div class="left">
      <div class="title-box">
        <img src="../../assets/login_icon.png" alt />
        <div class="title">黑马面面</div>
        <div class="line"></div>
        <div class="sub-title">用户登录</div>
      </div>
      <!-- 表单部分 -->
      <el-form class="login-form" :model="loginForm" :rules="rules" ref="loginFormRef">
        <el-form-item prop="phone">
          <el-input v-model="loginForm.phone" prefix-icon="el-icon-user" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            show-password
            prefix-icon="el-icon-lock"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-input v-model="loginForm.code" prefix-icon="el-icon-key" placeholder="请输入验证码"></el-input>
            </el-col>
            <el-col :span="8">
              <img :src="codeUrl" class="captcha" @click="captchaClick" alt />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="checked">
          <el-checkbox v-model="loginForm.checked"></el-checkbox>&nbsp;我已阅读并同意
          <el-link type="primary" href="http://www.baidu.com">用户协议</el-link>和
          <el-link type="primary" href="http://www.baidu.com">隐私条款</el-link>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%" @click="submit">登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%" @click="registerClick">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="right">
        <img src="../../assets/login_bg.png" alt="">
    </div>
  </div>
</template>

<script>
//按需导入
import {setToken} from '@/utils/token.js'
export default {
  name: "Login",
  data() {
    return {
      codeUrl: process.env.VUE_APP_BASEURL + "/captcha?type=login",
      loginForm: {
        phone: "18511111111",//手机号
        password: "12345678",//密码
        code: "",//验证码
        checked: true,//是否勾选用户协议
      },
      rules: {
        phone: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("手机号不能为空"));
              }

              const reg = /^1[3456789][0-9]{9}$/;
              if (!reg.test(value)) {
                return callback(new Error("手机号不合法"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 10, message: "长度在 6 到 10个字符", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 4, max: 4, message: "长度必须为4个字符", trigger: "blur" }
        ],
        checked: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("请勾选用户协议"));
              }

              callback();
            },
            trigger: "change"
          }
        ]
      }
    };
  },
  //点击登录按钮
  methods: {
    submit() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return; //验证不通过

        //验证通过发送请求
        const res = await this.$axios.post("/login", this.loginForm);
        if (res.data.code == 200) {
          this.$message({
            message: "登陆成功",
            type: "success"
          });
          // 登录成功后保存token到localstorage里面去
          setToken(res.data.data.token)

          //跳转到layout页面
          this.$router.push('/layout')
        } else {
          this.$message.error(res.data.message);
          //登录错了就重新更新验证码
          this.captchaClick()
        }
      });
    },
    //点击验证码图片按钮重新发送请求
    captchaClick(){
      this.codeUrl = process.env.VUE_APP_BASEURL + "/captcha?type=login&r="+Math.random()
    },
      //点击注册按钮
    registerClick() {},
  }
};
</script>

<style lang="less">
.login-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: linear-gradient(225deg, #1493fa, #01c6fa);
  .left {
    width: 478px;
    height: 550px;
    background: #f5f5f5;
    padding: 48px;
    .title-box {
      display: flex;
      align-items: center;
      img {
        width: 22px;
        height: 17px;
        margin-right: 16px;
      }
      .title {
        font-size: 24px;
        margin-right: 14px;
      }
      .line {
        width: 1px;
        background-color: #c7c7c7;
        height: 27px;
        margin-right: 12px;
      }
      .sub-title {
        font-size: 22px;
      }
    }
    .login-form {
      margin-top: 29px;
      .captcha {
        width: 100%;
        height: 40px;
      }
    }
  }
}
</style>