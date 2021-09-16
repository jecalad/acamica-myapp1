class Products{
    constructor(Id, Nombre, Descripcion, Tipo){
        this.Id = Id;
        this.Nombre = Nombre;
        this.Descripcion = Descripcion;
        this.Tipo = Tipo;
    }

}

const payments = [
    {
        "Id":   1,
        "Nombre"    : "Tarjeta Debito",
        "Descripcion"  : "Se reciben tarjetas debido Maestro, MasterCard, Visa",
        "Tipo"     : "Debito",
    },
    {
        "Id":   2,
        "Nombre"    : "Tarjeta Crédito",
        "Descripcion"  : "Se reciben tarjeas Crédito VISA y MASTERCARD",
        "Tipo"     : "credito",
    },
    {
        "Id":   3,
        "Nombre"    : "Efectivo",
        "Descripcion"  : "efectivo al momento de la entrega",
        "Tipo"     : "efectivo",
    }
]

const findALL =  ()=>{
    return payments
}

const createNewPayment = (nombre, descripcion, tipo)=>{
    const paymentId = payments.length+1;
    const payment = new Products(paymentId, nombre, descripcion, tipo);
    payments.push(payment);
}

const updatePayment = (nombre, descripcion, Tipo, id)=>{
    const index = payments.findIndex(i => i.Id == id);
    payments[index].Nombre = nombre;
    payments[index].Descripcion = descripcion;
    payments[index].Tipo = Tipo;
}

const deletePayment = (id)=>{
    const index = payments.findIndex(i => i.Id == id);
    payments.splice(index, 1)
}

module.exports = {findALL, createNewPayment, updatePayment, deletePayment};