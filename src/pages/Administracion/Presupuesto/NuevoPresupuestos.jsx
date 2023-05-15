import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import TrashIcon from '@material-ui/icons/DeleteOutline';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'

export default function NuevoPresupuestos() {
    const [presupuesto, setPresupuesto] = useState([]);
    const areas = useSelector((state) => state.opciones.areas);
    const [areasOpciones, setAreasOpciones] = useState([]);

    useEffect(() => {
        setAreasOpciones(areas)
    }, [areas])


    const columnas = [
        { title: "", accesor: "eliminar" },
        { title: "Partida", accesor: "partida" },
        { title: "Subpartida", accesor: "subpartida" },
        { title: "$", accesor: "Enero" },
        { title: "$", accesor: "Febrero" },
        { title: "$", accesor: "Marzo" },
        { title: "$", accesor: "Abril" },
        { title: "$", accesor: "Mayo" },
        { title: "$", accesor: "Junio" },
        { title: "$", accesor: "Julio" },
        { title: "$", accesor: "Agosto" },
        { title: "$", accesor: "Septiembre" },
        { title: "$", accesor: "Octubre" },
        { title: "$", accesor: "Noviembre" },
        { title: "$", accesor: "Diciembre" },
        { title: "$", accesor: "Total" },
    ];

    const eliminarPartida = (i, partida) => {
        let newAreas = [...areasOpciones]
        let newArea = areas.find((area) => area.id_area === partida.area)
        newAreas.push(newArea)
        newAreas.sort((a, b) => a.nombreArea > b.nombreArea ? 1 : -1)
        setAreasOpciones(newAreas)
        let presupuestoAux = [...presupuesto];
        presupuestoAux.splice(i, 1);
        setPresupuesto(presupuestoAux);
    };

    const insertData = (data) => {
        let auxAreas = [...areasOpciones]
        
        let index = auxAreas.findIndex((area) => area.id_area === data)
        auxAreas.splice(index, 1)
        let newTable = [{
            eliminar: "",
            area: data,
            partida: "1",
            subpartida: "1",
            Enero: "1",
            Febrero: "1",
            Marzo: "1",
            Abril: "1",
            Mayo: "1",
            Junio: "1",
            Julio: "1",
            Agosto: "1",
            Septiembre: "1",
            Octubre: "1",
            Noviembre: "1",
            Diciembre: "1",
            Total: "12",
        }]

        setPresupuesto([...presupuesto, newTable])
        setAreasOpciones(auxAreas)
    };

    const handleMoney = (value, index, subindex, mes) => { 
        let auxPresupuesto = [...presupuesto]
        let auxTable = [...auxPresupuesto[index]]
        let auxPartida = {...auxTable[subindex]}
        auxPartida[mes] = value
        auxTable[subindex] = auxPartida
        auxPresupuesto[index] = auxTable
        setPresupuesto(auxPresupuesto)
    }

    const createTable = (presupuesto, indexTable) => {

        return (
            <table>
                <thead>
                    <tr>
                        {columnas.map((columna) => (
                            <th>{columna.title}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>{
                    presupuesto.map((partida, index) => (
                        <tr>
                            <td>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => {
                                        eliminarPartida(index, partida);
                                    }
                                    }
                                >
                                    <TrashIcon />
                                </button>
                            </td>
                            <td>{partida.partida}</td>
                            <td>{partida.subpartida}</td>
                            <td>
                                <CurrencyTextField
                                    variant="standard"
                                    value={presupuesto[indexTable][index]?.Enero}
                                    currencySymbol="$"
                                    outputFormat="number"
                                    onChange={(event, value) => handleMoney(value, indexTable, index, "Enero")}
                                />
                            </td>
                            <td>
                                <CurrencyTextField
                                    variant="standard"
                                    value={partida.Febrero}
                                    currencySymbol="$"
                                    outputFormat="number"
                                    onChange={(event, value) => handleMoney(value, indexTable, index, "Febrero")}
                                />
                            </td>
                            <td>
                                <CurrencyTextField
                                    variant="standard"
                                    value={partida.Marzo}
                                    currencySymbol="$"
                                    outputFormat="number"
                                    onChange={(event, value) => handleMoney(value, indexTable, index, "Marzo")}
                                />
                            </td>
                            <td>
                                <CurrencyTextField
                                    variant="standard"
                                    value={partida.Abril}
                                    currencySymbol="$"
                                    outputFormat="number"
                                    onChange={(event, value) => handleMoney(value, indexTable, index, "Abril")}
                                />
                            </td>
                            <td>
                                <CurrencyTextField
                                    variant="standard"
                                    value={partida.Mayo}
                                    currencySymbol="$"
                                    outputFormat="number"
                                    onChange={(event, value) => handleMoney(value, indexTable, index, "Mayo")}
                                />
                            </td>
                            <td>
                                <CurrencyTextField
                                    variant="standard"
                                    value={partida.Junio}
                                    currencySymbol="$"
                                    outputFormat="number"
                                    onChange={(event, value) => handleMoney(value, indexTable, index, "Junio")}
                                />
                            </td>
                            <td>
                                <CurrencyTextField
                                    variant="standard"
                                    value={partida.Febrero}
                                    currencySymbol="$"
                                    outputFormat="number"
                                    onChange={(event, value) => handleMoney(value, indexTable, index, "Febrero")}
                                />
                            </td>
                            <td>
                                <CurrencyTextField
                                    variant="standard"
                                    value={partida.Febrero}
                                    currencySymbol="$"
                                    outputFormat="number"
                                    onChange={(event, value) => handleMoney(value, indexTable, index, "Febrero")}
                                />
                            </td>
                            <td>
                                <CurrencyTextField
                                    variant="standard"
                                    value={partida.Febrero}
                                    currencySymbol="$"
                                    outputFormat="number"
                                    onChange={(event, value) => handleMoney(value, indexTable, index, "Febrero")}
                                />
                            </td>
                            <td>
                                <CurrencyTextField
                                    variant="standard"
                                    value={partida.Febrero}
                                    currencySymbol="$"
                                    outputFormat="number"
                                    onChange={(event, value) => handleMoney(value, indexTable, index, "Febrero")}
                                />
                            </td>
                            <td>
                                <CurrencyTextField
                                    variant="standard"
                                    value={partida.Febrero}
                                    currencySymbol="$"
                                    outputFormat="number"
                                    onChange={(event, value) => handleMoney(value, indexTable, index, "Febrero")}
                                />
                            </td>
                            <td>
                                <CurrencyTextField
                                    variant="standard"
                                    value={presupuesto[indexTable][index]?.Enero}
                                    currencySymbol="$"
                                    outputFormat="number"
                                    onChange={(event, value) => handleMoney(value, indexTable, index, "Febrero")}
                                />
                            </td>
                            
                            <td>{partida.Total}</td>
                        </tr>
                    ))

                }</tbody>
            </table>
        )
    }

    return (
        <div>
            <h1>Nuevo Presupuesto</h1>
            {
                presupuesto.length > 0 ?
                    presupuesto.map((presupuesto, index) => {
                        return (
                            <div>
                                {createTable(presupuesto, index)}
                            </div>
                        )
                    })
                    

                : null

            }
            <div>
                <p>Seleccionar area</p>
                {
                    areasOpciones.length ?
                    <select onChange={e => insertData(e.target.value)} value="0" >
                        <option value="0">Seleccionar</option>
                        {areasOpciones.map((area) => (
                            <option value={area.id_area}>{area.nombreArea}</option>
                        ))}
                        </select>    
                    : null
                }
                

            </div>
        </div>
    );
}
    