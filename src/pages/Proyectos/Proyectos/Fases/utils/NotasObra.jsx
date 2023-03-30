import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PresupuestoViejo from './../../../../../components/forms/presupuesto/PresupuestoForm'
import { apiGet, apiPostForm } from '../../../../../functions/api';
import { setOptions } from './../../../../../functions/setters'
import { NotasObra } from './../../../../../components/forms'

export default function Notas(props) { 
    const { proyecto, activo, reload } = props
    const auth = useSelector(state => state.authUser);
    return (
        <>
            <NotasObra
                isActive={activo}
                proyecto={proyecto}
                at={auth.access_token}
                /* onClick={this.onClick} */
                /* options={options} */
                /* refresh={this.getOneProyecto} */
            />
        </>
    )
}