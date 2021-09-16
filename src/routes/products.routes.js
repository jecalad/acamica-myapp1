const express = require('express');
const router = express.Router();
const product = require('../models/products.model');
const User = require('../models/User.model');

/**
 * @swagger
 * /products:
 *  get:
 *      summary: Returns products list
 *      tags: [Products]
 *      responses:
 *          200:
 *              description: return the list of products
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Product'
 */

router.get('/', (req, res)=>{
    res.json(product.findALL());
});


/**
 * @swagger
 * /products:
 *  post:
 *      summary: add new products by admin only
 *      tags: [Products]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Product'
 *      responses:
 *          200:
 *              description: Producto creado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Product'
 *          500:
 *              description: internal server error or product duplicated
 *          401:
 *              description: not authorized to add new products
 */
router.post('/', (req, res)=>{
    const auth = req.headers.authorization;
    let buff = Buffer.from(auth.split(' ')[1], 'base64');
    let text = buff.toString('ascii');
    let reqUser = text.split(':');
    
    const users = User.findALL().filter(u => u.Email === reqUser[0]);
    if (users[0].Email === reqUser[0] && users[0].isAdmin){
        const validarProduct = product.findALL().filter(prod => prod.Nombre === req.body.Nombre)
        if (validarProduct <= 0){
            product.createNewProduct(req.body.Nombre, req.body.Descripcion, req.body.Precio)
            res.json(product.findALL());
        }else{ res.status(500).send("Product Dup!")}
    }else{ res.status(401).json(-1);}
});


/**
 * @swagger
 * /products/{id}:
 *  put:
 *      summary: update products by admin only
 *      tags: [Products]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: id of product to be updated
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UpdateProduct'
 *      responses:
 *          200:
 *              description: Producto actualizado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Product'
 *          500:
 *              description: internal server error or product duplicated
 *          404:
 *              description: product not found
 *          401:
 *              description: not allowed to modify products
 */
router.put('/:id', (req, res)=>{
    const auth = req.headers.authorization;
    let buff = Buffer.from(auth.split(' ')[1], 'base64');
    let text = buff.toString('ascii');
    let reqUser = text.split(':');
    
    const users = User.findALL().filter(u => u.Email === reqUser[0]);
    const { id } = req.params;
    
    if (users[0].Email === reqUser[0] && users[0].isAdmin){
        const products = product.findALL().find(p => p.Id == id)
        if (products.length <=0){
            res.status(404).send("product not found")
        }else{
            product.updateProduct(req.body.Nombre, req.body.Descripcion, req.body.Precio, id)
            res.json(product.findALL());
        }
       
    }else{
        res.status(401).json("not allowed to update products");
    }
});

/**
 * @swagger
 * /products/{id}:
 *  delete:
 *      summary: delete specific product by admin only
 *      tags: [Products]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: number
 *              required: true
 *              description: id of the product to be deleted
 *      responses:
 *          200:
 *              description: Producto eliminado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Product'
 *          404:
 *              description: User not found
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
        const products = product.findALL().find(i => i.Id == id)
        if (products.length <=0){
            res.status(404).send("product not found")
        }else{
            product.deleteProduct(id)
            res.json(product.findALL());
        }
       
    }else{
        res.status(401).json("not allowed to delete products");
    }
});

module.exports = router;

/**
 * @swagger
 * tags:
 *  name: Products
 *  description: product section
 * components:
 *  schemas:
 *      Product:
 *          type: object
 *          required:
 *              - Nombre
 *              - Descripcion
 *              - Precio
 *          properties:
 *              id:
 *                  type: string
 *                  description: Product ID
 *              Nombre:
 *                  type: string
 *                  description: Product name
 *              Descripcion:
 *                  type: string
 *                  description: Product description
 *              Precio:
 *                  type: number
 *                  description: product price
 *          example:
 *              Id: 1
 *              Nombre: Hamburguesa Clasica
 *              Descripcion: La Hamburguesa con pan ajonjolí, carne, queso, tomate, lechuga y nuestras salsas especiales
 *              Precio: 12000
 *      DeleteProduct:
 *          type: object
 *          required:
 *              - Nombre
 *          properties:
 *              Nombre:
 *                  type: string
 *                  description: name of the product to be deleted
 *      UpdateProduct:
 *          type: object
 *          required:
 *              - Nombre
 *              - Descripcion
 *              - Precio
 *          properties:
 *              Nombre:
 *                  type: string
 *                  description: Name of the product
 *              Description:
 *                  type: string
 *                  description: product description
 *              Precio:
 *                  type: number
 *                  description: Product price
 *          example:
 *              Nombre: Hamburguesa Clasica
 *              Descripcion: La Hamburguesa con pan ajonjolí, carne, queso, tomate, lechuga y nuestras salsas especiales
 *              Precio: 12000
 */