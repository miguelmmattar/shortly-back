import connection from '../connection/connection.js';

async function getUser(req, res) {
    const { id } = res.locals.user;

    try {
        const user = await connection.query(`
            SELECT 
                users.id,
                users.name,
                SUM(urls."visitCount") AS "visitCount",
                json_agg(json_build_object(
                    'id', urls.id,
                    'shortUrl', urls."shortUrl",
                    'url', urls.url,
                    'visitCount', urls."visitCount"
                )) AS "shortenedUrls"
            FROM
                users
            JOIN urls
                ON users.id = urls."userId"
                WHERE users.id = $1
            GROUP BY users.id;
        `, [id]);

        res.status(200).send(user.rows[0]);
    } catch(error) {
        return res.status(500).send(error.message);
    }
}

export default {
    getUser
}