document.getElementById('btn-submit').addEventListener('click', ()=>{
    let username = document.getElementById('usuario').value;
    let password = document.getElementById('password').value;
    document.getElementById('authresult').innerHTML = "<progress></progress>";

    localStorage.setItem('lusername', username);
    localStorage.setItem('lpassword', password);

    lusername = localStorage.getItem('lusername');
    lpassword = localStorage.getItem('lpassword');

    let credentials = btoa((lusername + ':' + lpassword).toString());
    var auth = 'Basic ' + credentials
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow'
    };
    
    setTimeout(function(){
        fetch("http://localhost:3000/login", requestOptions)
        .then(response => {
            if(response.status !== 200){
                document.getElementById('authresult').innerHTML = "";
                document.getElementById('authresult').innerHTML = "<h3 style='color: red'>Usuario o contraseña incorrecta</h3>";
            }
        return response.text()
        })
        .then(result => {
            if (result){
                document.getElementById('authresult').innerHTML = "";
                document.getElementById('authresult').innerHTML = "<h3 style='color: darksalmon'>Bienvenido</h3>";
                window.location.replace("http://localhost:3000/pedidos.html")
            }
        })
        .catch(error => console.log('error', error));
        },2000);
});

