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
import { apiOptions, apiPostForm } from '../../../../functions/api'
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
    const { reload, handleClose } = props

//   const [selectedMonths, setSelectedMonths] = useState([]);
  const [tableName, setTableName] = useState('');
  const [tables, setTables] = useState([]); // Estado para almacenar las tablas
  const [tableData, setTableData] = useState([]);
  const departamentos = useSelector(state => state.opciones.areas)
  const auth = useSelector(state => state.authUser.access_token)
  const [departmentTotals, setDepartmentTotals] = useState({});
  const [monthlyTotals, setMonthlyTotals] = useState({});
  const [hasRowsInDepartments, setHasRowsInDepartments] = useState({});
  const usuario = useSelector(state => state.authUser.departamento.departamentos[0])
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [comment, setComment] = useState('');

// Define un estado para las subpartidas seleccionadas en cada fila
  const [selectedSubpartidas, setSelectedSubpartidas] = useState({});
  
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
    // new Date(date)
    setStartDate(date); // Actualiza el estado con la fecha seleccionada
  };
  const handlsetEndDateChange = (date) => {
    // new Date(date)
    setEndDate(date); // Actualiza el estado con la fecha seleccionada
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

  const handleClosee = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };


  useEffect(() => {
    // Realiza una petición a la API cuando el componente se monta
        const updatedTables =  apiOptions(`presupuestosdep`, auth)
            .then((response) => {
        // Procesa los datos de la API según sea necesario
        const apiData = response.data;

        // Actualiza el estado de la tabla con los datos de la API procesados
        setTableData(apiData);
      })
      .catch((error) => {
        console.error('Error al obtener datos de la API:', error);
      });
  }, []); // E

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril',
    'Mayo', 'Junio', 'Julio', 'Agosto',
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];


  const handleAddTable = () => {
    console.log(tableName)
    if (tableName) {
      // Verificar si el departamento ya existe
      const departmentExists = tables.some((table) => table.name === tableName);
  
      if (!departmentExists) {
        const newTable = {
          id: Date.now(),
          name: tableName,
          months: months,
          rows: [],
        };
        // console.log(newTable)

        setTables([...tables, newTable]);
        setTableName('');
      } else {
        // Aquí puedes manejar una notificación o mensaje de error
        console.log("El departamento ya existe en la lista.");
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
        updatedDepartmentTotals[table.name][months[monthIndex]] = updatedRows.reduce(
          (total, row) => total + parseFloat(row.montos[monthIndex].monto),
          0
        );
  
        // Calculate the monthly total across all tables
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

      // Recorre las tablas
      tables.forEach((table) => {
        const department = departamentos.find((item) => item.id_area === table.name);
  
        // Recorre las filas de cada tabla
        table.rows.forEach((row) => {
          const rowData = {
            departamentoId: department ? department.id_area : null, // Agrega el ID del departamento
            departamento: department ? department.nombreArea : '',
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
                total: totalGlobal,
                data: formattedData,
                fecha_inicio: startDate, // Agrega la fecha de inicio
                fecha_fin: endDate, // Agrega la fecha de fin
                nombre: comment, // Agrega el comentario
                tab: 'departamento', // Agrega el comentario
                id_departamento:usuario.id
            };
        // console.log(usuario)
            apiPostForm(`presupuestosdep?departamento_id=${usuario.id}`, dataToSend, auth)
            .then(res => {
                Swal.close()
                Swal.fire({
                    icon: 'success',
                    title: 'Presupuesto creado con éxito',
                    timer: 2000
                }).then(() => {
                    if (reload) {
                        reload.reload()
                    }
                    handleClose()
                })

            })

    //   const response = await fetch('URL_DE_TU_API', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       // Agrega otros encabezados si es necesario, como la autorización
    //     },
    //     body: JSON.stringify(dataToSend), // Convierte los datos a formato JSON
    //   });
  
    //   if (response.ok) {
    //     // La solicitud fue exitosa, puedes realizar acciones adicionales si es necesario
    //     console.log('Datos de la tabla enviados con éxito');
    //   } else {
    //     // La solicitud falló, maneja el error apropiadamente
    //     console.error('Error al enviar datos de la tabla a la API');
    //   }
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
  
  // console.log(tables)

  
  return (
    <div className="form-group form-group-marginless row mx-0">    
        <div className="col-md-3">
              <InputLabel id="demo-controlled-open-select-label">Departamento</InputLabel>
                <Select labelId="demo-controlled-open-select-label" id="demo-controlled-open-select" open={open}  onClose={handleClosee} onOpen={handleOpen}
                  name="tabla" value={tableName} onChange={(e) => setTableName(e.target.value)} placeholder="Nombre de la tabla" style={{ width: 230, paddingRight: '2px' }} >
                  {
                    departamentos.map((item, index) => (
                    <MenuItem key={index} value={item.id_area}>{item.nombreArea}</MenuItem>
                  ))}
              </Select>
              <Button  className = "btn btn-light-primary mr-4 my-2" color="primary" onClick={handleAddTable}>Agregar Departamento</Button>
        </div>       
        <div  className="col-md-2">

        <InputLabel >Fecha Inicio</InputLabel>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                <Grid container >
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
      <InputLabel >Fecha fin</InputLabel>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                <Grid container >
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
           <h2>Total Global: {calculateTotalGlobal().toLocaleString('es-MX', {style: 'currency', currency: 'MXN',minimumFractionDigits: 2,maximumFractionDigits: 2,})}</h2>
        </div>        
        <hr></hr>
        <div className="col-md-12">
        <div className="table-responsive rounded">

              <table className="table table-borderless table-vertical-center rounded table-hover">
                <thead>
              {months.map((month, monthIndex) => (
                    <th key={monthIndex}>
                         {month}<br></br> Total: {(monthlyTotals[month] || 0).toLocaleString('es-MX', {style: 'currency', currency: 'MXN',minimumFractionDigits: 2,maximumFractionDigits: 2,}) }
                    </th>
                    ))}
                </thead>
              </table>


          {tables.map((table) => (
            <div key={table.id} className="table-container">
                <br></br>                   
                <div>
                {departamentos.map((item) => (
                    item.id_area == table.name ?
                    <h2 key={item.id_area}>{item.nombreArea}  
                       <Tooltip title="Eliminar departamento" arrow>
                           <TrashIcon onClick={() => handleDeleteTable(table.id)}style={{ cursor: 'pointer', color: 'red' }} />
                        </Tooltip>
                    {/* <Button  className = "btn btn-light-danger " onClick={() => handleDeleteTable(table.id)}>Eliminar Departamento </Button> */}
                    <p>Total: {calculateDepartmentTotal(item.id_area).toLocaleString('es-MX', {style: 'currency', currency: 'MXN',minimumFractionDigits: 2,maximumFractionDigits: 2,})}</p>

                    </h2>
                    :
                    ''
                ))}
                
                </div>              

              <table className="table table-borderless table-vertical-center rounded table-hover">
                <thead>                   
                  <tr  style={{ width: 20 }}>
                    <th className="w-5">Partida</th>
                    <th className="w-5">Subpartida</th>
                    {months.map((month, monthIndex) => (
                    <th key={monthIndex}>{month}<br></br> Total: <br></br>{ (departmentTotals[table.name]?.[month] || 0).toLocaleString('es-MX', {style: 'currency', currency: 'MXN',minimumFractionDigits: 2,maximumFractionDigits: 2,}) } </th>
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
                           <TrashIcon onClick={() => handleDeleteRow(table.id, row.id)} style={{ cursor: 'pointer', color: 'red' }} />
                        </Tooltip>

                          <Select value={row.select1} name="partida" onChange={(e) => handleSelectChange( table.id, row.id,  'select1', e.target.value)}style={{ width: 100, marginRight: '1rem' }}>
                              {departamentos.find(item => item.id_area == table.name) && departamentos.find(item => item.id_area == table.name).partidas.map((items, index) => (
                                  <MenuItem key={index} value={items.id}>{items.nombre}</MenuItem>
                              ))}
                          </Select>                        
                      </td>
                      <td>
                      {
                         departamentos.length && row.select1 !== '' ?
                              <Select name="subarea" value={row.select2} style={{ width: 100, marginRight: '1rem' }} onChange={(e) => handleSelectChange(table.id, row.id,'select2',e.target.value )} >
                                {departamentos.find(item => item.id_area == table.name).partidas.find(item => item.id == row.select1).subpartidas.map((item, index) => (
                                    <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                ))}

                              </Select>
                            : null
                        }
                             
                      </td>
                      {table.months.map((month, monthIndex) => (
                        <td  key={monthIndex}>
                            <CurrencyTextField style={{ width: 70, marginRight: '1rem' }}  label="monto" variant="standard" value={row.montos[monthIndex].monto} currencySymbol="$"
                              outputFormat="string" decimalCharacter="." digitGroupSeparator="," autoFocus onChange={(event, value) => handleMontosChange(table.id, row.id, monthIndex, value)} />                                  
                        </td>
                      ))}
                      <td>
                        <CurrencyTextField label="total" variant="standard"  value={calculateRowTotal(row)} currencySymbol="$" outputFormat="string" decimalCharacter="." digitGroupSeparator=","
                            autoFocus disabled style={{ width: 65, marginRight: '1rem' }}/>          
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
            <Button className = "btn btn-light-primary mr-4 my-2" onClick={handleSendTables}  disabled={ tables.length === 0 || Object.values(hasRowsInDepartments).every((hasRows) => !hasRows)}>Guardar</Button>
          </div>
        )}
      </div>
    </div>

  );
}

export default App;
