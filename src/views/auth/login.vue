<template>
  <div class="login_page">
    <div class="login_box">
      <div class="center_box">
        <!-- 登录&注册-->
        <div :class="{ login_form: true, rotate: tab == 2 }">
          <div :class="{ tabs: true, r180: reverse == 2 }">
            <div class="fl tab" @click="changetab(1)">
              <span :class="{ on: tab == 1 }">登录</span>
            </div>
            <div class="fl tab" @click="changetab(2)">
              <span :class="{ on: tab == 2 }">注册</span>
            </div>
          </div>

          <!-- 登录 -->
          <div class="form_body" v-if="reverse == 1">
            <!-- submit.prevent 阻止默认表单事件提交，采用loginSubmit -->
            <form @submit.prevent="loginSubmit">
              <input
                type="text"
                v-model="loginData.username"
                placeholder="请输入用户名"
                autocomplete="off"
              />
              <input
                type="password"
                v-model="loginData.password"
                placeholder="请输入密码"
                autocomplete="off"
              />
              <div class="error_msg">{{ loginMessage }}</div>
              <input
                type="submit"
                v-if="subState"
                disabled="disabled"
                value="登录中···"
                class="btn"
              />
              <input
                type="submit"
                v-else
                value="登录"
                @submit="loginSubmit"
                class="btn"
              />
            </form>
          </div>

          <!-- 注册 -->
          <div class="form_body r180" v-if="reverse == 2">
            <form @submit.prevent="regSubmit">
              <input
                type="text"
                v-model="registerData.username"
                placeholder="请输入用户名"
                autocomplete="off"
              />
              <input
                type="password"
                v-model="registerData.password"
                placeholder="6-30位密码，可用数字/字母/符号组合"
                autocomplete="off"
              />
              <input
                type="password"
                v-model="registerData.repPassword"
                placeholder="确认密码"
              />
              <div class="error_msg">{{ regMessage }}</div>
              <div class="agree">
                <input
                  type="checkbox"
                  id="tonyi"
                  v-model="registerData.check"
                />
                <label for="tonyi">我已经阅读并同意</label
                ><a href="javascript:;" @click="xieyi = true">《用户协议》</a>
              </div>
              <input
                type="submit"
                v-if="subState"
                disabled="disabled"
                value="提交中···"
                class="btn"
              />
              <input type="submit" v-else value="注册" class="btn" />
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户协议 -->
    <div class="xieyi" v-if="xieyi" @click.self="xieyi = false">
      <div class="xieyi_content">
        <div class="xieyi_title">请认真阅读用户协议</div>
        <div class="xieyi_body" v-if="xieyiContent" v-html="xieyiContent"></div>
        <input
          type="button"
          class="xieyi_btn"
          value="确定"
          @click="xieyi = false"
        />
      </div>
    </div>
  </div>
