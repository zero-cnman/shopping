<template>
  <div class="loginTag">
    <div class="loginBox">
      <el-form ref="loginForm" :model="loginForm" label-width="80px" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            clearable
            show-password
            @keyup.enter.native="login('loginForm')"
          ></el-input>
        </el-form-item>
        <el-form-item class="loginButton">
          <el-button type="primary" @click="login('loginForm')">登录</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script scoped>
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    login(loginForm) {
      this.$refs[loginForm].validate(async valid => {
        if (!valid) return false;
        await this.$http({
          url: "/login",
          method: "post",
          params: {
            username: this.loginForm.username,
            password: this.loginForm.password
          }
        })
          .then(res => {
            if (res.data.meta.status !== 200)
              return this.$message.error("用户名或密码错误");
            window.sessionStorage.setItem("token", res.data.data.token);
            this.$router.push("/home");
          })
          .catch(err => {
            console.log("服务器繁忙,请稍后重试");
          });
      });
    }
  }
};
</script>

<style>
.loginTag {
  height: 100%;
  background-color: #4f383e;
  background: url("../assets/imgs/01.jpg") no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
}
.loginBox {
  width: 500px;
  height: 300px;
  background-color: #fffef9;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
}
.el-form {
  margin-top: 80px;
  margin-right: 20px;
}
.loginButton {
  display: flex;
  justify-content: center;
}
</style>