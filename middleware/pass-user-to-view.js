// Assign user information from the session to res.locals so that the user property is available in all views
// If user not signed in the res.locals will be set to null
const passUserToView = (req, res, next) => {
    res.locals.user = req.session.user ? req.session.user : null
    next()
}

module.exports = passUserToView