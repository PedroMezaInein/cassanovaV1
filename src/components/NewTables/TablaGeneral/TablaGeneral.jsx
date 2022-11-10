import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { URL_DEV } from '../../../constants'
import Swal from 'sweetalert2'

export default function TablaGeneral(props) {
    const { titulo, subtitulo, columnas, url, numPaginado, acciones } = props;
    const auth = useSelector(state => state.authUser)
    const [data, setData] = useState(false);
    const [filterData, setFilterData] = useState(false);
    const [filter, setFilter] = useState(false);
    const [paginas, setPaginas] = useState(false);

    useEffect(() => {
        getData();
        setFilter(() => {
            let obj = {}
            columnas.forEach((item) => {
                obj[item.identificador] = ''
            })
            return obj
        })
    }, [])

    const getData = () => {
        Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            },
        });
        try {
            axios(`${URL_DEV}${url}`, { headers: { Authorization: `Bearer ${auth.access_token}` } })
            .then(res => {
                console.log(res.data)
                setData(res.data.Sala)
                setFilterData(res.data.Sala)
                Swal.close();
            })
        } catch (error) {
            console.log(error)
        }
    }

    const sortData = (identificador) => {
        let dataSort = [...data];
        dataSort.sort((a, b) => {
            if (a[identificador] > b[identificador]) {
                return 1;
            }
            if (a[identificador] < b[identificador]) {
                return -1;
            }
            return 0;
        })
        setFilterData(dataSort)
    }

    const sortDataDesc = (identificador) => {
        let dataSort = [...data];
        dataSort.sort((a, b) => {
            if (a[identificador] < b[identificador]) {
                return 1;
            }
            if (a[identificador] > b[identificador]) {
                return -1;
            }
            return 0;
        })
        setFilterData(dataSort)
    }

    const filterString = (identificador, value) => {
        setFilter({
            ...filter,
            [identificador]: value
        })
        let dataFilter = [...data];
        dataFilter = dataFilter.filter((item) => {
            return item[identificador].toLowerCase().includes(value.toLowerCase())
        })
        setFilterData(dataFilter)
    }

    const paginado = (numPaginado) => {
        let dataPaginado = [...filterData];
        let dataPaginadoFinal = [];
        let numPaginas = Math.ceil(dataPaginado.length / numPaginado);
        for (let i = 0; i < numPaginas; i++) {
            dataPaginadoFinal.push(dataPaginado.splice(0, numPaginado))
        }
        setPaginas(dataPaginadoFinal)
    }

    return (
        <>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">{titulo}</h3>
                        </div>
                        <div className="card-body table-responsive p-0">
                            <table className="table table-hover text-nowrap">
                                <thead>
                                    <tr>
                                        {columnas.map((columna, index) => {
                                            return (
                                                <th key={index}>{columna.nombre}
                                                    {columna.sort ?
                                                        <div className="btn-group">
                                                            <button type="button" className="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                                <i className="fas fa-sort"></i>
                                                            </button>
                                                            <div className="dropdown-menu" role="menu">
                                                                <a className="dropdown-item" href="#" onClick={() => sortData(columna.identificador)}>Ascendente</a>
                                                                <a className="dropdown-item" href="#" onClick={() => sortDataDesc(columna.identificador)}>Descendente</a>
                                                            </div>
                                                        </div>
                                                        : null
                                                    }
                                                    {columna.filtroSort ?
                                                        <div className="input-group input-group-sm">
                                                            <input type="text" className="form-control" onChange={(e) => filterString(columna.identificador, e.target.value)} value={filter[columna.identificador]} placeholder={`Buscar por ${columna.nombre}` } />
                                                        </div>
                                                        : null
                                                    }
                                                </th>
                                            )
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filterData ?
                                        filterData.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    
                                                    {columnas.map((columna, index) => {
                                                        if (acciones && columna.identificador === 'acciones') {
                                                            return (
                                                                <td key={index}>
                                                                    
                                                                    <div className="">
                                                                        <button type="button" className="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                                            <i className="fas fa-cog"></i>
                                                                        </button>
                                                                        <div className="dropdown-menu" role="menu">
                                                                            
                                                                            {acciones.map((accion, index) => {
                                                                                return (
                                                                                    <i className={`${accion.icono} ${accion.color}`} key={index} onClick={() => accion.funcion(item)}>
                                                                                        <span className="ml-2">{accion.nombre}</span>
                                                                                    </i>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            )
                                                            
                                                        } else {
                                                            return (
                                                                <td key={index}>{item[columna.identificador]}</td>
                                                            )
                                                        }
                                                    })}
                                                    
                                                </tr>
                                            )
                                        })
                                        : null
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}