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
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import { apiGet, apiPutForm } from '../../../../functions/api'
import Tooltip from '@material-ui/core/Tooltip';
import Swal from 'sweetalert2'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale'
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
  const { reload, handleClose, data } = props
  //   const [selectedMonths, setSelectedMonths] = useState([]);
  const [tableName, setTableName] = useState('');
  const [tables, setTables] = useState([
    // Otras tablas existentes...
    {
      id: 'new-table', // Un identificador único para la nueva tabla
      name: 'Tabla Personalizada', // Nombre de la nueva tabla
      months: months,
      rows: [],
    },
  ]);


  const departamentos = useSelector(state => state.opciones.areas)
  const auth = useSelector(state => state.authUser.access_token)
  const [departmentTotals, setDepartmentTotals] = useState({});
  const [monthlyTotals, setMonthlyTotals] = useState({});
  const [hasRowsInDepartments, setHasRowsInDepartments] = useState({});
  const usuario = useSelector(state => state.authUser.departamento.departamentos[0])
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [comment, setComment] = useState('');
  const [idPresu, setIdPresu] = useState('');

  // Define un estado para las subpartidas seleccionadas en cada fila
  const [selectedSubpartidas, setSelectedSubpartidas] = useState({});
  const initialAuthorizedMonths = months ? months.map(() => false) : [];
  const [authorizedMonths, setAuthorizedMonths] = useState(initialAuthorizedMonths);
  const [selectedTable, setSelectedTable] = useState(null);
  //variables para presupuesto de nomina

  const [totalGlobal, setTotalGlobal] = useState(0);
  const [totalesPorMes, setTotalesPorMes] = useState({});
  const [departamentosData, setDepartamentosData] = useState([]);
  const [departamentosAgregados, setDepartamentosAgregados] = useState([]);
  const [empleadosPorDepartamento, setEmpleadosPorDepartamento] = useState({});
  const [departamento, setDepartamentos] = useState([]);
  const [mese, setMeses] = useState([]);

  const cargarNombresMeses = () => {
    const nombresMeses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    setMeses(nombresMeses);
  };

  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril',
    'Mayo', 'Junio', 'Julio', 'Agosto',
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];



  const classes = useStyles();
  const [age, setAge] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
    checkedF: true,
    checkedG: true,
  });

  const handleStartDateChange = (date) => {
    // Verifica si el nombre actual es igual a "Presupuesto Nómina"
    if (comment === "Presupuesto Nomina" || comment === "Presupuesto Prestaciones") {
      // No permitas cambios en el campo de fecha de inicio
      return;
    }
    // Si no es "Presupuesto Nómina", permite cambios en el campo de fecha de inicio
    setStartDate(date);
  };
  const handlsetEndDateChange = (date) => {
    // Verifica si el nombre actual es igual a "Presupuesto Nómina"
    if (comment === "Presupuesto Nomina" || comment === "Presupuesto Prestaciones") {
      // No permitas cambios en el campo de fecha de fin
      return;
    }
    // Si no es "Presupuesto Nómina", permite cambios en el campo de fecha de fin
    setEndDate(date);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleCommentChange = (event) => {
    // Verifica si el nombre actual es igual a "Presupuesto Nómina"
    if (comment === "Presupuesto Nomina" || comment === "Presupuesto Prestaciones") {
      // No permitas cambios en el campo de entrada
      return;
    }

    // Si no es "Presupuesto Nómina", permite cambios en el campo de entrada
    setComment(event.target.value);
  };
  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleClosee = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };



  useEffect(() => {
    apiGet(`presupuestosdep/edit/${data.id}`, auth)
      .then((response) => {
        const apiDepartments = response.data.presupuesto[0].rel;
        const apiData = response.data.presupuesto[0];
        const nomina = response.data;

        const updatedDepartmentTotals = {};
        const { fecha_inicio, fecha_fin, nombre } = apiData;
        setIdPresu(apiData.id); // Assuming fecha_inicio is a valid date string

        setStartDate(new Date(apiData.fecha_inicio)); // Assuming fecha_inicio is a valid date string
        setEndDate(new Date(apiData.fecha_fin)); // Assuming fecha_fin is a valid date string
        setComment(apiData.nombre);

        if (apiData.nombre != 'Presupuesto Nomina' && apiData.nombre != 'Presupuesto Prestaciones') {
          setSelectedTable('Presupuesto');

          const updatedTables = {};
          const addedIdAreas = {};

          apiDepartments.forEach((department) => {
            const idArea = department.id_area;

            if (!addedIdAreas[idArea]) {
              addedIdAreas[idArea] = true;
            }

            if (!updatedTables[idArea]) {
              updatedTables[idArea] = {
                id: idArea,
                name: idArea,
                departments: department.rel,
                months: months,
                rows: [],
              };
            }

            const newRow = {
              id: department.id,
              select1: department.id_partida, // Establece la "partida" según los datos de la API
              select2: department.id_subareas, // Establece la "subárea" según los datos de la API
              montos: months.map(() => ({ monto: 0 })),
            };

            months.forEach((_, index) => {
              newRow.montos[index].monto = department[meses[index].toLowerCase()];
            });

            updatedTables[idArea].rows.push(newRow);
          });

          const convertedAuthorizedMonths = months.map(month => {
            if (apiData.mes[0]) {
              const value = apiData.mes[0][month.toLowerCase()];
              return value == 1;
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



        } else if (apiData.nombre == 'Presupuesto Nomina') {
          setSelectedTable('Nomina');

          const empleados = apiData.prestaciones;
            const nomina = response.data.presupuesto[0];

          const departamentosUnicos = [...new Set(empleados.map((empleado) => empleado.id_area))];

          // Crea un objeto de departamentos donde cada departamento contiene sus empleados
          const updatedDepartamentosData = departamentosUnicos.map((departamentoId) => {
          const empleadosEnDepartamento = empleados.filter((empleado) => empleado.id_area === departamentoId);

            return {
              id: departamentoId,
              datos: empleadosEnDepartamento,
              fecha_inicio: nomina.fecha_inicio, 
              fecha_fin: nomina.fecha_fin, 
            };
          });

          setDepartamentosData(updatedDepartamentosData);
          calcularTotales(updatedDepartamentosData);
          
        } else {
          // Si no cumple con ninguna condición, puedes seleccionar la tabla personalizada o cualquier otra
          setSelectedTable('Prestaciones');

          const empleados = apiData.prestaciones;
          const departamentosUnicos = [...new Set(empleados.map((empleado) => empleado.id_area))];

          // Crea un objeto de departamentos donde cada departamento contiene sus empleados
          const updatedDepartamentosData = departamentosUnicos.map((departamentoId) => {
            const empleadosEnDepartamento = empleados.filter((empleado) => empleado.id_area === departamentoId);
            return {
              id: departamentoId,
              datos: empleadosEnDepartamento
            };
          });

          setDepartamentosData(updatedDepartamentosData);
          calcularTotales(updatedDepartamentosData);
        }

      })
      .catch((error) => {
        console.error('Error al obtener datos de la API de departamentos:', error);
      });
  }, []);

  useEffect(() => {
    cargarNombresMeses();
    // cargarDepartamentos(); // Llama a la función para cargar departamentos al iniciar el componente.
  }, []);


  const handleAddTable = () => {
    if (tableName) {
      const departmentExists = tables.some((table) => table.name == tableName);

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
        // Display an error message if the department already exists
        alert("El departamento ya existe en la lista.");
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
          select1: '',
          select2: '',
          montos: months.map(() => ({ monto: 0 })),
        };
        table.rows.push(newRow);

        // Inicializa el estado de subpartidas seleccionadas para esta fila
        setSelectedSubpartidas({
          ...selectedSubpartidas,
          [`${table.id}-${newRow.id}`]: {
            select1: '',
            select2: '',
          },
        });

        // Actualiza el estado de hasRowsInDepartments
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

    // Recalculate department totals
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
            // De lo contrario, actualiza el campo select correspondiente
            return { ...row, [fieldName]: value };
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
        // console.log(updatedDepartmentTotals[table.name][months[monthIndex]] )
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

        setMonthlyTotals(updatedMonthlyTotals); // Update the monthly totals state

        setDepartmentTotals(updatedDepartmentTotals); // Update the department totals state

        return { ...table, rows: updatedRows };
      }
      return table;
    });
    setTables(updatedTables);
  };


  const handleSendTables = () => {
    // Verifica que startDate, endDate y comment no estén vacíos
    if (!startDate || !endDate || !comment) {
      // Muestra una alerta al usuario indicando que los campos son obligatorios
      Swal.fire({
        icon: 'error',
        title: 'Campos obligatorios',
        text: 'Por favor, completa las fechas de inicio y fin, y el comentario.',
      });
      return; // Detén la función si los campos están vacíos
    }

    // Verifica que select1 y select2 en cada fila no estén vacíos
    for (const table of tables) {
      for (const row of table.rows) {
        if (!row.select1 || !row.select2) {
          // Muestra una alerta al usuario indicando que los campos son obligatorios
          Swal.fire({
            icon: 'error',
            title: 'Campos obligatorios',
            text: 'Por favor, completa los campos Partida y Subpartida en todas las filas.',
          });
          return; // Detén la función si algún campo está vacío
        }
      }
    }

    // Si todos los campos requeridos están completos, llama a la función para enviar los datos de la tabla a la API
    sendTableDataToAPI(tables);
  };


  // Crea una función para enviar los datos de la tabla a la API en el nuevo formato
  const sendTableDataToAPI = async (tables) => {
    try {
      const formattedData = [];
      let totalGlobal = 0; // Variable para almacenar el total global
      tables.mesesAutorizados = authorizedMonths;

      // Recorre las tablas
      tables.forEach((table) => {
        const department = departamentos.find((item) => item.id_area === table.name);
        // Recorre las filas de cada tabla
        table.rows.forEach((row) => {
          const rowData = {
            departamentoId: table.name, // Agrega el ID del departamento
            id: row.id,
            partida: row.select1,
            subpartida: row.select2,
            months: row.montos.map((monto, monthIndex) => ({
              month: months[monthIndex],
              monto: parseFloat(monto.monto),
            })),
          };
          // Calcula el total de la fila y lo agrega al total global
          const rowTotal = rowData.months.reduce((acc, monthData) => acc + monthData.monto, 0);
          totalGlobal += rowTotal;
          formattedData.push(rowData);
        });
      });

      // Agrega el total global al objeto de datos
      const dataToSend = {
        totalGlobal: totalGlobal,
        data: formattedData,
        fecha_inicio: startDate, // Agrega la fecha de inicio
        fecha_fin: endDate, // Agrega la fecha de fin
        nombre: comment, // Agrega el comentario
        autorizados: authorizedMonths,
        presuId: idPresu,
        tab: 'departamento'
      };
      // console.log(dataToSend)
      apiPutForm(`presupuestosdep/update/${idPresu}`, dataToSend, auth)

        // apiPostForm(`presupuestosdep?departamento_id=${usuario.id}`, dataToSend, auth)
        .then(res => {
          Swal.close()
          Swal.fire({
            icon: 'success',
            title: 'Presupuesto editado con éxito',
            timer: 2000
          }).then(() => {
            if (reload) {
              reload.reload()
            }
            handleClose()
          })

        })


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

  // Llama a esta función en el useEffect para calcular los totales cuando los datos se cargan inicialmente
  useEffect(() => {
    setMonthlyTotals(calculateMonthlyTotals());
  }, [tables]); // Asegúrate de que se vuelva a calcular cuando cambian los datos de las tablas



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

  const handleRemoveDepartamento = (departamentoId) => {
    const updatedDepartamentosAgregados = departamentosAgregados.filter((depId) => depId !== departamentoId);
    setDepartamentosAgregados(updatedDepartamentosAgregados);
    // Elimina los datos de empleados por departamento
    const updatedEmpleadosPorDepartamento = { ...empleadosPorDepartamento };
    delete updatedEmpleadosPorDepartamento[departamentoId];
    setEmpleadosPorDepartamento(updatedEmpleadosPorDepartamento);
    const updatedDepartamentosData = departamentosData.filter((data) => data.id !== departamentoId);
    setDepartamentosData(updatedDepartamentosData);
    calcularTotales(updatedDepartamentosData);

  };

  const calcularTotales = (data) => {
    const updatedTotalesPorMes = {};
    let updatedTotalGlobal = 0;

    data.forEach((departamentoInfo) => {
      departamentoInfo.datos.forEach((empleado) => {
        meses.forEach((mes) => {
          const montoPorMes = empleado[mes] || 0;
          updatedTotalesPorMes[mes] = (updatedTotalesPorMes[mes] || 0) + montoPorMes;
          updatedTotalGlobal += montoPorMes;
        });
      });
    });

    setTotalesPorMes(updatedTotalesPorMes);
    setTotalGlobal(updatedTotalGlobal);
  };

  function isFechaInicioCurrentYear(fechaInicio,fechaComparar) {

    if (fechaInicio && fechaComparar) {
      const currentYear = new Date(fechaComparar).getFullYear();
      const fechaInicioYear = new Date(fechaInicio).getFullYear();
      return fechaInicioYear == currentYear;
    }
    return false;
  }

  // console.log(tables)
  // console.log(departamentos)
  // console.log(departamentosData)


  return (
    <div>
      {selectedTable === 'Presupuesto' && (
        <div className="form-group form-group-marginless row mx-0">

          <div className="col-md-3">
            <InputLabel id="demo-controlled-open-select-label">Departamento</InputLabel>
            <Select labelId="demo-controlled-open-select-label" id="demo-controlled-open-select" open={open} onClose={handleClosee} onOpen={handleOpen}
              name="tabla" value={tableName} onChange={(e) => setTableName(e.target.value)} placeholder="Nombre de la tabla" style={{ width: 230, paddingRight: '2px' }} >
              {
                departamentos.map((item, index) => (
                  <MenuItem key={index} value={item.id_area}>{item.nombreArea}</MenuItem>
                ))}
            </Select>
            <Button className="btn btn-light-primary mr-4 my-2" color="primary" onClick={handleAddTable}>Agregar Departamento</Button>
          </div>
          <div className="col-md-2">

            <InputLabel >Fecha Inicio</InputLabel>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
              <Grid container >
                <KeyboardDatePicker format="dd/MM/yyyy" name="fecha_inicio" value={startDate} placeholder="dd/mm/yyyy" onChange={handleStartDateChange}
                  KeyboardButtonProps={{ 'aria-label': 'change date', }} />
              </Grid>
            </MuiPickersUtilsProvider>
          </div>

          <div className="col-md-2">
            <InputLabel >Fecha fin</InputLabel>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
              <Grid container >
                <KeyboardDatePicker format="dd/MM/yyyy" name="fecha_fin" id="endDate" value={endDate} placeholder="dd/mm/yyyy" onChange={handlsetEndDateChange}
                  KeyboardButtonProps={{ 'aria-label': 'change date', }} />
              </Grid>
            </MuiPickersUtilsProvider>

          </div>
          <div className="col-md-2">
            <label htmlFor="comment">NOMBRE DEL PRESUPUESTO</label>
            <TextField id="comment" value={comment} onChange={handleCommentChange} InputLabelProps={{ shrink: true, }} />

          </div>
          <div className="col-md-3">
            <h2>Total Global: {calculateTotalGlobal().toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2, })}</h2>
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
                        style: 'currency', currency: 'MXN', minimumFractionDigits: 0, maximumFractionDigits: 0,
                      })}
                      <br></br>
                      <FormControlLabel
                        control={
                          <GreenCheckbox checked={authorizedMonths[monthIndex] ? true : false} onChange={() => handleMonthAuthorizationChange(monthIndex)} />
                        } label="Autorizar"
                      />
                    </th>
                  ))}
                </thead>
              </table>

              {tables.map((table) => (
                <div key={table.id} className="table-container">
                  <br></br>
                  {departamentos.map((item) => (
                    item.id_area == table.name ?
                      <h2 key={item.id_area}>{item.nombreArea}
                        <Tooltip title="Eliminar departamento" arrow>
                          <TrashIcon onClick={() => handleDeleteTable(table.id)} style={{ cursor: 'pointer', color: 'red' }} />
                        </Tooltip>
                        {/* <Button  className = "btn btn-light-danger " onClick={() => handleDeleteTable(table.id)}>Eliminar Departamento </Button> */}
                        <p>Total: {calculateDepartmentTotal(item.id_area).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0, maximumFractionDigits: 0, })}</p>

                      </h2>
                      :
                      ''
                  ))}
                  <table className="table table-borderless table-vertical-center rounded table-hover">
                    <thead>
                      <tr style={{ width: 20 }}>
                        <th></th>
                        <th className="w-5">Partida</th>
                        <th className="w-5">Subpartida</th>
                        {months.map((month, monthIndex) => (
                          <th key={monthIndex}>
                            {month}
                            <br></br> Total: <br></br>
                            {(departmentTotals[table.name]?.[month] || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0, maximumFractionDigits: 0, })}{' '}
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
                            <Tooltip title="Eliminar columna" arrow >
                              <TrashIcon onClick={() => handleDeleteRow(table.id, row.id)} style={{ cursor: 'pointer', color: 'red' }} />
                            </Tooltip>
                          </td>
                          <td>
                            <Select value={row.select1} name="partida" onChange={(e) => handleSelectChange(table.id, row.id, 'select1', e.target.value)}>
                              {departamentos.find((item) => item.id_area == table.name) &&
                                departamentos.find((item) => item.id_area == table.name).partidas.map((items, index) => (
                                  <MenuItem key={index} value={items.id} > {items.nombre} </MenuItem>
                                ))}
                            </Select>
                          </td>
                          <td>
                            {
                              departamentos.length && row.select1 !== '' ?
                                <Select name="subarea" value={row.select2} style={{ width: 100, marginRight: '1rem' }} onChange={(e) => handleSelectChange(table.id, row.id, 'select2', e.target.value)} >
                                  {departamentos.find(item => item.id_area == table.name).partidas.find(item => item.id == row.select1).subpartidas.map((item, index) => (
                                    <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                  ))}

                                </Select>
                                : null
                            }

                          </td>
                          {table.months.map((month, monthIndex) => (
                            <td key={monthIndex}>
                              <CurrencyTextField style={{ width: 70, marginRight: '1rem' }} label="monto" variant="standard" value={row.montos[monthIndex].monto} currencySymbol="$" outputFormat="string"
                                decimalCharacter="." digitGroupSeparator="," autoFocus onChange={(event, value) => handleMontosChange(table.id, row.id, monthIndex, value)}
                              />
                            </td>
                          ))}
                          <td>
                            <CurrencyTextField label="total" variant="standard" value={calculateRowTotal(row)} currencySymbol="$" outputFormat="string" decimalCharacter="." digitGroupSeparator=","
                              autoFocus disabled style={{ width: 65, marginRight: '1rem' }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Tooltip
                    title="Agregar columna"
                    arrow
                  >
                    <PlaylistAddIcon
                      onClick={() => handleAddRow(table.id)}
                      style={{ cursor: 'pointer', color: 'green' }}
                    />
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>
          <br></br>
          <div className="col-md-12">
            {tables.length > 0 && (
              <div>
                <Button
                  className="btn btn-light-primary mr-4 my-2"
                  onClick={handleSendTables}
                // disabled={
                //     tables.length == 0 ||
                //     Object.values(hasRowsInDepartments).every(
                //     (hasRows) => !hasRows
                //     )
                // }
                >
                  Guardar
                </Button>
              </div>
            )}
          </div>


        </div>
      )}

      {selectedTable === 'Nomina' && (

        <div className="form-group form-group-marginless row mx-0">
          <div className="col-md-4">
            <h2>Presupuesto de nomina</h2>
          </div>
          <div className="col-md-4">
            <h3>Total Global: {totalGlobal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2, })} </h3>
          </div>
          <div className="col-md-12">
            <div className="table-responsive rounded">
              <table className="table table-border less table-vertical-center rounded table-hover">
                <thead>
                  <tr>
                    <th>Departamento</th>
                    <th>Nombre</th>
                    <th>Puesto</th>
                    {meses.map((mes, index) => (
                      <th key={index}>
                        {mes}
                        <br />
                        Total: <br />
                        {totalesPorMes[mes] ? totalesPorMes[mes].toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2, }) : 0}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>

                  {Object.values(departamentosData).map((departamentoInfo) => (
                    <React.Fragment key={departamentoInfo.id}>
                      {Object.values(departamentoInfo.datos).map((empleado) => (
                        <tr key={empleado.id} style={{ border:  isFechaInicioCurrentYear(empleado.usuarios.fecha_inicio,departamentoInfo.fecha_fin) ? '2px solid green' : '' , color: isFechaInicioCurrentYear(empleado.usuarios.fecha_inicio,departamentoInfo.fecha_fin) ? 'green' : '' }}>
                          <td>
                            {empleado.usuarios.departamentos ? empleado.usuarios.departamentos[0].nombre : 'N/A'}
                          </td>
                          <td>{empleado.usuarios.nombre} {empleado.usuarios.apellido_paterno} {empleado.usuarios.apellido_materno}</td>
                          <td>{empleado.usuarios.puestos ? empleado.usuarios.puestos.nombre_puesto : ''}</td>
                          {meses.map((mes, index) => (
                            <td key={index}>{empleado[mes].toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2, })} </td>
                          ))}
                        </tr>
                      ))}
                      <tr>
                        <td></td>
                        <td></td>
                        {/* <td> <Button  className = "btn mr-4 my-2" color="secondary" startIcon={<DeleteIcon />} onClick={() => handleRemoveDepartamento(departamentoInfo.id)}>Eliminar</Button></td> */}
                        <td>
                          {departamentos && departamentos.map((item) => (
                            item.id_area == departamentoInfo.id ?
                              <strong> <p key={item.id_area}> Subtotales {item.nombreArea} </p> </strong>
                              :
                              ''
                          ))}
                        </td>
                        {meses.map((mes, index) => (
                          <td key={index}>
                            <strong>
                              {Object.values(departamentoInfo.datos).reduce((totalPorMes, empleado) => {
                                const montoPorMes = empleado[mes] || 0; // Obtener el monto para el mes actual (o 0 si no existe)
                                return totalPorMes + montoPorMes;
                              }, 0).toLocaleString('es-MX', {
                                style: 'currency',
                                currency: 'MXN',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </strong>
                          </td>
                        ))}

                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              <div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTable === 'Prestaciones' && (

        <div className="form-group form-group-marginless row mx-0">
          <div className="col-md-4">
            <h2> Nomina Prestaciones</h2>
          </div>
          <div className="col-md-4">
            <h2>Total Global: {totalGlobal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2, })}</h2>
          </div>
          <div className="col-md-12">
            <div className="table-responsive rounded">
              <table className="table table-border less table-vertical-center rounded table-hover">
                <thead>
                  <tr>
                    <th>Departamento</th>
                    <th>Nombre</th>
                    <th>Puesto</th>
                    <th>Prestacion</th>
                    {meses.map((mes, index) => (
                      <th key={index}>
                        {mes}
                        <br />
                        Total: <br />
                        {totalesPorMes[mes] ? totalesPorMes[mes].toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2, }) : 0}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>

                  {Object.values(departamentosData).map((departamentoInfo) => (
                    <React.Fragment key={departamentoInfo.id}>
                      {Object.values(departamentoInfo.datos).map((empleado) => (
                        // Object.values(array).map((empleado) => (
                        // Object.values(empleado.prestaciones).map((prestaciones) => (
                        <tr key={empleado}>
                          <td>
                            {empleado.usuarios.departamentos ? empleado.usuarios.departamentos[0].nombre : 'N/A'}
                          </td>
                          <td>{empleado.usuarios.nombre} {empleado.usuarios.apellido_paterno} {empleado.usuarios.apellido_materno}</td>
                          <td>{empleado.usuarios.puestos ? empleado.usuarios.puestos.nombre_puesto : ''}</td>
                          <td>{empleado.nombre ? empleado.nombre : ''}</td>
                          {meses.map((mes, index) => (
                            <td key={index}>{empleado[mes].toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2, })}</td>
                          ))}
                        </tr>
                        // ))                      
                        // ))                  
                      ))}
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>

                        {/* <td> <Button  className = "btn mr-4 my-2" color="secondary" startIcon={<DeleteIcon />} onClick={() => handleRemoveDepartamento(departamentoInfo.id)}>Eliminar</Button></td> */}
                        <td>
                          {departamentos && departamentos.map((item) => (
                            item.id_area == departamentoInfo.id ?
                              <strong> <p key={item.id_area}> Subtotales {item.nombreArea} </p> </strong>
                              :
                              ''
                          ))}
                        </td>
                        {meses.map((mes, index) => (

                          <td key={index}>
                            <strong>
                              {Object.values(departamentoInfo.datos).reduce((totalPorMes, empleado) => {
                                const montoPorMes = empleado[mes] || 0; // Obtener el monto para el mes actual (o 0 si no existe)
                                return totalPorMes + montoPorMes;
                              }, 0).toLocaleString('es-MX', {
                                style: 'currency',
                                currency: 'MXN',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </strong>
                          </td>
                        ))}

                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              {/* <Button  className = "btn  mr-4 my-2"  startIcon={<SaveIcon />} color="primary"  onClick={enviarFormulario} >Guardar</Button> */}
              <div>
              </div>
            </div>
          </div>

        </div>
      )}


    </div>



  );

}

export default App;
