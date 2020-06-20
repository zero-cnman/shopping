<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 商品数据表 -->
    <el-card class="box-card">
      <el-button type="primary" @click="shoppingdialogopen">新增商品方式一</el-button>
      <el-button type="primary" @click="dialogRaddshoppingtwo=true">新增商品方式二</el-button>

      <!-- <div class="wride">{{this.txt}}</div> -->
      <el-table :data="goodsData" style="width: 100%">
        <el-table-column prop="goods_name" label="商品名称" width="800"></el-table-column>
        <!-- <el-table-column label="商品名称" width="800">
          <template v-slot="scope">
            <el-input-number
              v-model="scope.row.num"
              @change="handleChange(scope.row)"
              :min="1"
              :max="10"
              label="描述文字"
            ></el-input-number>
          </template>
        </el-table-column>-->
        <el-table-column prop="goods_price" label="价格" width="100"></el-table-column>
        <el-table-column prop="goods_number" label="数量" width="100"></el-table-column>
        <el-table-column prop="goods_weight" label="重量" width="100"></el-table-column>
        <el-table-column prop="goods_state" label="商品状态" width="180">
          <template v-slot="scope">
            <p>{{ scope.row.goods_state==0?'未通过':(scope.row.goods_state==1?'审核中':'未审核') }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="add_time" label="添加时间" :formatter="dateFormat" width="150"></el-table-column>
        <el-table-column label="操作" width="100">
          <template v-slot="scope">
            <el-button type="danger" size="mini" @click="deleteshop(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pagenum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 新增商品方式一的dialog -->
    <el-dialog title="收货地址" :visible.sync="dialogRaddshopping" width="70%" @close="shoppingClose">
      <el-steps :space="200" :active="tabname-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="shoppingForm"
        :rules="shoppingrules"
        ref="addOnlyatrbForm"
        label-width="100px"
        class="demo-ruleForm"
        style="margin-top:30px"
      >
        <!-- 左侧tabs -->
        <el-tabs
          tab-position="left"
          style="margin-top:30px"
          :before-leave="beforeTab"
          v-model="tabname"
          @tab-click="parameterClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="shoppingForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="shoppingForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="shoppingForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="shoppingForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <div class="block">
                <el-cascader
                  v-model="shoppingForm.category"
                  :options="tableData"
                  :props="{ expandTrigger: 'hover',children:'children',label:'cat_name',value:'cat_id'}"
                  @change="shoppingChange"
                ></el-cascader>
              </div>
            </el-form-item>
          </el-tab-pane>

          <!-- 商品参数页签 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="(item,index) in manyAttributesData" :key="index" class="tanle">
              <p>{{item.attr_name}}</p>
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="iten" v-for="(iten,index) in item.attr_vals" :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性页签 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="(item,index) in onlyAttributesData" :key="index" class="tanle">
              <p>{{item.attr_name}}</p>
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="iten" v-for="(iten,index) in item.attr_vals" :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="uploadpic"
              :headers="uphearder"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="shoppingForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="submitaddsForm" class="butadd">新增商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRaddshopping = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsData: [],
      pagenum: 1,
      pagesize: 2,
      total: 100,
      dialogRaddshopping: false,

      shoppingForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        category: [],
        /* 分类列表 */
        goods_cat: "",
        /* 图片 */
        pics: [],
        /* 介绍 */
        goods_introduce: "",
        /* 商品参数数组 */
        attrs: []
        // goods_state: ""
      },
      tableData: [],
      shoppingrules: {
        attr_vals: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur"
          }
        ],
        goods_name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur"
          }
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur"
          }
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: "blur"
          }
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品数量",
            trigger: "blur"
          }
        ]
      },
      tabname: 0,
      manyAttributesData: [],
      onlyAttributesData: [],
      uphearder: { Authorization: window.sessionStorage.getItem("token") },
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload"
    };
  },
  created() {
    this.aquery();

    // this.wrides(this.txt);
  },

  methods: {
    handleChange(value) {
      //   console.log(value);
    },
    /* 获取商品列表数据 */
    async aquery() {
      const { data: res } = await this.$http.get("goods", {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });

      if (res.meta.status !== 200) {
        return this.$message.error("数据获取失败,请重试");
      } else {
        // console.log(res);
        // res.data.goods.forEach(item => {
        //   item.num = ""; //必须要这样赋值
        // });
        this.goodsData = res.data.goods;
        this.total = res.data.total;
      }
    },
    dateFormat(row, column) {
      const date = row[column.property];
      if (date === undefined) {
        return "";
      }
      return this.$moment(date).format("YYYY-MM-DD HH:mm");
    },
    /* 查询条数 */
    handleSizeChange(val) {
      this.pagesize = val;
      this.aquery();
    },
    /* 查询页数 */
    handleCurrentChange(val) {
      this.pagenum = val;
      this.aquery();
    },
    /* 点击'新增商品方式一'弹框 并获取分类信息 */
    async shoppingdialogopen() {
      this.dialogRaddshopping = true;
      const { data: res } = await this.$http.get("/categories");
      if (res.meta.status != 200) {
        return this.$message.error("数据获取失败，请重新获取");
      } else {
        this.tableData = res.data;
      }
    },
    shoppingChange(value) {
      if (value.length !== 3) {
        this.shoppingForm.category = [];
        this.$message.error("请选择末级分类");
      }
    },
    /* tab跳转前验证 */
    beforeTab(activeName, oldActiveName) {
      if (this.shoppingForm.category.length == "0" && oldActiveName == 0) {
        this.$message.error("请选择商品分类");
        return false;
      }
    },
    shoppingClose() {
      this.tabname = "0";
      this.shoppingForm.category = [];
      this.manyAttributesData = [];
      this.onlyAttributesData = [];
    },

    async parameterClick() {
      /* 商品参数获取 */
      if (this.tabname == 1) {
        const { data: res } = await this.$http.get(
          `/categories/${this.shoppingForm.category[2]}/attributes`,
          {
            params: {
              sel: "many"
            }
          }
        );
        if (res.meta.status != 200) {
          return this.$message.error("数据获取失败，请重新获取");
        } else {
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
          });
          this.manyAttributesData = res.data;
          console.log(this.manyAttributesData);
        }
      } else if (this.tabname == 2) {
        const { data: res } = await this.$http.get(
          `/categories/${this.shoppingForm.category[2]}/attributes`,
          {
            params: {
              sel: "only"
            }
          }
        );
        if (res.meta.status != 200) {
          return this.$message.error("数据获取失败，请重新获取");
        } else {
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
          });
          this.onlyAttributesData = res.data;
          // console.log(this.onlyAttributesData);
        }
      }
    },
    handleOnlyClose(tag, index) {
      let attr_vals = tag.attr_vals;
      tag.attr_vals.splice(index, 1);
    },
    handleRemove(file, fileList) {
      const filedata = file.response.data.tmp_path;
      const i = this.shoppingForm.pics.findIndex(x => (x.pic = filedata));
      this.shoppingForm.pics.splice(i, 1);
    },
    handlePreview(file) {
      // console.log(file);
    },
    uploadpic(res) {
      const uploadpics = { pic: res.data.tmp_path };
      this.shoppingForm.pics.push(uploadpics);
    },
    /* 新增商品 */
    submitaddsForm() {
      this.$refs["addOnlyatrbForm"].validate(async valid => {
        if (!valid) {
          this.$message.error("请补全必填信息");
        } else {
          this.shoppingForm.goods_cat = this.shoppingForm.category.join(",");
          console.log(this.manyAttributesData);

          /* 处理attrs数组 */
          this.manyAttributesData.forEach(item => {
            const manyarr = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            };
            this.shoppingForm.attrs.push(manyarr);
          });
          this.onlyAttributesData.forEach(item => {
            const onlyarr = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            };
            this.shoppingForm.attrs.push(onlyarr);
          });
          console.log(this.shoppingForm);
          const { data: res } = await this.$http.post(
            "/goods",
            this.shoppingForm
          );
          console.log(res);

          if (res.meta.status !== 201) {
            return this.$message.error("新增商品失败，请重试");
          } else {
            this.aquery();
            console.log(this);

            this.$refs["addOnlyatrbForm"].clearValidate();
            this.$refs["addOnlyatrbForm"].resetFields();
            this.dialogRaddshopping = false;
          }
        }
      });
    },
    /* 删除商品 */
    async deleteshop(val) {
      this.$confirm("确认关闭？")
        .then(async _ => {
          console.log(val);

          const { data: res } = await this.$http.delete(
            `/goods/${val.goods_id}`
          );
          console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.errpr("删除失败，请重试");
          }
          this.aquery();
        })
        .catch(_ => {});
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
.wride {
  width: 500px;
  height: 30px;
  background-color: skyblue;
  margin: 10px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.tanle >>> .el-form-item__content {
  margin-left: 0 !important;
}
/* .tanle >>> .el-form-item__content >>> p {
  margin-block-end: 0 !important;
  margin-block-start: 0 !important;
}
p {
  margin-block-end: 5px !important;
  margin-block-start: 5px !important;
} */

.butadd {
  margin-top: 20px;
}
</style>