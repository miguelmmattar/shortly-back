import connection from '../connection/connection.js';
import bcrypt from 'bcrypt';
import joi from 'joi';

function authSchema(req, res, next) {
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
        if(user.rows[0]) {
            return res.status(409).send('Este e-mail já está cadastrado!');     
       }
    } catch(error) {
        return res.status(500).send(error.message);
    }
    
    next();
}

async function allowSignIn(req, res, next) {
    const { email, password } = req.body;

    try {
        const user = await connection.query(`
            SELECT
                id,
                name, 
                email,
                "passwordHash" 
            FROM users 
                WHERE email = $1;
        `, [email]);
        
        if(!user.rows[0]) {
            return res.status(401).send('E-mail ou senha inválidos!');
        }

        const hash = user.rows[0].passwordHash;

        if(!bcrypt.compareSync(password, hash)) {
            return res.status(401).send('E-mail ou senha inválidos!');
        }

        const session = await connection.query(`
            SELECT 
                email 
            FROM sessions 
                WHERE email = $1;
        `, [email]);
        if(session.rows[0]) {
            return res.status(401).send('Usuário já logado!');
        }

        res.locals.session = {
            userId: user.rows[0].id,
            name: user.rows[0].name,
            email: user.rows[0].email
        };
    
    } catch(error) {
        return res.status(500).send(error.message);
    }

    next();
}

async function isAuthorized(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    try {
        if(!token) {
            return res.status(401).send('Sessão expirada! Faça o login para continuar.');
        }

        const session = await connection.query(`
            SELECT
                *
            FROM sessions
                WHERE token = $1;
        ;`, [token]);

        if(!session.rows[0]) {
            return res.status(401).send('Sessão expirada! Faça o login para continuar.');
        }

        res.locals.session = session.rows[0];
    } catch(error) {
        return res.status(500).send(error.message);
    }

    next();
}

export default {
    authSchema,
    allowSignUp,
    allowSignIn,
    isAuthorized
};