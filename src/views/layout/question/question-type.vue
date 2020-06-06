<template>
  <div class="questionType">
    <!-- 单选 -->
    <div v-if="questionEditForm.type==1">
      <div class="item" v-for="(item, index) in questionEditForm.select_options" :key="index">
        <el-radio  @change="changeValue" v-model="questionEditForm.single_select_answer" :label="item.label">{{item.label}}</el-radio>
        <el-input v-model="item.text" style="margin-right:15px"></el-input>
        <upload-file  v-model="item.image"></upload-file>
      </div>
    </div>
    <!-- 多选 -->
    <div v-if="questionEditForm.type==2">
      <div class="item" v-for="(item, index) in questionEditForm.select_options" :key="index">
        <el-checkbox
         @change="changeValue"
          v-model="questionEditForm.multiple_select_answer"
          :label="item.label"
        ></el-checkbox>
        <el-input v-model="item.text" style="margin:0 15px 0 30px"></el-input>
        <upload-file  v-model="item.image"></upload-file>
      </div>
    </div>
    <!-- 简答 -->
    <div v-if="questionEditForm.type==3">
      <el-input  type="textarea" @change="changeValue" v-model="questionEditForm.short_answer" :rows="5"  placeholder="请输入内容"></el-input>
    </div>
  </div>
</template>

<script>
import uploadFile from "./upload-file";
export default {
  name: "QuestionType",
  //接受父组件传来的值
  props: ["questionEditForm"],
  components: {
    uploadFile
  },
  methods: {
    changeValue(){
      // 给父组件抛出这个事件,父组件触发这个事件
      this.$emit('childChange')
    }
  },

};
</script>

<style lang="less">
.questionType {
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>