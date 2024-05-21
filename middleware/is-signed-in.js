
// Checks if user session exists and continues on the normal chain with next() if so
//  If check fails, user is redirected to sign-in page
//  Add query parameter to store page user tried to access
const isSignedIn = (req, res, next) => {
    if (req.session.user) return next()
    res.redirect(`/auth/sign-in?redirectUrl=${req.url}`)
}

module.exports = isSignedIn