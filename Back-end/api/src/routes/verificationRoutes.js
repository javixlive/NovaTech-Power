const {Router}=require("express");
const router=Router();

const {verCode}=require("../controllers/verificationController.js");

router.put("/",verCode);

module.exports=router;