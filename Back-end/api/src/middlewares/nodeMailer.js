const nodemailer=require("nodemailer");
const {MAIL,PASS}=process.env;


  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: `${MAIL}`, //meter en un .env
      pass: `${PASS}`, 
    },
    });  
  
    transporter.verify().then(() => {//verificacion
        console.log("Ready to Send");
      });
  
  

  module.exports={transporter};
