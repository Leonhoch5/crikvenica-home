export default {
    routes: [
        {
            method: 'GET',
            path: '/villas',
            handler: 'villa.find',
            config: {
                auth: false,
                policies: [],
            },
        },
        {
            method: 'GET',
            path: '/villas/:id',
            handler: 'villa.findOne',
            config: {
                auth: false,
                policies: [],
            },
        },
        {
            method: 'POST',
            path: '/villas',
            handler: 'villa.create',
            config: {
                auth: false,
                policies: [],
            },
        },
    ],
};
