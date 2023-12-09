const {readFileSync, writeFileSync} = require("fs")
const {join} = require("path")
const Gasto = {
    file: join(__dirname, "../data", "gastos.json"),

    index: () => {
      const content = readFileSync(Gasto.file, "utf-8");
      return JSON.parse(content);
    },

    findByPk: function (id) {
        const allGastos = Gasto.index();
        const gastoFound = allGastos.find((oneGasto) => oneGasto.id == id);
        return gastoFound;
    },

    findByField: function (field, text) {
        let allGastos = Gasto.index();
        let gastoFound = allGastos.find(oneGasto => oneGasto[field] === text);
        return gastoFound;
    },

    agregarNuevoGasto: (nuevoGasto) => {
        const gastos = Gasto.index();
        const nuevoId = Date.now();
        const newGasto = {
            id: nuevoId,
            ...nuevoGasto,
        };
        gastos.push(newGasto);
        writeFileSync(Gasto.file, JSON.stringify(gastos, null, 2));
    },
  
    delete: function (id) {
        let allGastos = Gasto.index();
        let finalGastos = allGastos.filter(oneGasto => oneGasto.id !== id);
        fs.writeFileSync(Gasto.file, JSON.stringify(finalGastos, null, 4))
        return true
    }
}

module.exports = Gasto;