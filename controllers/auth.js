const bcrypt = require('bcryptjs');
const Users = require("../models/Users");
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Users.findOne({ email });

    if( user ){
        return res.status(400).json({
            ok: false,
            msg: 'Un usuario existe con ese email'
        });
    }

    user = new Users(req.body);

    //Encriptar password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync( password, salt );

    await user.save();
    // Generar JWT
    const token = await generateJWT( user.id, user.name );

    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token
    });
    
  } catch (error) {
    res.status(500).json({
        ok: false,
        msg: 'Ups algo salio mal'
    })
  }
};

const revalidateToken = async(req, res) => {
  
  const uid = req.uid;
  const name = req.name;
  
  // generar un nuevo JWT
  const token = await generateJWT( uid, name );

  res.json({
    ok: true,
    uid,
    name,
    token
  });
};

const loginUser = async(req, res) => {
  const { email, password } = req.body;

  try {

    const user = await Users.findOne({ email });

    if( !user ){
        return res.status(400).json({
            ok: false,
            msg: 'El usuario no existe con ese email'
        });
    }

    // Confirmar los password
    const validPassword = bcrypt.compareSync( password, user.password );

    if( !validPassword ){
      return res.status(400).json({
          ok:false,
          msg: 'Password incorrecto'
      });
    }

    // Generar token
    const token = await generateJWT( user.id, user.name );

    res.json({
      ok: true,
      uid: user.id,
      name: user.name,
      token
    })

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Ups algo salio mal'
  })    
  }
};

module.exports = {
  createUser,
  revalidateToken,
  loginUser,
};
