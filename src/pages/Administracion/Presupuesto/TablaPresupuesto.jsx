import React, { useState } from 'react'
import { useSelector } from 'react-redux';

import { useTable } from 'react-table'
import styled from 'styled-components'

import Bloque from './Modales/Bloque'
import NuevoPresupuesto from './NuevoPresupuestos'


export default function Presupuesto() {
    const [form, setForm] = useState([])


    return (
        <>
            {/* <Styles>
                <Table columns={columns} data={data} />
                {buttonAdd()}
            </Styles> */}
            <Bloque form={form} setForm={setForm} />
        </>
    )
}