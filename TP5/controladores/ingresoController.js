//--- requires ------------------------------------------
const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const ingresoBD = require("./../modelos/ingresosModel.js");

// -------------------------------------------------------- 
// --rutas de escucha (endpoint) dispoibles para PACIENTE --- 
// --------------------------------------------------------

app.get("/", listarTodo);
app.post('/create', crear);


// --------------------------------------------------------
// ---------FUNCIONES UTILIZADAS EN ENDPOINTS -------------
// --------------------------------------------------------

function listarTodo(req, res) {
    ingresos = ingresoBD.metodos.getAll((err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
    }
    );
}

function crear(req, res) {
    ingresoBD.metodos.crearIngreso(req.body, (err, exito) => {
        if (err) {
            res.send(err);
        } else {
            res.json(exito);
        }
    });
}


module.exports = app;