<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-table :data="ordersData" style="width: 100%">
        <el-table-column prop="order_number" label="订单编号" width="250"></el-table-column>
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
        <el-table-column prop="order_price" label="订单价格" width="100"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="100">
          <template v-slot="scope">
            <p>{{ scope.row.order_pay==0?'未付款':'已付款'}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100"></el-table-column>
        <!-- <el-table-column prop="goods_state" label="商品状态" width="180">
          <template v-slot="scope">
            <p>{{ scope.row.goods_state==0?'未通过':(scope.row.goods_state==1?'审核中':'未审核') }}</p>
          </template>
        </el-table-column>-->
        <el-table-column prop="create_time" label="添加时间" :formatter="dateFormat" width="150"></el-table-column>
        <el-table-column label="操作" width="200">
          <template v-slot="scope">
            <el-button type="success" size="mini" @click="logisticstree(scope.row)">物流进度</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 物流进度 -->
      <el-dialog title="收货地址" :visible.sync="dialoglogisticstree">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in logisticstreelist"
            :key="index"
            :timestamp="activity.time"
          >{{activity.context}}</el-timeline-item>
        </el-timeline>
        <!-- <el-steps direction="vertical" :active="0">
          <el-step
            :title="item.time"
            :description="item.context"
            v-for="(item,index) in logisticstreelist"
            :key="index"
          ></el-step>
        </el-steps>-->
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialoglogisticstree = false">确 定</el-button>
        </div>
      </el-dialog>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      ordersData: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
      dialoglogisticstree: false,
      logisticstreelist: []
    };
  },
  created() {
    this.acquire();
  },
  methods: {
    async acquire() {
      const { data: res } = await this.$http.get("/orders", {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      console.log(res);
      if (res.meta.status !== 200) {
        this.$message.error("获取数据失败，请刷新页面");
      }
      this.ordersData = res.data.goods;
      this.total = res.data.total;
    },
    dateFormat(row, column) {
      //   console.log(row, column);

      const date = row[column.property];
      if (date === undefined) {
        return "";
      }
      return this.$moment(date).format("YYYY-MM-DD HH:mm");
    },
    /* 查询条数 */
    handleSizeChange(val) {
      this.pagesize = val;
      this.acquire();
    },
    /* 查询页数 */
    handleCurrentChange(val) {
      this.pagenum = val;
      this.acquire();
    },
    /* 物流信息 */
    async logisticstree(val) {
      console.log(val);
      this.dialoglogisticstree = true;
      const { data: res } = await this.$http.get("/kuaidi/1106975712662");
      this.logisticstreelist = res.data;
      console.log(this.logisticstreelist);
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
</style>