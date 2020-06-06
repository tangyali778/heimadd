<template>
  <div class="questionEdit">
    <el-dialog :visible.sync="dialogVisible" fullscreen>
      <div class="title" slot="title">{{modal==='add'?'新增用户':'编辑用户'}}</div>
      <el-form
        class="form"
        :model="questionEditForm"
        :rules="rules"
        ref="questionEditFormRef"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="学科" prop="subject">
          <el-select v-model="questionEditForm.subject" placeholder="请选择学科">
            <el-option
              v-for="item in subjectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="阶段" prop="step">
          <el-select v-model="questionEditForm.step" placeholder="请选择阶段">
            <el-option v-for="(value,name) in stepObj" :key="name" :label="value" :value="+name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业" prop="enterprise">
          <el-select v-model="questionEditForm.enterprise" placeholder="请选择企业">
            <el-option
              v-for="item in enterpriseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-cascader
            size="large"
            :options="options"
            v-model="questionEditForm.city"
            :props="{value:'label'}"
            placeholder="请选择城市"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="题型" prop="type">
          <el-radio-group v-model="questionEditForm.type">
            <el-radio v-for="(value, name) in typeObj" :key="name" :label="+name">{{value}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="难度" prop="difficulty">
          <el-radio-group v-model="questionEditForm.difficulty">
            <el-radio v-for="(value, name) in difficultyObj" :key="name" :label="+name">{{value}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <hr class="hrMargin" />
        <el-form-item label="试题标题" prop="title" class="setMargin">
          <quill-editor
            @change="onEditorChange('title')"
            :options="{placeholder:'请输入标题....'}"
            v-model="questionEditForm.title"
          ></quill-editor>
        </el-form-item>

        <!-- 题型子组件 -->
        <el-form-item
          :label="typeObj[questionEditForm.type]"
          :prop="validateQuestionTypeObj[questionEditForm.type]"
        >
        <!-- 监听子组件传来的childChange事件 -->
          <question-type :questionEditForm="questionEditForm" @childChange="onchildChange"></question-type>
        </el-form-item>

        <!-- 上传子组件 -->
        <hr class="hrMargin" />
        <el-form-item label="解析视频">
          <!-- 父组件传给上传子组件一个字符串video,千万别加:,加了:后面引号就是变量不是字符串了 -->
          <upload-file type="video" v-model="questionEditForm.video"></upload-file>
        </el-form-item>

        <hr class="hrMargin" />
        <el-form-item label="答案解析" prop="answer_analyze" class="setMargin">
          <quill-editor
            :options="{placeholder:'请输入答案解析....'}"
            v-model="questionEditForm.answer_analyze"
            @change="onEditorChange('answer_analyze')"
          ></quill-editor>
        </el-form-item>

        <hr class="hrMargin" />
        <el-form-item label="试题备注" prop="remark">
          <el-input v-model="questionEditForm.remark"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
//导入题型子组件
import questionType from "./question-type";
// 导入上传子组件
import uploadFile from "./upload-file";

//导入城市三级联动
import { regionData } from "element-china-area-data";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
//导入富文本编辑器
import { quillEditor } from "vue-quill-editor";
export default {
  name: "QuestionEdit",
  //接受父组件传来的值
  props: {
    subjectList: Array,
    enterpriseList: Array,
    stepObj: Object,
    typeObj: Object,
    difficultyObj: Object
  },
  components: {
    quillEditor,
    questionType,
    uploadFile
  },
  data() {
    return {
      validateQuestionTypeObj: {
        1: "single_select_answer",
        2: "multiple_select_answer",
        3: "short_answer"
      }, //校验题型:
      options: regionData, //城市数据
      dialogVisible: false, //控制dialog显示还是隐藏
      modal: "", //控制新增还是编辑
      //模型
      questionEditForm: {
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
      },
      rules: {
        subject: [{ required: true, message: "请选择学科", trigger: "change" }],
        step: [{ required: true, message: "请选择阶段", trigger: "change" }],
        enterprise: [
          { required: true, message: "请选择企业", trigger: "change" }
        ],
        city: [{ required: true, message: "请选择城市", trigger: "change" }],
        type: [{ required: true, message: "请选择题型", trigger: "change" }],
        difficulty: [
          { required: true, message: "请选择难度", trigger: "change" }
        ],
        title: [{ required: true, message: "请选择标题", trigger: "change" }],
        single_select_answer: [
          { required: true, message: "请选择单选答案", trigger: "blur" }
        ],
        multiple_select_answer: [
          { required: true, message: "请选择多选答案", trigger: "blur" }
        ],
        short_answer: [
          { required: true, message: "请选择简答答案", trigger: "change" }
        ],
        answer_analyze: [
          { required: true, message: "请输入答案解析", trigger: "change" }
        ],
        remark: [
          { required: true, message: "请输入试题备注", trigger: "change" }
        ]
      }
    };
  },
  watch: {
    // 等新增&编辑的form表单渲染出来之后清空校验
    dialogVisible(newValue){
      this.$nextTick(()=>{
        this.$refs.questionEditFormRef.clearValidate()
      })
    }
  },
  methods: {
    // 富文本编辑器改变时做校验
    onEditorChange(value) {
      this.$refs.questionEditFormRef.validateField(value);
    },
    //单选多选简答做了改变时校验
    onchildChange() {
      this.$refs.questionEditFormRef.validateField([
        "single_select_answer",
        "multiple_select_answer",
        "short_answer"
      ]);
    },

    //确定新增&编辑按钮
    submit() {
        this.$refs.questionEditFormRef.validate(async valid => {
        if (!valid) return;

        let res = "";
        if (this.modal == "add") {
          res = await this.$axios.post("/question/add", this.questionEditForm);
        } else {
          // 发送编辑请求的时候又要是字符串
          this.questionEditForm.city = this.questionEditForm.city.join(",");
          res = await this.$axios.post("/question/edit", this.questionEditForm);
        }

        if (res.data.code == 200) {
          //提示
          this.$message({
            type: "success",
            message: this.modal === "add" ? "新增成功" : "编辑成功"
          });
          //把当前对话框关掉
          this.dialogVisible = false;
          // 调用父组件search方法
          this.$parent.search();
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>

<style lang='less'>
.questionEdit {
  .title {
    height: 53px;
    padding-left: 15px;
    line-height: 53px;
    background-color: #0e9ff9;
    color: #fff;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
  .form {
    width: 832px;
    margin: 0 auto;
  }
  .el-select,
  .el-cascader {
    width: 300px;
  }
  .hrMargin {
    margin-bottom: 20px;
  }
  .setMargin {
    .el-form-item__content {
      margin-left: 0px !important;
      margin-top: 40px;
    }
  }
  .ql-editor {
    height: 100px;
  }
}
</style>