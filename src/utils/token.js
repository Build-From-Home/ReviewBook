import jwt from "jsonwebtoken";
import { JWTSECRET } from './config.js';


export const createJwtToken = function (displayName) {
    return Buffer.from(
        jwt.sign({ data: displayName }, JWTSECRET, {
            expiresIn: "2 days"
        })
    ).toString("base64");
}


export const verifyJwtToken = function (token) {
    const currentTime = new Date().getTime() / 1000
    const valid = jwt.verify(Buffer.from(token, "base64").toString(), JWTSECRET)
    if (token.exp < currentTime) {
        return false
    }
    if (valid) {
        return valid.data
    }
    else {
        console.log("Jwt token invalid")
        return false;
    }
}