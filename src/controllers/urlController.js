import connection from '../connection/connection.js';
import { nanoid } from 'nanoid';

async function postURL(req, res) {
    const { session, url } = res.locals;
    const shortURL = nanoid(6);

    try {
        await connection.query(`
            INSERT INTO
                urls ("shortUrl", url, "userId")
            VALUES ($1, $2, $3);
        `, [shortURL, url, session.userId]);

        res.status(201).send({shortUrl: shortURL});
    } catch(error) {
        return res.status(500).send(error.message);
    }
}

async function getURL(req, res) {
    const { url } = res.locals;

    try {
        res.status(200).send(url);

    } catch(error) {
        return res.status(500).send(error.message);
    }
}

export default {
    postURL,
    getURL
}