
const passport=require('passport');
const UserDataBase=require('../databaseModel/userModel');
const FacebookStrategy=require('passport-facebook').Strategy;
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
passport.use(new FacebookStrategy({
    clientID:secret.facebook.clientID,
        clientSecret: secret.facebook.clientSecret,
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        // profileFields: ['displayName', 'photos', 'email'],
        profileFields: ['location','photos','displayName', 'birthday', 'gender', 'email', 'age_range'],

        passReqToCallback:true
  },(req,token, refreshToken, profile, done)=>{
    UserDataBase.findOne({facebook:profile.id }, function(err, user) {
        if (err) { return done(err); }

        if (user) {
          return done(null, user);
        }
        else{
            const newUser=new UserDataBase();
            newUser.facebook=profile.id;
            newUser.firstName=profile.displayName;
            newUser.email=profile._json.email;
            newUser.ageRange=profile._json.age_range;
            newUser.gender=profile._json.gender;
            newUser.birthdate=profile._json.birthday;
            newUser.location=profile._json.location;
            newUser.userImage=profile.photos[0].value || ''; 
            newUser.fbTokens.push({token:token});
            

            newUser.save((err)=>{
                return done(null,user);
            })
        }
      });
  }
));

