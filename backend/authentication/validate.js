import prisma from '../database/prismaClient.js'
import jsonwebtoken from 'jsonwebtoken';
import dotenv from "dotenv"

dotenv.config({quiet : true});

const validate = async (req, _res, next) => {
  if (!req.headers.authorization) {
    throw new Error('Unauthorized');
  }

  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    throw new Error('Token not found');
  }

  try {
    const decode = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: {
        email: decode.email,
      },
    });
    req.user = user || undefined;
    next();
  } catch (err) {
    req.user = undefined;
    next();
  }
};

/* Explaination of the working
     try {
     if (!req.user) {
      return res.sendStatus(401); 
     } 
     // Basically if user is not undefined then the route knows to proceed further otherwise it won't
     // however there is a check for the header auth token so idk whether it is even neccessary
*/

export default validate;