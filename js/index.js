function validarCamposFormulario(datos) {
  if (datos === null || typeof datos !== "object") {
    return false;
  }

  const errores = obtenerErroresFormulario(datos);

  return (!errores.nombre && !errores.descripcion && !errores.fechaEntrega && !errores.estado);
}

function obtenerErroresFormulario(datos) {
  const errores = {};
  const nombre = datos.nombre;
  const descripcion = datos.descripcion;
  const fechaEntrega = datos.fechaEntrega;
  const estado = datos.estado;

  if (typeof nombre !== "string" || nombre.trim() === "") {
    errores.nombre = "Ingresa el nombre de la tarea";
  }
  if (typeof descripcion !== "string" || descripcion.trim() === "") {
    errores.descripcion = "Ingresa la descripción de la tarea";
  }

  if (typeof fechaEntrega !== "string" || fechaEntrega === "") {
    errores.fechaEntrega = "Selecciona una fecha de entrega válida";
  }

  if (  typeof estado !== "string" || !["pendiente", "en-progreso", "completada"].includes(estado)) {
    errores.estado = "Selecciona un estado";
  }

  return errores;
}

const formularioTarea = document.querySelector("#task-form");
const listaTareas = document.querySelector("#task-list");

function enviarFormulario(evento) {
  evento.preventDefault();

  const entradaNombreTarea = document.querySelector("#task-name");
  const nombre = entradaNombreTarea.value;
  const entradaDescripcion = document.querySelector("#task-description");
  const descripcion = entradaDescripcion.value;
  const entradaFechaEntrega = document.querySelector("#task-due-date");
  const fechaEntrega = entradaFechaEntrega.value;
  const entradaEstado = document.querySelector("#task-status");
  const estado = entradaEstado.value;

  const datos = {
    nombre,
    descripcion,
    fechaEntrega,
    estado,
  };

  console.log("nombre: " + nombre);
  console.log("descripción: " + descripcion);
  console.log("fecha de entrega: " + fechaEntrega);
  console.log("estado: " + estado);

  const formularioValido = validarCamposFormulario(datos);
  let errores = {};
  if (!formularioValido) {
    errores = obtenerErroresFormulario(datos);
  }
  const campos = {
    nombre: {
      input: entradaNombreTarea,
      feedback: document.querySelector("#task-name-error"),
    },
    descripcion: {
      input: entradaDescripcion,
      feedback: document.querySelector("#task-description-error"),
    },
    fechaEntrega: {
      input: entradaFechaEntrega,
      feedback: document.querySelector("#task-due-date-error"),
    },
    estado: {
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

const taskManager = new TaskManager();
taskManager.inicializarTarjetas(listaTareas);

console.log(taskManager.tasks);

listaTareas.addEventListener("click", (evento) => {
  const boton = evento.target.closest(".task-status-toggle");
  if (!boton || !listaTareas.contains(boton)) {
    return;
  }

  const tarjeta = boton.closest(".card");
  taskManager.cambiarEstadoTask(tarjeta);
});