import React, {useState, useEffect} from "react"

import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';

export default function ControlGastos (props) {
    const { data, handleClose, reload } = props

    const [form, setForm] = useState ({
        nombre: data.nombre ? data.nombre : '',
        cantidad: '',
    })

    const handleChange = (event) => {
        // name son los diferentes tipos de atributos (departamento, fecha...)
        let name = event.target.name;
        setForm({
            ...form,
            [name]: event.target.value,
        });
    };

    return (
        <>
            <div>
                <InputLabel id="nombre" >Nombre</InputLabel>
                <TextField
                    name="nombre"
                    value={form.nombre}
                    disabled
                    // error={errores.nombre ? true : false}
                />
            </div>

            <div>
                <InputLabel id="nombre" >Cantidad</InputLabel>
                <TextField
                    name="cantidad"
                    value={form.cantidad}
                    type='number'
                    onChange={handleChange}
                    // error={errores.nombre ? true : false}
                />
            </div>
        </>
    )
}