class TaskManager {
    constructor(currentId = 0) {
        this.currentId = currentId;
        this.tasks = [];
        this.listaTareas = null;
        this.storageKey = "planificador-tareas";
    }

    inicializarTarjetas(listaTareas) {
        this.listaTareas = listaTareas;
        const estadosIniciales = {
            pendiente: "PORHACER",
            "en-progreso": "EN PROGRESO",
            completada: "COMPLETADA",
        };

        listaTareas.querySelectorAll(".card").forEach((tarjeta) => {
            const estadoVisible = tarjeta.querySelector(".badge").textContent.trim()
                .toLowerCase().replace(" ", "-");
            this.currentId += 1;
            this.tasks.push({
                id: this.currentId,
                name: tarjeta.querySelector(".card-title").textContent.trim(),
                description: tarjeta.querySelector(".card-text").textContent.trim(),
                dueDate: tarjeta.querySelector("time").dateTime,
                status: estadosIniciales[estadoVisible] || "PORHACER",
            });
        });
    }

    addTask(name, description, dueDate, status) {
        this.currentId += 1;
        this.tasks.push({
            id: this.currentId,
            name,
            description,
            dueDate,
            status: "PORHACER",
        });
    }

    deleteTask(taskId) {
        const newTasks = [];

        for (const task of this.tasks) {
            if (task.id !== taskId) {
                newTasks.push(task);
            }
        }

        this.tasks = newTasks;
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
    }

    load() {
        const tareasGuardadas = localStorage.getItem(this.storageKey);
        if (!tareasGuardadas) {
            return false;
        }

        try {
            const tareas = JSON.parse(tareasGuardadas);
            if (!Array.isArray(tareas)) {
                return false;
            }

            this.tasks = tareas;
            this.currentId = Math.max(0, ...this.tasks.map((task) => Number(task.id) || 0));
            return true;
        } catch {
            return false;
        }
    }

    createTaskHtml(task) {
        const estados = {
            PORHACER: { nombre: "Por hacer", clase: "text-bg-warning" },
            "EN PROGRESO": { nombre: "En progreso", clase: "text-bg-primary" },
            COMPLETADA: { nombre: "Completada", clase: "text-bg-success" },
        };
        const estado = estados[task.status] || estados.PORHACER;
        const completada = task.status === "COMPLETADA";
        const fecha = new Date(`${task.dueDate}T00:00:00`).toLocaleDateString("es-CO", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

        return `
            <div class="col-12 col-md-6 col-lg-4">
                <article class="card h-100${completada ? " border-success bg-light" : ""}" data-task-id="${task.id}">
                    <div class="card-body">
                        <h3 class="card-title h5${completada ? " text-decoration-line-through" : ""}">${this.escapeHtml(task.name)}</h3>
                        <p class="card-text">${this.escapeHtml(task.description)}</p>
                        <p class="card-text"><strong>Fecha:</strong> <time datetime="${this.escapeHtml(task.dueDate)}">${fecha}</time></p>
                        <p class="mb-3"><strong>Estado:</strong> <span class="badge ${estado.clase}">${estado.nombre}</span></p>
                        <button type="button" class="btn ${completada ? "btn-outline-secondary" : "btn-outline-success"} task-status-toggle" aria-pressed="${completada}">${completada ? "Marcar como pendiente" : "Marcar como completada"}</button>
                        <button type="button" class="delete-button btn btn-danger">Eliminar</button>
                    </div>
                </article>
            </div>`;
    }

    render() {
        if (this.listaTareas) {
            this.listaTareas.innerHTML = this.tasks.map((task) => this.createTaskHtml(task)).join("");
        }
    }

    cambiarEstadoTask(tarjeta) {
        const task = this.tasks.find((tarea) => tarea.id === Number(tarjeta.dataset.taskId));
        if (!task) {
            return;
        }

        task.status = task.status === "COMPLETADA" ? "PORHACER" : "COMPLETADA";
    }

    escapeHtml(valor) {
        const caracteres = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
        return String(valor).replace(/[&<>"']/g, (caracter) => caracteres[caracter]);
    }
}
