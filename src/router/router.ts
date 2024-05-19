import { createRouter, createWebHistory } from 'vue-router'
import Map from '@/components/Map.vue';
import InfoBlock from '@/components/InfoBlock.vue';
import EditBlock from "@/components/EditBlock.vue";

const routes = [
    {
        path: '/',
        name: 'Redirect',
        component: Map,
        props: true,
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
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router