<template>
  <div class="login_page">
    <div class="login_box">
      <div class="center_box">
        <!-- 登录&注册-->
        <div :class="{login_form: true, rotate: tab == 2}">
          <div :class="{tabs: true, r180: reverse == 2}">
            <div class="fl tab" @click="changetab(1)">
              <span :class="{on: tab == 1}">登录</span>
            </div>
            <div class="fl tab" @click="changetab(2)">
              <span :class="{on: tab == 2}">注册</span>
            </div>
          </div>
          
          <!-- 登录 -->
          <div class="form_body" v-if="reverse == 1">
            <!-- submit.prevent 阻止默认表单事件提交，采用loginSubmit -->
            <form @submit.prevent="loginSubmit">
              <input type="text" v-model="loginData.username" placeholder="请输入用户名" autocomplete="off">
              <input type="password" v-model="loginData.password" placeholder="请输入密码" autocomplete="off">
              <div class="error_msg">{{loginMessage}}</div>
              <input type="submit" v-if="subState" disabled="disabled" value="登录中···" class="btn" />
              <input type="submit" v-else value="登录" @submit="loginSubmit" class="btn" />
            </form>
          </div>

          <!-- 注册 -->
          <div class="form_body r180" v-if="reverse == 2">
            <form @submit.prevent="regSubmit">
              <input type="text" v-model="registerData.username" placeholder="请输入用户名" autocomplete="off">
              <input type="password" v-model="registerData.password" placeholder="6-30位密码，可用数字/字母/符号组合" autocomplete="off">
              <input type="password" v-model="registerData.repPassword" placeholder="确认密码" >
              <div class="error_msg">{{regMessage}}</div>
              <div class="agree">
                <input type="checkbox" id="tonyi" v-model="registerData.check">
                <label for="tonyi">我已经阅读并同意</label><a href="jvascript:;"  @click="xieyi = true">《用户协议》</a>
              </div>
              <input type="submit" v-if="subState" disabled="disabled" value="提交中···" class="btn">
              <input type="submit" v-else value="注册" class="btn">
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户协议 -->
    <div class="xieyi" v-if="xieyi" @click.self="xieyi = false">
      <div class="xieyi_content">
        <div class="xieyi_title">请认真阅读用户协议</div>
        <div class="xieyi_body" v-if="xieyiContent" v-html="xieyiContent">
        </div>
        <input type="button" class="xieyi_btn" value="确定" @click="xieyi = false">
      </div>
    </div>
  </div>
</template>
<script >
export default {

    data () {
      return {
        tab:  1, // 高亮当前标签名
        reverse:  1, // 旋转 1 登录，2 注册
        loginMessage: '', //登录错误提示信息
        regMessage: '', //注册错误提示信息
        subState: false, //提交状态
        xieyi: false, // 显示隐藏协议内容
        xieyiContent: null, // 协议内容
        redirectURL: '', // 登录成功后重写向地址
        loginData: { // 登录表单数据
            username: '',
            password: ''
        },
        registerData: { // 注册表单数据
            username: '',
            password: '',
            repassword: '',
            check: false
        },
      }
    },

    methods: {

      // 切换标签
      changetab (int) {
          this.tab = int;
          let _that = this;
          setTimeout(() => {
            this.reverse = int
          }, 200)
      },

      // 提交登录
      loginSubmit() {

      },

      // 提交注册
      regSubmit() {
        
      }

    },
}
</script>
<style scoped>
@import '../../assets/style/login.css'; 
</style>

