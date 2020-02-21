const router = require('express').Router()
const userModel = require('../model/users')
const jwt = require('jsonwebtoken') 
const valid = require('@hapi/joi')
const bcrypt = require('bcrypt')
// const cors = require('cors') 
const loginSchema  = valid.object({
    email:valid.string().min(6).required().email() , 
    password:valid.string().min(6).required()
});
router.get('/' , (req , res)=>{
    res.send("hello");
}) ;
router.post('/register', async(req , res)=>{
    // console.log("Register" , req);
    const today = new Date();
    const userData = {
        users_first_name:req.body.first_name , 
        users_last_name :req.body.last_name  ,
        users_email:req.body.email , 
        users_password :req.body.password , 
        users_created_at:today
    }
    userModel.findOne({
        where : {
            "users_email":req.body.email
        }
    }).then(user=>{
        if(!user){
            const hashpassword = bcrypt.hash(req.body.password , 10 , async (err  ,hash)=>{
                console.log("Password hash" , hash);
                
                userData.users_password =hash ;
                console.log("user" , userData);
                
                await userModel.create(userData) 
                .then(user=>{
                    res.json({error:false , msg :`${user.users_email} has been saved`}) ; 
                }) .catch(err=>{
                    res.json({error:true , msg : err})
                }) ; 
            })  ; //hash password 

        }else{
            res.json({error:'Email is already used'}) ;
        }
    }).catch(err=>{
        res.json({error:true , msg:err}); 
    }); 
    
}) ; 
router.post('/login' , async(req , res)=>{
    const today = new Date();
    //it will require valid email and pass
    const body = req.body ; 
    const {error} = await loginSchema.validate(body);
    if(error){
        return  res.json({msg:error.details[0].message , error : true}).status(400) ;
    }else{
        userModel.findOne({
            where:{
                users_email :body.email
            }
        }).then(user=>{
            if(user){
                //user found
                if(bcrypt.compareSync(body.password , user.users_password)){
                    let loginToken = jwt.sign(user.dataValues ,process.env.TOKEN_SECRET , {
                        expiresIn:144440
                    } )  ; 
                    // console.log("Login token" , loginToken );
                 return  res.json({msg:"Login success" , error : false , token :loginToken, user:user.users_first_name}).status(400) ;
                    
                }else{
                return  res.json({msg:"Auth failed" , error : true , token :null }).status(400) ;
                    
                }
            }else{
                //user is not found
             return  res.json({msg:"Invalid login cradential" , error : true}).status(400) ;

            }
        })  ; 
    }





}) ; 
module.exports= router;