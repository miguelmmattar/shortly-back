import connection from "../connection/connection.js";
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

async function signUp(req, res) {
    const { name, email, password } = req.body;

    try {
        await connection.query(`
            INSERT INTO 
                users (name, email, "passwordHash")
            VALUES ($1, $2, $3);
        `, [name, email, bcrypt.hashSync(password, 10)]);

        res.sendStatus(201);
    } catch(error) {
        return res.status(500).send(error.message);
    }
}

async function signIn(req, res) {
    const token = uuid();
    const session = {...res.locals.session, token: token};

    try {
        await connection.query(`
            INSERT INTO
                sessions (name, "userId", email, token)
            VALUES ($1, $2, $3, $4);
        `, [session.name, session.userId, session.email, session.token]);

        res.status(200).send({token: token});
    } catch(error) {
        return res.status(500).send(error.message);
    }
}

export default {
    signUp,
    signIn
};