import connection from "../connection/connection.js";
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

async function signUp(req, res) {
    const { name, email, password } = req.body;

    try {
        connection.query(`
            INSERT INTO 
                users (name, email, "passwordHash")
            VALUES ($1, $2, $3);
        `, [name, email, bcrypt.hashSync(password, 10)]);
    } catch(error) {
        return res.status(500).send(error.message);
    }

    res.sendStatus(201);
}

export default {
    signUp
};