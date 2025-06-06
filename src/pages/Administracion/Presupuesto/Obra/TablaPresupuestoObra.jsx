import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import SelectMUI from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';
import TrashIcon from '@material-ui/icons/DeleteOutline';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import { apiOptions, apiPostForm } from '../../../../functions/api';
import Tooltip from '@material-ui/core/Tooltip';
import Swal from 'sweetalert2';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    button: {
        display: 'block',
        marginTop: theme.spacing(2),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

const GreenCheckbox = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

function App(props) {
    const { reload, handleClose } = props;

    const [tableName, setTableName] = useState('');
    const [tables, setTables] = useState([]);
    const [tableData, setTableData] = useState([]);
    const departamentos = useSelector((state) => state.opciones.areas);
    const [empresa, setEmpresa] = useState('');
    const auth = useSelector((state) => state.authUser.access_token);
    const [departmentTotals, setDepartmentTotals] = useState({});
    const [monthlyTotals, setMonthlyTotals] = useState({});
    const [hasRowsInDepartments, setHasRowsInDepartments] = useState({});
    const usuario = useSelector((state) => state.authUser.departamento.departamentos[0]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [comment, setComment] = useState('');
    const proyectos = useSelector((state) => state.opciones.proyectos);
    const compras = useSelector((state) => state.opciones.compras);
    const [selectedSubpartidas, setSelectedSubpartidas] = useState({});
    const empresas = useSelector((state) => state.opciones.empresas);
    const classes = useStyles();
    const [age, setAge] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [openn, setOpenn] = React.useState(false);

    // console.log(compras);
    const [state, setState] = React.useState({
        checkedA: true,
        checkedB: true,
        checkedF: true,
        checkedG: true,
    });

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handlsetEndDateChange = (date) => {
        setEndDate(date);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const handleChanges = (event) => {
        setEmpresa(event.target.value);
    };

    const handleClosee = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClosess = () => {
        setOpenn(false);
    };

    const handleOpens = () => {
        setOpenn(true);
    };

    useEffect(() => {
        const updatedTables = apiOptions(`presupuestosdep`, auth)
            .then((response) => {
                const apiData = response.data;
                setTableData(apiData);
            })
            .catch((error) => {
                console.error('Error al obtener datos de la API:', error);
            });
    }, []);

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril',
        'Mayo', 'Junio', 'Julio', 'Agosto',
        'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ];

    const handleAddTable = () => {
        if (tableName) {
            // console.log(proyectos)
            const proyectoSeleccionado = proyectos.find((proyecto) => proyecto.id === tableName);
            if (!proyectoSeleccionado) {
                console.error('El proyecto seleccionado no existe.');
                return;
            }

            const departmentExists = tables.some((table) => table.name === tableName);
            // console.log(tableName)
            // console.log( proyectoSeleccionado.nombre)

            if (!departmentExists) {
                const newTable = {
                    id: Date.now(),
                    name: tableName,
                    projectName: proyectoSeleccionado.nombre,
                    months: months,
                    rows: [],
                };

                setTables([...tables, newTable]);
                // setTableName('');
            } else {
                console.log('El departamento ya existe en la lista.');
            }
        }
    };

    const handleDeleteTable = (tableId) => {
        const updatedTables = tables.filter((table) => table.id !== tableId);
        setTables(updatedTables);
    };

    const handleAddRow = (tableId) => {
        const updatedTables = tables.map((table) => {
            if (table.id === tableId) {
                const newRow = {
                    id: Date.now(),
                    areaId: '',
                    select1: '',
                    select2: '',
                    projectName: table.projectName, // Agrega el nombre del proyecto a la fila
                    montos: months.map(() => ({ monto: 0 })),
                };
                table.rows.push(newRow);
    
                setSelectedSubpartidas({
                    ...selectedSubpartidas,
                    [`${table.id}-${newRow.id}`]: {
                        areaId: '',
                        select1: '',
                        select2: '',
                    },
                });
    
                setHasRowsInDepartments({
                    ...hasRowsInDepartments,
                    [table.name]: true,
                });
            }
            return table;
        });
        setTables(updatedTables);
    };
    

    const handleDeleteRow = (tableId, rowId) => {
        const updatedTables = tables.map((table) => {
            if (table.id === tableId) {
                table.rows = table.rows.filter((row) => row.id !== rowId);
            }
            return table;
        });

        setTables(updatedTables);

        const updatedDepartmentTotals = {};

        updatedTables.forEach((table) => {
            const departmentName = table.name;

            updatedDepartmentTotals[departmentName] = {};

            months.forEach((month, monthIndex) => {
                const monthTotal = table.rows.reduce((total, row) => {
                    return total + parseFloat(row.montos[monthIndex].monto);
                }, 0);
                updatedDepartmentTotals[departmentName][month] = monthTotal;
            });
        });

        setDepartmentTotals(updatedDepartmentTotals);
    };

    const handleSelectChange = (tableId, rowId, fieldName, value) => {
        const updatedTables = tables.map((table) => {
            if (table.id === tableId) {
                const updatedRows = table.rows.map((row) => {
                    if (row.id === rowId) {
                        if (fieldName === 'areaId') {
                            return { ...row, areaId: value, select1: '', select2: '' };
                        } else if (fieldName === 'select1') {
                            return { ...row, select1: value, select2: '' };
                        } else {
                            return { ...row, [fieldName]: value };
                        }
                    }
                    return row;
                });
                return { ...table, rows: updatedRows };
            }
            return table;
        });
        setTables(updatedTables);
    };

    const handleMontosChange = (tableId, rowId, monthIndex, value) => {
        const updatedTables = tables.map((table) => {
            if (table.id === tableId) {
                const updatedRows = table.rows.map((row) => {
                    if (row.id === rowId) {
                        const updatedMontos = [...row.montos];
                        updatedMontos[monthIndex].monto = value;
                        return { ...row, montos: updatedMontos };
                    }
                    return row;
                });

                const updatedDepartmentTotals = { ...departmentTotals };
                const updatedMonthlyTotals = { ...monthlyTotals };

                updatedDepartmentTotals[table.name] = updatedDepartmentTotals[table.name] || {};
                updatedDepartmentTotals[table.name][months[monthIndex]] = updatedRows.reduce(
                    (total, row) => total + parseFloat(row.montos[monthIndex].monto),
                    0
                );

                updatedMonthlyTotals[months[monthIndex]] = tables.reduce((total, table) => {
                    const sum = table.rows.reduce(
                        (tableTotal, row) => tableTotal + parseFloat(row.montos[monthIndex].monto),
                        0
                    );
                    return total + sum;
                }, 0);

                setMonthlyTotals(updatedMonthlyTotals);

                setDepartmentTotals(updatedDepartmentTotals);
                return { ...table, rows: updatedRows };
            }
            return table;
        });
        setTables(updatedTables);
    };

    const handleSendTables = () => {
        if (!startDate || !endDate || !comment) {
            Swal.fire({
                icon: 'error',
                title: 'Campos obligatorios',
                text: 'Por favor, completa las fechas de inicio y fin, y el comentario.',
            });
            return;
        }

        for (const table of tables) {
            for (const row of table.rows) {
                if (!row.areaId || !row.select1 || !row.select2) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Campos obligatorios',
                        text: 'Por favor, completa los campos Área, Partida y Subpartida en todas las filas.',
                    });
                    return;
                }
            }
        }

        sendTableDataToAPI(tables);
    };

    const sendTableDataToAPI = async (tables) => {
        try {
            const formattedData = [];
            let totalGlobal = 0;
            // console.log(tables)

            tables.forEach((table) => {
                // console.log(table)

                const department = proyectos.find((item) => item.id === table.name);
                // console.log(proyectos)
                table.rows.forEach((row) => {
                    const rowData = {
                        departamentoId: department ? department.id : null,
                        departamento: department ? department.nombre : '',
                        area: row.areaId,
                        partida: row.select1,
                        subpartida: row.select2,
                        months: row.montos.map((monto, monthIndex) => ({
                            month: months[monthIndex],
                            monto: parseFloat(monto.monto),
                        })),
                    };
                    const rowTotal = rowData.months.reduce((acc, monthData) => acc + monthData.monto, 0);
                    totalGlobal += rowTotal;

                    formattedData.push(rowData);
                });
            });

            const dataToSend = {
                total: totalGlobal,
                data: formattedData,
                fecha_inicio: startDate,
                fecha_fin: endDate,
                nombre: comment,
                tab: 'obra',
                id_departamento: usuario.id,
                empresa: empresa,
                usuario:usuario,
            };

            apiPostForm(`presupuestosdep?departamento_id=${usuario.id}`, dataToSend, auth)
                .then((res) => {
                    Swal.close();
                    Swal.fire({
                        icon: 'success',
                        title: 'Presupuesto creado con éxito',
                        timer: 2000,
                    }).then(() => {
                        if (reload) {
                            reload.reload();
                        }
                        handleClose();
                    });
                });
        } catch (error) {
            console.error('Error en la solicitud HTTP:', error);
        }
    };

    const calculateRowTotal = (row) => {
        return row.montos.reduce((total, { monto }) => total + (parseFloat(monto) || 0), 0);
    };

    function calculateTotalGlobal() {
        let total = 0;

        tables.forEach((table) => {
            table.rows.forEach((row) => {
                row.montos.forEach((monto) => {
                    total += parseFloat(monto.monto);
                });
            });
        });

        return total;
    }

    const calculateMonthlyTotals = () => {
        const monthlyTotals = {};

        months.forEach((month) => {
            let total = 0;

            tables.forEach((table) => {
                table.rows.forEach((row) => {
                    total += parseFloat(row.montos[months.indexOf(month)].monto);
                });
            });

            monthlyTotals[month] = total;
        });

        return monthlyTotals;
    };

    useEffect(() => {
        setMonthlyTotals(calculateMonthlyTotals());
    }, [tables]);

    function calculateDepartmentTotal(departmentName) {
        let total = 0;
        tables.forEach((table) => {
            if (table.name === departmentName) {
                table.rows.forEach((row) => {
                    row.montos.forEach((monto) => {
                        total += parseFloat(monto.monto);
                    });
                });
            }
        });
        return total;
    }

    return (
        <div className="form-group form-group-marginless row mx-0">
            <div className="col-md-2">
                <InputLabel id="demo-controlled-open-select-label">Proyecto</InputLabel>
                <Select
                    labelId="demo-controlled-open-select-label"
                    id="demo-controlled-open-select"
                    open={open}
                    onClose={handleClosee}
                    onOpen={handleOpen}
                    name="tabla"
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                    placeholder="Nombre de la tabla"
                    style={{ width: 230, paddingRight: '2px' }}
                >
                    {proyectos.map((proyecto, index) => (
                        <MenuItem key={index} value={proyecto.id}>
                            {proyecto.nombre}
                        </MenuItem>
                    ))}
                </Select>
                <Button
                    className="btn btn-light-primary mr-4 my-2"
                    color="primary"
                    onClick={handleAddTable}
                >
                    Agregar Proyecto
                </Button>
            </div>
            <div className="col-md-2">
                <InputLabel id="demo-controlled-open-select-label">Empresa</InputLabel>
                <Select
                    labelId="demo-controlled-open-select-label"
                    onChange={(event) => handleChanges(event)}
                    open={openn}
                    onClose={handleClosess}
                    onOpen={handleOpens}
                    name="empresa"
                    value={empresa}
                    placeholder="Empresa"
                    style={{ width: 230, paddingRight: '1px' }}
                >
                    {empresas.map((dep) => (
                        <MenuItem key={dep.id} value={dep.id}>
                            {dep.nombre}
                        </MenuItem>
                    ))}
                </Select>
            </div>
            <div className="col-md-2">
                <InputLabel>Fecha Inicio</InputLabel>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                    <Grid container>
                        <KeyboardDatePicker
                            format="dd/MM/yyyy"
                            name="fecha_inicio"
                            value={startDate}
                            placeholder="dd/mm/yyyy"
                            onChange={handleStartDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </Grid>
                </MuiPickersUtilsProvider>
            </div>

            <div className="col-md-2">
                <InputLabel>Fecha fin</InputLabel>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                    <Grid container>
                        <KeyboardDatePicker
                            format="dd/MM/yyyy"
                            name="fecha_fin"
                            id="endDate"
                            value={endDate}
                            placeholder="dd/mm/yyyy"
                            onChange={handlsetEndDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </Grid>
                </MuiPickersUtilsProvider>
            </div>
            <div className="col-md-2">
                <label htmlFor="comment">NOMBRE DEL PRESUPUESTO</label>
                <TextField
                    id="comment"
                    value={comment}
                    onChange={handleCommentChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </div>
            <div className="col-md-3">
                <h2>
                    Total Global:{' '}
                    {calculateTotalGlobal().toLocaleString('es-MX', {
                        style: 'currency',
                        currency: 'MXN',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </h2>
            </div>
            <hr />
            <div className="col-md-12">
                <div className="table-responsive rounded">
                    <table className="table table-borderless table-vertical-center rounded table-hover">
                        <thead>
                            {months.map((month, monthIndex) => (
                                <th key={monthIndex}>
                                    {month}
                                    <br />
                                    Total:{' '}
                                    {(monthlyTotals[month] || 0).toLocaleString('es-MX', {
                                        style: 'currency',
                                        currency: 'MXN',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </th>
                            ))}
                        </thead>
                    </table>

                    {tables.map((table) => (
                        <div key={table.id} className="table-container">
                            <br />
                            <div>
                                {proyectos.map((item) =>
                                    item.id == table.name ? (
                                        <h2 key={item.id}>
                                            {item.nombre}
                                            <Tooltip title="Eliminar departamento" arrow>
                                                <TrashIcon
                                                    onClick={() => handleDeleteTable(table.id)}
                                                    style={{ cursor: 'pointer', color: 'red' }}
                                                />
                                            </Tooltip>
                                            <p>
                                                Total:{' '}
                                                {calculateDepartmentTotal(item.id).toLocaleString('es-MX', {
                                                    style: 'currency',
                                                    currency: 'MXN',
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </p>
                                        </h2>
                                    ) : (
                                        ''
                                    )
                                )}
                            </div>

                            <table className="table table-borderless table-vertical-center rounded table-hover">
                                <thead>
                                    <tr style={{ width: 20 }}>
                                        <th className="w-5">Área</th>
                                        <th className="w-5">Partida</th>
                                        <th className="w-5">Subpartida</th>
                                        {months.map((month, monthIndex) => (
                                            <th key={monthIndex}>
                                                {month}
                                                <br />
                                                Total: <br />
                                                {(departmentTotals[table.name]?.[month] || 0).toLocaleString('es-MX', {
                                                    style: 'currency',
                                                    currency: 'MXN',
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </th>
                                        ))}
                                        <th>Total</th>
                                        <th> </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {table.rows.map((row) => (
                                        <tr key={row.id}>
                                            <td>
                                                <Tooltip title="Eliminar columna" arrow>
                                                    <TrashIcon
                                                        onClick={() => handleDeleteRow(table.id, row.id)}
                                                        style={{ cursor: 'pointer', color: 'red' }}
                                                    />
                                                </Tooltip>

                                                <Select
                                                    value={row.areaId}
                                                    name="areaId"
                                                    onChange={(e) =>
                                                        handleSelectChange(table.id, row.id, 'areaId', e.target.value)
                                                    }
                                                    style={{ width: 100, marginRight: '1rem' }}
                                                >
                                                    {compras.map((item) => (
                                                        <MenuItem key={item.id_area} value={item.id_area}>
                                                            {item.nombreArea}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </td>
                                            <td>
                                                <Select
                                                    value={row.select1}
                                                    name="partida"
                                                    onChange={(e) =>
                                                        handleSelectChange(table.id, row.id, 'select1', e.target.value)
                                                    }
                                                    style={{ width: 100, marginRight: '1rem' }}
                                                >
                                                    {compras
                                                        .find((item) => item.id_area == row.areaId)
                                                        ?.partidas.map((items, index) => (
                                                            <MenuItem key={index} value={items.id}>
                                                                {items.nombre}
                                                            </MenuItem>
                                                        ))}
                                                </Select>
                                            </td>
                                            <td>
                                                {compras.length && row.select1 !== '' ? (
                                                    <Select
                                                        name="subarea"
                                                        value={row.select2}
                                                        style={{ width: 100, marginRight: '1rem' }}
                                                        onChange={(e) =>
                                                            handleSelectChange(table.id, row.id, 'select2', e.target.value)
                                                        }
                                                    >
                                                        {compras
                                                            .find((item) => item.id_area == row.areaId)
                                                            ?.partidas.find((item) => item.id == row.select1)
                                                            ?.subpartidas.map((item, index) => (
                                                                <MenuItem key={index} value={item.id}>
                                                                    {item.nombre}
                                                                </MenuItem>
                                                            ))}
                                                    </Select>
                                                ) : null}
                                            </td>
                                            {table.months.map((month, monthIndex) => (
                                                <td key={monthIndex}>
                                                    <CurrencyTextField
                                                        style={{ width: 70, marginRight: '1rem' }}
                                                        label="monto"
                                                        variant="standard"
                                                        value={row.montos[monthIndex].monto}
                                                        currencySymbol="$"
                                                        outputFormat="number" // Cambia a "number" para asegurarte de que se almacene como un número
                                                        decimalCharacter="."
                                                        digitGroupSeparator=","
                                                        autoFocus
                                                        onChange={(event, value) =>
                                                            handleMontosChange(table.id, row.id, monthIndex, parseFloat(value)) // Asegúrate de convertirlo a número
                                                        }
                                                    />
                                                </td>
                                            ))}
                                            <td>
                                                <CurrencyTextField
                                                    label="total"
                                                    variant="standard"
                                                    value={calculateRowTotal(row)}
                                                    currencySymbol="$"
                                                    outputFormat="string"
                                                    decimalCharacter="."
                                                    digitGroupSeparator=","
                                                    autoFocus
                                                    disabled
                                                    style={{ width: 65, marginRight: '1rem' }}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Tooltip title="Agregar columna" arrow>
                                <PlaylistAddIcon
                                    onClick={() => handleAddRow(table.id)}
                                    style={{ cursor: 'pointer', color: 'green' }}
                                />
                            </Tooltip>
                        </div>
                    ))}
                </div>
            </div>
            <br />
            <div className="col-md-12">
                {tables.length > 0 && (
                    <div>
                        <Button
                            className="btn btn-light-primary mr-4 my-2"
                            onClick={handleSendTables}
                            disabled={
                                tables.length === 0 || Object.values(hasRowsInDepartments).every((hasRows) => !hasRows)
                            }
                        >
                            Guardar
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
