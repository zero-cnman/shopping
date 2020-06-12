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
            <p>{{ scope.row.goods_state==0?'未通过':(scope.row.goods_state==1?'审核中':已审核) }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="add_time" label="添加时间" :formatter="dateFormat" width="150"></el-table-column>
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

      <el-tabs
        tab-position="left"
        style="margin-top:30px"
        :before-leave="beforeTab"
        v-model="tabname"
        @tab-click="parameterClick"
      >
        <el-tab-pane label="基本信息" name="0">
          <el-form
            :model="shoppingForm"
            :rules="shoppingrules"
            ref="addOnlyatrbForm"
            label-width="100px"
            class="demo-ruleForm"
            style="margin-top:30px"
          >
            <el-form-item label="商品名称" prop="attr_vals">
              <el-input v-model="shoppingForm.name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="attr_vals">
              <el-input v-model="shoppingForm.price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="attr_vals">
              <el-input v-model="shoppingForm.weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="attr_vals">
              <el-input v-model="shoppingForm.quantity"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="attr_vals">
              <div class="block">
                <el-cascader
                  v-model="shoppingForm.category"
                  :options="tableData"
                  :props="{ expandTrigger: 'hover',children:'children',label:'cat_name',value:'cat_id'}"
                  @change="shoppingChange"
                ></el-cascader>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 商品参数页签 -->
        <el-tab-pane label="商品参数" name="1">
          商品参数
          <el-table :data="manyAttributesData" style="width: 100%">
            <!-- 动态属性下拉tag属性 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  :key="tag"
                  v-for="tag in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                >{{tag}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column type="index" width="80"></el-table-column>
            <el-table-column prop="attr_name" label="属性名" width="380"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
        <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
        <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRaddshopping = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
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
        name: "",
        price: "",
        weight: "",
        quantity: "",
        category: []
      },
      tableData: [],
      shoppingrules: {
        attr_vals: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur"
          }
        ]
      },
      tabname: 0,
      manyAttributesData: [],
      onlyAttributesData: []
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
    },
    async parameterClick() {
      console.log(1);
      console.log(this.shoppingForm.category[2]);
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
      }
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
</style>