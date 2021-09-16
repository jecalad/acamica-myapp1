class Usuarios{
    constructor(Nombre, Apellido ,Email, Telefono, Pais, Pass){
        this.Nombre = Nombre;
        this.Apellido = Apellido;
        this.Email = Email;
        this.Telefono = Telefono;
        this.Pais = Pais;
        this.Pass = Pass;
        this.isAdmin = false;
    }

}

const users = [{
    "Nombre"    : "Juan",
    "Apellido"  : "Calad",
    "Email"     : "jecalad@gmail.com",
    "Telefono"   : 3122915658,
    "Pais"      : "Colombia",
    "Pass"      : 1234,
    "isAdmin"   : true

},{
    "Nombre"    : "Marcelo",
    "Apellido"  : "Florez",
    "Email"     : "mflorez@gmail.com",
    "Telefono"   : 3122915658,
    "Pais"      : "Argentina",
    "Pass"      : 2345,
    "isAdmin"   : false

},{
    "Nombre"    : "Belen",
    "Apellido"  : "Fernandez",
    "Email"     : "bfernandez@gmail.com",
    "Telefono"   : 3122915658,
    "Pais"      : "Argentina",
    "Pass"      : 3456,
    "isAdmin"   : false

}
];

const findALL = ()=>{
    return users;
}

const createNewUser = (nombre, apellido, email, telefono, pais, pass)=>{
    const usuario = new Usuarios(nombre, apellido, email, telefono, pais, pass, isAdmin = false);
    users.push(usuario);
}

const updateUser = (nombre, apellido, email, telefono, pais, pass, admin)=>{
    const index = users.findIndex( i => i.Email == email);
    if (index < 0) return false;
    users[index].Nombre = nombre;
    users[index].Apellido = apellido;
    users[index].Email = email;
    users[index].Telefono = telefono;
    users[index].Pais = pais;
    users[index].Pass = pass;
    users[index].isAdmin =admin;
    return true
}

const deleteUser = (UserEmail)=>{
    const index = users.findIndex(usu => usu.Email == UserEmail);
    console.log(index);
    if (index <0) return false;
    users.splice(index, 1)
    return true
}

module.exports = {findALL, createNewUser, updateUser, deleteUser};