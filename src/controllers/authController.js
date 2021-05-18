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
            return res.redirect('guest')
        }

    } catch (err) {
        return res.status(400).send("Invalid token.");
    }
}

export const signUp = router.post('/signUp', async (req, res) => {
    console.log("In signUp route")
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
                res.redirect(`/pages/landing?user_id=${user._id}&name=${user.name}&email=${user.email}&jwtToken=${token}`)
            }
        }
        catch (err) {
            console.log("error is from the catch block")
            console.log(err)
            return res.status(403)
        }
    }
})



export const authController = router