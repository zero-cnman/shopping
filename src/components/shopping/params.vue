<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <div class="block">
        <span class="demonstration">请选择商品分类：</span>
        <el-cascader
          v-model="optionsdata"
          :options="tableData"
          :props="{ expandTrigger: 'hover',value:'cat_id',children:'children',label:'cat_name'}"
          @change="handleChange"
        ></el-cascader>
      </div>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态属性 -->
        <el-tab-pane label="动态属性" name="many">
          <el-button
            type="primary"
            size="mini"
            @click="selDataID?dialogaddManyatrb=true:$message.error('请选择商品分类')"
          >添加属性</el-button>
          <!-- 新增动态属性dialog -->
          <el-dialog
            title="提示"
            :visible.sync="dialogaddManyatrb"
            width="70%"
            @close="dialogaddManyatrbClose"
          >
            <el-form
              :model="addManyatrbForm"
              :rules="addrules"
              ref="addManyatrbForm"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="分类名称" prop="attr_vals">
                <el-input v-model="addManyatrbForm.attr_vals"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogaddManyatrb = false">取 消</el-button>
              <el-button type="primary" @click="addManyatrb('addManyatrbForm')">确 定</el-button>
            </span>
          </el-dialog>

          <!-- table数据 -->
          <el-table :data="manyAttributesData" style="width: 100%">
            <!-- 动态属性下拉tag属性 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  :key="tag"
                  v-for="(tag,index) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleManyClose(scope.row,index)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputManyConfirm(scope.row)"
                  @blur="handleInputManyConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" width="80"></el-table-column>
            <el-table-column prop="attr_name" label="属性名" width="380"></el-table-column>
            <el-table-column label="操作" width="220">
              <template v-slot="scope">
                <el-button
                  class="input-new-tag"
                  type="primary"
                  size="small"
                  @click="dialogamendclick(scope.row)"
                >修改</el-button>

                <!-- 修改的dialog -->
                <el-dialog
                  title="提示"
                  :visible.sync="dialogamendManyatrb"
                  width="70%"
                  @close="dialogamendManyatrbClose"
                >
                  <el-form
                    :model="amendManyatrbForm"
                    :rules="addrules"
                    ref="amendManyatrbForm"
                    label-width="100px"
                    class="demo-ruleForm"
                  >
                    <el-form-item label="分类名称" prop="attr_name">
                      <el-input v-model="amendManyatrbForm.attr_name"></el-input>
                    </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogaddManyatrb = false">取 消</el-button>
                    <el-button type="primary" @click="amendManyatrb('amendManyatrbForm')">确 定</el-button>
                  </span>
                </el-dialog>

                <el-button
                  class="input-new-tag"
                  v-model="scope.row.inputValue"
                  type="danger"
                  size="small"
                  @click="deleteManyatrb(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            @click="selDataID?dialogaddOnlyatrb=true:$message.error('请选择商品分类')"
          >添加属性</el-button>
          <!-- 新增静态属性dialog -->
          <el-dialog
            title="提示"
            :visible.sync="dialogaddOnlyatrb"
            width="70%"
            @close="dialogaddOnlyatrbClose"
          >
            <el-form
              :model="addOnlyatrbForm"
              :rules="addrules"
              ref="addOnlyatrbForm"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="分类名称" prop="attr_vals">
                <el-input v-model="addOnlyatrbForm.attr_vals"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogaddOnlyatrb = false">取 消</el-button>
              <el-button type="primary" @click="addOnlyatrb('addOnlyatrbForm')">确 定</el-button>
            </span>
          </el-dialog>

          <!-- table数据 -->
          <el-table :data="onlyAttributesData" style="width: 100%">
            <!-- 动态属性下拉tag属性 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  :key="tag"
                  v-for="(tag,index) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleOnlyClose(scope.row,index)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputOnlyConfirm(scope.row)"
                  @blur="handleInputOnlyConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" width="80"></el-table-column>
            <el-table-column prop="attr_name" label="属性名" width="380"></el-table-column>
            <el-table-column label="操作" width="220">
              <template v-slot="scope">
                <el-button
                  class="input-new-tag"
                  type="primary"
                  size="small"
                  @click="dialogamendclick(scope.row)"
                >修改</el-button>

                <!-- 修改的dialog -->
                <el-dialog
                  title="提示"
                  :visible.sync="dialogamendManyatrb"
                  width="70%"
                  @close="dialogamendManyatrbClose"
                >
                  <el-form
                    :model="amendManyatrbForm"
                    :rules="addrules"
                    ref="amendManyatrbForm"
                    label-width="100px"
                    class="demo-ruleForm"
                  >
                    <el-form-item label="分类名称" prop="attr_name">
                      <el-input v-model="amendManyatrbForm.attr_name"></el-input>
                    </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogaddManyatrb = false">取 消</el-button>
                    <el-button type="primary" @click="amendOnlyatrb('amendManyatrbForm')">确 定</el-button>
                  </span>
                </el-dialog>

                <el-button
                  class="input-new-tag"
                  v-model="scope.row.inputValue"
                  type="danger"
                  size="small"
                  @click="deleteManyatrb(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      optionsdata: "",
      tableData: [],
      /* 级联的分类ID */
      selDataID: "",
      activeName: "many",
      /* 首次查询的时候，默认是动态属性 */
      selData: "many",
      /* 动态属性 */
      manyAttributesData: [],
      /* 静态属性 */
      onlyAttributesData: [],

      addManyatrbForm: {
        attr_vals: ""
      },
      shoppingrules: {
        attr_vals: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur"
          }
        ],
        attr_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur"
          }
        ]
      },
      dialogaddManyatrb: false,
      addOnlyatrbForm: {
        attr_vals: ""
      },
      dialogaddOnlyatrb: false,
      dialogamendManyatrb: false,
      amendManyatrbForm: {
        attr_name: "",
        attr_id: ""
      }

      // @close="dialogamendClose"
    };
  },
  created() {
    this.a();
  },
  methods: {
    async a() {
      const { data: res } = await this.$http.get("/categories");
      if (res.meta.status != 200) {
        return this.$message.error("数据获取失败，请重新获取");
      } else {
        this.total = res.data.total;
        this.tableData = res.data;
        // console.log(this.tableData);
      }
    },

    /* 获取属性数据 */
    async acquirelist() {
      const { data: res } = await this.$http.get(
        `/categories/${this.selDataID}/attributes`,
        {
          params: {
            sel: this.selData
          }
        }
      );

      if (res.meta.status != 200) {
        return this.$message.error("数据获取失败，请重新获取");
      } else {
        res.data.forEach(item => {
          item.inputVisible = false;
          item.inputValue = "";
          item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
        });
        if (this.selData == "many") {
          this.manyAttributesData = res.data;
        } else {
          this.onlyAttributesData = res.data;
        }
      }
    },
    /* 在改变级联列表的时候进行数据申请 */
    handleChange(value) {
      // console.log(value[2]);
      this.selDataID = value[2];
      if (value.length !== 3) {
        this.optionsdata = [];
      } else {
        this.acquirelist();
      }
    },
    /* 改变tab栏时进行不同属性间的数据的切换 */
    handleClick(tab, event) {
      this.selData = tab.name;
      if (!this.optionsdata) {
        return;
      } else {
        this.acquirelist();
      }
    },
    /* 新增动态属性 */
    async addManyatrb() {
      const { data: res } = await this.$http.post(
        `/categories/${this.selDataID}/attributes`,
        {
          attr_name: this.addManyatrbForm.attr_vals,
          attr_sel: "many"
        }
      );

      if (res.meta.status != 201) {
        return this.$message.error("数据新增失败，请重新尝试");
      } else {
        this.$refs["addManyatrbForm"].resetFields();
        this.dialogaddManyatrb = false;
        this.acquirelist();
      }
    },
    /* 关闭addmanydialog框的清除缓存动作 */
    dialogaddManyatrbClose() {
      this.$refs["addManyatrbForm"].resetFields();
    },
    /* 新增静态属性 */
    async addOnlyatrb() {
      const { data: res } = await this.$http.post(
        `/categories/${this.selDataID}/attributes`,
        {
          attr_name: this.addOnlyatrbForm.attr_vals,
          attr_sel: "only"
        }
      );

      if (res.meta.status != 201) {
        return this.$message.error("数据新增失败，请重新尝试");
      } else {
        this.$refs["addOnlyatrbForm"].resetFields();
        this.dialogaddOnlyatrb = false;
        this.acquirelist();
      }
    },
    /* 关闭addmanydialog框的清除缓存动作 */
    dialogaddOnlyatrbClose() {
      this.$refs["addManyatrbForm"].resetFields();
    },
    /* 动态属性tag的函数 */
    async handleManyClose(tag, index) {
      let attr_vals = tag.attr_vals;
      tag.attr_vals.splice(index, 1);
      const { data: res } = await this.$http.put(
        `categories/${this.selDataID}/attributes/${tag.attr_id}`,
        {
          attr_name: tag.attr_name,
          attr_sel: "many",
          attr_vals: attr_vals.join(",")
        }
      );
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("新增属性失败,请重试");
      } else {
        this.$message.success("删除属性成功");
        tag.attr_vals = attr_vals;
        tag.inputVisible = false;
      }
    },

    showInput(row) {
      row.inputVisible = true;

      this.$nextTick(() => {
        this.$refs["saveTagInput"].$refs.input.focus();
      });
    },
    /* 新增下拉属性 */
    async handleInputManyConfirm(val) {
      let inputValue = val.inputValue;
      let attr_vals = val.attr_vals;
      console.log(val);

      if (inputValue) {
        attr_vals.push(inputValue);
        const { data: res } = await this.$http.put(
          `categories/${this.selDataID}/attributes/${val.attr_id}`,
          {
            attr_name: val.attr_name,
            attr_sel: "many",
            attr_vals: attr_vals.join(",")
          }
        );
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("新增属性失败,请重试");
        } else {
          this.$message.success("新增属性成功");
          val.attr_vals = attr_vals;
          val.inputVisible = false;
          val.inputValue = "";
        }
      }
    },

    /* 静态属性tag得函数 */
    async handleOnlyClose(tag, index) {
      let attr_vals = tag.attr_vals;
      tag.attr_vals.splice(index, 1);
      const { data: res } = await this.$http.put(
        `categories/${this.selDataID}/attributes/${tag.attr_id}`,
        {
          attr_name: tag.attr_name,
          attr_sel: "only",
          attr_vals: attr_vals.join(",")
        }
      );
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("新增属性失败,请重试");
      } else {
        this.$message.success("删除属性成功");
        tag.attr_vals = attr_vals;
        tag.inputVisible = false;
      }
    },

    // showInput(row) {
    //   row.inputVisible = true;
    //   this.$nextTick(() => {
    //     this.$refs["saveTagInput"].$refs.input.focus();
    //   });
    // },

    /* 新增下拉属性 */
    async handleInputOnlyConfirm(val) {
      let inputValue = val.inputValue;
      let attr_vals = val.attr_vals;
      console.log(val);

      if (inputValue) {
        attr_vals.push(inputValue);
        const { data: res } = await this.$http.put(
          `categories/${this.selDataID}/attributes/${val.attr_id}`,
          {
            attr_name: val.attr_name,
            attr_sel: "only",
            attr_vals: attr_vals.join(",")
          }
        );
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("新增属性失败,请重试");
        } else {
          this.$message.success("新增属性成功,请重试");
          val.attr_vals = attr_vals;
          val.inputVisible = false;
          val.inputValue = "";
        }
      }
    },

    /* 动态属性修改 */
    dialogamendclick(val) {
      this.dialogamendManyatrb = true;
      console.log(val);
      this.amendManyatrbForm.attr_name = val.attr_name;
      this.amendManyatrbForm.attr_id = val.attr_id;
      console.log(this.amendManyatrbForm.attr_name);
    },
    dialogamendManyatrbClose() {
      this.$refs["amendManyatrbForm"].resetFields();
    },
    async amendManyatrb() {
      if (this.amendManyatrbForm.attr_name) {
        const { data: res } = await this.$http.put(
          `categories/${this.selDataID}/attributes/${this.amendManyatrbForm.attr_id}`,
          {
            attr_name: this.amendManyatrbForm.attr_name,
            attr_sel: "many"
          }
        );
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("修改属性失败,请重试");
        } else {
          this.$message.success("修改属性成功");
          this.acquirelist();
          this.$refs["amendManyatrbForm"].resetFields();
          this.dialogamendManyatrb = false;
        }
      }
    },
    /* 删除动态属性 */
    deleteManyatrb(row) {
      this.amendManyatrbForm.attr_id = row.attr_id;
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `categories/${this.selDataID}/attributes/${this.amendManyatrbForm.attr_id}`
          );
          console.log(res);
          if (res.meta.status != 200) {
            return this.$message.error("删除失败，请重新尝试");
          } else {
            this.acquirelist();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    /* 静态属性修改 */
    dialogamendclick(val) {
      this.dialogamendManyatrb = true;
      console.log(val);
      this.amendManyatrbForm.attr_name = val.attr_name;
      this.amendManyatrbForm.attr_id = val.attr_id;
      console.log(this.amendManyatrbForm.attr_name);
    },
    dialogamendManyatrbClose() {
      this.$refs["amendManyatrbForm"].resetFields();
    },
    async amendOnlyatrb() {
      if (this.amendManyatrbForm.attr_name) {
        const { data: res } = await this.$http.put(
          `categories/${this.selDataID}/attributes/${this.amendManyatrbForm.attr_id}`,
          {
            attr_name: this.amendManyatrbForm.attr_name,
            attr_sel: "many"
          }
        );
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("修改属性失败,请重试");
        } else {
          this.$message.success("修改属性成功");
          this.acquirelist();
          this.$refs["amendManyatrbForm"].resetFields();
          this.dialogamendManyatrb = false;
        }
      }
    },
    /* 删除动态属性 */
    deleteManyatrb(row) {
      this.amendManyatrbForm.attr_id = row.attr_id;
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `categories/${this.selDataID}/attributes/${this.amendManyatrbForm.attr_id}`
          );
          console.log(res);
          if (res.meta.status != 200) {
            return this.$message.error("删除失败，请重新尝试");
          } else {
            this.acquirelist();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style scoped>
.box-card {
  margin-top: 20px;
  min-width: 1000px;
  /* overflow: scroll; */
}
.el-tabs {
  margin-top: 20px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>