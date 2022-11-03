const url_global = "https://6361a838af66cc87dc2fd80f.mockapi.io/users/";
var idPut;
var myModal = new bootstrap.Modal(document.getElementById("dataModal"), {
  keyboard: false,
});

let inputPutNombre = document.getElementById("inputPutNombre");
let inputPutApellido = document.getElementById("inputPutApellido");
let btnModal = document.getElementById("btnSendChanges");

let getJSONData = function (url = "", method = "GET", body) {
  let result = {};
  showSpinner();
  return fetch(url_global + url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = "ok";
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = "error";
      result.data = error;
      hideSpinner();
      return result;
    });
};

const modifOpen = async (id) => {
  btnModal.style.display = "block";
  let data = await obtener(id, true);

  inputPutApellido.removeAttribute("disabled");
  inputPutNombre.removeAttribute("disabled");
  if (data) {
    inputPutNombre.value = data.data.name;
    inputPutApellido.value = data.data.lastname;
    myModal.toggle();
    btnModal.removeAttribute("disabled");
    idPut = id;
  }
};

const agregarOpen = async () => {
  btnModal.style.display = "block";
  inputPutNombre.value = "";
  inputPutApellido.value = "";
  idPut = "";
  btnModal.setAttribute("disabled", "");
};

function createHtml(lista) {
  let content = "";
  lista.forEach((e) => {
    content += `<tr>
        <th scope="row">${e.name}</th>
        <td>${e.lastname}</td>
        <td class="text-end">
            <button onclick="obtener(${e.id})" class="btn">
                <i class="bi bi-eye"></i>
            </button>
            <button onclick="modifOpen(${e.id})" class="btn">
                <i class="bi bi-pencil"></i>
            </button>
            <button onclick="borrar(${e.id})" class="btn">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    </tr>`;
  });
  document.getElementById("results").innerHTML = content;
  document.getElementById("count").innerHTML = lista.length;
}

async function listar() {
  let resultado = await getJSONData();
  console.log(resultado);
  createHtml(resultado.data);
}
listar();

async function obtener(user_id, returResul = false) {
  let resultado = await getJSONData(user_id);

  if (resultado.status == "ok") {
    if (returResul) {
      return resultado;
    }
    inputPutNombre.value = resultado.data.name;
    inputPutApellido.value = resultado.data.lastname;
    inputPutApellido.setAttribute("disabled", true);
    inputPutNombre.setAttribute("disabled", true);
    btnModal.style.display = "none";
    myModal.toggle();
  } else {
    showAlertError();
  }
}

async function agregar({ name, lastname }) {
  let resultado = await getJSONData("", "POST", { name, lastname });
  listar();
}

async function modificar(id, { name, lastname }) {
  let resultado = await getJSONData(id, "PUT", { name, lastname });
  listar();
}

async function borrar(id) {
  let resultado = await getJSONData(id, "DELETE");

  if (resultado.status == "ok") {
    listar();
  } else {
    showAlertError();
  }
}
///////////////////////////////////////////////////////////////

inputPutNombre.addEventListener("input", () => {
  if (inputPutNombre.value && inputPutApellido.value) {
    btnModal.removeAttribute("disabled");
  } else {
    btnModal.setAttribute("disabled", "");
  }
});
inputPutApellido.addEventListener("input", () => {
  if (inputPutNombre.value && inputPutApellido.value) {
    btnModal.removeAttribute("disabled");
  } else {
    btnModal.setAttribute("disabled", "");
  }
});

function showAlertError() {
  document.getElementById("alert-danger").classList.add("show");
  hiddeAlertError();
}

function hiddeAlertError() {
  setTimeout(
    () => document.getElementById("alert-danger").classList.remove("show"),
    3000,
  );
}

btnModal.addEventListener("click", () => {
  if (idPut) {
    modificar(idPut, {
      name: inputPutNombre.value,
      lastname: inputPutApellido.value,
    });
  } else {
    agregar({
      name: inputPutNombre.value,
      lastname: inputPutApellido.value,
    });
  }
  myModal.toggle();
});