</template>
<script >
import { isvalidUsername } from "@/utils/validate";
import { getXieyi, getUserByUsername, register } from "@/api/auth";
export default {
  data() {
    return {
      tab: 1, // 高亮当前标签名
      reverse: 1, // 旋转 1 登录，2 注册
      loginMessage: "", //登录错误提示信息
      regMessage: "", //注册错误提示信息
      subState: false, //提交状态,减少请求
      xieyi: false, // 显示隐藏协议内容
      xieyiContent: null, // 协议内容
      redirectURL: "http://localhost:3000", // 登录成功后重写向地址
      loginData: {
        // 登录表单数据
        username: "",
        password: "",
      },
      registerData: {
        // 注册表单数据
        username: "",
        password: "",
        repPassword: "",
        check: false,
      },
    };
  },
  async created() {
    // 判断url中是否带有redirecturl参数
    if (this.$route.query.redirectURL) {
      this.redirectURL = this.$route.query.redirectURL;
    }
    // 获取协议内容
    const xieYiContent = await getXieyi();
    this.xieyiContent = xieYiContent;
  },

  methods: {
    // 切换标签
    changetab(int) {
      this.tab = int;
      let _that = this;
      setTimeout(() => {
        this.reverse = int;
      }, 200);
    },

    loginSubmit() {
      // 登录中....
      if (this.subState) {
        return false;
      }
      if (!isvalidUsername(this.loginData.username)) {
        this.loginMessage = "请输入正确的用户名";
        return false;
      }
      if (this.loginData.password.length < 6) {
        this.loginMessage = "密码长度不能少于6位";
        return false;
      }
      this.subState = true; // 提交中
      this.$store
        .dispatch("UserLogin", this.loginData)
        .then((response) => {
          const { code, message } = response;
          if (code === 20000) {
            // 跳转回来源页面
            window.location.href = this.redirectURL;
          } else {
            this.loginMessage = message;
          }
          this.subState = false; // 提交完毕
        })
        .catch((error) => {
          this.subState = false;
          this.loginMessage = "系统繁忙，请稍后再试";
        });
    },

    // 提交注册
    async regSubmit() {
      if (this.subState) {
        return false;
      }
      if (!isvalidUsername(this.registerData.username)) {
        this.regMessage = "请输入4-30位用户名，中文，数字，字母，下划线";
        return false;
      }
      const { code, message, data } = await getUserByUsername(
        this.registerData.username
      );
      if (code != 20000) {
        this.regMessage = message;
        return false;
      }
      if (data) {
        // true表示已经被注册，false表示未注册
        this.regMessage = "用户名已经被注册，请重新输入用户名";
        return false;
      }

      if (
        this.registerData.password.length < 6 ||
        this.registerData.password.length > 30
      ) {
        this.regMessage = "请输入6-30位密码,区分大小写且不可有空格";
        return false;
      }

      if (this.registerData.password !== this.registerData.repPassword) {
        this.regMessage = "两次输入密码不一致";
        return false;
      }

      if (!this.registerData.check) {
        this.regMessage = "请阅读并同意用户协议";
        return false;
      }

      this.subState = true; // 提交中
      register(this.registerData)
        .then((response) => {
          this.subState = false;
          const { code, message } = response;
          if (code === 20000) {
            // 注册成功，切换登录页
            this.changetab(1);
            // 清空表单
            this.registerData = {};
            this.regMessage = "";
          } else {
            this.regMessage = message;
          }
        })
        .catch((error) => {
          this.subState = false;
          this.regMessage = "系统繁忙，请稍后重试";
        });
    },
  },
};
</script>
<style scoped>
.login_page .login_box {
  height: 650px;
  background: url(../../assets/image/login.jpg) no-repeat center center;
}
.login_page .login_box .center_box {
  width: 1200px;
  margin: 0 auto;
  position: relative;
}

.login_page .login_form {
  width: 380px;
  position: absolute;
  top: 80px;
  right: 0px;
  border-radius: 6px;
  transition: all 0.8s;
  transform: perspective(600px);
}

