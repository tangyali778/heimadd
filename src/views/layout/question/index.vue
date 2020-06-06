<template>
  <div class="question">
    <el-card>
      <!-- 搜索栏 -->
      <el-form inline :model="searchForm" ref="searchFormRef" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="学科" prop="subject">
              <el-select v-model="searchForm.subject" placeholder="请选择学科">
                <el-option
                  v-for="item in subjectList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="阶段" prop="step">
              <el-select v-model="searchForm.step" placeholder="请选择阶段">
                <el-option v-for="(value,name) in stepObj" :key="name" :label="value" :value="name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="企业" prop="enterprise">
              <el-select v-model="searchForm.enterprise" placeholder="请选择企业">
                <el-option
                  v-for="item in enterpriseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="题型" prop="type">
              <el-select v-model="searchForm.type" placeholder="请选择题型">
                <el-option v-for="(value,name) in typeObj" :key="name" :label="value" :value="name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="难度" prop="difficulty">
              <el-select v-model="searchForm.difficulty" placeholder="请选择难度">
                <el-option
                  v-for="(value,name) in difficultyObj"
                  :key="name"
                  :label="value"
                  :value="name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="作者" prop="username">
              <el-input style="width:217px" v-model.trim="searchForm.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" prop="status">
              <el-select v-model="searchForm.status" placeholder="请选择状态">
                <el-option label="启用" :value="1"></el-option>
                <el-option label="禁用" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日期" prop="create_date">
              <el-date-picker v-model="searchForm.create_date" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input style="width:620px" v-model.trim="searchForm.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button type="primary" @click="search">搜索</el-button>
              <el-button @click="clear">清除</el-button>
              <el-button type="primary" @click="add">+新增用户</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card style="margin-top:15px">
      <!-- 表格 -->
      <el-table :data="listData" border stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="题目">
          <template slot-scope="scope">
            <span v-html="scope.row.title"></span>
          </template>
        </el-table-column>
        <el-table-column label="学科.阶段" :formatter="formatterSubAndStep"></el-table-column>
        <el-table-column label="题型" :formatter="formatterType"></el-table-column>
        <el-table-column label="企业" prop="enterprise_name"></el-table-column>
        <el-table-column label="创建者" prop="username"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span
              :style="{color:scope.row.status === 0?'red':'#85ce61'}"
            >{{scope.row.status === 0?'禁用':'启用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="访问量" prop="reads"></el-table-column>
        <el-table-column label="操作" width="280px">
          <template slot-scope="scope">
            <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-button
              @click="changeStatus('/question/status',scope.row.id)"
              :type="scope.row.status===0?'success':'info'"
            >{{scope.row.status === 0 ? '启用':'禁用'}}</el-button>
            <el-button type="danger" @click="del('/question/remove',scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="text-align:center;margin-top:15px">
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
      </div>
    </el-card>
    <question-edit
      ref="EditRef"
      :subjectList="subjectList"
      :enterpriseList="enterpriseList"
      :stepObj="stepObj"
      :typeObj="typeObj"
      :difficultyObj="difficultyObj"
    ></question-edit>
  </div>
</template>

<script>
//导入新增&修改组件
import QuestionEdit from "./question-add-or-update";
//导入混入
import common from "@/mixins/common";
export default {
  name: "Question",
  mixins: [common],
  components: {
    QuestionEdit
  },
  data() {
    return {
      searchForm: {
        title: "", //标题名称
        subject: "", //学科id
        enterprise: "", //	企业id
        step: "", //	题目阶段:1(初级),2(中级),3(高级)
        type: "", //	题目类型:1(单选),2(多选),3(简答)
        difficulty: "", //	题目难度: 1(简单),2(一般),3(困难)
        username: "", //	作者
        status: "", //状态:0(禁用),1(启用)
        create_date: "" //	创建日期
      },
      page: 1,
      limit: 2,
      total: 0,
      subjectList: [], //学科列表
      enterpriseList: [], //企业列表
      listData: [], //题库列表
      stepObj: { 1: "初级", 2: "中级", 3: "高级" }, //阶段
      typeObj: { 1: "单选", 2: "多选", 3: "简答" }, //题型
      difficultyObj: { 1: "简单", 2: "一般", 3: "困难" } //难度
    };
  },
  created() {
    //获取学科列表
    this.getSubjectData();
    //获取企业列表
    this.getEnterpriseData();
    //发送请求得到题库列表
    this.getListData();
  },
  methods: {
    async getSubjectData() {
      const res = await this.$axios.get("/subject/list");
      if (res.data.code == 200) {
        this.subjectList = res.data.data.items;
      }
    },
    async getEnterpriseData() {
      const res = await this.$axios.get("/enterprise/list");
      if (res.data.code == 200) {
        this.enterpriseList = res.data.data.items;
      }
    },
    async getListData() {
      const res = await this.$axios.get("/question/list", {
        params: {
          ...this.searchForm,
          page: this.page,
          limit: this.limit
        }
      });
      // console.log(res);
      if (res.data.code == 200) {
        this.listData = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    //格式化学科.阶段
    formatterSubAndStep(row) {
      return `${row.subject_name}.${this.stepObj[row.step]}`;
    },
    //格式化题型
    formatterType(row) {
      return `${this.typeObj[row.type]}`;
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
    add() {
      this.$refs.EditRef.modal = "add";
      this.$refs.EditRef.dialogVisible = true;
      // 解决每次点新增&编辑时,新增跟编辑的form能清空内容与校验
      this.$refs.EditRef.questionEditForm = {
        title: "", //	标题
        subject: "", //		学科id标识
        step: "", //阶段1、初级 2、中级 3、高级
        enterprise: "", //	企业id标识
        city: [], //		[省、市、区县]
        type: 1, //	题型 1单选 、2多选 、3简答
        difficulty: 1, //	题目难度 1简单 、2一般 、3困难
        single_select_answer: "", //	单选题答案
        multiple_select_answer: [], //多选题答案
        short_answer: "", //	简答题答案
        video: "", //	解析视频地址
        answer_analyze: "", //	答案解析
        remark: "", //	答案备注
        select_options: [
          {
            label: "A",
            text: "splice",
            image: ""
          },
          {
            label: "B",
            text: "slice",
            image: ""
          },
          {
            label: "C",
            text: "pop",
            image: ""
          },
          {
            label: "D",
            text: "shift",
            image: ""
          }
        ] //选项，介绍，图片介绍
      };
    },
    edit(row) {
      this.$refs.EditRef.modal = "edit";
      this.$refs.EditRef.dialogVisible = true;
      // 把row那行填到新增&修改子组件的form表单中
      this.$refs.EditRef.questionEditForm = JSON.parse(JSON.stringify(row));
      //解决阶段,城市,题型,难度,多选form中显示不上的bug
      if (row.city) {
        this.$refs.EditRef.questionEditForm.city = row.city.split(",");
      } else {
        this.$refs.EditRef.questionEditForm.city = [];
      }

      if (row.multiple_select_answer) {
        this.$refs.EditRef.questionEditForm.multiple_select_answer = row.multiple_select_answer.split(
          ","
        );
      } else {
        this.$refs.EditRef.questionEditForm.multiple_select_answer = [];
      }
    }
  }
};
</script>

<style>
</style>