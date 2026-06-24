import { jwtVerify } from 'jose';
import {JWKS} from './joseJs.js';

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req?.headers.authorization;
        // console.log(authHeader);
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: 'Unauthorized access!!'
                });
        }

        const token = authHeader.split(" ")[1];
            if (!token) {
                return res
                    .status(401)
                    .json({
                        success: false,
                        message: 'Unauthorized access!!'
                    });
            }

        // console.log("Received token:", token);

        const { payload } = await jwtVerify(token, JWKS, {
            issuer: process.env.BETTER_AUTH_URL,
            audience: process.env.BETTER_AUTH_URL,
        });

        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({
            success:false,
            message: error.message
            // message:"Invalid token"
        });
    }
}