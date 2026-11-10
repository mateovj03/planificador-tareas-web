class TaskManager {
    constructor() {
        this.tasks = [];
    }

    inicializarTarjetas(listaTareas) {
        let idTarea = 1;

        listaTareas.querySelectorAll(".card").forEach((tarjeta) => {
            const indicadorEstado = tarjeta.querySelector(".badge");
            const task = {
                id: idTarea,
                nombre: tarjeta.querySelector(".card-title").textContent.trim(),
                descripcion: tarjeta.querySelector(".card-text").textContent.trim(),
                fechaEntrega: tarjeta.querySelector("time").dateTime,
                estado: indicadorEstado.textContent.trim().toLowerCase().replace(" ", "-"),
            };

            tarjeta.dataset.taskId = idTarea;
            this.tasks.push(task);
            this.actualizarTarjeta(tarjeta, task);
            idTarea += 1;
        });
    }

    cambiarEstadoTask(tarjeta) {
        const task = this.tasks.find((tarea) => tarea.id === Number(tarjeta.dataset.taskId));
        if (!task) {
            throw new Error("No se encontró la tarea asociada a esta tarjeta");
        }

        if (task.estado === "completada") {
            task.estado = "pendiente";
        } else {
            task.estado = "completada";
        }

        this.actualizarTarjeta(tarjeta, task);
    }
}