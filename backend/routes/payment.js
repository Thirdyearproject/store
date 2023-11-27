import express from "express"

const router=express.Router()

router.route("/checkout").post(checkout);

export default router;