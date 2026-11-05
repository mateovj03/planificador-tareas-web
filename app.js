function validFormFieldInput(datos) {
  if (datos === null || typeof datos !== "object") {
    return false;
  }

  const errores = obtenerErroresFormulario(datos);

  return (!errores.name && !errores.description && !errores.dueDate && !errores.status);
}

function obtenerErroresFormulario(datos) {
  const errores = {};
  const nombre = datos.name;
  const descripcion = datos.description;
  const fechaEntrega = datos.dueDate;
  const estado = datos.status;

  if (typeof nombre !== "string" || nombre.trim() === "") {
    errores.name = "Ingresa el nombre de la tarea";
  }
  if (typeof descripcion !== "string" || descripcion.trim() === "") {
    errores.description = "Ingresa la descripción de la tarea";
  }

  if (typeof fechaEntrega !== "string" || fechaEntrega === "") {
    errores.dueDate = "Selecciona una fecha de entrega válida";
  }

  if (  typeof estado !== "string" || !["pendiente", "en-progreso", "completada"].includes(estado)) {
    errores.status = "Selecciona un estado";
  }

  return errores;
}

const formularioTarea = document.querySelector("#task-form");

function enviarFormulario(evento) {
  evento.preventDefault();

  const newTaskNameInput = document.querySelector("#task-name");
  const name = newTaskNameInput.value;
  const entradaDescripcion = document.querySelector("#task-description");
  const descripcion = entradaDescripcion.value;
  const entradaFechaEntrega = document.querySelector("#task-due-date");
  const fechaEntrega = entradaFechaEntrega.value;
  const entradaEstado = document.querySelector("#task-status");
  const estado = entradaEstado.value;

  const datos = {
    name,
    description: descripcion,
    dueDate: fechaEntrega,
    status: estado,
  };

  console.log("name: " + name);
  console.log("description: " + descripcion);
  console.log("due date: " + fechaEntrega);
  console.log("status: " + estado);

  const formularioValido = validFormFieldInput(datos);
  let errores = {};
  if (!formularioValido) {
    errores = obtenerErroresFormulario(datos);
  }
  const campos = {
    name: {
      input: newTaskNameInput,
      feedback: document.querySelector("#task-name-error"),
    },
    description: {
      input: entradaDescripcion,
      feedback: document.querySelector("#task-description-error"),
    },
    dueDate: {
      input: entradaFechaEntrega,
      feedback: document.querySelector("#task-due-date-error"),
    },
    status: {
      input: entradaEstado,
      feedback: document.querySelector("#task-status-error"),
    },
  };

  Object.keys(campos).forEach((nombreCampo) => {
    const campo = campos[nombreCampo];
    const mensajeError = errores[nombreCampo] || "";
    campo.feedback.textContent = mensajeError;

    if (mensajeError !== "") {
      campo.input.classList.add("is-invalid");
      campo.input.setAttribute("aria-invalid", "true");
    } else {
      campo.input.classList.remove("is-invalid");
      campo.input.setAttribute("aria-invalid", "false");
    }
  });
}

formularioTarea.addEventListener("submit", enviarFormulario);