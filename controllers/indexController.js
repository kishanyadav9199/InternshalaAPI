const ImageKit = require("imagekit");
const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const Student = require("../models/studentModels");
const ErrorHandler = require("../utils/ErrorHandler");
const { sendmail } = require("../utils/nodemailer");
const { sendtoken } = require("../utils/SendToken");
const path = require("path");
const { userInfo } = require("os");
const imagekit=require("../utils/imagekit").initImageKit();
exports.homepage= catchAsyncErrors(async(req,res,next)=>{
        res.json({success:"Secure Homepage"})
});

exports.currentUser= catchAsyncErrors(async(req,res,next)=>{
        const student = await Student.findById(req.id).exec();
        res.json({student})
});

exports.studentsignup= catchAsyncErrors(async(req,res,next)=>{
        const student= await new Student(req.body).save();
        sendtoken(student,201,res);
});



exports.studentsignin= catchAsyncErrors(async(req,res,next)=>{
        const student = await Student.findOne({email:req.body.email}).select("+password").exec();
        if(!student) return next(new ErrorHandler("User not found",404))

         const isMatch=student.comparePassword (req.body.password);  
         if(!isMatch) return next(new ErrorHandler("Password incorrect",500))
        sendtoken(student,200,res);

});


exports.studentsignout= catchAsyncErrors(async(req,res,next)=>{
       res.clearCookie("token");
       res.json({success:"Logged out"})
});


exports.studentsendmail= catchAsyncErrors(async(req,res,next)=>{
        const student = await Student.findOne({email:req.body.email}).exec();
        if(!student) return next(new ErrorHandler("User not found",404));
        const url=`${req.protocol}://${req.get('host')}/student/forget-link/${student._id}`
        sendmail(req,res,next,url)
        student.resetPasswordToken="1";
        student.save();
        res.json({student,url})
});
exports.studentforgetlink= catchAsyncErrors(async(req,res,next)=>{
        const student = await Student.findById(req.params.id).exec();
        if(!student) return next(new ErrorHandler("User not found",404));
        if(student.resetPasswordToken=="1"){
                student.resetPasswordToken=="0"
                student.password=req.body.password;
                await student.save();

        }
        else{
                return next(new ErrorHandler("Invalid reset password link try again",500)) 
        }

      
       res.status(200).json({
        success:"Password reset successfully changed"
       })

});

exports.studentresetpassword = catchAsyncErrors(async(req,res,next)=>{
        const student = await Student.findById(req.id).exec();
        student.password=req.body.password;
        await student.save();
        sendtoken(student,201,res);
        res.status(200).json({
        success:"Password has been  successfully reset"
       })

});



exports.studentupdate= catchAsyncErrors(async(req,res,next)=>{
         await Student.findByIdAndUpdate(req.params.id,req.body).exec();
        res.status(200).json({success:true,message:"Student Updated successfully"});
});


exports.studentavatar= catchAsyncErrors(async(req,res,next)=>{
        const student= await Student.findById(req.params.id).exec();
        const file = req.files.avatar;
        const modifiedFile= `resumebuilder-${Date.now()}${path.extname(file.name)}`;


        const {fileId,url} = await imagekit.upload({
                file:file.data,
                fileName:modifiedFile
        })
        
        if(student.avatar.fileId !== "")
        {
                await imagekit.deleteFile(student.avatar.fileId);
        }
        student.avatar={fileId,url};

        await student.save();
                res
                  .status(200)
                  .json({
                    success: true,
                    message: "Profile Updated successfully",
                  });

});

















