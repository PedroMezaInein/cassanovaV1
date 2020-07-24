import React, { Component } from 'react'
import { useTable, usePagination, useSortBy } from 'react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons'


const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
        const defaultRef = React.useRef()
        const resolvedRef = ref || defaultRef
        React.useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate
        }, [resolvedRef, indeterminate])

        return <input type="checkbox" ref={resolvedRef} {...rest} />
    }
)
function Table({ columns, data }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        getToggleHideAllColumnsProps,
        allColumns,
    } = useTable({
        columns,
        data,
        initialState: { pageIndex: 0, pageSize: 15 }
    }, useSortBy, usePagination);
    return (
        <>
            <div className="hidding-columns">
                <div>
                    <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} /> Mostrar todas
                </div>
                <div className="hidding-columns__single">
                    {
                        allColumns.map((column, x) => (
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
                <table className="table__container" {...getTableProps()}>
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
                        }
                    </tbody>
                </table>
            </div>
        </>
    )

}

class EmpresasTable extends Component {
    constructor(props) {
        super(props)
    }

    componentDidUpdate() {

    }

    render() {
        /* const data = [
            {
                actions: '1',
                name: 'Rocco',
                logo: 'logo'
            },
            {
                actions: '2',
                name: 'Inein',
                logo: 'logo'
            },
            {
                actions: '3',
                name: 'JOCAHEGA',
                logo: 'logo'
            }
            
        ] */
        const columns = [
            {
                Header: ' ',
                accessor: 'actions',
            },
            {
                Header: 'Nombre',
                accessor: 'name',
            },
            {
                Header: 'Razón social',
                accessor: 'razonSocial',
            },
            {
                Header: 'Logo',
                accessor: 'logo',
            },
        ]
        const { data } = this.props
        return (
            <div>
                <Table columns={columns} data={data} />
            </div>
        )
    }


}

export default EmpresasTable;