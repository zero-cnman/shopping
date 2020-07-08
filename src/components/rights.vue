<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card"></el-card>
    <el-table :data="roleslist" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="280"></el-table-column>
      <el-table-column prop="level" label="权限等级" width="180">
        <template v-slot="scope">
          <div
            :style="{color:(scope.row.level==0?'orange':(scope.row.level==1?'green':'#158bb8')),backgroundColor:(scope.row.level==0?'orange':(scope.row.level==1?'green':'#158bb8'))}"
            class="divf"
          >{{scope.row.level==0?'一级':(scope.row.level==1?'二级':'三级')}}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleslist: []
    };
  },

  created() {
    this.acquire();
  },
  methods: {
    async acquire() {
      const { data: res } = await this.$http.get(`/rights/list`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失请，请刷新页面");
      }
      this.roleslist = res.data;
    }
  }
};
</script>

<style scoped>
.box-card {
  margin-top: 20px;
}
.divf {
  text-align: center;
  border-radius: 5px;
  width: 45px;

  border: 1px solid;
}
/* :style="{color:(scope.row.level==0?'orange':(scope.row.level==1?'green':'blue')),
            }" */
/* :type="(scope.row.level==0?'primary':(scope.row.level==1?'success':'warning'))" */
</style>

