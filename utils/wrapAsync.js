// A utility function to wrap async route handlers and pass errors to next(). {another process to handle try catch mechanism.}
module.exports= (fn) => {
    return function(req, res, next) {
        fn(req, res, next).catch(next);
    };
};