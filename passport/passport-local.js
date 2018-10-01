
const passport=require('passport');
const UserDataBase=require('../databaseModel/userModel');
const LocalStrategy=require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    UserDataBase.findById(id, function(err, user) {
      done(err, user);
    });
  }); 

  //Signup 
passport.use('local.signup',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password', 
    passReqToCallback:true
  },(req,email, password, done)=> {
    UserDataBase.findOne({'email':email }, function(err, user) {
        if (err) { return done(err); }

        if (user) {
          return done(null, false, req.flash('error',`This email is already exist`));
        }

        const newUser=new UserDataBase();
        newUser.firstName=req.body.firstName;
        newUser.lastName=req.body.lastName;
        newUser.email=req.body.email;
        newUser.birthdate=req.body.birthdate;
        newUser.gender=req.body.gender;
        if(req.body.password===req.body.confirmPassword){
          newUser.password=newUser.encryptPassword(req.body.password);
        }  
        
        newUser.save((err)=>{
            done(null,newUser);
        })
      });
  }
));


// login
passport.use('local.login',new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password', 
  passReqToCallback:true
},(req,email, password, done)=> {
  UserDataBase.findOne({'email':email }, function(err, user) {
      if (err) { return done(err); }
      if (!user || !user.validUserPassword(password)) {
        return done(null, false, req.flash('LoginError',"Invalid email or password"));
      }
      return done(null, user);
 
    });
}
));