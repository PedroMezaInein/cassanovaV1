import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2'
import TextField from '@material-ui/core/TextField';

import { URL_DEV } from '../../../constants'

import '../../../styles/_TablaGeneral.scss'

export default function TablaGeneral(props) {
    const { titulo, subtitulo, columnas, url, numItemsPagina, acciones, ProccessData } = props;
    const auth = useSelector(state => state.authUser)
    const [data, setData] = useState(false);
    const [filterData, setFilterData] = useState(false);
    const [filter, setFilter] = useState(false);
    const [paginas, setPaginas] = useState(false);
    const [paginaActual, setPaginaActual] = useState(0);

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
    useEffect(() => {
        if (filterData) {
            paginado(numItemsPagina)
        }
    }, [filterData])

    const getData = () => {

        Swal.fire({
            title: 'Cargando datos',
            html: 'Espere un momento por favor',
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
            },
        })

        try {
            axios(`${URL_DEV}${url}`, { headers: { Authorization: `Bearer ${auth.access_token}` } })
                .then(res => {
                if (ProccessData !== undefined) {
                    setData(ProccessData(res.data))
                    setFilterData(ProccessData(res.data))   
                } else {
                    setData(res.data)
                    setFilterData(res.data)
                }
            
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

    const filterString = async (identificador, value) => {
        await setPaginaActual(0)
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

    const paginado = (num) => {
        let dataPaginado = [...filterData];
        let dataPaginadoFinal = [];
        let numPaginas = Math.ceil(dataPaginado.length / num);
        for (let i = 0; i < numPaginas; i++) {
            dataPaginadoFinal.push(dataPaginado.splice(0, num))
        }
        setPaginas(dataPaginadoFinal)
    }

    const handleSetPagina = (num) => {
        setPaginaActual(num)
    }

    const handleNextPagina = () => {
        if (paginaActual+1 < paginas.length && paginas.length > 1) {
            setPaginaActual(paginaActual + 1)
        }
    }

    const handlePrevPagina = () => {
        if (paginaActual > 1 && paginas.length > 1) {
            setPaginaActual(paginaActual - 1)
        }
    }

    const reloadTable = () => {
        resetFilter();
        getData();
        setPaginaActual(0);
    }

    const resetFilter = () => {
        setFilterData(data)
        setFilter(() => {
            let obj = {}
            columnas.forEach((item) => {
                obj[item.identificador] = ''
            })
            return obj
        })
    }

    return (
        <div className='containerTable'>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="headerTable">
                            <h3 className="TitleTable">{titulo}<span className="SubtitleTable"> {subtitulo}</span></h3>
                            <button type="button" className="btn btn-tool " onClick={reloadTable}>
                                <i className="fas fa-sync-alt reloadTable"></i>
                            </button>
                        </div>


                        <div className="card-body table-responsive p-0">
                            <table className="table table-hover text-nowrap">
                                <thead className="containerTitleColumn">
                                    <tr>
                                        {columnas.map((columna, index) => {
                                            return (
                                                <th key={index} className='MinCell'>
                                                    <div className="TitleColumn">
                                                        <span>
                                                            {
                                                                columna.stringSearch ? "" :
                                                                    <>
                                                                        <div>
                                                                            {columna.nombre}    
                                                                        </div>
                                                                        
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
                                                                    </>
                                                                    
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="TitleColumn">
                                                        {columna.stringSearch ?
                                                            <>
                                                                <TextField size='small' className="InputSearch" id="outlined-basic" label={`Buscar por ${columna.nombre}`} variant="outlined" onChange={(e) => filterString(columna.identificador, e.target.value)} />   
                                                                {columna.sort ?
                                                                    <div className="">
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
                                                            </>
                                                            : null
                                                        }
                                                        
                                                    </div>
                                                    
                                                </th>
                                            )
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginas && paginas[0]  ?
                                        paginas[paginaActual].map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    
                                                    {columnas.map((columna, index) => {
                                                        if (acciones && columna.identificador === 'acciones') {
                                                            return (
                                                                <td key={index} className='CellContent CellActions' >
                                                                    
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
                                                                <td key={index} className='CellContent'>{item[columna.identificador]}</td>
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
                            <div className="pb-10">
                                <ul className="pagination pagination-sm m-0 float-right">
                                    <li className="page-item"><a className="page-link" href="#" onClick={() => handlePrevPagina()}>&laquo;</a></li>
                                    {paginas ?
                                        paginas.map((item, index) => {
                                            return (
                                                <li className={`page-item ${paginaActual == index ? 'active' : ''}`} key={index}><a className="page-link" href="#" onClick={() => handleSetPagina(index)}>{index + 1}</a></li>
                                            )
                                        })
                                        : null
                                    }
                                    <li className="page-item"><a className="page-link" href="#" onClick={() => handleNextPagina()}>&raquo;</a></li>
                                </ul>
                            </div>    
                                
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}