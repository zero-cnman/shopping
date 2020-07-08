<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div class="hh1">电商后台管理系统</div>
      <el-button type="success" class="outbnt" @click="outbnt">退出</el-button>
    </el-header>
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
            <el-menu-item
              :index="items.path"
              v-for="items in item.children"
              :key="items.id"
              @click="addTabs(items)"
            >
              <i class="el-icon-setting"></i>
              <span slot="title">{{items.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主题区域 -->

      <el-main>
        <div class="navTop">
          <el-tabs
            v-model="tabsname"
            type="card"
            closable
            @tab-remove="removeTab"
            @tab-click="changetab"
          >
            <!-- @tab-click="changetab" -->
            <el-tab-pane
              v-for="item in tabslist"
              :key="item.name"
              :label="item.title"
              :name="item.name"
              class="tabs"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <div style="height: 20px"></div>
        <div style="height: 20px" class="prompt" v-if="prompt">
          该项目为仿http://shop.liulongbin.top/
          并进行进一步优化。
        </div>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
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
      collapse: false,
      tabslist: [],
      /* 当前 */
      tabsname: "",
      prompt: true,
      tabslists: [
        {
          path: "/users",
          cname: "用户列表",
          name: "users",
          index: 1
        },
        {
          path: "/roles",
          name: "roles",
          cname: "角色列表"
        },
        {
          path: "/categories",
          name: "categories",
          cname: "商品分类"
        },
        {
          path: "/params",
          name: "params",
          cname: "分类参数"
        },
        {
          path: "/goods",
          name: "goods",
          cname: "商品列表"
        },
        {
          path: "/orders",
          name: "orders",
          cname: "订单管理"
        },
        {
          path: "/reports",
          name: "reports",
          cname: "数据报表"
        },
        {
          path: "/rights",
          name: "rights",
          cname: "权限列表"
        }
      ]
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
    this.addtabs();
  },
  methods: {
    addTabs(items) {
      this.prompt = false;
      const a = this.tabslist.findIndex(element => {
        return element.title == items.authName;
      });
      if (a != -1) {
        return;
      }
      let paths = "/" + items.path;
      let titles = items.authName;
      let names = items.path;
      this.tabsname = items.path;
      // console.log(this.menusList);

      this.tabslist.push({
        path: paths,
        title: titles,
        name: names
      });
    },
    removeTab() {},
    addtabs() {
      if (this.$route.name == "home") {
        return;
      }
      const a = this.tabslists.findIndex(element => {
        return element.name == this.$route.name;
      });
      let paths = this.tabslists[a].path;
      let titles = this.tabslists[a].cname;
      let names = this.tabslists[a].name;
      this.tabsname = this.tabslists[a].name;

      this.tabslist.push({
        path: paths,
        title: titles,
        name: names
      });
      // console.log(this.tabslist);

      this.prompt = false;
    },
    /* 移除tabs */
    removeTab(targetName) {
      // console.log(this.$route.name);
      let tabs = this.tabslist;
      let activeName = this.tabsname;
      if (activeName == targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tab[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
              const a = this.tabslists.findIndex(element => {
                return element.name == activeName;
              });
              this.tabsname = nextTab.name;
              this.$router.push(this.tabslists[a].path);
              tabs.splice(index, 1);
            } else {
              this.tabsname = "";
              this.$router.push("/home");
              tabs.splice(index, 1);
            }
          }
        });
      } else {
        const a = this.tabslist.findIndex(element => {
          return element.name == targetName;
        });
        tabs.splice(a, 1);
      }
    },
    /* 改变路由 */
    changetab(targetName) {
      this.tabsname = targetName.name;
      let activeName = targetName.name;
      const a = this.tabslists.findIndex(element => {
        return element.name == activeName;
      });
      this.$router.push(this.tabslists[a].path);
    },
    outbnt() {
      this.$router.push("/login");
      window.sessionStorage.removeItem("token");
    }
  }
};
</script>

<style scoped>
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
  position: relative;
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
.navTop {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 21px;
  /* background-color: yellow; */
  border-bottom: 1px solid black;
}
.hh1 {
  display: inline-block;
  line-height: 60px;
  width: 200px;
  height: 100%;
  font-size: 24px;
}
.outbnt {
  position: absolute;
  top: 10px;
  right: 20px;
}
</style>
<style>
.navTop > .el-tabs__item,
.tabs,
.is-closable {
  height: 19px !important;
  line-height: 19px !important;
}
</style>