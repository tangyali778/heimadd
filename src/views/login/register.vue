<template>
  <div class="register">
    <el-dialog center :visible.sync="dialogVisible" width="600px">
      <div class="title" slot="title">注册</div>
      <el-form :model="registerForm" :rules="rules" ref="registerFormRef" label-width="100px">
        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            :action="avatarUrl"
            name="image"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
           
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="昵称" prop="username">
          <el-input v-model="registerForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="registerForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="图形码" prop="code">
          <el-row>
            <el-col :span="17">
              <el-input v-model="registerForm.code"></el-input>
            </el-col>
            <el-col :span="6" style="margin-left:10px">
              <img :src="codeUrl" class="captcha" @click="captchaClick" alt />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="验证码" prop="rcode">
          <el-row>
            <el-col :span="17">
              <el-input v-model.number="registerForm.rcode"></el-input>
            </el-col>
            <el-col :span="6" style="margin-left:10px">
              <el-button @click="getSendsms">获取用户验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible= false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      imageUrl: "", //头像地址
      avatarUrl: process.env.VUE_APP_BASEURL + "/uploads", //头像上传地址
      codeUrl: process.env.VUE_APP_BASEURL + "/captcha?type=sendsms", //图形码请求地址
      dialogVisible: false,
      registerForm: {
        username: "",
        phone: "",
        email: "",
        avatar: "", //头像
        password: "",
        code: "", //图形吗
        rcode: "" //验证码
      },
      rules: {
        avatar: [{ required: true, message: "请上传头像", trigger: "change" }],
        username: [
          { required: true, message: "请输入昵称", trigger: "blur" },
          { min: 2, max: 4, message: "长度在 2到4个字符", trigger: "blur" }
        ],
        email: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("邮箱不能为空"));
              }

              const reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
              if (!reg.test(value)) {
                return callback(new Error("邮箱不合法"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("手机号不能为空"));
              }

              const reg = /^1[3456789][0-9]{9}$/;
              if (!reg.test(value)) {
                return callback(new Error("手机号不合法"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "长度不能小于6个字符", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入图形码", trigger: "blur" },
          { min: 4, max: 4, message: "长度必须为4个字符", trigger: "blur" }
        ],
        rcode: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("用户验证码不能为空"));
              }

              if (!Number.isInteger(value)) {
                return callback(new Error("请输入数值型"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    //   监听dialogVisible的变化,当它是false的时候就清空所有校验
    dialogVisible(newValue) {
      if (!newValue) {
        this.$refs.registerFormRef.clearValidate();
      }
    }
  },
  methods: {
    //点击图形码
    captchaClick() {
      this.codeUrl =
        process.env.VUE_APP_BASEURL +
        "/captcha?type=sendsms&r=" +
        Math.random();
    },
    //获取短信验证码
    async getSendsms() {
      const res = await this.$axios.post("/sendsms", {
        code: this.registerForm.code,
        phone: this.registerForm.phone
      });
      //console.log(res);
      if (res.data.code == 200) {
        this.registerForm.rcode = res.data.data.captcha;
      } else {
        this.$message.error(res.data.message);
        this.captchaClick();
      }
    },

    //上传成功
    handleAvatarSuccess(res) {
      // console.log(res);
      this.imageUrl = process.env.VUE_APP_BASEURL + "/" + res.data.file_path;
      this.registerForm.avatar = res.data.file_path;
    },
    // 上传之前
    beforeAvatarUpload(file) {
      const isImage =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImage) {
        this.$message.error("上传头像图片只能是  JPG/png/gif 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isImage && isLt2M;
    },
    //确定注册按钮
    submit() {
      this.$refs.registerFormRef.validate(async valid => {
        if (!valid) return;

        const res = await this.$axios.post("/register", this.registerForm);
        // console.log(res);
        if (res.data.code == 200) {
          this.$message({
            message: "注册成功",
            type: "success"
          });
          this.dialogVisible = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>

 <style lang="less">
.register {
  .title {
    height: 53px;
    background: #03c0f9;
    color: #fff;
    line-height: 53px;
  }
  .el-dialog__header {
    padding: 0px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
  .captcha {
    width: 100%;
    height: 40px;
  }
  .avatar-uploader {
    text-align: center;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>