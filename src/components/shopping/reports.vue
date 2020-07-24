<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <div id="myChart" style="width: 1000px;height:500px;"></div>
    </el-card>

    <!-- <button @click="a">132</button> -->
    <div class="wenzia">
      <p>啊实打实实打实dasdd asd啊实打实打算到昂是dasd asd 阿松大昂是</p>
      <span class="wenzi">...</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      myChartData: {},
      options: {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ]
      }
    };
  },
  created() {
    // this.acquire();
    // this.b();
    console.log(2 + "created");
  },

  async mounted() {
    // this.drawLine();
    this.$nextTick(function() {
      console.log(3 + "next");
      console.log(this.myChartData);
    });
    console.log(1 + "mounted");
    const { data: res } = await this.$http.get("reports/type/1");
    //   console.log(res);
    if (res.meta.status !== 200) {
      return this.$message.error("获取数据失败，请刷新页面");
    }
    this.myChartData = res.data;
    this.drawLine();
    // this.a();
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表配置
      let option = {
        tooltip: {},
        xAxis: this.myChartData.xAxis,
        yAxis: this.myChartData.yAxis,
        series: this.myChartData.series
      };
      //展示数据，此处的option就是上面绘制图表配置的定义变量
      //   console.log(option);
      //   console.log(this.myChartData.series);

      //   option = option.concat(this.options);
      const obj = this._.merge({}, option, this.options);

      myChart.setOption(obj);
      // 窗口大小自适应方案
      setTimeout(function() {
        window.onresize = function() {
          myChart.resize();
        };
      }, 200);
    }
    // async acquire() {
    //   //   console.log(res.data);
    //   //   console.log(this.myChartData);
    // }
  }
};
</script>

<style>
.box-card {
  margin-top: 20px;
  min-width: 1000px;
  /* overflow: scroll; */
}
.wenzia {
  position: relative;
  height: 90px;
  width: 100px;
  background-color: red;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
.wenzia p {
  margin: 0;
}
</style>