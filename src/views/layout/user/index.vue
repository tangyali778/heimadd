<template>
  <div>
    <el-card>
      <!-- 搜索栏 -->
      <el-form :model="searchForm" ref="searchFormRef" inline label-width="80px">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="searchForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="searchForm.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select v-model="searchForm.role_id" placeholder="请选择角色">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left:50px">
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="clear">清除</el-button>
          <el-button type="primary" @click="add">+新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top:15px">
      <!-- 表格 -->
      <el-table :data="listData" border stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="角色" prop="role"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span
              :style="{color:scope.row.status === 0?'red':'#85ce61'}"
            >{{scope.row.status === 0?'禁用':'启用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280px">
          <template slot-scope="scope">
            <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-button
              @click="changeStatus('/user/status',scope.row.id)"
              :type="scope.row.status===0?'success':'info'"
            >{{scope.row.status === 0 ? '启用':'禁用'}}</el-button>
            <el-button type="danger" @click="del('/user/remove',scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="page"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
    <user-edit ref="EditRef"></user-edit>
  </div>
</template>

<script>
import userEdit from "./user-add-or-update";
import common from "@/mixins/common";
export default {
  mixins: [common],
  components: {
    userEdit
  },
  name: "User",
  data() {
    return {
      searchForm: {
        username: "",
        email: "",
        role_id: ""
      },
      page: 1, //展示第几页
      limit: 2, //页容量
      listData: [], //用户列表数据
      total: 0, //总页数

      options: [
        {
          value: "1",
          label: "超级管理员"
        },
        {
          value: "2",
          label: "管理员"
        },
        {
          value: "3",
          label: "老师"
        },
        {
          value: "4",
          label: "学生"
        }
      ]
    };
  },
  created() {
    //发送请求得到用户列表
    this.getListData();
  },
  methods: {
    async getListData() {
      const res = await this.$axios.get("/user/list", {
        params: {
          ...this.searchForm,
          page: this.page,
          limit: this.limit
        }
      });
      //   console.log(res);
      if (res.data.code == 200) {
        this.listData = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    //点击搜索按钮
    search() {
      //从第一页开始搜
      this.page = 1;
      this.getListData();
    },
    //清除
    clear() {
      // form表单中resetFields()方法必须搭配prop使用
      this.$refs.searchFormRef.resetFields();
      this.search();
    },
    //页容量改变
    sizeChange(val) {
      this.limit = val;
      this.search();
    },
    //当前页改变
    currentChange(val) {
      this.page = val;
      this.getListData();
    },
    //新增用户
    add() {
      this.$refs.EditRef.modal = "add";
      this.$refs.EditRef.dialogVisible = true;
      //去掉bug如果在新增前面点过编辑再点新增form表单内就会有内容
      // form表单要在每次不管点新增还是编辑的时候都要清空内容还有校验
      this.$refs.EditRef.userEditForm = {
        username: "", //用户名
        email: "", //邮箱
        phone: "",
        role_id: "", //角色
        status: "", //状态
        remark: "" //备注
      };
    },
    //编辑用户
    edit(row) {
      this.$refs.EditRef.modal = "edit";
      this.$refs.EditRef.dialogVisible = true;
      this.$refs.EditRef.userEditForm = JSON.parse(JSON.stringify(row));
    }
  }
};
</script>

<style lang='less' scoped>
.el-form-item {
  .el-input {
    width: 240px;
  }
}
.el-pagination {
  margin-top: 15px;
  text-align: center;
}
</style>