const url_global = "https://6361a838af66cc87dc2fd80f.mockapi.io/users/"

let getJSONData = function (url = "",
    method = "GET", 
    body) {
    let result = {};
    showSpinner();
    return fetch(url_global + url,
        {
            method, headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw Error(response.statusText);
            }
        })
        .then(function (response) {
            result.status = 'ok';
            result.data = response;
              hideSpinner();
            return result;

        })
        .catch(function (error) {
            result.status = 'error';
            result.data = error;
            hideSpinner();
            return result;
        });
}

function createHtml(lista) {
    let content = "";
    lista.forEach(e => {
        content += `
        <li>
            <div>
                ID: ${e.id}
                <br>
                NAME: ${e.name}
                <br>
                LASTNAME: ${e.lastname}
            </div>
            <br>
        </li>
        `
    });
    document.getElementById("results").innerHTML = content

}

async function listar() {
    let resultado = await getJSONData();
    console.log(resultado);
    createHtml(resultado.data)
}

async function obtener(user_id, returResul = false) {
    
    let resultado = await getJSONData(user_id);
  
    if(resultado.status == "ok"){
        if(returResul){
            return resultado;
        }
        createHtml([resultado.data])
    }else{
        showAlertError();
    }
    
    
}

async function agregar({name, lastname}) {
    let resultado = await getJSONData("", "POST", {name, lastname});
    listar();
}

async function modificar(id, {name, lastname}) {
    let resultado = await getJSONData(id, "PUT", {name, lastname});
    listar();
}


async function borrar(id) {
    let resultado = await getJSONData(id, "DELETE");
    
    if(resultado.status == "ok"){
        listar();
    }else{
        showAlertError();
    }
    
}

document.getElementById("btnGet1").addEventListener("click", () =>{
    let input = document.getElementById("inputGet1Id").value;
    input? obtener(input) : listar();

})

let nameIn = document.getElementById("inputPostNombre")
let lastname = document.getElementById("inputPostApellido")
nameIn.addEventListener("input", ()=>{
    if(nameIn.value && lastname.value){
        document.getElementById("btnPost").removeAttribute('disabled');
    }else{
        document.getElementById("btnPost").setAttribute('disabled', '');
    }
})  
lastname.addEventListener("input", ()=>{
    if(nameIn.value && lastname.value){
        document.getElementById("btnPost").removeAttribute('disabled');
    }else{
        document.getElementById("btnPost").setAttribute('disabled', '');
    }
})  

document.getElementById("btnPost").addEventListener("click", ()=>{
    agregar({name:nameIn.value, lastname:lastname.value});

})

let modificarIn = document.getElementById("inputPutId")

modificarIn.addEventListener("input", (event)=>{
    if(event.target.value){
        document.getElementById("btnPut").removeAttribute('disabled');
    }else{
        document.getElementById("btnPut").setAttribute('disabled', '')
    }
})

///////////////////////////////////////////////////////////////

let inputPutNombre = document.getElementById("inputPutNombre")
let inputPutApellido = document.getElementById("inputPutApellido")

inputPutNombre.addEventListener("input", ()=>{
    if(inputPutNombre.value && inputPutApellido.value){
        document.getElementById("btnSendChanges").removeAttribute('disabled');
    }else{
        document.getElementById("btnSendChanges").setAttribute('disabled', '');
    }
})  
inputPutApellido.addEventListener("input", ()=>{
    if(inputPutNombre.value && inputPutApellido.value){
        document.getElementById("btnSendChanges").removeAttribute('disabled');
    }else{
        document.getElementById("btnSendChanges").setAttribute('disabled', '');
    }
})  

var idPut;
var myModal = new bootstrap.Modal(document.getElementById('dataModal'), {
    keyboard: false
  })

document.getElementById("btnPut").addEventListener("click", async ()=>{
    let id = modificarIn.value;

    let data =await obtener(id,true);

    console.log(data);

    if(data){
        inputPutNombre.value = data.data.name;
        inputPutApellido.value = data.data.lastname;
        myModal.toggle();
        document.getElementById("btnSendChanges").removeAttribute('disabled');
        idPut = id;
    }
})

function showAlertError() {
    document.getElementById("alert-danger").classList.add("show");
    hiddeAlertError();
}

function hiddeAlertError() {
    setTimeout( () => document.getElementById("alert-danger").classList.remove("show"), 3000) 
}

document.getElementById("btnSendChanges").addEventListener("click", ()=>{
    modificar(idPut, {name: inputPutNombre.value, lastname:inputPutApellido.value})
    myModal.toggle();
})

//////////////////////////////////////////////////////

let eliminarIn = document.getElementById("inputDelete")

eliminarIn.addEventListener("input", (event)=>{
    if(event.target.value){
        document.getElementById("btnDelete").removeAttribute('disabled');
    }else{
        document.getElementById("btnDelete").setAttribute('disabled', '')
    }
})

document.getElementById("btnDelete").addEventListener("click", ()=>{
    borrar(eliminarIn.value);
})