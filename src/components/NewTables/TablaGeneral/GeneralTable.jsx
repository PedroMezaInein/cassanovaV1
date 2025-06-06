import React, { useEffect, useState } from 'react';
import { waitAlert } from "../../../functions/alert";
import axios from "axios";
import { URL_DEV } from "../../../constants";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useReactTable, flexRender, getCoreRowModel } from '@tanstack/react-table';
import '../../../styles/_TablaGeneral.scss'

export default function GeneralTable({ titulo, subtitulo, columns, acciones, url, reload, numItemsPagina, filtros, ProccessData }) {
    const auth = useSelector(state => state.authUser)
    const [data, setData] = useState([]);
    const [filterData, setFilterData] = useState(false);
    const [filter, setFilter] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(5);
    const [errorApi, setErrorApi] = useState(false)

    console.log(columns)

    useEffect(() => {
        getData();
        setFilter(() => {
            let obj = {}
            columns.forEach((item) => {
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


    console.log('filter', filter)

    const getData = (num) => {
        console.log('url', `${URL_DEV}${url}?page=${num ? num : currentPage}&page_size=${numItemsPagina}${filtros}`)

        waitAlert()

        try {
            axios(`${URL_DEV}${url}?page=${num ? num : currentPage}&page_size=${numItemsPagina}${filtros}`, { headers: { Authorization: `Bearer ${auth.access_token}` } })
                .then(res => {

                    setTotalPages(res.data.data.last_page ? res.data.data.last_page : 1)

                    if (ProccessData !== undefined) {
                        console.log('ProcessData', ProccessData(res.data))
                        setData(ProccessData(res.data))
                        setFilterData(ProccessData(res.data))

                    } else {
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

    console.log(data, 'data desde general table')

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className='containerTable' >
            <h1>{titulo}</h1>
            <div className='card-body' >
                <div className="table-responsive">
                    <table className='table'>
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th scope='col' key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}