.login_page .login_form.rotate {
  transform: rotateY(-180deg);
}
.login_page .form_body {
  background: #fff;
  padding: 0 30px 20px;
  border-radius: 0 0 6px 6px;
}
.login_page .form_body input[type="text"],
.login_page .form_body input[type="password"],
.login_page .form_body input[type="button"],
.login_page .form_body input[type="submit"] {
  width: 310px;
  height: 43px;
  padding-left: 10px;
  margin-top: 20px;
  border-radius: 6px;
  font-size: 14px;
  border: 1px solid #ccc;
  outline: none;
}
.login_page .form_body input[type="text"].btn,
.login_page .form_body input[type="password"].btn,
.login_page .form_body input[type="button"].btn,
.login_page .form_body input[type="submit"].btn {
  background: #f45154;
  width: 320px;
  color: #fff;
  border: none;
  outline: none;
  cursor: pointer;
  margin-bottom: 20px;
}
.login_page .form_body .error_msg {
  width: 310px;
  color: #d51423;
  font-size: 12px;
}
.login_page .form_body .next_auto {
  font-size: 14px;
  color: #333;
}
.login_page .form_body .is_go {
  float: right;
  color: #f45154;
  height: 18px;
  line-height: 18px;
  font-size: 14px;
  display: inline-block;
  padding: 0 10px;
  text-decoration: none;
}
.login_page .form_body .is_go:hover {
  text-decoration: underline;
}
.login_page .form_body .agree {
  font-size: 14px;
  color: #333;
  margin-top: 20px;
}
.login_page .form_body .agree a {
  color: #f45154;
  text-decoration: none;
}
.login_page .form_body .agree a:hover {
  text-decoration: underline;
}
.fl {
  float: left;
}
.login_page .yzm_btn {
  width: 100px;
  height: 46px;
  position: absolute;
  left: 210px;
  top: 21px;
  line-height: 48px;
  border-radius: 0 6px 6px 0;
  text-align: center;
  color: #fff;
  cursor: pointer;
  border: none;
}
.login_page .login_footer {
  padding-bottom: 30px;
}
.login_page .login_footer p {
  text-align: center;
  font-size: 12px;
  color: #1e1e1e;
  margin-top: 20px;
}
.login_page .check {
  width: 14px;
  height: 14px;
  position: relative;
  top: -1px;
}
.login_page .img_box {
  height: 70px;
}
.login_page .img_box img {
  width: 70px;
  height: 70px;
  display: block;
  border-radius: 50%;
  margin: 0 auto;
}
.login_page .hellow_text {
  text-align: center;
  font-size: 14px;
  padding: 20px 0;
  border-bottom: 1px solid #ccc;
}
.login_page .btn_box {
  border-bottom: 1px solid #ccc;
  padding-bottom: 20px;
}
.login_page .btn_box li {
  float: left;
  width: 140px;
  text-align: center;
  line-height: 30px;
  margin: 20px 10px 0;
  border-radius: 6px;
}
.login_page .btn_box li a {
  display: block;
  background: whitesmoke;
  border-radius: 6px;
}
.login_page .btn_box li a:hover {
  color: #fff;
  text-decoration: none;
  background: skyblue;
}
.login_page .out_btn {
  display: inline-block;
  margin: 10px 0 0 100px;
  font-size: 16px;
  color: #333;
  width: 120px;
  line-height: 30px;
  text-align: center;
}
.login_page .out_btn:hover {
  text-decoration: none;
}
.login_page .prn_icon {
  width: 16px;
  height: 16px;
  position: relative;
  top: 3px;
}
.login_page .tabs {
  height: 60px;
  line-height: 60px;
  background: #fff;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid #e6e6e6;
}
.login_page .tabs .tab {
  font-size: 18px;
  width: 50%;
  text-align: center;
  cursor: pointer;
  line-height: 60px;
}
.login_page .tabs span {
  display: inline-block;
  height: 59px;
}
.login_page .tabs .on {
  border-bottom: 2px solid #f45154;
  color: #f45154;
}
.login_page .r180 {
  transform: rotateY(-180deg);
}
/* 用户协议 */
.login_page .xieyi {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 3;
}
.login_page .xieyi .xieyi_content {
  width: 900px;
  height: 500px;
  margin: 50px auto 0;
  border-radius: 8px;
  background: #fff;
  position: relative;
}
.login_page .xieyi .xieyi_title {
  color: #333;
  font-size: 18px;
  line-height: 70px;
  text-align: center;
}
.login_page .xieyi .xieyi_body {
  height: 350px;
  overflow-y: auto;
  padding: 0 20px;
}
.login_page .xieyi .xieyi_btn {
  position: absolute;
  bottom: 15px;
  width: 166px;
  height: 46px;
  background: #f45154;
  color: #fff;
  border: none;
  outline: none;
  cursor: pointer;
  left: 50%;
  margin-left: -83px;
  border-radius: 6px;
}
</style>

