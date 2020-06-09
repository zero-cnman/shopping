<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="usersSearch" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="queryUsers()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 添加用户的dialog -->
      <el-dialog title="新增用户" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
        <el-form
          :model="usersForm"
          :rules="usersRules"
          ref="usersForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名称" prop="username" name="username">
            <el-input v-model="usersForm.username"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password" name="password">
            <el-input v-model="usersForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" name="email">
            <el-input v-model="usersForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile" name="mobile">
            <el-input v-model="usersForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogClose">取 消</el-button>
          <el-button type="primary" @click="dialogAddUsers">确 定</el-button>
        </span>
      </el-dialog>
      <!-- table数据 -->
      <el-table :data="usersData" stripe style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="username" label="用户名" width="180"></el-table-column>
        <el-table-column prop="role_name" label="权限名称" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="250"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="180">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeSwitch(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="400">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button
              type="info"
              icon="el-icon-share"
              size="mini"
              @click="acquireRoleList(scope.row)"
            >分配角色</el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteUsers(scope.row.id)"
              >删除</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->

      <el-pagination
        :current-page="currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 分配权限dialog -->
    <el-dialog title="收货地址" :visible.sync="dialogRoleVisible" @close="closeRloe">
      <el-form :model="roleForm">
        <p>用户名： {{roleForm.usersname}}</p>
        <p>原角色名： {{roleForm.rolename}}</p>

        <el-form-item label="活动区域">
          <el-select v-model="queryRolesData" placeholder="请选择新的角色">
            <el-option
              v-for="item in rolesData"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script scoped>
export default {
  data() {
    var emailvalidation = (rule, value, callback) => {
      if (value === "") {
        callback();
      } else {
        var emails = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (!emails.test(value)) {
          callback(new Error("邮箱格式有误，请重新输入"));
        }
        callback();
      }
    };
    var mobilevalidation = (rule, value, callback) => {
      if (value === "") {
        callback();
      } else {
        var emails = /^1[3456789]\d{9}$/;
        if (!emails.test(value)) {
          callback(new Error("手机格式有误，请重新输入"));
        }
        callback();
      }
    };

    return {
      usersSearch: "",
      usersData: [],
      changeSwitchvalue: "",
      dialogVisible: false,
      dialogRoleVisible: false,
      input2: "",
      usersForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      roleForm: {
        rolename: "",
        usersname: "",
        usersID: ""
      },
      /*当前页码 */
      currentPage: 1,
      /* 查询条数 */
      pagesize: 2,
      total: 0,
      usersRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        email: [{ validator: emailvalidation, trigger: "blur" }],
        mobile: [{ validator: mobilevalidation, trigger: "blur" }]
      },
      rolesData: [],
      queryRolesData: ""
    };
  },
  created() {
    this.acquiresUsers();
  },
  methods: {
    /* 修改用户状态 */
    changeSwitch(value) {
      this.changeSwitchvalue = value.mg_state;
      this.$http({
        url: `/users/${value.id}/state/${this.changeSwitchvalue}`,
        method: "put"
      })
        .then(res => {
          if (res.data.meta.status !== 200)
            return this.$message.error("数据修改失败");
        })
        .catch(err => {
          this.$message.error("服务器繁忙,修改状态失败，请稍后重试");
        });
    },
    /* 获取用户列表 */
    acquiresUsers() {
      this.$http({
        url: "/users",
        method: "get",
        params: {
          query: this.usersSearch,
          pagenum: this.currentPage /* 页码 */,
          pagesize: this.pagesize /* 条数 */
        }
      })
        .then(res => {
          if (res.data.meta.status !== 200)
            return this.$message.error("数据获取失败");

          this.usersData = res.data.data.users;
          this.total = res.data.data.total;
        })
        .catch(err => {
          this.$message.error("服务器繁忙，请稍后重试");
        });
    },
    /* 删除用户的提示 */
    open() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /* dialog关闭X提示 */
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
          this.$refs["usersForm"].resetFields();
        })
        .catch(_ => {});
    },
    /*  dialog关闭取消按钮的提示 */
    dialogClose() {
      this.dialogVisible = false;
      this.$refs["usersForm"].resetFields();
    },
    /* 新增用户 */
    dialogAddUsers() {
      this.$refs["usersForm"].validate(async valid => {
        if (!valid) return false;
        const { data: res } = await this.$http.post("users", this.usersForm);
        if (res.meta.status === 400 && res.meta.msg === "用户名已存在") {
          console.log(res);
          return this.$message.error("用户名已存在，请使用其他用户名");
        } else if (res.meta.status !== 201) {
          return this.$message.error("新增用户失败，请重新尝试");
        }
        this.$message.success("新增用户成功");
        this.dialogVisible = false;

        this.$refs["usersForm"].resetFields();
        this.acquiresUsers();
        // console.log(this.usersForm.username);

        // await this.$http({
        //   url: "users",
        //   method: "post",
        //   params: this.usersForm,
        //   contentTypeString: "application/Json"
        // })
        //   .then(res => {
        //     console.log(this.usersForm.username);
        //     console.log(res);

        //     if (res.data.meta.status !== 201)
        //       return this.$message.error("数据新增失败，请重新尝试");
        //     this.$message.success("数据新增成功");
        //     this.dialogVisible = false;
        //     this.$refs["usersForm"].resetFields();
        //     this.acquiresUsers();
        //   })
        //   .catch(err => {
        //     this.$message.error("服务器繁忙,修改状态失败，请稍后重试");
        //   });
      });
    },
    /* 删除用户 */
    deleteUsers(usersid) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`users/${usersid}`);
          if (res.meta.status != 200) {
            this.$message({
              type: "success",
              message: "删除失败!"
            });
          } else {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.acquiresUsers();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /* 查询条数 */
    handleSizeChange(val) {
      this.pagesize = val;
      this.acquiresUsers();
    },
    /* 查询页数 */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.acquiresUsers();
    },
    /* 查询用户 */
    queryUsers() {
      this.currentPage = 1;
      this.acquiresUsers();
    },
    /* 分配角色 */
    submitRole() {},
    /* 获取角色列表 */
    async acquireRoleList(val) {
      this.dialogRoleVisible = true;
      this.roleForm.rolename = val.role_name;
      this.roleForm.usersname = val.username;
      this.roleForm.usersID = val.id;

      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200)
        return this.$message.error("权限获取失败请重试");
      this.rolesData = res.data;
      console.log(this.rolesData);
    },
    closeRloe() {
      this.queryRolesData = "";
    },
    async submitRole() {
      /* 当前行的用户id就是this.roleForm.usersID */
      /* 新配置的角色id就是this.queryRolesData */
      if (!this.queryRolesData) {
        return this.$message.error("请选择角色");
      } else {
        const { data: res } = await this.$http.put(
          `users/${this.roleForm.usersID}/role`,
          {
            rid: this.queryRolesData
          }
        );
        console.log(res);
        if (res.meta.status != 200) {
          return this.$message.error("更新角色失败，请重试");
        } else {
          this.$message.success("更新角色成功");
          this.dialogRoleVisible = false;
          this.acquiresUsers();
        }
      }
    }
  }
};
</script>

<style scoped>
.box-card {
  margin-top: 20px;
}
.el-dialog .el-dialog__body .el-form {
  margin-top: 0;
}
</style>