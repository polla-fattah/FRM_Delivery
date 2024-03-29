import store from 'src/store/index.js'
const defaultGaurd = (to, from, next) => {
    console.log(store.state)
    if (!store.state.user)
        next("/")
    else
        next()
}
const adminGuard = (to, from, next) => {
    console.log(store.state)

    if ((!store.state.user) || store.state.claims.role != "admin")
        next(null)
    else
        next()
}
const employeeGuard = (to, from, next) => {
    console.log(store.state)

    if ((!store.state.user) || (store.state.claims.role != "admin" && store.state.claims.role != "driver"))
        next(null)
    else
        next()
}


const routes = [{
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{
            path: 'login-failed',
            name: 'LoginFailed',
            component: () => import('pages/LoginFailed.vue'),
        },
        {
            path: '',
            name: 'Home',
            component: () => import('pages/Index.vue'),
            beforeEnter: (to, from, next) => {
                if (store.state.user)
                    next("/#/delivery")
                else
                    next()
            }
        },
        {
            path: 'delivery',
            name: 'Delivery',
            component: () => import('pages/delivery/Index.vue'),
            beforeEnter: defaultGaurd
        },
        {
            path: 'show-delivery',
            name: 'ShowDelivery',
            props: true,
            component: () => import('pages/delivery/ShowDelivery.vue'),
            beforeEnter: defaultGaurd
        },
        {
            path: 'edit-delivery',
            name: 'EditDelivery',
            props: true,
            component: () => import('pages/delivery/EditDelivery.vue'),
            beforeEnter: defaultGaurd
        },
        {
            path: 'assign-driver',
            name: 'AssignDriver',
            props: true,
            component: () => import('pages/delivery/AssignDriver.vue'),
            beforeEnter: defaultGaurd
        },
        {
            path: 'show-regions',
            name: 'ShowRegions',
            component: () => import('pages/regions/Index.vue'),
            beforeEnter: adminGuard
        },
        {
            path: 'edit-region',
            name: 'EditRegion',
            props: true,
            component: () => import('pages/regions/EditRegion.vue'),
            beforeEnter: adminGuard
        },
        {
            path: 'edit-driver',
            name: 'EditDriver',
            props: true,
            component: () => import('pages/regions/EditDriver.vue'),
            beforeEnter: adminGuard
        },
        {
            path: 'search-shops',
            name: 'SearchShops',
            component: () => import('pages/shops/Index.vue'),
            beforeEnter: employeeGuard
        },
        {
            path: 'edit-shop',
            name: 'EditShop',
            props: true,
            component: () => import('pages/shops/EditShops.vue'),
            beforeEnter: employeeGuard
        },
        {
            path: 'prev-delivery',
            name: 'PrevDelivery',
            props: true,
            component: () => import('pages/delivery/PrevDelivery.vue'),
            beforeEnter: defaultGaurd
        },
        {
            path: 'stats',
            name: 'StatIndex',
            props: true,
            component: () => import('pages/stats/Index.vue'),
            beforeEnter: adminGuard
        },
        {
            path: 'stat_element',
            name: 'StatElement',
            props: true,
            component: () => import('pages/stats/StatElement.vue'),
            beforeEnter: adminGuard
        },

    ]
}]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
    routes.push({
        path: '*',
        component: () => import('pages/Error404.vue')
    })
}

export default routes
