import { verifyJwtToken, createJwtToken } from '../utils/token.js'
import express from 'express';
import { userModal, validateUser } from '../models/userSchema.js';
import bcrypt from 'bcrypt';


const router = express.Router();

export const authenticationMiddleware = async (req, res, next) => {
    console.log("at authenticationmiddleware")
    const { jwtToken } = req.query
    console.log(jwtToken)
    if (!jwtToken) {
        return res.redirect('/pages/guest')
    }
    try {
        const displayName = await verifyJwtToken(jwtToken)
        console.log(displayName)
        if (displayName) {
            req.user = displayName;
            console.log(req.user)
            next();
        }
        else {
            return res.redirect('/pages/guest')
        }

    } catch (err) {
        return res.status(400).send("Invalid token.");
    }
}

export const signUp = router.post('/signup', async (req, res) => {
    console.log("In signup route")
    console.log(req.body)
    const valid = await validateUser(req.body)
    console.log(valid)
    if (!valid) {
        return res.status(400).send("Invalid Entry");
    }
    else {
        try {
            let user = await userModal.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).send("User already registered.");
            }
            else {
                user = new userModal({
                    displayName: req.body.name,
                    password: req.body.password,
                    email: req.body.email
                });
                user.password = await bcrypt.hash(user.password, 10);
                await user.save();
                console.log("user sucessfully registerd")
                const token = createJwtToken(user.displayName)
                console.log(token)
                res.locals = token
                return res.redirect(`/pages/landing?jwtToken=${token}&user_id=${user._id}&name=${user.displayName}&email=${user.email}`)
            }
        }
        catch (err) {
            console.log("error is from the catch block")
            console.log(err)
            return res.status(403).send("Internal server error")
        }
    }
})
export const logIn = router.post('/login', async (req, res) => {
    console.log("at login")
    console.log(req.body)
    try {
        const user = await userModal.findOne({ email: req.body.email });
        if (user) {
            const match = await bcrypt.compare(req.body.password, user.password);
            if (match) {
                const token = createJwtToken(user.displayName)
                return res.redirect(`/pages/landing?user_id=${user._id}&name=${user.displayName}&email=${user.email}&jwtToken=${token}`)
            }
            else {
                return res.status(404).send("Password doesn't match")
            }
        }
        else {
            return res.status(400).send("User doesn't exist");
        }
    }
    catch (err) {
        console.log("error is from the catch block")
        console.log(err)
        return res.status(403)
    }

})
export const logOut = router.get('/logout', (req, res) => {
    //need to remove locals from frontend
    return res.redirect('/pages/guest')
})



export const authController = router