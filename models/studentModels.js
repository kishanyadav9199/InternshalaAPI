const mongoose= require('mongoose');
const bcrypt= require('bcrypt');
const jwt = require("jsonwebtoken")
const studentModel=new mongoose.Schema({
    firstname:{
        type:String,
        required:[true,'First Name is required'],
        minLength:[4,"First name should be at least 4 characters long"]
    },
    lastname:{
        type:String,
        required:[true,'Last Name is required'],
        minLength:[4,"Last name should be at least 4 characters long"]
    },
    contact:{
        type:String,
        required:[true,'Contact is required'],
        maxLength:[10," Contact must not exceed 10 characters long"],
        minLength:[10," Contact should be at least 10 characters long"]

    },
    city:{
        type:String,
        required:[true,'City is required'],
        minLength:[4,"City name should be at least 4 characters long"]
    },
    gender:{
        type:String,
        required:[true,'Gender is required'],
        enum:['male','female','other']
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Please enter valid email address']
    },
    password:{
        type:String,
        select:false,
        maxLength:[
            15,
            'Password should not exceed 15 characters'
        ],
        minLength:[
            6,
            'Password should have atleast  6 characters'
        ],
        // match:[/^\w+([\.-]?\w+)*]
    },
    resetPasswordToken:{
        type:String,
        default:"0"
    }
    ,    
    avatar:{
        type:Object,
        default:{
            fileId:"",
            url:"https://images.unsplash.com/photo-1640951613773-54706e06851d?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
    },
    resume:{
       education:[],
       jobs:[],
       internships:[],
       responsibilities:[],
       courses:[],
       projects:[],
       skills:[],
       accomplishments:[],
    },
    internships: [
            { type: mongoose.Schema.Types.ObjectId, ref: "internship" },
        ],
        jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "job" }],
    

},{timestamps:true})

studentModel.pre("save",function(){
    if(!this.isModified("password")){
        return;
    }
    let salt = bcrypt.genSaltSync(10);
    this.password=bcrypt.hashSync(this.password,salt)
})

studentModel.methods.comparePassword=function(password){
    return bcrypt.compareSync(password,this.password);
}

studentModel.methods.getjwttoken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}

const student = mongoose.model('Student',studentModel);
module.exports=student;