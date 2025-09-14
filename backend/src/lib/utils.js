import jwt from 'jsonwebtoken'

export const generateToken = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'})
    res.cookie("jwt", token, {
        httpOnly: true, //prevent XSS attacks, cross sit scripting
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", //prevent CSRF attacks
        maxAge: 7*24*60*60*1000 //MS
    })
    return token
}


//http://localhose -> env
//https://... -> prod