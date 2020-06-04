<script>
export default {
  methods: {
    //改变用户状态
    async changeStatus(url, id) {
      const res = await this.$axios.post(url, { id });
      //console.log(res);
      if (res.data.code == 200) {
        this.$message({
          message: "更改状态成功",
          type: "success"
        });

        //更改成功之后要刷新页面
        this.getListData();
      } else {
        this.$message.error(res.data.message);
      }
    },
    //删除
    async del(url, id) {
      //弹出框
      this.$confirm("你确定要删除吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.post(url, { id });
          if (res.data.code == 200) {
            this.$message({
              message: "删除用户成功",
              type: "success"
            });
            //删除成功之后要刷新页面
            this.search();
          } else {
            this.$message.error(res.data.message);
          }
        }).catch(() => {});
    }
  }
};
</script>

