var router = require('express').Router();
const passport = require('passport');
const Post=require("../databaseModel/post");

router.get('/', (req, res) => {
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
    res.render("dashboard");
})

router.post('/welcome/dashboard',(req,res)=>{
    Post.create({
        description:"Heeee",
        image:"https://3.bp.blogspot.com/-FYjlw5lYV_Q/VCaXoNp-PTI/AAAAAAAAHmk/cLuCv4Ruq_U/s1600/37.jpg"
    },(err,post)=>{
        if(err){
            console.log("Some error");
        }
        else{
            post.save((err,data)=>{
                if(err){
                    console.log("Not saving");
                }
                else{
                    console.log(data);
                    res.redirect('/welcome/dashboard',{userId: req.user});

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
        return next();
    }
    res.redirect("/");
}

module.exports = router;