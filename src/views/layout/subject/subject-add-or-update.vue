<template>
  <div class="subjectEdit">
    <el-dialog center :visible.sync="dialogVisible" width="600px">
      <div class="title" slot="title">{{modal==='add'?'新增用户':'编辑用户'}}</div>
      <el-form
        :model="subjectEditForm"
        :rules="rules"
        ref="subjectEditFormRef"
        label-width="80px"
      >
        <el-form-item label="学科编号" prop="rid">
          <el-input v-model="subjectEditForm.rid"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="name">
          <el-input v-model="subjectEditForm.name"></el-input>
        </el-form-item>
        <el-form-item label="学科简称" prop="short_name">
          <el-input v-model="subjectEditForm.short_name"></el-input>
        </el-form-item>
        <el-form-item label="学科简介" prop="intro">
          <el-input v-model="subjectEditForm.intro"></el-input>
        </el-form-item>
        <el-form-item label="学科备注" prop="remark">
          <el-input v-model="subjectEditForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "EnterpriseEdit",
  data() {
    return {
      dialogVisible: false, //dialog的显示与隐藏
      modal: "", //控制dialog标题是新增还是编辑
      subjectEditForm: {
        rid: "", //学科编号
        name: "", //学科名字
        short_name: "", //学科简称
        intro: "", //学科简介
        remark: "" //学科备注
      },

      rules: {
        rid: [{ required: true, message: "请输入学科编号", trigger: "blur" }],
        name: [{ required: true, message: "请输入学科名称", trigger: "blur" }],
        short_name: [
          { required: true, message: "请输入学科简称", trigger: "blur" }
        ],
        intro: [{ required: true, message: "请输入学科简介", trigger: "blur" }],
        remark: [{ required: true, message: "请输入备注", trigger: "blur" }]
      }
    };
  },
  watch: {
    dialogVisible(newValue) {
      // 等dom渲染出来的时候清空校验
      this.$nextTick(() => {
        this.$refs.subjectEditFormRef.clearValidate();
      });
    }
  },
  methods: {
    //点击确定按钮
    submit() {
      this.$refs.subjectEditFormRef.validate(async valid => {
        if (!valid) return;

        let res = "";
        if (this.modal === "add") {
          res = await this.$axios.post("/subject/add", this.subjectEditForm);
        } else {
          res = await this.$axios.post("/subject/edit", this.subjectEditForm);
        }

        // console.log(res);
        if (res.data.code == 200) {
          this.$message({
            message: this.modal === "add" ? "新增成功" : "编辑成功",
            type: "success"
          });
          //关闭dialog对话框
          this.dialogVisible = false;
          // 刷新用户列表
          this.$parent.search();
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>

<style lang="less">
.subjectEdit {
  .title {
    height: 53px;
    text-align: center;
    color: #fff;
    background-color: #0e9cfa;
    line-height: 53px;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
}
</style>