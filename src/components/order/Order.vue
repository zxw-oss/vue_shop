<template>
  <div>
    <!--面包屑导航区  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页 </el-breadcrumb-item>
      <el-breadcrumb-item> 订单管理 </el-breadcrumb-item>
      <el-breadcrumb-item> 订单列表 </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索框区域 -->
      <el-row>
        <el-col :span="10">
          <el-input placeholder="请输入内容">
            <!-- 搜索按钮 -->
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- tab表格区域 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editaddress"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页显示区域 -->

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 弹出框区 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="closeaddressFrom"
    >
      <!-- 表单验证区域 -->
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressForm"
        label-width="100px"
      >
        <el-form-item label="省市区县" prop="address1">
          <el-cascader
            expandTrigger="hover"
            v-model="addressForm.address1"
            :options="cityData"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 物流数据的对话框 -->
    <el-dialog
      title="物流信息查询"
      :visible.sync="progressVisible"
      width="50%"
      
    >
      <span>物流信息查询</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="progressVisible = false">取 消</el-button>
        <el-button type="primary" @click="progressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import cityData from "../order/citydata";
export default {
  name: "Order",
  data() {
    return {
      // 查询的数据对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      // 订单总条数
      total: 0,
      // 订单列表数据
      orderList: [],
      // 修改信息的弹出框
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: "",
      },
      // 验证规则对象
      addressFormRules: {
        address1: [
          { required: true, message: "请选择省市区县", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ],
      },
      cityData,
      // 控制物流信息的显示与隐藏
      progressVisible:false
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      // 获取数据
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      // console.log(res);
      // 判断数据是否获取成功
      if (res.meta.status !== 200) {
        return this.$message.error("订单列表信息获取失败");
      }
      // 数据获取成功将订单总条数
      this.total = res.data.total;
      // 订单列表数据
      this.orderList = res.data.goods;
    },
    // 下拉框发生变化时触发此函数
    handleSizeChange(newSize) {
      // console.log(newSize);
      // 下拉菜单发生变化会把相应的值传进来
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    // 页码发生变化时触发这里的
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getOrderList();
    },
    editaddress() {
      this.addressVisible = true;
    },
    // 弹出框关闭时调用
    closeaddressFrom() {
      this.$refs.addressForm.resetFields();
    },
    // 点击地图的小标 调用这里的函数
    // async showprogress(){
      
    //   // 获取物流信息的数据
    //   const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
    //   this.progressVisible = true
    //   console.log(res);
    // }
  },
};
</script>
<style scoped>
</style>