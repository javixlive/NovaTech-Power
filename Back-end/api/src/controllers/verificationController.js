const {Users}=require("../db.js");

async function verCode(req,res){
    const{id,code}=req.body;
    console.log(id);
    console.log(code);
    try {
        let searchUser=await Users.findByPk(id);
        if(searchUser.verifCode===Number(code)){
            searchUser.confirmed=true;
            await searchUser.save();
            res.status(200).json({message:"verification complete"})
        }else{
            res.status(400).json({message:"wrong code"})
        }
    } catch (error) {
        res.status(400).json({message:"error to verificate"})
    }
}

module.exports={verCode}