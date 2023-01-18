import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'

import axios from 'axios'
import Swal from 'sweetalert2'

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

export default function ModalAgregar () {
    const user = useSelector(state=> state.authUser)
    const departamentos = useSelector(state => state.opciones.areas)

    const [form, setForm] = useState ({
        area:'',
        partida: '',
        subPartida: ''
    })

    return (
        <>
        <div>Nueva área</div>

        <div className="">
                    {/* {departamentos.length > 0 ?
                        <>
                            <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
                            <Select
                                value={form.departamento}
                                name="departamento"
                                // onChange={handleChangeDepartamento}
                            >
                                {departamentos.map((item, index) => (
                                    <MenuItem key={index} value={item.id_area}>{item.nombreArea}</MenuItem>
                                ))}

                            </Select>
                        </>
                        : null
                    } */}
                </div>
        </>
    )
}