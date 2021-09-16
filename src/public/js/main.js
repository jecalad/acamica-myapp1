window.onload = function() {
    var overlay = document.getElementById('overlay');
    var popup = document.getElementById('popup');
    var btnCerrarPopup = document.getElementById('btn-cerrar-popup');

    overlay.classList.add('active');

    btnCerrarPopup.addEventListener('click', function() {
        overlay.classList.remove('active');
    });


    document.getElementById('submit').addEventListener('click', function(){
        let nombre = document.getElementById('Nombre').value;
        let apellido = document.getElementById('Apellido').value;
        let email = document.getElementById('Email').value;
        let telefono = document.getElementById('Telefono').value;
        let pais = document.getElementById('Pais').value
        let pass = document.getElementById('Pass').value;

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "Nombre": nombre,
        "Apellido": apellido,
        "Email": email,
        "Telefono": telefono,
        "Pais": pais,
        "Pass": pass
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("http://localhost:3000/register", requestOptions)
        .then(response => {
            if(response.status !== 200){
                document.getElementById('overlay').innerHTML = "";
                document.getElementById('overlay').innerHTML = "<h3 style='color: red'>se ha producido un error, vuelve a intentarlo</h3>";
            }
            console.log(response.status);
        return response.text()
        })
        .then(result => {
            console.log(result);
            if (result == "Email Dup!"){
                document.getElementById('overlay').innerHTML = "";
                document.getElementById('overlay').innerHTML += `
                <h3 style='color: red'>El correo ya existe!</h3><br>
                <div><a href='index.html' style='color: darksalmon;'>Volver</a></div>
                `;
            }else{
                document.getElementById('overlay').innerHTML = "";
                document.getElementById('overlay').innerHTML = "<h3 style='color: darksalmon'>EXITOSO!</h3>";
                document.getElementById('overlay').innerHTML += "<br><div><a href='index.html' style='color: darksalmon;'>Volver</a></div>"
            }
        })
        .catch(error => console.log('error', error));
    });


};