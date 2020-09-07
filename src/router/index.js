import Vue from 'vue'
import VueRouter from 'vue-router'
import ProjectUserTable from '../views/ProjectUserTable.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'ProjectUserTable',
    component: ProjectUserTable
  },
]

const router = new VueRouter({
  routes
})

export default router
