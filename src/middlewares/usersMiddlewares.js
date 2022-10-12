import connection from '../connection/connection.js';

async function isUser(req, res, next) {
    const { userId } = res.locals.session;

    try {
        const user = await connection.query(`
            SELECT
                id
            FROM users
                WHERE id = $1;
        `, [userId]);

        if(!user.rows[0]) {
            res.status(404).send('Este usuário não existe!');
        }

        res.locals.user = user.rows[0];
    } catch(error) {
        return res.status(500).send(error.message);
    }

    next();
}

export default {
    isUser
};