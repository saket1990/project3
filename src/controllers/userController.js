const userModel = require("../models/userModel")
const secretKey = "Functionup-Radon";
const jwt = require("jsonwebtoken")
const validator = require("../validator/validator")

const createUser =async function(req,res){
    let body = req.body

    let requestBody = req.body;

        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({
                status: false,
                messege: "Please provide user details",
            });
        }
        // extract parameters
        const { title,name,email,phone,password,} = requestBody; //destructuring 


        //  Validation starts
        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, messege: "Title is required" });
        }
        const tit = ["Mr", "Mrs", "Miss"]
        if(!tit.includes(title)){
            return res.status(400).send({status:false, msg: "title only can be Mr, Mrs, Miss"})
        }

        if (!validator.isValid(name)) {
            return res.status(400).send({ status: false, messege: "Name is required" });
        }
        if(!validator.isValidName(name)){
            return res.status(400).send({ status: false, messege: "Invalid Name" });
        }

        if(!validator.isValid(phone)){
            return res.status(400).send({status:false, message: "phone number is required"})
        }
        if(!validator.isValidMobile(phone)){
            return res.status(400).send({status:false, msg: "invalid mobile number"})
        }
        const mobile = await userModel.findOne({phone:phone})
        if(mobile){
            return res.status(400).send({status:false, msg: "mobile number is already registered"})
        }


        if(!validator.isValid(email)){
            return res.status(400).send({status:false, message: "email is required"})
        }
        if(!validator.isValidEmail(email)){
            return res.status(400).send({status:false, message: "email is invalid"})
        }
        const mail = await userModel.findOne({email:email})
        if(mail){
            return res.status(400).send({status:false, msg:"email is already registered"})
        }


        

        if(!validator.isValid(password)){
            return res.status(400).send({status:false, message: "password is required"})
        }
        if(!validator.isValidPassword(password)){
            return res.status(400).send({status:false, msg: "Password must contains min 8 chracters, max 15 characters at least one uppercase letter, one lowercase letter, one number and one special character:"})
        }
        
    const registerUser= await userModel.create(body)

    res.status(201).send({status:true,message: "user created successfully",data:registerUser})
};

const loginUser = async function(req, res) {
    try {
        const data = req.body;

        const email = data.email
        const password = data.password
        

        const findUser = await userModel.findOne({ email, password });
        //finding author details in DB
        if (!findUser) {
            return res.status(400).send({ status: false, msg: "Invalid credentials. Please check the details & try again." })
        }

        //creating JWT
        // var d = new Date();

        // var calculatedExpiresIn = (((d.getTime()) + (60 * 60 * 1000)) - (d.getTime() - d.getMilliseconds()) / 1000);

        // let token = jwt.sign({ userId: findUser._id.toString() ,"iat": (new Date().getTime())  }, secretKey,{

        //     expiresIn: "10s"
        //  });
        var token = jwt.sign(
            {userId: findUser._id.toString()},
             secretKey, {
            expiresIn: '10s'
         });
    

         
  

        req.header("x-api-key", token);
        return res.status(201).send({ status: true, token: token});


    } catch (error) {
        res.status(500).send({ status: false, Error: error.message });
    }

}
module.exports= {createUser,loginUser}