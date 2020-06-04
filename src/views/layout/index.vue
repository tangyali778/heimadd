<template>
  <el-container class="layout">
    <el-header class="header">
      <div class="left">
        <div class="el-icon-s-fold" @click="isCollapse= !isCollapse"></div>
        <img src="./../../assets/layout_icon.png" class="marginlr" alt />
        <div class="title">黑马面面</div>
      </div>
      <div class="right">
        <img :src="avatarSrc" alt />
        <div class="name">{{username}},您好</div>
        <el-button type="primary" size="mini" @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="auto">
        <!-- 导航栏 -->
        <el-menu
          router
          :default-active="defaultActive"
          :collapse="isCollapse"
          class="el-menu-vertical-demo"
        >
          <el-menu-item index="/layout/welcome">
            <i class="el-icon-date"></i>
            <span slot="title">个人信息</span>
          </el-menu-item>
          <el-menu-item index="/layout/echart">
            <i class="el-icon-pie-chart"></i>
            <span slot="title">数据预览</span>
          </el-menu-item>
          <el-menu-item index="/layout/user">
            <i class="el-icon-user"></i>
            <span slot="title">用户列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/question">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">题库列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/enterprise">
            <i class="el-icon-office-building"></i>
            <span slot="title">企业列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/subject">
            <i class="el-icon-notebook-2"></i>
            <span slot="title">学科列表</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main style="background:#e8e9ec">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { removeToken } from "@/utils/token.js";
export default {
  name: "Layout",
  data() {
    return {
      avatarSrc: "", //头像的src,
      username: "", //用户名
      isCollapse: false, //是否折叠
      defaultActive: "" //高亮
    };
  },
  created() {
    // 发送请求得到个人信息
    this.getUserInfo();
    //高亮由当前路由决定
    this.defaultActive = this.$route.fullPath;
  },
  methods: {
    async getUserInfo() {
      const res = await this.$axios.get("/info");
      //console.log(res);
      if (res.data.code == 200) {
        this.avatarSrc =  process.env.VUE_APP_BASEURL + "/" + res.data.data.avatar;
        this.username = res.data.data.username;

        //得到登录者信息之后存到vuex仓库
        this.$store.commit('setInfo',res.data.data)
      }
    },
    //退出
    logout() {
      this.$confirm("你确定要退出吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.get("/logout");
          if (res.data.code == 200) {
           //把token删掉
            removeToken();

            //退出成功后就要去到登录页
            this.$router.push("/login");
          }
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="less">
.layout {
  height: 100%;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f3f3f3;
    .left {
      display: flex;
      align-items: center;
      .marginlr {
        margin-left: 10px;
        margin-right: 10px;
      }
      .title {
        font-size: 22px;
        color: #49a1ff;
      }
    }
    .right {
      display: flex;
      align-items: center;
      img {
        width: 43px;
        height: 43px;
        margin-right: 9px;
        border-radius: 50%;
      }
      .name {
        margin-right: 38px;
      }
    }
  }
  .el-menu {
    border-right: solid 0px #e6e6e6;
    list-style: none;
    position: relative;
    margin: 0;
    padding-left: 0;
    background-color: #fff;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
}
</style>