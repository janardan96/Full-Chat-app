const passport=require('passport');
const UserDataBase=require('../databaseModel/userModel');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const secret=require("../secret/secretFile");

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    UserDataBase.findById(id, function(err, user) {
      done(err, user);
    });
  }); 

  //Signup 
passport.use(new GoogleStrategy({
    clientID:secret.google.ClientID,
        clientSecret: secret.google.ClientSecret,
        callbackURL: "http://localhost:3000/auth/google/callback",
        profileFields: ['displayName', 'photos', 'email','gender','location'],
        passReqToCallback:true
  },(req,accessToken, refreshToken, profile, done)=>{
    UserDataBase.findOne({email: profile._json.emails[0].value},function(err, user) {
        if (err) { return done(err); }


        if (user) {
            return done(null, user);
          }
          else{
              const newUser=new UserDataBase();
              newUser.google=profile.id;
              newUser.firstName=profile.displayName;
              newUser.email=profile.emails[0].value;
              newUser.userImage=`${profile._json.image.url.split('?sz')[0]}?sz=480`; 
              newUser.gender=profile._json.gender;

              
              newUser.save((err)=>{
                  if(err){
                      return done(err); 
                  }
                  return done(null,newUser);
              })
          }
      });
  }
));

