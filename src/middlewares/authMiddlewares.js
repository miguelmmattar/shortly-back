import connection from '../connection/connection.js';
import bcrypt from 'bcrypt';
import joi from 'joi';

function signUpSchema(req, res, next) {
    const schema = joi.object({
        name: joi.string().max(100).empty(),
        email: joi.string().email().max(100).empty(),
        password: joi.string().max(100).empty(),
        confirmPassword: joi.ref('password')
    });

    const validation = schema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  next();
}

async function allowSignUp(req, res, next) {
    const { email } = req.body;

    try {
        const user = await connection.query(`
            SELECT 
                email 
            FROM users 
                WHERE email = $1;
        `, [email]);

        console.log(user);
        if(user.rows[0]) {
            return res.status(409).send('Este e-mail já está cadastrado!');     
       }
    } catch(error) {
        return res.status(500).send(error.message);
    }
    
    next();
}

export default {
    signUpSchema,
    allowSignUp
};