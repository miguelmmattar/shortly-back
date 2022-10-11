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

async function visitURL(req, res) {
    const { id, visitCount, url } = res.locals.url;
    const count = visitCount + 1;

    try {
        await connection.query(`
            UPDATE
                urls
            SET "visitCount" = $1
                WHERE id = $2;
        `, [count, id]);

        res.redirect(url);
    } catch(error) {
        return res.status(500).send(error.message);
    }
}

async function deleteURL(req, res) {
    const { id } = res.locals.url;

    try {
        await connection.query(`
            DELETE FROM
                urls
                WHERE id = $1;
        `, [id]);

        res.sendStatus(204);
    } catch(error) {
        return res.status(500).send(error.message);
    }
}

export default {
    postURL,
    getURL,
    visitURL,
    deleteURL
}