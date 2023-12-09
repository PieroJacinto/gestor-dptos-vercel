function userLoggedMiddleware (req,res,next) {
    
    res.locals.isLogged = false;
    if (req.session &&  req.session.userLogged){
        res.locals.isLogged = true
        res.locals.userLogged = req.session.userLogged
    }
    /*res.locals.isLogged = req.session && req.session.userLogged;
    res.locals.userLogged = (req.session && req.session.userLogged) ? req.session.userLogged : undefined,
    next();*/
    next()
}

module.exports = userLoggedMiddleware;