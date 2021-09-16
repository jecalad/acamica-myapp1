lusername = localStorage.getItem('lusername');
lpassword = localStorage.getItem('lpassword');

let credentials = btoa((lusername + ':' + lpassword).toString());
var auth = 'Basic ' + credentials

var myHeaders = new Headers();
myHeaders.append("Closed", "true");
myHeaders.append("Authorization", auth);

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("http://localhost:3000/orders", requestOptions)
  .then(response => response.text())
  .then(result => {
      var resultados = JSON.parse(result);
      document.getElementById('orders contenedor').innerHTML = "";
      resultados.forEach(e => {
        document.getElementById('orders contenedor').innerHTML += 
        `
        <div class="order">
            <ul>
                <li>Pedido #${e.Id}</li>
                <li>Nombre: ${e.Nombre}</li>
                <li>Email: ${e.Email}</li>
                <li>Productos:</li>
                    <ol>
                        ${e.Producto.map(o => `<li>${o.Nombre}</li>`).join("")}
                    </ol>
                <li>Estado: ${e.Estado}</li>
                <li>Direccion de envio: ${e.Direccion}</li>
            </ul>
            <form action="#" onsubmit="pedidos(${e.Id});return false" >
            <input type="submit" value="confirmar Orden" class="confirmarOrder">
            </form>
        </div>
        `
      });
  })
  .catch(error => console.log('error', error));

function pedidos(reqId){

  lusername = localStorage.getItem('lusername');
  lpassword = localStorage.getItem('lpassword');

  let credentials = btoa((lusername + ':' + lpassword).toString());
  var auth = 'Basic ' + credentials
  var myHeaders = new Headers();
  myHeaders.append("Authorization", auth);

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    redirect: 'follow'
  };

  reqURL = "http://localhost:3000/closeorder/"+reqId
  fetch(reqURL, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
    setTimeout(function(){
    window.location.replace("http://localhost:3000/pedidos.html")
  },1000)
}

document.getElementById('cerrarsesion').addEventListener('click', ()=>{
  localStorage.removeItem('lusername')
  localStorage.removeItem('lpassword')
});