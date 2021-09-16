const express = require('express');
const router = express.Router();
const User = require('../models/User.model');

/**
 * @swagger
 * /register:
 *  post:
 *      summary: Create new user
 *      tags: [Registro]
 *      security: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *              description: registro exitoso
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          500:
 *              description: internal server error or email duplicated
 */

router.post('/', (req, res)=>{

    const validarUser = User.findALL().filter(u => u.Email === req.body.Email);
    if (validarUser <= 0){
        if(req.body.Nombre =="" || req.body.Apellido == "" || req.body.Email =="" || req.body.Telefono =="" || req.body.Pais =="" || req.body.Pass =="") return res.status(500).json("no se permiten campos vacios")
        User.createNewUser(req.body.Nombre, req.body.Apellido, req.body.Email,req.body.Telefono, req.body.Pais, req.body.Pass)
        res.status(200).send("registro exitoso")
    }else{res.status(500).send("Email Dup!")}
    
});

/**
 * @swagger
 * tags:
 *  name: Registro
 *  description: SignUp section
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          required:
 *              - Nombre
 *              - Apellido
 *              - Email
 *              - Telefono
 *              - Pais
 *              - Pass
 *          properties:
 *              Nombre:
 *                  type: string
 *                  description: user name
 *              Apellido:
 *                  type: string
 *                  description: user last name
 *              Email:
 *                  type: string
 *                  description: user email used for system log in
 *              Telefono:
 *                  type: number
 *                  description: user cellphone number
 *              Pais:
 *                  type: string
 *                  description: user country of residence
 *              Pass:
 *                  type: string
 *                  description: user password for system log in
 *          example:
 *              Nombre: Liliana
 *              Apellido: Trujillo
 *              Email: ltrujillo@gmail.com
 *              Telefono: 3107377784
 *              Pais: Colombia
 *              Pass: 123456
 */

module.exports = router;