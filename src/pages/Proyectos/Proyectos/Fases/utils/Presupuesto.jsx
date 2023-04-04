import React, {useState, useEffect} from "react";
import {useSelector} from "react-redux";
import PresupuestoViejo from './../../../../../components/forms/presupuesto/PresupuestoForm'
import { apiGet, apiPostForm } from '../../../../../functions/api';
import { setOptions } from './../../../../../functions/setters'
import { PresupuestosProyecto } from './../../../../../components/forms'

import Swal from 'sweetalert2'


export default function Presupuesto(props) {
    const {proyecto, activo} = props
    const auth = useSelector(state => state.authUser);

/*     const [state, setState] = useState({
        formeditado: 0,
        title: "Nuevo presupuesto",
        form: {
            proyecto: "",
            area: "",
            empresa: "",
            fecha: new Date(),
            tiempo_ejecucion: "",
            partida: "",
            subpartida: "",
            conceptos: {}
        },
        options: {
            proyectos: [],
            empresas: [],
            areas: [],
            partidas: [],
            subpartidas: [],
        },
        data: {
            partidas: [],
            subpartidas: [],
            conceptos: []
        },
    })

    useEffect(() => { 
        getOptionsAxios()
    }, [])

    const getOptionsAxios = () => {
        Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            },
        });
        apiGet("presupuestos/options", auth.access_token)
            .then(
                (response) => {
                    Swal.close();
                    const { empresas, proyectos, areas, partidas, conceptos } = response.data;
                    const { options, data, form } = state;
                    data.partidas = partidas
                    let aux = {}
                    conceptos.map((concepto) => {
                        return aux[concepto.clave] = false
                    })
                    form.conceptos = aux;
                    options["proyectos"] = setOptions(proyectos, "nombre", "id");
                    options["empresas"] = setOptions(empresas, "name", "id");
                    options["areas"] = setOptions(areas, "nombre", "id");
                    options["partidas"] = setOptions(partidas, "nombre", "id");
                    setState({
                        ...state,
                        options,
                    });
                },
                (error) => {
                    Swal.close();
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Algo salió mal!',
                    })

                    console.error(error, "error");
                }
            )
            .catch((error) => {
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo salió mal!',
                })
                console.error(error, "error");
            });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        const { data } = state
        switch (name) {
            case 'partida':
                data.partidas.map((partida) => {
                    data.conceptos = []
                    if (partida.id.toString() === value) {
                        data.subpartidas = partida.subpartidas
                    }
                    return false
                })
                break;
            case 'subpartida':
                data.subpartidas.map((subpartida) => {
                    if (subpartida.id.toString() === value) {
                        data.conceptos = subpartida.conceptos
                    }
                    return false
                })
                break;
            default:
                break;
        }
        const { form } = state;
        form[name] = value;
        setState({
            ...state,
            form,
            data
        });
    };

    const checkButton = e => {
        const { name, checked } = e.target
        const { form } = state
        form.conceptos[name] = checked
        setState({
            ...state,
            form
        })
    }

    const handleSetOptions = (name, array) => {
        const { options } = state;
        options[name] = setOptions(array, "nombre", "id");
        setState({
            ...state,
            options,
        });
    };

    const handleSubmit= () => {
        apiPostForm('presupuestos', state.form, auth.access_token)
            .then(
            (response) => {
                const { presupuesto } = response.data
                
            },
            (error) => {
                
            }
        ).catch((error) => {
            
            console.error(error, 'error')
        })
    } */



    return (
        <>
            {/* <PresupuestoViejo 
                formeditado={state.formeditado}
                title={state.title}
                form={state.form}
                onChange={handleChange}
                checkButton={checkButton}
                options={state.options}
                setOptions={handleSetOptions}
                onSubmit={handleSubmit}
                data={state.data}
            /> */}

            <PresupuestosProyecto
                proyecto={proyecto}
                at={auth.access_token}
                /* presupuestoId={this.getPresupuestoFromUrl()} */
                isActive={activo}
            />
        </>
    )
}