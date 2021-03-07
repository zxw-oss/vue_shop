<template>
  <div>
    <!--面包屑导航区  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        数据统计
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        数据报表
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <h1>用户来源</h1>

      <!--图表区域 -->
      <!--  2. 为ECharts准备一个具备大小（宽高）的Dom -->
    <div id="main" style="width: 800px;height:400px;"></div>

    </el-card>
  </div>
</template>
<script>
//1. 导入echarts
import echarts from 'echarts'
// 引入 loadsh 包
import _ from 'lodash'

export default {
  name:'Report',
  data(){
    return{
      // 要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  methods:{},
  created(){},
  async mounted(){
      //  3. 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        // 获取折线统计图的数据
        const {data:res} = await this.$http.get('reports/type/1')
        console.log(res);
        // 判断折线图数据是否获取成功
        if(res.meta.status !== 200){
          return this.$message.error('数据获取失败')
        }
          // 指定图表的配置项和数据
          // 调用lodash 下面的merge 对两个对象进行合并
          const result = _.merge(res.data,this.options)

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(result);
  }
}
</script>
<style scoped>

</style>