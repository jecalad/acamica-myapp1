const express = require('express');
const router = express.Router();
const order = require('../models/order.models');
const User = require('../models/User.model');


/**
 * @swagger
 * /orderStatus/{status}/{id}:
 *  put:
 *      summary: update status of specific order
 *      tags: [OrderStatus]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: Id of the order to be updated
 *          -   in: path
 *              name: status
 *              schema:
 *                  type: string
 *              required: true
 *              description: new status of the order
 *      responses:
 *          200:
 *              description: order actualizada exitosamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/OrderStatus'
 *          500:
 *              description: an error has ocurred
 *          403:
 *              description: not allowed operation
 *          404:
 *              description: order not found
 */
router.put('/:status/:id', (req, res)=>{
    const auth = req.headers.authorization;
    let buff = Buffer.from(auth.split(' ')[1], 'base64');
    let text = buff.toString('ascii');
    let reqUser = text.split(':');

    const users = User.findALL().filter(u => u.Email === reqUser[0]);
    if (users[0].Email === reqUser[0] && users[0].isAdmin){
        valOrder = order.findALL().findIndex( i => i.Id == parseInt(req.params.id));
        if (valOrder <0 ){
            res.status(404).json("orden no encontrada")
        }else{
            const updateStatus = order.updateOrderStatus(parseInt(req.params.id), req.params.status);
            if (!updateStatus) return res.status(500).json("no se puede actualizar estado")
            res.json("orden actualizada exitosamente!")
        }
        
    }else{
        res.status(403).json("operacion no permitida")
    }







    
    //const valOrder = order.findALL().filter(ord => ord.Email === reqUser[0]);
    // if (valOrder <= 0) return res.json("orden no valida");
    //     valId = valOrder.map(valiD => valiD.Id === parseInt(req.params.id));
    //     if (valOrder[valId.indexOf(true)] == undefined) res.status(404).json("orden no encontrada")
    //     if (valOrder[valId.indexOf(true)].Id === parseInt(req.params.id)){
    //     const updateStatus = order.updateOrderStatus(parseInt(req.params.id), req.params.status);
    //         if (!updateStatus) return res.json("no se puede actualizar estado")
    //         res.json("orden actualizada exitosamente")
    //     }else {res.json("Orden no valida")}
 });


module.exports = router;

/**
 * @swagger
 * tags:
 *  name: OrderStatus
 *  description: Orders status section
 * components:
 *  schemas:
 *      OrderStatus:
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