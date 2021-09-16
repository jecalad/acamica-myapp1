const express = require('express');
const router = express.Router();
const order = require('../models/order.models');
const User = require('../models/User.model');

/**
 * @swagger
 * /orders:
 *  get:
 *      summary: Returns users list of orders by User, full list to admins
 *      tags: [Orders]
 *      responses:
 *          200:
 *              description: return the list of users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Order'
 */
router.get('/', (req, res)=>{
    const auth = req.headers.authorization;
    let buff = Buffer.from(auth.split(' ')[1], 'base64');
    let text = buff.toString('ascii');
    let reqUser = text.split(':');
    //console.log(reqUser[0]);
    const users = User.findALL().filter(u => u.Email === reqUser[0]);
    if (users[0].Email === reqUser[0] && users[0].isAdmin){
        res.json(order.findALL());
    }else{
        res.json(order.findALL().filter(ord => ord.Email === reqUser[0]))
    }
});

/**
 * @swagger
 * /orders:
 *  post:
 *      summary: create new Order or add products to an active order
 *      tags: [Orders]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/createOrder'
 *      responses:
 *          200:
 *              description: orden creada o actualizada
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Order'
 *          500:
 *              description: internal server error
 */
router.post('/', (req, res)=>{
    const auth = req.headers.authorization;
    let buff = Buffer.from(auth.split(' ')[1], 'base64');
    let text = buff.toString('ascii');
    let reqUser = text.split(':');
    
    const users = User.findALL().filter(u => u.Email === reqUser[0]);
    //console.log(users);
    
    createOrder = order.createNewOrder(req.body.Nombre, req.body.Email, req.body.ProductoId,req.body.Direccion);
    if(createOrder){
        res.status(200).json(order.findALL().filter(ord => ord.Email === reqUser[0]))
    }else{
        res.status(500).json("se ha producido un error")
    }
    
});

/**
 * @swagger
 * /orders:
 *  put:
 *      summary: Update certain parameters of ther order (address)
 *      tags: [Orders]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UpdateOrder'
 *      responses:
 *          200:
 *              description: orden creada o actualizada
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Order'
 *          401:
 *              operacion no valida
 */
router.put('/', (req, res)=>{
    const auth = req.headers.authorization;
    let buff = Buffer.from(auth.split(' ')[1], 'base64');
    let text = buff.toString('ascii');
    let reqUser = text.split(':');
    
    index = order.findALL().findIndex(i => i.Id == req.body.OrderId);
    if (index <0) {
        res.status(404).json("orden no valida")
    }else{
        valOrder = order.findALL()[index];
        if (valOrder.Closed) {
            res.status(403).json("La order ha sido cerrada")
        }else{
            order.updateOrder(req.body.OrderId ,req.body.Direccion)
            res.json(order.findALL().filter(u => u.Email == reqUser[0]))
        }
        
    }
    
 });

/**
 * @swagger
 * /orders/{id}:
 *  delete:
 *      summary: delete specific order
 *      tags: [Orders]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: Id of the order to be deleted
 *      responses:
 *          200:
 *              description: order eliminada exitosamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Order'
 *          500:
 *              description: order closed or an error has ocurred
 *          403:
 *              description: not allowed operation
 *          404:
 *              description: order not found
 */
router.delete('/:id', (req, res)=>{
    const auth = req.headers.authorization;
    let buff = Buffer.from(auth.split(' ')[1], 'base64');
    let text = buff.toString('ascii');
    let reqUser = text.split(':');

    let { id } = req.params
    id = parseInt(id);
    const orderDelete = order.findALL().find(ord => ord.Email == reqUser[0])
    if (orderDelete <= 0) return res.status(404).json("order not found")
    if (orderDelete.Id !== id) return res.status(403).json("operacion no permitida")
    if (orderDelete.Closed) return res.status(500).json("la order está cerrada")
    const deleteOrder = order.cancelOrder(id);
    if (deleteOrder) return res.status(200).json(order.findALL().filter(e => e.Email == reqUser[0]))
    res.status(500).json("se ha producido un error")
});
 
module.exports = router;

/**
 * @swagger
 * tags:
 *  name: Orders
 *  description: Orders section
 * components:
 *  schemas:
 *      Order:
 *          type: object
 *          required:
 *              - Id
 *              - Nombre
 *              - Email
 *              - Producto
 *              - Direccion
 *              - Estado
 *              - Closed
 *          properties:
 *              Id:
 *                  type: number
 *                  description: Order ID
 *              Nombre:
 *                  type: string
 *                  description: user who created the order
 *              Email:
 *                  type: string
 *                  description: user email used creating the order
 *              Producto:
 *                  type: array
 *                  description: list of products being ordered
 *                  items:
 *                      Id:
 *                          type: number
 *                          description: Id of the product
 *                      Nombre:
 *                          type: string
 *                          description: product name
 *              Direccion:
 *                  type: string
 *                  description: user primary address to deliver the order
 *              Estado:
 *                  type: string
 *                  description: order status of preparation
 *              Closed:
 *                  type: string
 *                  description: if order status is closed or not
 *          example:
 *              Id: 1
 *              Nombre: Liliana
 *              Email: ltrujillo@gmail.com
 *              Producto:
 *                  Id: 2
 *                  Nombre: Hamburguesa Especial
 *              Direccion: calle37#45-34
 *              Estado: pidiendo
 *              isAdmin: false
 *      createOrder:
 *          type: object
 *          required:
 *              - Nombre
 *              - Email
 *              - ProductoId
 *              - Direccion
 *          properties:
 *              Nombre:
 *                  type: string
 *                  description: user name
 *              Email:
 *                  type: string
 *                  description: user Email
 *              ProductoId:
 *                  type: number
 *                  description: Product ID to be ordered or added
 *              Direccion:
 *                  type: string
 *                  description: User address for delivery
 *          example:
 *              Nombre: Juan
 *              Email: jecalad@gmail.com
 *              ProductoId: 1
 *              Direccion: cra64C#48-56
 *      UpdateOrder:
 *          type: object
 *          required:
 *              - OrderId
 *              - Direccion
 *          properties:
 *              OrderId:
 *                  type: number
 *                  description: Order ID number
 *              Direccion:
 *                  type: string
 *                  description: address to be update
 *          example:
 *              OrderId: 1
 *              Direccion: calle67#54-297
 */