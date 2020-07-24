<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-button type="primary" @click="dialogFormVisible=true">添加角色</el-button>

      <el-table :data="rolesData" stripe style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="250"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="compileRole(scope.row)"
            >编辑</el-button>
            <el-button
              type="info"
              icon="el-icon-share"
              size="mini"
              @click="allotRole(scope.row)"
            >分配权限</el-button>
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
                @click="deleteRole(scope.row.id)"
              >删除</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色dialog -->
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form :model="addRolesform" :rules="addRolesRoles" ref="addRoleform">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesform.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesform.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles('addRoleform')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改角色信息dialog -->
    <el-dialog title="角色信息" :visible.sync="dialogamendRoles" @close="closedialog">
      <el-form :model="addRolesform" :rules="amendRolesRoles" ref="amendRoleform">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesform.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesform.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogamendRoles = false">取 消</el-button>
        <el-button type="primary" @click="compileRolesz('amendRoleform')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑角色权限dialog -->
    <el-dialog title="分配权限" :visible.sync="dialogcompileRoles" @close="closedialog()">
      <!-- @node-click="handleNodeClick" -->
      <el-tree
        :data="permissionsData"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        :default-checked-keys="treeid"
        ref="rightsTree"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogcompileRoles = false">取 消</el-button>
        <el-button type="primary" @click="compileRoles()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>



<script scoped>
export default {
  data() {
    return {
      rolesData: [] /* 角色信息 */,
      permissionsData: [] /* 所有权限 */,
      treeid: [] /* 角色拥有的权限 */,

      addRolesform: {
        roleName: "",
        roleDesc: "",
        roleId: ""
      },
      dialogFormVisible: false,
      dialogamendRoles: false,
      dialogcompileRoles: false,
      addRolesRoles: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ]
      },
      amendRolesRoles: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ]
      },
      defaultProps: {
        children: "children",
        label: "authName"
      }
    };
  },
  created() {
    this.acquirePermissionsList();
    this.acquireRoleList();
  },
  methods: {
    /* 获取权限列表 */
    async acquirePermissionsList() {
      const { data: res } = await this.$http.get("rights/tree");

      if (res.meta.status != 200)
        return this.$message.error("权限获取失败请重试");
      this.permissionsData = res.data;
    },
    /* 获取角色及角色拥有的权限列表 */
    async acquireRoleList() {
      const { data: res } = await this.$http.get("roles");

      if (res.meta.status != 200)
        return this.$message.error("权限获取失败请重试");
      this.rolesData = res.data;
    },
    /* 添加角色 */
    addRoles(addRoleform) {
      this.$refs[addRoleform].validate(async valid => {
        if (!valid) {
          return false;
        } else {
          const { data: res } = await this.$http.post(
            "/roles",
            this.addRolesform
          );
          if (res.meta.status != 201) {
            return this.$message.error("添加角色失败，请重新尝试");
          } else {
            this.$message.success("添加角色成功");
            this.acquireRoleList();
            this.dialogFormVisible = false;
            this.$refs[addRoleform].resetFields();
          }
        }
      });
    },

    /* 删除角色 */
    async deleteRole(roleid) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`roles/${roleid}`);
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
            this.acquireRoleList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /* 点击编辑，进行角色编辑 */
    compileRole(rolesRow) {
      this.dialogamendRoles = true;
      this.addRolesform.roleName = rolesRow.roleName;
      this.addRolesform.roleDesc = rolesRow.roleDesc;
      this.addRolesform.roleId = rolesRow.id;
    },

    /* 点击确定，提交角色编辑后的信息 */
    compileRolesz(amendRoleform) {
      this.$refs[amendRoleform].validate(async valid => {
        if (!valid) {
          return false;
        } else {
          const { data: res } = await this.$http.put(
            `/roles/${this.addRolesform.roleId}`,
            this.addRolesform
          );
          if (res.meta.status != 200) {
            return this.$message.error("角色修改失败，请重新尝试");
          } else {
            this.$message.success("修改角色成功");
            this.acquireRoleList();
            this.dialogamendRoles = false;
            this.$refs[amendRoleform].resetFields();
          }
        }
      });
    },

    /* 打开分配权限dialog */
    allotRole(scope) {
      this.checkRole(scope.children); /* 获取当前角色下拥有哪些权限 */

      /* 收起tree */

      this.$nextTick(() => {
        this.$refs.rightsTree.setCheckedKeys(this.treeid);
        console.log(this.$refs.rightsTree);
        for (
          var i = 0;
          i < this.$refs.rightsTree.store._getAllNodes().length;
          i++
        ) {
          this.$refs.rightsTree.store._getAllNodes()[
            i
          ].expanded = this.isexpand;
        }
      });
      this.addRolesform.roleId = scope.id;

      this.dialogcompileRoles = true;
    },
    /* 默认勾选的递归函数 */
    checkRole(val) {
      for (let i = 0; i < val.length; i++) {
        if (!val[i].children) {
          this.treeid.push(val[i].id);
        } else {
          this.checkRole(val[i].children);
        }
      }
    },

    /* 角色权限分配提交 */
    async compileRoles() {
      const treeIdList = [
        ...this.$refs.rightsTree.getCheckedKeys(),
        ...this.$refs.rightsTree.getHalfCheckedKeys()
      ];
      const treeIdString = treeIdList.join(",");

      const { data: res } = await this.$http.post(
        `roles/${this.addRolesform.roleId}/rights`,
        {
          rids: treeIdString
        }
      );
      console.log(res);

      if (res.meta.status != 200)
        return this.$message.error("更新权限失败，请重试");
      this.$message.success("更新成功");
      this.dialogcompileRoles = false;
      this.acquireRoleList();
    },

    /* close回调 */
    closedialog() {
      this.treeid = [];
    }
  }
};
</script>

<style scoped>
.box-card {
  margin-top: 20px;
}
</style>