import Vue from 'vue'
import { Select, Option, Form, FormItem, Loading } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import 'element-ui/lib/theme-chalk/index.css'

locale.use(lang)

Vue.use(FormItem)
Vue.use(Form)
Vue.use(Select)
Vue.use(Option)
Vue.use(Loading)
