// userRoute.ts
import express, { Router } from "express";

export function userRoute(router: Router): Router {
    // Your route definitions here
    router.get('/', (req, res) => {
        res.send('Home');
    });

    return router; 
}