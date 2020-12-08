<template>
  <div class="login-container">
    <van-nav-bar
      class="app-nav-bar"
      title="注册/登陆"
      left-arrow
      @click-left="$router.back()"
    />

    <!--登陆表单-->
    <van-form
      :show-error="false"
      :show-error-message="false"
      validate-first
      ref="login-form"
      @submit="onLogin"
      @failed="onFailed"

    >
      <van-field
        v-model="user.mobile"
        icon-prefix="toutiao"
        left-icon="shouji"
        placeholder="请输入手机号"
        name="mobile"
        center
        required
        :rules="formrules.mobile"
      />
      <van-field
        v-model="user.code"
        type="number"
        icon-prefix="toutiao"
        left-icon="yanzhengma"
        placeholder="请输入验证码"
        name="code"
        required
        center
        clearable
        :rules="formrules.code"
      >
      <template #button>
        <van-count-down
          v-if="isCountDownShow"
          :time="1000 * 60"
          format="ss s"
          @finish="isCountDownShow = false"
        />
        <van-button
          v-else
          class="send-btn"
          size="mini"
          round
          :loading="isSendSmsLoading"
          @click.prevent="onSendSms"
        >验证码</van-button>  <!--使用prevent来禁止表单提交-->
      </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button
          type="info"
          block
          >
          登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
  import { login,sendSms } from '@/api/user'
  import { Toast } from 'vant'
  import { CountDown } from 'vant'
  export default {
    name: 'LoginIndex',
    components: {},
    props: {},
    data () {
      return {
        user : {
          mobile :'',
          code : ''
        },
        formrules:{
          mobile: [
            { required : true ,   message: '请输入手机号'},
            { pattern : /0?(13|14|15|18|17)[0-9]{9}/, message : '手机号格式错误' }
          ],
          code:[
            { required : true ,   message: '请输入验证码'},
            { pattern : /^\d{6}$/, message : '验证码错误' }
          ]
        },
        isSendSmsLoading: false,
        isCountDownShow: false
      }
    },
    computed: {},
    watch: {},
    created () {},
    mounted () {},
    methods: {
      async onLogin () {
        Toast.loading({
          message: '登陆中...',
          forbidClick: true, // 禁止背景点击
          duration: 0
        })
        //1.找到数据接口
        //2.封装请求方法
        //3.请求调用登陆
        try {
          const { data } = await login(this.user)
          console.log(data)
          Toast.success('登陆成功')
          this.$store.commit('setUser' , data.data)
        } catch (err) {
          if (err.response.status === 400) {
            Toast.fail('登陆失败')
          }
        }
      },

      onFailed (error) {
        console.log(error)
        if (error.errors[0]) {
          this.$toast({
            message: error.errors[0].message, // 提示消息
            position: 'top' // 防止手机键盘太高看不见提示消息
          })
        }
      },
      async onSendSms () {
        try {
          // 校验手机号码
          await this.$refs['login-form'].validate('mobile')
          // 验证通过 -> 请求发送验证码 -> 用户接收短信 -> 输入验证码 -> 请求登录
          this.isSendSmsLoading = true
          const res =await sendSms(this.user.mobile)
          console.log(res)
          // 短信发出去了,显示倒计时，关闭发送按钮
          this.isCountDownShow = true
          // 请求发送验证码 -> 隐藏发送按钮，显示倒计时
          // 倒计时结束 -> 隐藏倒计时，显示发送按钮
        } catch (err) {
          let message = ''
          if (err && err.response && err.response.status === 429) {
            // 发送短信失败的错误提示
            message = '发送太频繁了，请稍后重试'
          } else if (err.name === 'mobile') {
            // 表单验证失败的错误提示
            message = err.message
          } else {
            // 未知错误
            message = '发送失败，请稍后重试'
          }
          this.$toast({
            message: message,
            position: 'top'
          })
        }
        this.isSendSmsLoading = false
      }
  }
}
</script>

<style scoped lang="less">
  .login-container {
    .send-btn {
      width: 76px;
      height: 23px;
      background-color: #ededed;
      .van-button__text {
        font-size: 11px;
        color: #666666;
      }
    }
    .login-btn-wrap {
      padding: 26px 16px;
      .login-btn {
        background-color: #6db4fb;
        border: none;
        .van-button__text {
          font-size: 15px;
        }
      }
    }
  }
</style>
