import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';
import TrashIcon from '@material-ui/icons/DeleteOutline';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import { apiGet, apiPutForm } from '../../../../functions/api';
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
    const { reload, handleClose, data } = props;
    const [tableName, setTableName] = useState('');
    const [tables, setTables] = useState([
        {
            id: 'new-table',
            name: 'Tabla Personalizada',
            months: months,
            rows: [],
        },
    ]);

    const departamentos = useSelector((state) => state.opciones.compras);
    const auth = useSelector((state) => state.authUser.access_token);
    const [departmentTotals, setDepartmentTotals] = useState({});
    const [monthlyTotals, setMonthlyTotals] = useState({});
    const [hasRowsInDepartments, setHasRowsInDepartments] = useState({});
    const usuario = useSelector((state) => state.authUser.departamento.departamentos[0]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [comment, setComment] = useState('');
    const [idPresu, setIdPresu] = useState('');
    const [selectedSubpartidas, setSelectedSubpartidas] = useState({});
    const [authorizedMonths, setAuthorizedMonths] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [totalGlobal, setTotalGlobal] = useState(0);
    const [empresa, setEmpresa] = useState({});
    const [departamentosData, setDepartamentosData] = useState([]);
    const proyectos = useSelector((state) => state.opciones.proyectos);
    const [open, setOpen] = React.useState(false);

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril',
        'Mayo', 'Junio', 'Julio', 'Agosto',
        'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ];

    const classes = useStyles();

    useEffect(() => {
        apiGet(`presupuestosdep/edit/${data.id}`, auth)
            .then((response) => {
                const apiDepartments = response.data.presupuesto[0].rel;
                const apiData = response.data.presupuesto[0];
                const updatedDepartmentTotals = {};
                const { fecha_inicio, fecha_fin, nombre } = apiData;
                setIdPresu(apiData.id);
                setEmpresa(apiData.empresa[0] ? apiData.empresa[0].name : '');
                setStartDate(new Date(apiData.fecha_inicio));
                setEndDate(new Date(apiData.fecha_fin));
                setComment(apiData.nombre);

                setSelectedTable('Presupuesto');

                const updatedTables = {};
                const addedIdAreas = {};

                apiDepartments.forEach((department) => {
                    const idArea = department.proyecto.id;
                    if (!addedIdAreas[idArea]) {
                        addedIdAreas[idArea] = true;
                    }
                    if (!updatedTables[idArea]) {
                        updatedTables[idArea] = {
                            id: idArea,
                            name: idArea,
                            departments: department.proyecto,
                            months: months,
                            rows: [],
                        };
                    }

                    const newRow = {
                        id: department.id,
                        area: department.id_area,
                        select1: department.id_partida,
                        select2: department.id_subareas,
                        proyecto: department.id_proyecto,
                        montos: months.map(() => ({ monto: 0 })),
                    };

                    months.forEach((_, index) => {
                        newRow.montos[index].monto = department[months[index].toLowerCase()];
                    });

                    updatedTables[idArea].rows.push(newRow);
                });

                const convertedAuthorizedMonths = months.map((month) => {
                    if (apiData.mes[0]) {
                        const value = apiData.mes[0][month.toLowerCase()];
                        return value === 1;
                    }
                });

                setAuthorizedMonths(convertedAuthorizedMonths);
                setTables(Object.values(updatedTables));

                Object.keys(updatedTables).forEach((indice) => {
                    const departmentName = updatedTables[indice].name;
                    updatedDepartmentTotals[departmentName] = {};

                    months.forEach((month, monthIndex) => {
                        const monthTotal = updatedTables[indice].rows.reduce((total, row) => {
                            return total + parseFloat(row.montos[monthIndex].monto);
                        }, 0);
                        updatedDepartmentTotals[departmentName][month] = monthTotal;
                    });
                });
                setDepartmentTotals(updatedDepartmentTotals);
            })
            .catch((error) => {
                console.error('Error al obtener datos de la API de departamentos:', error);
            });
    }, []);

    const handleAddTable = () => {
        if (tableName) {
            const departmentExists = tables.some((table) => table.name === tableName);

            if (!departmentExists) {
                const newTable = {
                    id: Date.now(),
                    name: tableName,
                    months: months,
                    rows: [],
                };

                setTables([...tables, newTable]);
                setTableName('');
            } else {
                alert('El departamento ya existe en la lista.');
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
                    area: '',
                    select1: '',
                    select2: '',
                    proyecto: table.rows[0].proyecto,
                    montos: months.map(() => ({ monto: 0 })),
                };
                table.rows.push(newRow);

                setSelectedSubpartidas({
                    ...selectedSubpartidas,
                    [`${table.id}-${newRow.id}`]: {
                        area: '',
                        select1: '',
                        select2: '',
                        proyecto: table.rows[0].proyecto,
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
                        if (fieldName === 'area') {
                            return { ...row, area: value, select1: '', select2: '' };
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
                if (!row.select1 || !row.select2) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Campos obligatorios',
                        text: 'Por favor, completa los campos Partida y Subpartida en todas las filas.',
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
            tables.mesesAutorizados = authorizedMonths;
            tables.forEach((table) => {
                table.rows.forEach((row) => {
                    const rowData = {
                        departamentoId: table.name,
                        departamento: table ? table.nombre : '',
                        id: row.id,
                        area: row.area,
                        partida: row.select1,
                        subpartida: row.select2,
                        proyecto: row.proyecto,

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
                totalGlobal: totalGlobal,
                data: formattedData,
                fecha_inicio: startDate,
                fecha_fin: endDate,
                nombre: comment,
                autorizados: authorizedMonths,
                presuId: idPresu,
                tab: 'obra',
            };

            apiPutForm(`presupuestosdep/update/${idPresu}`, dataToSend, auth)
                .then((res) => {
                    Swal.close();
                    Swal.fire({
                        icon: 'success',
                        title: 'Presupuesto editado con éxito',
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
        return row.montos.reduce((total, { monto }) => total + parseFloat(monto), 0);
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
            if (table.name == departmentName) {
                table.rows.forEach((row) => {
                    row.montos.forEach((monto) => {
                        total += parseFloat(monto.monto);
                    });
                });
            }
        });
        return total;
    }

    const handleMonthAuthorizationChange = (index) => {
        const updatedAuthorizedMonths = [...authorizedMonths];
        updatedAuthorizedMonths[index] = !updatedAuthorizedMonths[index];
        setAuthorizedMonths(updatedAuthorizedMonths);
    };

    const handleClosee = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleStartDateChange = (date) => {
        if (comment === 'Presupuesto Nomina' || comment === 'Presupuesto Prestaciones') {
            return;
        }
        setStartDate(date);
    };

    const handlsetEndDateChange = (date) => {
        if (comment === 'Presupuesto Nomina' || comment === 'Presupuesto Prestaciones') {
            return;
        }
        setEndDate(date);
    };

    const handleCommentChange = (event) => {
        if (comment === 'Presupuesto Nomina' || comment === 'Presupuesto Prestaciones') {
            return;
        }
        setComment(event.target.value);
    };

    return (
        <div>
            {selectedTable === 'Presupuesto' && (
                <div className="form-group form-group-marginless row mx-0">
                    <div className="col-md-2">
                        <InputLabel id="demo-controlled-open-select-label">Departamento</InputLabel>
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
                            {proyectos.map((item, index) => (
                                <MenuItem key={index} value={item.id}>
                                    {item.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                        <Button className="btn btn-light-primary mr-4 my-2" color="primary" onClick={handleAddTable}>
                            Agregar Departamento
                        </Button>
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
                        <h2>{empresa}</h2>
                        <br></br>
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
                    <div className="col-md-12">
                        <div className="table-responsive rounded">
                            <table className="table table-borderless table-vertical-center rounded table-hover">
                                <thead>
                                    {months.map((month, monthIndex) => (
                                        <th key={monthIndex}>
                                            {month}
                                            <br></br> Total:{' '}
                                            {(monthlyTotals[month] || 0).toLocaleString('es-MX', {
                                                style: 'currency',
                                                currency: 'MXN',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0,
                                            })}
                                            <br></br>
                                            <FormControlLabel
                                                control={
                                                    <GreenCheckbox
                                                        checked={authorizedMonths[monthIndex] ? true : false}
                                                        onChange={() => handleMonthAuthorizationChange(monthIndex)}
                                                    />
                                                }
                                                label="Autorizar"
                                            />
                                        </th>
                                    ))}
                                </thead>
                            </table>

                            {tables.map((table) => (
                                <div key={table.id} className="table-container">
                                    <br></br>
                                    {proyectos.map((item) =>
                                        item.id == table.name ? (
                                            <h2 key={item.id}>
                                                {item.nombre}
                                                <Tooltip title="Eliminar proyecto" arrow>
                                                    <TrashIcon onClick={() => handleDeleteTable(table.id)} style={{ cursor: 'pointer', color: 'red' }} />
                                                </Tooltip>
                                                <p>
                                                    Total:{' '}
                                                    {calculateDepartmentTotal(item.id).toLocaleString('es-MX', {
                                                        style: 'currency',
                                                        currency: 'MXN',
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 0,
                                                    })}
                                                </p>
                                            </h2>
                                        ) : (
                                            ''
                                        )
                                    )}
                                    <table className="table table-borderless table-vertical-center rounded table-hover">
                                        <thead>
                                            <tr style={{ width: 20 }}>
                                                <th></th>
                                                <th className="w-5">Área</th>
                                                <th className="w-5">Partida</th>
                                                <th className="w-5">Subpartida</th>
                                                {months.map((month, monthIndex) => (
                                                    <th key={monthIndex}>
                                                        {month}
                                                        <br></br> Total: <br></br>
                                                        {(departmentTotals[table.name]?.[month] || 0).toLocaleString('es-MX', {
                                                            style: 'currency',
                                                            currency: 'MXN',
                                                            minimumFractionDigits: 0,
                                                            maximumFractionDigits: 0,
                                                        })}{' '}
                                                    </th>
                                                ))}
                                                <th>Total</th>
                                                <th> </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {table.rows.map((row) => (
                                                <tr key={row.proyecto}>
                                                    <td>
                                                        <Tooltip title="Eliminar columna" arrow>
                                                            <TrashIcon onClick={() => handleDeleteRow(table.id, row.id)} style={{ cursor: 'pointer', color: 'red' }} />
                                                        </Tooltip>                                                        
                                                    </td>
                                                    <td>
                                                         <Select  value={row.area} name="area" onChange={(e) => handleSelectChange(table.id, row.id, 'area', e.target.value)}
                                                            style={{ width: 100, marginRight: '1rem' }}  >
                                                            {departamentos.map((item) => (
                                                                <MenuItem key={item.id_area} value={item.id_area}>
                                                                    {item.nombreArea}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </td>
                                                    <td>
                                                        <Select value={row.select1}  name="partida" onChange={(e) => handleSelectChange(table.id, row.id, 'select1', e.target.value)}
                                                            style={{ width: 100, marginRight: '1rem' }} >
                                                            {departamentos
                                                                .find((item) => item.id_area == row.area)
                                                                ?.partidas.map((partida) => (
                                                                    <MenuItem key={partida.id} value={partida.id}>
                                                                        {partida.nombre}
                                                                    </MenuItem>
                                                                ))}
                                                        </Select>
                                                    </td>
                                                    <td>
                                                        {departamentos.length && row.select1 !== '' ? (
                                                            <Select  name="subarea" value={row.select2 } style={{ width: 100, marginRight: '1rem' }} onChange={(e) => handleSelectChange(table.id, row.id, 'select2', e.target.value)}>
                                                                {departamentos
                                                                    .find((item) => item.id_area == row.area)
                                                                    ?.partidas.find((partida) => partida.id == row.select1)
                                                                    ?.subpartidas.map((subpartida) => (
                                                                        <MenuItem key={subpartida.id} value={subpartida.id}>
                                                                            {subpartida.nombre}
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
                                                                outputFormat="string"
                                                                decimalCharacter="."
                                                                digitGroupSeparator=","
                                                                autoFocus
                                                                onChange={(event, value) => handleMontosChange(table.id, row.id, monthIndex, value)}
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
                                        <PlaylistAddIcon onClick={() => handleAddRow(table.id)} style={{ cursor: 'pointer', color: 'green' }} />
                                    </Tooltip>
                                </div>
                            ))}
                        </div>
                    </div>
                    <br></br>
                    <div className="col-md-12">
                        {tables.length > 0 && (
                            <div>
                                <Button className="btn btn-light-primary mr-4 my-2" onClick={handleSendTables}>
                                    Guardar
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
