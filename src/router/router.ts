import { createRouter, createWebHistory } from 'vue-router'
import Map from '@/components/Map.vue';
import InfoBlock from '@/components/InfoBlock.vue';
import EditBlock from "@/components/EditBlock.vue";

const routes = [
    {
        path: '/',
        redirect: '/map/56.820095/60.571232/15'
    },
    {
        path: '/map/:lat/:lng/:zoom',
        name: 'Home',
        component: Map,
        children: [
            {
                path: ':id',
                name: 'InfoBlock',
                component: InfoBlock,
            },
            {
                path: ':id/edit',
                name: 'EditBlock',
                component: EditBlock
            },
            {
                path: 'add',
                name: 'AddBlock',
                component: EditBlock
            },
        ],
    },
    {
        path: '/:catchAll(.*)', // С помощью синтаксиса ':catchAll(.*)' мы перехватываем все остальные маршруты
        component: () => import('/src/views/404.vue') // Путь к вашему компоненту 404 страницы
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router