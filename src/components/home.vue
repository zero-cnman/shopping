<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>Header</el-header>
    <el-container>
      <!-- 侧边导航栏 -->
      <el-aside :width="!collapse?'200px':'64px'">
        <div class="collapselist" @click="collapse=!collapse">| | |</div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
          unique-opened
          :collapse="collapse"
          :collapse-transition="false"
          :default-active="$route.name"
        >
          <el-submenu :index="item.id+''" v-for="(item,index) in menusList" :key="item.id">
            <template slot="title">
              <i :class="iconList[index]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="items.path" v-for="items in item.children" :key="items.id">
              <i class="el-icon-setting"></i>
              <span slot="title">{{items.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主题区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script scoped>
export default {
  data() {
    return {
      menusList: [],
      iconList: [
        "el-icon-user-solid" /* 用户 */,
        "el-icon-s-tools" /* 权限 */,
        "el-icon-s-goods" /* 商品 */,
        "el-icon-s-order" /* 订单 */,
        "el-icon-s-marketing" /* 数据 */
      ],
      collapse: false
    };
  },
  created() {
    this.$http({
      url: "/menus",
      method: "get"
    })
      .then(res => {
        if (res.data.meta.status !== 200)
          return this.$message.error("列表获取失败，请稍后重试");
        this.menusList = res.data.data;
      })
      .catch(err => {
        this.$message.error("服务器繁忙");
      });
  }
};
</script>

<style>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  box-sizing: border-box;
}
.is-vertical {
  height: 100%;

  /* width: 100%; */
}
.el-menu {
  border-right: 0 !important;
}
.collapselist {
  /* width: 100%; */
  text-align: center;
  cursor: pointer;
  background-color: #5e7987;
  color: #d3dce6;
}
</style>