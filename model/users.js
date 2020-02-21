const Sequilize =require ('sequelize' ) ; 
const db = require('../database/db')
const Users = db.sequelize.define(
    'users',{
        users_id : {
            type:Sequilize.INTEGER , 
            primaryKey:true , 
            autoIncrement:true ,
        } , 
        users_first_name : {
            type:Sequilize.STRING , 
        } , 
        users_last_name :{
            type:Sequilize.STRING  
        } , 
        users_email : {
            type:Sequilize.STRING
        } , 
        users_password :{
            type:Sequilize.STRING  , 
        } , 
        users_created_at:{
            type:Sequilize.DATE , 
            defaultValue :Sequilize.NOW
        }

    },{
        timestamps:false
    }
)
module.exports = Users ; 