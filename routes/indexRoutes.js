const express = require('express');
const { homepage,
    studentsignup,
    studentsignin,
    studentsignout,
    currentUser,
    studentsendmail,
    studentresetpassword,
    studentforgetlink,
    studentavatar,
    studentupdate} = require('../controllers/indexController');
const { isAuthenticated } = require('../middlewares/auth');
const router =express.Router()

//get/
router.get("/",homepage)
//get/
router.post("/student",isAuthenticated,currentUser)

//POST/STUDENT/SIGNUP
router.post("/student/signup",studentsignup)

router.post("/student/signin",studentsignin)

router.get("/student/signout",isAuthenticated,studentsignout)

//post/student/send-mail
router.post("/student/send-mail",studentsendmail)




//post/student/forget-link/:studentid
router.get("/student/forget-link/:id",studentforgetlink)

//post/student/resetpassword
router.post("/student/reset-password/:id",isAuthenticated,studentresetpassword)


router.post("/student/update/:id",isAuthenticated,studentupdate)


router.post("/student/avatar/:id",isAuthenticated,studentavatar)








module.exports=router;