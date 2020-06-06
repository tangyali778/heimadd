<template>
  <div class="uploadFile">
    <el-upload
      class="avatar-uploader"
      :action="baseUrl+'/question/upload'"
      name="file"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <!-- 判断接收过来的type是不是video -->
      <div v-if="type==='video'">
        <video v-if="value" :src="baseUrl+'/'+value" controls class="avatar"></video>
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </div>
      <div v-else>
        <img v-if="value" :src="baseUrl+'/'+value" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: "UploadFile",
  props: {
    //传过来的type
    type: {
      type: String,
      default: "image"
    },
    // 传过来的value
    value: String
  },
  data() {
    return {
      //基地址
      baseUrl: process.env.VUE_APP_BASEURL
    };
  },
  methods: {
    //上传成功后
    handleAvatarSuccess(res) {
      //要做两件事,1.显示上传的图片/视频2.存到新增&编辑组件中的questionEditForm中video/image
      this.$emit("input", res.data.url);
    },
    // 上传之前
    beforeAvatarUpload(file) {
      if (this.type === "video") {
        const isVideo = file.type === "video/mp4";
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isVideo) {
          this.$message.error("上传头像图片只能是  mp4 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
        return isVideo && isLt2M;
      } else {
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
      }
    }
  }
};
</script>

<style lang="less">
.uploadFile {
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