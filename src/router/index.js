import { createRouter, createWebHistory } from "vue-router"
import useUserStore from "@/stores/user"
import { nextTick } from "vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //path不要重复，path是用于menu判断选中的唯一标识
    //meta里的title、icon最好都有，如果只有一个子元素可以不写，因为不会被渲染。
    //meta里的hidden可以不写，表示不隐藏

    //登录成功后展示
    {
      path: "/",
      name: "layout", //命名路由，做权限
      component: () => import("@/views/layout/index.vue"),
      redirect: "/home",
      children: [
        {
          path: "/home",
          component: () => import("@/views/home/index.vue"),
          meta: {
            title: "首页",
            icon: "menu"
          }
        }
      ]
    },

    //登录页面
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/login/index.vue"),
      meta: {
        title: "登录",
        hidden: true
      }
    },
    //404页面
    {
      path: "/404",
      name: "404",
      component: () => import("@/views/404/index.vue"),
      meta: {
        title: "404",
        hidden: true
      }
    },
    // {
    //   path: "/screen",
    //   component: () => import("@/views/screen/index.vue"),
    //   name: "screen",
    //   meta: {
    //     title: "数据大屏",
    //     icon: "platform"
    //   }
    // },

    {
      path: "/screen",
      name: "screen", //命名路由，做权限
      component: () => import("@/views/layout/index.vue"),
      children: [
        {
          path: "/screen",
          component: () => import("@/views/screen/index.vue"),
          meta: {
            title: "数据大屏",
            icon: "platform"
          }
        }
      ]
    },

    {
      path: "/acl",
      name: "acl",
      component: () => import("@/views/layout/index.vue"),
      redirect: "/acl/permission",
      meta: {
        title: "权限管理",
        icon: "connection"
      },
      children: [
        //user
        {
          path: "/acl/user",
          name: "user",
          meta: {
            title: "用户管理"
            // icon: "user"
          },
          component: () => import("@/views/acl/user/index.vue")
        },
        //role
        {
          path: "/acl/role",
          name: "role",
          meta: {
            title: "角色管理"
            // icon: "aim"
          },
          component: () => import("@/views/acl/role/index.vue")
        },
        {
          path: "/acl/permission",
          name: "permission",
          meta: {
            title: "菜单管理"
            // icon: "position"
          },
          component: () => import("@/views/acl/permission/index.vue")
        }
      ]
    },
    //匹配任意路由
    {
      path: "/:pathMatch(.*)*",
      redirect: "/404",
      name: "any",
      meta: {
        title: "任意路由",
        hidden: true
      }
    }
  ]
})

const white = ["/login"]
let userStore
nextTick(() => {
  userStore = useUserStore()
})

router.beforeEach((to, from, next) => {
  if (!white.includes(to.path)) {
    if (!userStore.user) {
      return next({
        path: "/login",
        query: {
          redirect: to.path
        }
      })
    }
  }
  next()
})

export default router
