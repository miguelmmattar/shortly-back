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

async function getRanking(req, res) {
    try {
        const ranking = await connection.query(`
        SELECT 
            users.id,
            users.name,
            COUNT(urls.id) AS "linksCount",
            COALESCE(SUM(urls."visitCount"), 0) AS "visitCount"
        FROM 
            users
        LEFT JOIN urls
            ON users.id = urls."userId"
        GROUP BY users.id
        ORDER BY "visitCount" DESC
        LIMIT 10;
        `);

        res.status(200).send(ranking.rows);
    } catch(error) {
        return res.status(500).send(error.message);
    }
}

export default {
    getUser,
    getRanking
};