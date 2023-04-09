const jwt = require('jsonwebtoken');


// =====================
// Verify JWT
// =====================
let verifyToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.JWT_SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        req.user = decoded.user;
        next();

    });

};

// =====================
// Verify AdminRole
// =====================
let verifyAdminRole = (req, res, next) => {

    let user = req.user;

    if (user.role === '1') {
        next();
    } else {
        return res.json({ message: 'El usuario no tiene permisos' });
    }
};



module.exports = {
    verifyToken,
    verifyAdminRole
}