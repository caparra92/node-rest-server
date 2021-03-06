const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middlewares/auth');

app.get("/usuario", verificaToken ,(req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);
  let limite = req.query.limite || 5;
  limite = Number(limite);

  Usuario.find({estado: true}, 'nombre email estado img google')
    .skip(desde)
    .limit(limite)
    .exec((err, usuario)=> {
      if(err) {
        return res.status(400).json({
            ok: false,
            err
        });
      }

      Usuario.countDocuments({estado:true}, (err, conteo)=>{
        res.json({
          ok: true,
          usuario,
          numero_usuarios: conteo
        })
      });
    });

});

app.post("/usuario", [verificaToken, verificaAdminRole],function (req, res) {
  let body = req.body;

  let  usuario = new Usuario({
      nombre: body.nombre,
      email: body.email,
      password: bcrypt.hashSync(body.password, 10),
      role: body.role
  });

  usuario.save((err, usuarioDB) => {
    if(err) {
        return res.status(400).json({
            ok: false,
            err
        });
    }

    res.json({
        ok: true,
        usuario: usuarioDB
    }) 
  });

});

app.put("/usuario/:id", [verificaToken, verificaAdminRole],function (req, res) {
  let id = req.params.id;
  let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])   ;

  Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'}, (err, usuarioDB)=> {
    if(err) {
      return res.status(400).json({
          ok: false,
          err
      });
    }
  
    res.json({
      ok: true,
      usuario: usuarioDB
    });
  })
});

app.delete("/usuario/:id", [verificaToken, verificaAdminRole],function (req, res) {
  let id = req.params.id;
  //eliminar fisicamente de la bd
  /* Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=> {
    if(err) {
      return res.status(400).json({
          ok: false,
          err
      });
    }

    if(!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no encontrado'
        }
      });
    }

    res.json({
      ok: true,
      usuario: usuarioBorrado
    });

  }); */
  //Eliminar cambiando estado a false
  Usuario.findById(id,(err, usuarioDB)=> {
    if(err) {
      return res.status(400).json({
          ok: false,
          err
      });
    }
    usuarioDB.estado = false;
    usuarioDB.save((_,usuarioDB)=>{
      res.json({
        ok: true,
        usuario: usuarioDB
      });
    });
  });
});

module.exports = app;