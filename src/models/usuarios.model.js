const { readFileSync, writeFileSync } = require("fs");
const { join } = require("path");
const bcrypt = require("bcryptjs");

const model = {
  file: join(__dirname, "../data", "usuarios.json"),

  index: () => {
    const content = readFileSync(model.file, "utf-8");
    return JSON.parse(content);
  },

  one: (nombre) => model.index().find((e) => e.nombre === nombre),

  agregarUsuario: async (nuevoUsuario) => {
    const usuarios = model.index();
    const nuevoId = Date.now();

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(nuevoUsuario.password, saltRounds);

    const newUser = {
      id: nuevoId,
      admin: false,
      nombre: nuevoUsuario.nombre,
      password: hashedPassword,
    };

    usuarios.push(newUser);
    writeFileSync(model.file, JSON.stringify(usuarios, null, 2));
  },
};

module.exports = model;

