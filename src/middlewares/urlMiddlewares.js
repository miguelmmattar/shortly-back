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

export default {
    urlSchema
};