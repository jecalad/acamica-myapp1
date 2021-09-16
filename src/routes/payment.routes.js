const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const Payment = require('../models/payment.models');


/**
 * @swagger
 * /payment:
 *  get:
 *      summary: Returns users list of payment methods
 *      tags: [Payment]
 *      responses:
 *          200:
 *              description: return the list of payment methods
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Payment'
 */
router.get('/', (req, res)=>{
    res.json(Payment.findALL());
});

/**
 * @swagger
 * /payment:
 *  post:
 *      summary: create new payment
 *      tags: [Payment]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Payment'
 *      responses:
 *          200:
 *              description: Metodo de pago creado exitoso
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Payment'
 *          500:
 *              description: internal server error or payment method duplicated
 *          401:
 *              description: not authorized to create payment method
 */
router.post('/', (req, res)=>{
    const auth = req.headers.authorization;
    let buff = Buffer.from(auth.split(' ')[1], 'base64');
    let text = buff.toString('ascii');
    let reqUser = text.split(':');
    
    const users = User.findALL().filter(u => u.Email === reqUser[0]);
    if (users[0].Email === reqUser[0] && users[0].isAdmin){
        const validarPayment = Payment.findALL().filter(pay => pay.Nombre === req.body.Nombre || pay.Tipo === req.body.Tipo)
        if (validarPayment <= 0){
            Payment.createNewPayment(req.body.Nombre, req.body.Descripcion, req.body.Tipo)
            res.json(Payment.findALL());
        }else{ res.status(500).send("Payment Dup!")}
    }else{ res.status(401).json(-1);}
});

/**
 * @swagger
 * /payment/{id}:
 *  put:
 *      summary: Update payment
 *      tags: [Payment]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: id of the payment method to be updated
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UpdatePayment'
 *      responses:
 *          200:
 *              description: Metodo de pago actualizado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Payment'
 *          401:
 *              description: not authorized to update payment method
 *          404:
 *              description: payment not found
 */
router.put('/:id', (req, res)=>{
    const auth = req.headers.authorization;
    let buff = Buffer.from(auth.split(' ')[1], 'base64');
    let text = buff.toString('ascii');
    let reqUser = text.split(':');
    
    const users = User.findALL().filter(u => u.Email === reqUser[0]);
    const { id } = req.params;
    
    if (users[0].Email === reqUser[0] && users[0].isAdmin){
        const payments = Payment.findALL().find(i => i.Id == id)
        if (payments.length <=0){
            res.status(404).send("payment not found")
        }else{
            Payment.updatePayment(req.body.Nombre, req.body.Descripcion, req.body.Tipo, id);
            res.json(Payment.findALL());
        }
       
    }else{
        res.status(401).json("no autorizado");
    }
});

/**
 * @swagger
 * /payment/{id}:
 *  delete:
 *      summary: delete specific payment method
 *      tags: [Payment]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: ip of the payment method to be deleted
 *      responses:
 *          200:
 *              description: metodo de pago eliminado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Payment'
 *          404:
 *              description: Payment not found
 *          401:
 *              description: not allowed to delete users
 */
router.delete('/:id', (req, res)=>{
    const auth = req.headers.authorization;
    let buff = Buffer.from(auth.split(' ')[1], 'base64');
    let text = buff.toString('ascii');
    let reqUser = text.split(':');
    
    const users = User.findALL().filter(u => u.Email === reqUser[0]);
    const { id } = req.params;
    
    if (users[0].Email === reqUser[0] && users[0].isAdmin){
        const payments = Payment.findALL().find(i => i.Id == id)
        console.log(payments);
        if (payments.length <=0){
            res.status(404).send("payment not found")
        }else{
            Payment.deletePayment(id)
            res.json(Payment.findALL());
        }
       
    }else{
        res.status(401).json(-1);
    }
});

module.exports = router;

/**
 * @swagger
 * tags:
 *  name: Payment
 *  description: Payment Methods section
 * components:
 *  schemas:
 *      Payment:
 *          type: object
 *          required:
 *              - Nombre
 *              - Descripcion
 *              - Tipo
 *          properties:
 *              id:
 *                  type: number
 *                  description: payment type ID
 *              Nombre:
 *                  type: string
 *                  description: payment name
 *              Descripcion:
 *                  type: string
 *                  description: payment type description
 *              Tipo:
 *                  type: string
 *                  description: payment type
 *          example:
 *              Id: 1
 *              Nombre: Tarjeta Debito
 *              Descripcion: Se reciben tarjetas debido Maestro, MasterCard, Visa
 *              Tipo: Debito
 *      DeletePayment:
 *          type: object
 *          required:
 *              - Nombre
 *          properties:
 *              Nombre:
 *                  type: string
 *                  description: Name of the products to be deleted
 *      UpdatePayment:
 *          type: object
 *          required:
 *              - Nombre
 *              - Descripcion
 *              - Tipo
 *          properties:
 *              Nombre:
 *                  type: string
 *                  description: name of the payment method
 *              Descripcion:
 *                  type: string
 *                  description: payment type description
 *              Tipo:
 *                  type: string
 *                  description: type of payment
 */