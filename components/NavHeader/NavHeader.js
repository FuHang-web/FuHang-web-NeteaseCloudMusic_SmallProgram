// components/NavHeader/NavHeader.js
Component({
  /**
   * 组件的属性列表，由组件外部传入的数据， 等同于 vue 中的 props
   */
  properties: {
    title: {
      type: String,
      value: '',
    },
    iconHeader: {
      type: String,
      value: ''
    },
    iconBtn: {
      type: String,
      value: ''
    },
    textBtn: {
      type: String,
      value: '查看更多'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})