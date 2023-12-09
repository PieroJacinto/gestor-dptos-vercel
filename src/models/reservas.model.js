const { readFileSync, writeFileSync } = require("fs");
const { join } = require("path");
const model = {
  file: join(__dirname, "../data", "reservas.json"),

  index: () => {
    const content = readFileSync(model.file, "utf-8");
    return JSON.parse(content);
  },

  one: (id) => model.index().find((e) => e.id == id),

  obtenerDepartamento: (departamento) =>
    model.index().filter((e) => e.departamento === departamento),

  agregarNuevoDepartamento: (nuevoDepartamento) => {
    const reservas = model.index();
    const nuevoId = Date.now();
    const nuevaReserva = {
      id: nuevoId,
      ...nuevoDepartamento,
    };
    reservas.push(nuevaReserva);
    writeFileSync(model.file, JSON.stringify(reservas, null, 2));
  },
  obtenerReserva: (id) => model.index().find((e) => e.id === id),
};

module.exports = model;
