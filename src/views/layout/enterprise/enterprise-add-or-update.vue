<template>
  <div class="enterpriseEdit">
    <el-dialog center :visible.sync="dialogVisible" width="600px">
      <div class="title" slot="title">{{modal==='add'?'新增用户':'编辑用户'}}</div>
      <el-form
        :model="enterpriseEditForm"
        :rules="rules"
        ref="enterpriseEditFormRef"
        label-width="80px"
      >
        <el-form-item label="企业编号" prop="eid">
          <el-input v-model="enterpriseEditForm.eid"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="enterpriseEditForm.name"></el-input>
        </el-form-item>
        <el-form-item label="企业简称" prop="short_name">
          <el-input v-model="enterpriseEditForm.short_name"></el-input>
        </el-form-item>
        <el-form-item label="企业简介" prop="intro">
          <el-input v-model="enterpriseEditForm.intro"></el-input>
        </el-form-item>
        <el-form-item label="企业备注" prop="remark">
          <el-input v-model="enterpriseEditForm.remark"></el-input>
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
      enterpriseEditForm: {
        eid: "", //企业编号
        name: "", //企业名字
        short_name: "", //企业简称
        intro: "", //企业简介
        remark: "" //企业备注
      },

      rules: {
        eid: [{ required: true, message: "请输入企业编号", trigger: "blur" }],
        name: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
        short_name: [
          { required: true, message: "请输入企业简称", trigger: "blur" }
        ],
        intro: [{ required: true, message: "请输入企业简介", trigger: "blur" }],
        remark: [{ required: true, message: "请输入备注", trigger: "blur" }]
      }
    };
  },
  watch: {
    dialogVisible(newValue) {
      // 等dom渲染出来的时候清空校验
      this.$nextTick(() => {
        this.$refs.enterpriseEditFormRef.clearValidate();
      });
    }
  },
  methods: {
    //点击确定按钮
    submit() {
      this.$refs.enterpriseEditFormRef.validate(async valid => {
        if (!valid) return;

        let res = "";
        if (this.modal === "add") {
          res = await this.$axios.post("/enterprise/add", this.enterpriseEditForm);
        } else {
          res = await this.$axios.post("/enterprise/edit", this.enterpriseEditForm);
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
.enterpriseEdit {
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