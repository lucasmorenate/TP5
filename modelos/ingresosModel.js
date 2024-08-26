require('rootpath')();

const mysql = require("mysql");
const configuracion = require("config.json");
const { query } = require('express');
const connection = mysql.createConnection(configuracion.database);
connection.connect((err) => {
    if (err) {
        console.log(err.code);
    } else {
        console.log("BD conectada");
    }
});

var metodos = {}
metodos.getAll = function (callback) {
    //consulta = "select * from clinica.ingreso";
    consulta = "SELECT i.id_ingreso, i.fecha_ingreso, i.nro_habitacion, i.nro_cama, i.observaciones, medico.matricula, CONCAT(medico.nombre, ' ', medico.apellido) AS ApeNomMedico, paciente.nss, CONCAT(paciente.nombre, ' ', paciente.apellido) AS ApeNomPaciente FROM ingreso i JOIN medico ON i.matricula_medico = medico.matricula JOIN paciente ON i.nro_historial_paciente = paciente.nro_historial_clinico;";

    connection.query(consulta, function (err, resultados, fields) {
        if (err) {
            callback(err);
            return;
        } else {
            callback(undefined, {
                messaje: "Resultados de la consulta",
                detail: resultados,
            });
        }
    });
}

metodos.crearIngreso = function (datosIngreso, callback) {
    ingreso = [
        datosIngreso.id_ingreso,
        datosIngreso.fecha_ingreso,
        datosIngreso.nro_habitacion,
        datosIngreso.nro_cama,
        datosIngreso.observaciones,
        datosIngreso.nro_historial_paciente,
        datosIngreso.matricula_medico,
    ];
    consulta =
        "INSERT INTO ingreso (id_ingreso, fecha_ingreso, nro_habitacion, nro_cama, observaciones, nro_historial_paciente, matricula_medico) VALUES (?, ?, ?, ?, ?, ?, ?)";

    connection.query(consulta, ingreso, (err, rows) => {
        if (err) {
            if (err.code = "ER_DUP_ENTRY") {
                callback({
                    message: "debe existir la matricula del medico, el historial del paciente y el id_ingreso debe ser distinto de " + datosIngreso.id_ingreso,
                    detail: err.sqlMessage
                })
            } else {
                callback({
                    message: "otro error que no conocemos",
                    detail: err
                })
            }
        } else {
            callback(undefined, {
                message: "el ingreso " + datosIngreso.id_ingreso + " del dia " + datosIngreso.fecha_ingreso + "se registro correctamente",
                detail: rows,
            })
        }
    });
}

module.exports = { metodos }

