const validateMiddleware = (schema) => async (req, res, next) => {
    try{
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody;
        next();
    }catch(err){
        res.status(401).json({ message:err});
    }
}

module.exports = {validateMiddleware};