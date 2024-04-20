const jwt = require('jsonwebtoken');
const { ADMIN_ROLE } = require('../const/variables');


// =====================
// Verify JWT
// =====================
let verifyToken = async (req, res, next) => {

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

    if (user.role === ADMIN_ROLE) {
        next();
    } else {
        return res.status(401).json({ error: 'Acción no permitida, intente más tarde' });
    }
};



module.exports = {
    verifyToken,
    verifyAdminRole
}