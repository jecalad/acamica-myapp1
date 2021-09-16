const productModel = require('../models/products.model');
const userModel = require('../models/User.model');
class Order{
    constructor(orderId, Nombre, Email, ProductoID, productName, Direccion){
        this.Id = orderId;
        this.Nombre = Nombre;
        this.Email = Email;
        this.Producto = [
            {   "Id" : ProductoID,
                "Nombre": productName
            }
        ];
        this.Estado = "pidiendo";
        this.Direccion = Direccion;
        this.Closed = false;
    }
}

const orders = [
    {
        "Id": 1,
        "Nombre": "Juan",
        "Email": "jecalad@gmail.com",
        "Producto": [
            {"Id"  : 2,
             "Nombre": "Hamburguesa Especial"
            }
        ],
        "Direccion": "calle37#45-34",
        "Estado": "pidiendo",
        "Closed": false
    },
    {
        "Id": 2,
        "Nombre": "Marcelo",
        "Email": "mflorez@gmail.com",
        "Producto": [
            {"Id"  : 3,
             "Nombre": "Perro Sencillo"
            }
        ],
        "Direccion": "carrera67#12-10",
        "Estado": "pidiendo",
        "Closed": false
    },
    {
        "Id": 3,
        "Nombre": "Belen",
        "Email": "bfernandez@gmail.com",
        "Producto": [
            {"Id"  : 1,
             "Nombre": "Hamburguesa Clasica"
            }
        ],
        "Direccion": "circular3#23-59",
        "Estado": "pidiendo",
        "Closed": false
    }
];

const findALL =  ()=>{
    return orders
}

const createNewOrder = (Nombre, Email, productID, Direccion)=>{

    ProductName = productModel.findALL().map(p => {
        if (p.Id == productID){
            productName = p.Nombre
            return productName
        }else{
            return false
        }
    })
    productNombre = ProductName.filter(p=> p !== false)

    if(userModel.findALL().filter(u => u.Email == Email).length <= 0) return false; 
    let valClosed = orders.findIndex(i => i.Email == Email);
    if (valClosed <0){}else{
        if (orders[valClosed].Closed == "true"){
            const orderid = orders.length+1;
            const order = new Order(orderid,Nombre, Email, productID, productNombre[0], Direccion);
            orders.push(order)
            return true
        }
    }
    
    if( productNombre <= 0) return false;
   
    if(orders.map(o => o.Email == Email).filter(o => o == true)[0]){
       index = orders.findIndex(i => i.Email == Email);
        orders[index].Producto.push(
            {"Id"  : productID,
             "Nombre": productNombre[0]
            }
        )
        return true

    }else{
        ProductName = productModel.findALL().map(p => {
            if (p.Id == productID){
                productName = p.Nombre
                return productName
            }else{
                return false
            }
        })
        productNombre = ProductName.filter(p=> p !== false)
        if( productNombre <= 0) return false;
        const orderid = orders.length+1;
        const order = new Order(orderid,Nombre, Email, productID, productNombre[0], Direccion);
        orders.push(order)
        return true
    }
    
}

const updateOrder = (orderid, direccion)=>{
    const index = orders.findIndex(i => i.Id == orderid);
    orders[index].Direccion = direccion;
}

const updateOrderClosed = (email, id)=>{
   
    const index = orders.findIndex(i=>i.Id == id);
    const valord = orders.find(o => o.Id == id )
    if(valord<0) return false;

    if (valord.Email == email){
        if (valord.Closed){
            return false
        }else{
            orders[index].Closed = true;
            orders[index].Estado = "confirmado"
            return true
        }
    }else{
        return false;
    }
}

const updateOrderStatus = (orderId, status)=>{
    const index = orders.findIndex(i => i.Id == orderId)
    if (orders[index].Estado == "entregado") return false;
    if (orders[index].Estado == "pidiendo") return false;

    if (orders[index].Estado == "en camino"){
        if (status == "preparacion" || "confirmado" || "pidiendo") return false;
    }else{
        if (orders[index].Estado == "preparacion"){
            if(status == "confirmado" || "pidiendo") return false;
        }else{
            orders[index].Estado = status;
            return true
        }
    }
}

const cancelOrder = (orderId)=>{
    const index = orders.findIndex(i=>i.Id === orderId);
    orders.splice(index, 1);
    return true
}

module.exports = {findALL, createNewOrder, updateOrder, updateOrderClosed, updateOrderStatus, cancelOrder};