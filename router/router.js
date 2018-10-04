var router = require('express').Router();
const passport = require('passport');
const Post=require("../databaseModel/post");
const multer=require("multer");

// for Storing the post imagees
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
    cb(null, 'public/uploads/')
    },
    filename: function(req, file, cb) {
    cb(null, file.originalname);
    }
   });
    
   var upload = multer({
    storage: storage
   });


//end

router.get('/',(req, res) => {
    if(req.isAuthenticated()){
        return res.redirect('/welcome');
    }
    res.render('login', {
        message: req.flash('LoginError')
    });
});


router.get('/welcome', IsLoggedIn, (req, res) => {
    res.render('welcome', {
        userId: req.user
    });
});

router.get('/register', (req, res) => {
    const errors = req.flash('error');
    res.render('register', {
        title: "Casperr",
        messages: errors,
        hasError: errors.length > 0
    });

});

router.get("/welcome/dashboard",IsLoggedIn,(req, res) => {
    Post.find({},(err,found)=>{
        if(err){
            console.log(err);
            res.render("dashboard");
        }
        else{
            // console.log(found);
            // console.log(req.user);
            res.render("dashboard",{post:found ,user:req.user});
        }
    })
})

router.post('/welcome/dashboard',IsLoggedIn,upload.single('fileupload'),(req,res)=>{
    Post.create({
        description:req.body.postDescription,
        userPost:req.file.path
        // image:"https://3.bp.blogspot.com/-FYjlw5lYV_Q/VCaXoNp-PTI/AAAAAAAAHmk/cLuCv4Ruq_U/s1600/37.jpg"
    },(err,post)=>{
        if(err){
            console.log("Some error");
        }
        else{
            console.log(req.file.path);
            post.author.id=req.user._id;
            post.author.userName=req.user.firstName + " " +req.user.lastName;
            post.author.userProfilePic=req.user.userImage;
            post.save((err,data)=>{
                if(err){ 
                    console.log("Not saving");
                }
                else{
                    // console.log(data);
                    res.redirect('/welcome/dashboard');

                }
            })
        }
    })

});

//facebook login
router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email', 'user_gender', 'user_birthday', 'user_location','user_age_range'],
    // authType: 'reauthenticate',
    authNonce: 'foo123'
}));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect:'/welcome',
        failureRedirect: '/',
        failureFlash: true
    }), (req, res) => {
        res.redirect("/welcome");
    });


//googel login
router.get('/auth/google',
    passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/plus.login',
            'https://www.googleapis.com/auth/plus.profile.emails.read'
        ]
    }));


router.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/welcome',
        failureRedirect: '/',
        failureFlash: true
    }));


// login
router.post('/login',
    passport.authenticate('local.login', {
        successRedirect: '/welcome',
        failureRedirect: '/',
        failureFlash: true
    })
);

// Signup
router.post('/register', function (req, res, next) {
    req.check('email', "Invalid Email").notEmpty().isEmail();
    // req.check('firstName', "Name is required").notEmpty();
    req.check('password', "Password is not matched").notEmpty().equals(req.body.confirmPassword);

    req.getValidationResult().then((result) => {
        const errors = result.array();
        const messages = [];
        errors.forEach((error) => {
            messages.push(error.msg);
        });
        req.flash('error', messages);
        res.redirect('/register');
    }).catch((err) => {
        return next();
    })
}, passport.authenticate('local.signup', {
    successRedirect: '/welcome',
    failureRedirect: '/register',
    failureFlash: true,
}))


//logout
router.get("/logout", (req, res) => {
    req.logout();
    req.session.destroy();
    res.locals.isAuthenticated = false;
    res.redirect("/");
})

//middleware
function IsLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.userId = req.user;
        return next();
    }
    res.redirect("/");
}

module.exports = router;