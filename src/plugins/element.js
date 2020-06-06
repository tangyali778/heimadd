import Vue from 'vue'
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css';

// Vue.use(ElementUI)

//把element全局注册弄成局部注册,需要哪个组件就导入哪个组件,免得体积太大:
// 1.安装 npm install babel-plugin-component -D 
// 2. 在babel.config.js文件下面复制element官网下要复制的代码
// 3.把全部导入变成按需导入然后按需注册


import {
    Form,
    FormItem,
    Input,
    Button,
    Icon,
    Row,
    Col,
    Checkbox,
    Link,
    Message,
    Dialog,
    Upload,
    Header,
    Main,
    Aside,
    Container,
    Menu,
    MenuItem,
    Card,
    Select,
    Option,
    MessageBox,
    Table,
    TableColumn,
    Pagination,
    DatePicker,
    Cascader,
    Radio,
    RadioGroup
  } from 'element-ui'
  
  Vue.use(Form)
  Vue.use(FormItem)
  Vue.use(Input)
  Vue.use(Button)
  Vue.use(Icon)
  Vue.use(Row)
  Vue.use(Col)
  Vue.use(Checkbox)
  Vue.use(Link)
  Vue.use(Dialog)
  Vue.use(Upload)
  Vue.use(Header)
  Vue.use(Main)
  Vue.use(Aside)
  Vue.use(Container)
  Vue.use(Menu)
  Vue.use(MenuItem)
  Vue.use(Card)
  Vue.use(Select)
  Vue.use(Option)
  Vue.use(Table)
  Vue.use(TableColumn)
  Vue.use(Pagination)
  Vue.use(DatePicker)
  Vue.use(Cascader)
  Vue.use(Radio)
  Vue.use(RadioGroup)
  
  Vue.prototype.$message = Message
  Vue.prototype.$confirm = MessageBox.confirm

