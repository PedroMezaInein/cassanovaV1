import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2'
import TextField from '@material-ui/core/TextField';
import { Dropdown } from 'react-bootstrap'

import { URL_DEV } from '../../../constants'
import SortIcon from '@material-ui/icons/Sort';
import SettingsSharpIcon from '@material-ui/icons/SettingsSharp';
import '../../../styles/_TablaGeneral.scss'

import { printResponseErrorAlert, errorAlert, waitAlert, validateAlert, doneAlert } from '../../../functions/alert'

export default function TablaGeneralPaginado(props) {
    const { titulo, subtitulo, columnas, url, numItemsPagina, acciones, ProccessData, opciones, reload, filtros, customFilter,resetFilters,setResetFilters } = props;
    //para implementar la tabla puedes utilizar los siguientes props

    //titulo: titulo de la tabla
    //subtitulo: subtitulo de la tabla
    //columnas: array de objetos con la siguiente estructura
    //          {nombre: 'nombre de la columna', identificador: 'identificador de la columna', sort: true/false, stringSearch: true/false}
    //el identificador de la columna debe ser igual al nombre de la propiedad del objeto que se va a mostrar en la tabla
    //Por defecto, para mostrar las acciones, se debe agregar una columna con el identificador 'acciones'
    //url: url de la api con la que se va a consumir la tabla y que por defecto regresa los datos dentro de un array llamado data
    //numItemsPagina: numero de items que se van a mostrar por pagina
    //acciones: array de objetos con la siguiente estructura
    //          {nombre: 'nombre del boton', icono: 'icono del boton', color: 'nombre de la clase del color del boton greenButton/blueButton/redButton', funcion: funcion que se va a ejecutar al dar click}

    //ProccessData: funcion que se va a ejecutar para procesar los datos que se van a mostrar en la tabla cuando la url no regrese por defecto un array llamado data o quieras procesar los datos de otra manera
    //por defecto ProcessData recibe un parametro que es la respuesta de la api y debe regresar un array con los datos que se van a mostrar en la tabla
    //Un ejemplo de como se puede utilizar ProccessData es el siguiente
    //ProccessData = (data) => {
    //    let newData = []
    //    data.forEach(element => {
    //        newData.push({
    //            id: element.id,
    //            nombre: element.nombre,
    //            apellido: element.apellido,
    //            email: element.email,
    //            telefono: element.telefono,
    //            acciones: element.acciones
    //        })
    //    });
    //    return newData
    //}

    //opciones: array de objetos con la siguiente estructura
    //          {nombre: 'nombre de la opcion', funcion: funcion que se va a ejecutar al dar click}
    //recargar: Regresa una funcion que se puede utilizar para recargar la tabla

    //ejemplo de uso
    // <Tabla titulo='Titulo de la tabla' subtitulo='Subtitulo de la tabla' columnas={columnas} url={url} numItemsPagina={numItemsPagina} acciones={acciones} ProccessData={ProccessData} opciones={opciones} />

    //filtros: un string con un query para filtrar los datos de la tabla. Se coloca en la url de la siguiente manera
    //url = url + filtros
    //ejemplo de estructura de filtros
    //filtros = '&nombre=valor&nombre2=valor2'

    //Los campos obligatorios son titulo, columnas y url

    const auth = useSelector(state => state.authUser)
    const [data, setData] = useState(false);
    const [filterData, setFilterData] = useState(false);
    const [filter, setFilter] = useState(false);
    const [paginas, setPaginas] = useState(false);
    const [paginaActual, setPaginaActual] = useState(0);
    const [errorApi, setErrorApi] = useState(false)

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(5);

     
    useEffect(() => {
        getData();
        setFilter(() => {
            let obj = {}
            columnas.forEach((item) => {
                obj[item.identificador] = ''
            })
            return obj
        })
        if (reload !== undefined) {
            reload({
                reload: getData
            })
        }

    }, [])

    useEffect(() => {
        if (filterData) {
            paginado(numItemsPagina)
        }
    }, [filterData])

    const getData = (num) => {

        waitAlert()

        try {
            axios(`${URL_DEV}${url}?page=${num ? num : currentPage}&page_size=${numItemsPagina}${filtros}`, { headers: { Authorization: `Bearer ${auth.access_token}` } })
                .then(res => {

                    setTotalPages(res.data.data.last_page? res.data.data.last_page : 1)

                    if (ProccessData !== undefined) {

                        // if (resetFilter && resetFilters === false) {
                        //     let aux = customFilter(ProccessData(res.data))
                        //     setData(aux)
                        //     setFilterData(aux)
                        // } else {
                        //     setData(ProccessData(res.data))
                        //     setFilterData(ProccessData(res.data))
                        // }

                        setData(ProccessData(res.data))
                        setFilterData(ProccessData(res.data))

                        // if (customFilter && resetFilters === false) {
                        //     let aux = customFilter(ProccessData(res.data))
                        //     setData(aux)
                        //     setFilterData(aux)
                        //     .then(() => {
                        //         if (reload) {
                        //             reload.reload()
                        //         }
                        //         handleClose()
                        //     })
                            
                        // } else {
                        //     setData(ProccessData(res.data))
                        //     setFilterData(ProccessData(res.data))
                        // }

                    } else {
                        // setData(ProccessData(res.data))
                        // setFilterData(ProccessData(res.data))
                        setData(res.data)
                        setFilterData(res.data)
                    }

                    Swal.close();
                })
                .catch(res => {
                    Swal.close()
                    setErrorApi(true)
                    Swal.fire({
                        title: 'Error al cargar la información',
                        html: `Intentalo más tarde`,
                        icon: 'error'
                    })
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
        if (paginaActual + 1 < paginas.length && paginas.length > 1) {
            setPaginaActual(paginaActual + 1)
        }
    }

    const handlePrevPagina = () => {
        if (paginaActual > 1 && paginas.length > 1) {
            setPaginaActual(paginaActual - 1)
        }
    }

    const reloadTable = () => {
        resetFilter('');
        getData();
        setPaginaActual(0);
        if (setResetFilters) {
            setResetFilters(true)
        }
        
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

    const changeCurrentPage = (num) => {
        setCurrentPage(num)
        getData(num)
    }

    const getPageNumbersToShow = () => {

        // if (totalPages <= 1) {
           
        //     const firstPageToShow = Math.max(1, currentPage - 1)
        //     const lastPageToShow = Math.min(totalPages, currentPage + 1)
        //     let pageNumbersToShow = [];

        //     pageNumbersToShow.push(1)

        //     return pageNumbersToShow
        // } else {

            const firstPageToShow = Math.max(1, currentPage - 1)
            const lastPageToShow = Math.min(totalPages, currentPage + 1)

            let pageNumbersToShow = [];

            if (firstPageToShow > 1) {
                pageNumbersToShow.push(1)
                pageNumbersToShow.push('...')
            }

            for (let i = firstPageToShow; i <= lastPageToShow; i++) {
                pageNumbersToShow.push(i)
            }

            if (lastPageToShow < totalPages) {
                pageNumbersToShow.push('...')
                pageNumbersToShow.push(totalPages)
            }

                return pageNumbersToShow
        // }
    }

    // <div>
    //     <button onClick={() => changeCurrentPage(currentPage - 1)} disabled={currentPage === 1}>&#60; Anterior</button>
    //     {getPageNumbersToShow().map((number, index) => (
    //         <button key={index} onClick={() => {
    //             if (number !== '...') {
    //                 changeCurrentPage(number)
    //             }
    //         }} disabled={number === currentPage}>{number}</button>
    //     ))}
    //     <button onClick={() => changeCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}> Siguiente &#62;</button>
    // </div>


    return (
        <div className='containerTable'>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="headerTable">
                            <h3 className="TitleTable">
                                <span>
                                    {titulo}
                                    <button type="button" className="btn btn-tool " onClick={reloadTable}>
                                        <i className="fas fa-sync-alt reloadTable"></i>
                                    </button>
                                </span>
                                <span className="SubtitleTable"> {subtitulo}</span>
                            </h3>

                            <div>
                                {opciones &&
                                    <Dropdown>
                                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                                            Opciones
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            {opciones.map((item, index) => {
                                                return (
                                                    <Dropdown.Item key={index} onClick={item.funcion}>
                                                        {item.nombre}
                                                    </Dropdown.Item>
                                                )
                                            })}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                }
                            </div>

                        </div>

                        <div className="card-body table-responsive mt-n6 p-n4">
                            <table className="table">
                                <thead className="containerTitleColumn ">
                                    <tr >
                                        {columnas.map((columna, index) => {
                                            return (
                                                <th key={index} className= {columna.nombre + ' mt-20'} >
                                                    <div className="TitleColumn">

                                                        {
                                                            columna.stringSearch ? "" :
                                                                <>
                                                                    <div>
                                                                        {columna.nombre}
                                                                    </div>

                                                                    {columna.sort ?
                                                                        <div className="">
                                                                            <button type="button" className="dropdown-toggle SortButton" data-toggle="dropdown" aria-expanded="false">
                                                                                <SortIcon />
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

                                                    </div>
                                                    <div className="TitleColumn">
                                                        {columna.stringSearch ?
                                                            <>
                                                                <TextField size='small' className="InputSearch" id="outlined-basic" label={` ${columna.nombre}`} variant="outlined" onChange={(e) => filterString(columna.identificador, e.target.value)} />
                                                                {columna.sort ?
                                                                    <div className="">
                                                                        <button type="button" className="dropdown-toggle SortButton" data-toggle="dropdown" aria-expanded="false">
                                                                            <SortIcon />
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
                                    { filterData[0] ?
                                        filterData.map((item, index) => {
                                            return (
                                                <tr key={index}>

                                                    {columnas.map((columna, index) => {
                                                        if (acciones && columna.identificador === 'acciones') {
                                                            return (
                                                                <td key={index} className='CellContent CellActions' >

                                                                    <div className="">
                                                                        <button type="button" className="SettingButton" data-toggle="dropdown" aria-expanded="false">
                                                                            <SettingsSharpIcon />
                                                                        </button>
                                                                        <div className="dropdown-menu" role="menu">

                                                                            {acciones.map((accion, index) => {
                                                                                return (
                                                                                    <div className={`${accion.color} Button-action`} onClick={() => accion.funcion(item)} key={index} >
                                                                                        <i className={` ${accion.icono} generalButtonColor`}>
                                                                                            <span className="ml-2 ">{accion.nombre}</span>
                                                                                        </i>
                                                                                    </div>

                                                                                )
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            )

                                                        } else {
                                                            return (
                                                                <td key={index} className={columna.identificador+ ' CellContent'}>
                                                                    <div className='contenido'>{item[columna.identificador]}
                                                                    
                                                                    { columna.identificador === "compra" && <div className='hijo'> </div>}
                                                                    </div></td>
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
                            {/* <div className="pb-10">
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
                            </div> */}
                            
                            <div className='tabla_paginado'>
                                <button className='tabla_paginado_flecha' onClick={() => handlePrevPagina()} disabled={currentPage === 1}>&#60; Anterior</button>
                                { 
                                getPageNumbersToShow ?
                                    getPageNumbersToShow().map((number, index) => (
                                        <button className='tabla_paginado_num' key={index} onClick={() => {
                                            if (number !== '...') {
                                                changeCurrentPage(number)
                                            }
                                        }} disabled={number === currentPage}>{number}</button>
                                    ))
                                    : null
                                }
                                <button className='tabla_paginado_flecha' onClick={() => changeCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}> Siguiente &#62;</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}