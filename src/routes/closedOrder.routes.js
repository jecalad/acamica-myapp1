const express = require('express');
const router = express.Router();
const order = require('../models/order.models');

/**
 * @swagger
 * /closeorder/{id}:
 *  put:
 *      summary: update order status to closed for confimation
 *      tags: [CloseOrder]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: Id of the order to be updated
 *      responses:
 *          200:
 *              description: order cerrada exitosamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          500:
 *              description: no se puede actualizar la orden
 *          403:
 *              description: not allowed operation
 *          404:
 *              description: order not found
 */
router.put('/:id', (req, res)=>{
    const auth = req.headers.authorization;
    let buff = Buffer.from(auth.split(' ')[1], 'base64');
    let text = buff.toString('ascii');
    let reqUser = text.split(':');
    
    const valOrder = order.findALL().filter(ord => ord.Email === reqUser[0]);
    const { id } = req. params;

    if (valOrder <= 0) return res.json("orden no valida");
    valId = valOrder.map(valiD => valiD.Id === parseInt(id));
    if (valOrder[valId.indexOf(true)] == undefined) return res.status(404).json("orden no encontrada o no pertenece al usuario")
    if (valOrder[valId.indexOf(true)].Id === parseInt(id)){
    const closeOrder = order.updateOrderClosed(reqUser[0], parseInt(id));
        if (!closeOrder) return res.json("Orden ya se encuentra cerrada o no valido")
        res.json("orden cerrrada exitosamente")
    }else {res.json("Orden no valida")}
    
    
 });

module.exports = router;

/**
 * @swagger
 * tags:
 *  name: CloseOrder
 *  description: close Order section
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
 */