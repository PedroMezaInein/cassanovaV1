import React, { Component } from 'react'
import { useTable, usePagination, useSortBy } from 'react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortDown, faSortUp, faStepForward, faStepBackward } from '@fortawesome/free-solid-svg-icons'
import { Button } from '../form-components'
import { TABLE_SIZE } from '../../constants'
import { Subtitle } from '../texts'


const IndeterminateCheckbox = React.forwardRef(
    ( { indeterminate, ...rest }, ref) => {
        const defaultRef = React.useRef()
        const resolvedRef = ref || defaultRef
        React.useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate
        }, [resolvedRef, indeterminate])
  
        return <input type="checkbox" ref={resolvedRef} {...rest} />
    }
)
function Table({ columns, data }){
    const { 
        getTableProps, 
        getTableBodyProps, 
        headerGroups, 
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        getToggleHideAllColumnsProps,
        allColumns,
        state: { pageIndex, pageSize },
    } = useTable({ 
        columns, 
        data,
        initialState: { pageIndex: 0, pageSize: TABLE_SIZE }
    }, useSortBy, usePagination );
    return(
        <>
            <div className="hidding-columns">
                <div>
                    <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} /> Mostrar todas
                </div>
                <div className="hidding-columns__single">
                    {
                        allColumns.map(( column, x ) => (
                            x !== 0 &&
                                <div className="checkbox" key={column.id}>
                                    <label className="text-capitalize">
                                        <input type="checkbox" {...column.getToggleHiddenProps()} />{' '}
                                        {
                                            column.id
                                        }
                                    </label>
                                </div>
                        ))
                    }
                </div>
            </div>
            <div className="table__wrap">
                <table className="table__container" { ...getTableProps() }>
                    <thead>
                        {
                            headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {
                                        headerGroup.headers.map((column, i) => (
                                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    {
                                                        column.render('Header')
                                                    }
                                                    <FontAwesomeIcon 
                                                        icon={
                                                            i === 0 ? ''
                                                                : column.isSorted
                                                                    ? column.isSortedDesc
                                                                        ? faSortUp
                                                                        : faSortDown
                                                                    : faSort
                                                        }
                                                    />
                                                </div>
                                            </th>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {
                            data.length > 0 ?
                                page.map((row, i) => {
                                    prepareRow(row)
                                    return (
                                        <tr {...row.getRowProps()}>
                                            {row.cells.map(cell => {
                                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                            })}
                                        </tr>
                                    )
                                })
                            :
                                <tr>
                                    <td colspan={columns.length}>
                                        <Subtitle className="text-center py-3" color="gold">
                                            No hay datos ☹
                                        </Subtitle>
                                    </td>
                                    
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
            {
                (canNextPage || canPreviousPage) &&
                <div className="pagination my-3 d-flex justify-content-center">
                    <Button color="transparent" onClick={previousPage} disabled={!canPreviousPage} icon={faStepBackward} className="mx-2" />
                    <div className="d-flex align-items-center">
                        <span>
                            Página 
                            <strong className="mx-1">
                                {pageIndex + 1} de {pageOptions.length}
                            </strong>
                        </span>
                    </div>
                    
                    <Button color="transparent" onClick={nextPage} disabled={!canNextPage} icon={faStepForward} className="mx-2" />
                </div>
            }
        </>
    )

}

class DataTable extends Component{
    constructor(props){
        super(props)
    }

    componentDidUpdate(){

    }

    render(){
        const { data, columns } = this.props
        return(
            <div>
                <Table columns={columns} data={data} />
            </div>
        )
    }


}

export default DataTable;