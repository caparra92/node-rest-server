const jwt = require('jsonwebtoken');

//=====================
//    Verifica token
//=====================

const verificaToken = (req, res, next) => {
    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED,(err, decoded) => {
        if(err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
}

//=====================
//    Verifica AdminRole
//=====================

const verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;

    if(usuario.role === "ADMIN_ROLE") {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: "Rol de usuario no autorizado para esta solicitud"
            }
        });
    }  
}

module.exports = {
    verificaToken,
    verificaAdminRole
}