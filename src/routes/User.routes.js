const express = require('express');
const router = express.Router();
const User = require('../models/User.model');

/**
 * @swagger
 * /users:
 *  get:
 *      summary: Returns users list to Admins only
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: return the list of users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/User'
 *          401:
 *              description: username and password required or not authorized for listing
 */
router.get('/', (req, res)=>{
    const auth = req.headers.authorization;
    let buff = Buffer.from(auth.split(' ')[1], 'base64');
    let text = buff.toString('ascii');
    let reqUser = text.split(':');
    
    const users = User.findALL().filter(u => u.Email === reqUser[0]);
    
    if (users[0].Email === reqUser[0] && users[0].isAdmin) return res.json(User.findALL());
    res.status(401).json(-1);
});


/**
 * @swagger
 * /users/{email}:
 *  put:
 *      summary: update user data
 *      tags: [Users]
 *      parameters:
 *          -   in: path
 *              name: email
 *              schema:
 *                  type: string
 *              required: true
 *              description: email of the user to be updated
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UpdateUser'
 *                      
 *      responses:
 *          200:
 *              description: Usuario actualizado exitosamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          500:
 *              description: no se puede actualizar el usuario
 *          404:
 *              description: usuario no encontrado
 */
router.put('/:email', (req, res)=>{
    const auth = req.headers.authorization;
    let buff = Buffer.from(auth.split(' ')[1], 'base64');
    let text = buff.toString('ascii');
    let reqUser = text.split(':');
    
    const users = User.findALL().filter(u => u.Email === reqUser[0]);
    const { email } = req.params;
    
    if(users <= 0) return res.status(404).json("usuario no valido");

    if (users[0].Email === reqUser[0] && users[0].isAdmin){
        const updateUser = User.updateUser(req.body.Nombre, req.body.Apellido, email, req.body.Telefono, req.body.Pais, req.body.Pass, req.body.isAdmin);
        if (!updateUser) return res.status(500).json("no se puede actualizar el usuario")
        res.status(200).json(User.findALL())
    }else{
        if (users[0].Email === email){
            const updateUser = User.updateUser(req.body.Nombre, req.body.Apellido, email, req.body.Telefono, req.body.Pais, req.body.Pass, false); 
            res.status(200).json("usuario actualizado exitosamente")
        }else{
            return res.status(500).json("no se puede actualizar el usuario!")
        }

    }
    
});

/**
 * @swagger
 * /users/{email}:
 *  delete:
 *      summary: delete specific user
 *      tags: [Users]
 *      parameters:
 *          -   in: path
 *              name: email
 *              schema:
 *                  type: string
 *              required: true
 *              description: email of the user to be deleted
 *      responses:
 *          200:
 *              description: usuario eliminado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/User'
 *          404:
 *              description: User not found
 *          401:
 *              description: not allowed to delete users
 */

router.delete('/:email', (req, res)=>{
    const auth = req.headers.authorization;
    let buff = Buffer.from(auth.split(' ')[1], 'base64');
    let text = buff.toString('ascii');
    let reqUser = text.split(':');
    
    const users = User.findALL().filter(u => u.Email === reqUser[0]);
    const { email } = req.params;
    
    if (users[0].Email === reqUser[0] && users[0].isAdmin){
        const deleteUser = User.deleteUser(email);
        if (!deleteUser) return res.status(404).json("Email not found")
        res.json(User.findALL());
    }else{
        res.status(401).json(-1);
    }
});



module.exports = router;

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: user section
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
 *              isAdmin:
 *                  type: boolean
 *                  description: Admins users
 *          example:
 *              Nombre: Liliana
 *              Apellido: Trujillo
 *              Email: ltrujillo@gmail.com
 *              Telefono: 3107377784
 *              Pais: Colombia
 *              Pass: 123456
 *              isAdmin: false
 *      DeleteUser:
 *          type: object
 *          required:
 *              - Email
 *          properties:
 *              Email:
 *                  type: string
 *                  description: Email of the user to be deleted
 *      UpdateUser:
 *          type: object
 *          required:
 *              - Nombre
 *              - Apellido
 *              - Telefono
 *              - Pais
 *              - Pass
 *          properties:
 *              Nombre:
 *                  type: string
 *                  description: User name
 *              Apellido:
 *                  type: string
 *                  description: User last name
 *              Telefono:
 *                  type: number
 *                  description: user phone number
 *              Pais:
 *                  type: string
 *                  description: user country
 *              Pass:
 *                  type: string
 *                  description: user password for system login
 */

