import connection from '../connection/connection.js';

function urlSchema(req, res, next) {
    const { url } = req.body;

    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  
    if(!pattern.test(url)) {
        return res.status(422).send('O texto enviado não é uma URL válida!');
    }

    res.locals.url = url;

    next(); 
}

async function hasURL(req, res, next) {
    const { id, shortUrl } = req.params;
    let url;

    try {
        if(id) {
            url = await connection.query(`
            SELECT 
                id,
                "shortUrl",
                url,
                "userId"
            FROM urls
                WHERE id = $1;
        `,[id]);
        }

        if(shortUrl) {
            url = await connection.query(`
            SELECT 
                id,
                "visitCount",
                url
            FROM urls
                WHERE "shortUrl" = $1;
        `,[shortUrl]);
        }
        
        if(!url.rows[0]) {
            return res.status(404).send('Não foi possível encontrar a URL!');
        }

        res.locals.url = url.rows[0];
    } catch(error) {
        return res.status(500).send(error.message);
    }
    
    next();
}

function allowDelete(req, res, next) {
    const { session, url } = res.locals;

    if(session.userId !== url.userId) {
        return res.status(401).send('Usuário não autorizado!');
    }
    
    next();
}

export default {
    urlSchema,
    hasURL,
    allowDelete
};