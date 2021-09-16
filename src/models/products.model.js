class Products{
    constructor(Id, Nombre, Descripcion ,Precio){
        this.Id = Id;
        this.Nombre = Nombre;
        this.Descripcion = Descripcion;
        this.Precio = Precio;
    }

}

const products = [
    {
        "Id":   1,
        "Nombre"    : "Hamburguesa Clasica",
        "Descripcion"  : "La Hamburguesa con pan ajonjolí, carne, queso, tomate, lechuga y nuestras salsas especiales",
        "Precio"     : 12000,
    },
    {
        "Id":   2,
        "Nombre"    : "Hamburguesa Especial",
        "Descripcion"  : "La Hamburguesa con pan ajonjolí, carne, queso, tomate, lechuga, cebolla caramelizada, doblequeso, salsa JackDaniels",
        "Precio"     : 18000,
    },
    {
        "Id":   3,
        "Nombre"    : "Perro Sencillo",
        "Descripcion"  : "Perro sencillo con pan Zenu, salchicha, ensalada, ripio para y nuestras salsas",
        "Precio"     : 9000,
    },
    {
        "Id":   4,
        "Nombre"    : "Perro Especial",
        "Descripcion"  : "Perro sencillo con pan Zenu, salchicha Ranchera, queso derretido,  ensalada, ripio papa y nuestras salsas",
        "Precio"     : 13000,
    },

];

//Metodos

const findALL = ()=>{
    return products;
}

const createNewProduct = (nombre, descripcion, precio)=>{
    const productId = products.length+1;
    const product = new Products(productId, nombre, descripcion, precio);
    products.push(product);
}

const updateProduct = (nombre, descripcion, precio, id)=>{
    const index = products.findIndex(i => i.Id == id);

    products[index].Nombre = nombre;
    products[index].Descripcion = descripcion;
    products[index].Precio = precio;
}

const deleteProduct = (id)=>{
    const index = products.map(i => i.Id == id);
    products.splice(index, 1)
}

module.exports = {findALL, createNewProduct, updateProduct, deleteProduct};