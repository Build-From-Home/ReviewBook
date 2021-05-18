import jwt from "jsonwebtoken";


export const createJwtToken = function (displayName) {
    return Buffer.from(
        jwt.sign({ data: displayName }, process.env.JWTSECRET, {
            expiresIn: "2 days"
        })
    ).toString("base64");
}


export const verifyJwtToken = function (token) {
    const currentTime = new Date().getTime() / 1000
    const valid = jwt.verify(Buffer.from(token, "base64").toString(), process.env.JWTSECRET)
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

    // try {
    //     const jwtSessionToken = new JwtToken(jwt.verify(Buffer.from(token, "base64").toString(), process.env.JWTSECRET))
    //     const currentTime = new Date().getTime() / 1000
    //     if (jwtSessionToken.exp && jwtSessionToken.exp < currentTime) {
    //         LOG.error("Jwt token valid but expired")
    //         
    //     }
    //     if (jwtSessionToken.data) {
    //         return jwtSessionToken.data
    //     }
    //     else {
    //         console.log("Jwt token invalid")
    //         return false;
    //     }
    // }
    // catch (e) {
    //     return false
    // }
}