<template>
  <div class="elcat">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- <el-button>获取</el-button> -->
      <el-button type="danger" icon="el-icon-share" size="mini" @click="dialogaddOneCatM()">新增一级类</el-button>
      <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="cat_id"
        border
        :default-expand-all="false"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="cat_name" label="分类名称" sortable width="180"></el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效" sortable width="180">
          <template v-slot="scope">
            <p>{{ scope.row.cat_deleted==false?"有效":"无效" }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="dialogamendCatM(scope.row)"
            >编辑</el-button>
            <el-button
              type="info"
              icon="el-icon-delete"
              size="mini"
              @click="dialogdeleteCatM(scope.row)"
            >删除</el-button>
            <el-button
              type="danger"
              icon="el-icon-share"
              size="mini"
              v-show="scope.row.cat_level==2?false:true"
              @click="dialogaddCatM(scope.row)"
            >新增子类</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pagenum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 分页 -->

    <!-- 新增分类得到dialog -->
    <el-dialog title="提示" :visible.sync="dialogaddCat" width="70%" @close="dialogClose()">
      <el-form
        :model="addCatForm"
        :rules="addrules"
        ref="addCatForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCatForm.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogaddCat = false">取 消</el-button>
        <el-button type="primary" @click="addCatM('addCatForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类 -->
    <el-dialog title="提示" :visible.sync="dialogamendCat" width="70%" @close="dialogamendClose">
      <el-form
        :model="amendCatForm"
        :rules="addrules"
        ref="amendCatForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="amendCatForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogaddCat = false">取 消</el-button>
        <el-button type="primary" @click="amendCatM('amendCatForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /*当前页码 */
      pagenum: 1,
      /* 查询条数 */
      pagesize: 5,
      total: 0,
      tableData: [],
      dialogaddCat: false,
      addCatForm: {
        cat_pid: "",
        cat_name: "",
        cat_level: ""
      },
      cat_name: "",
      addrules: {
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur"
          }
        ]
      },
      dialogamendCat: false,
      amendCatForm: {
        cat_id: "",
        cat_name: ""
      }
    };
  },
  created() {
    this.a();
  },
  methods: {
    /* 获取分类数据 */
    async a() {
      const { data: res } = await this.$http.get("/categories", {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      if (res.meta.status != 200) {
        return this.$message.error("数据获取失败，请重新获取");
      } else {
        // console.log(res);
        this.total = res.data.total;
        this.tableData = res.data.result;
      }
    },
    /* 新增分类，基础数据赋值 */
    dialogaddCatM(val) {
      this.dialogaddCat = true;
      this.addCatForm.cat_pid = val.cat_id;
      this.addCatForm.cat_level = val.cat_level + 1;
      console.log(this.addCatForm.cat_pid);
      console.log(this.addCatForm.cat_level);
    },
    /* 新增分类 */
    addCatM(val) {
      this.$refs[val].validate(async valid => {
        if (!valid) {
          return false;
        } else {
          const { data: res } = await this.$http.post("/categories", {
            cat_pid: this.addCatForm.cat_pid,
            cat_name: this.addCatForm.cat_name,
            cat_level: this.addCatForm.cat_level
          });
          if (res.meta.status != 201) {
            console.log(res);
            return this.$message.error("数据新增失败，请重新新增");
          } else {
            console.log(res);
            this.$message.success("数据新增成功");
            this.dialogaddCat = false;
            this.a();
            this.addCatForm.cat_pid = "";
            this.addCatForm.cat_level = "";
            this.$refs[val].resetFields();
          }
        }
      });
    },
    /* dialog关闭，清除缓存 */
    dialogClose() {
      this.addCatForm.cat_pid = "";
      this.addCatForm.cat_level = "";
      this.$refs["addCatForm"].resetFields();
    },
    /* dialog一级新增基础数据赋值 */
    dialogaddOneCatM() {
      this.addCatForm.cat_pid = 0;
      this.addCatForm.cat_level = 0;
      this.dialogaddCat = true;
    },
    /* 删除分类 */
    dialogdeleteCatM(val) {
      this.$confirm("确认删除？")
        .then(async _ => {
          const { data: res } = await this.$http.delete(
            `/categories/${val.cat_id}`
          );
          if (res.meta.status != 200) {
            console.log(res);
            return this.$message.error("数据删除失败，请重新尝试");
          } else {
            console.log(res);
            this.$message.success("数据删除成功");
            this.a();
          }
        })
        .catch(_ => {});
    },
    /* 修改分类，基础数据赋值 */
    dialogamendCatM(val) {
      this.dialogamendCat = true;
      this.amendCatForm.cat_name = val.cat_name;
      this.amendCatForm.cat_id = val.cat_id;
    },
    /* 修改分类名称 */
    amendCatM(val) {
      console.log(val);
      console.log(this.amendCatForm.cat_id);

      this.$refs[val].validate(async valid => {
        if (!valid) {
          return false;
        } else {
          const { data: res } = await this.$http.put(
            `categories/${this.amendCatForm.cat_id}`,
            {
              cat_name: this.amendCatForm.cat_name
            }
          );
          if (res.meta.status != 200) {
            console.log(res);
            return this.$message.error("数据修改失败，请重新修改");
          } else {
            console.log(res);
            this.$message.success("数据修改成功");
            this.dialogamendCat = false;
            this.a();
            this.amendCatForm.cat_pid = "";
            this.amendCatForm.cat_name = "";
            this.$refs[val].resetFields();
          }
        }
      });
    },
    dialogamendClose() {
      this.amendCatForm.cat_pid = "";
      this.amendCatForm.cat_name = "";
      this.$refs["amendCatForm"].resetFields();
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.a();
    },
    /* 查询页数 */
    handleCurrentChange(val) {
      this.pagenum = val;
      this.a();
    }
  }
};
</script>

<style scoped>
.box-card {
  margin-top: 20px;
  /* overflow: scroll; */
}
</style>