import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import SelectMUI from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';
import TrashIcon from '@material-ui/icons/DeleteOutline';

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import { apiOptions, apiPostForm } from '../../../../functions/api'

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

function App() {
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [tableName, setTableName] = useState('');
  const [tables, setTables] = useState([]); // Estado para almacenar las tablas
  const [tableData, setTableData] = useState([]);
  const departamentos = useSelector(state => state.opciones.areas)
  const auth = useSelector(state => state.authUser.access_token)
  
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

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  
  // useEffect(() => {
  //   // Función para cargar datos de la API y agregarlos a las tablas
  //   const fetchTableData = async () => {
  //     try {
  //       // const response = await fetch('http://localhost:8000/api/presupuestosdep'); // Reemplaza con la URL de tu API
  //       // const apiData = await response.json();
  //       const updatedTables =  apiOptions(`presupuestosdep`, auth)
  //       .then(apiData => {
  //          // Modificar el estado para agregar los datos a la propiedad 'rows' de las tablas
  //           const updatedTables = tables.map((table) => {
  //             if (updatedTables) {
  //               table.rows = apiData; // Reemplaza con la forma correcta de asignar los datos
  //             }
  //             return table;
  //           });

  //          setTables(updatedTables); // Actualizar el estado con los datos de 'rows'
  //       })

  //     } catch (error) {
  //       console.error('Error al cargar datos desde la API:', error);
  //     }
  //   };

  //   fetchTableData(); // Llamar a la función para cargar datos al montar el componente
  // }, [tables]);

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

  const handleMonthToggle = (month) => {
    if (selectedMonths.includes(month)) {
      setSelectedMonths(selectedMonths.filter((m) => m !== month));
    } else {
      setSelectedMonths([...selectedMonths, month]);
    }
  };

  const handleAddTable = () => {
    if (tableName && selectedMonths.length > 0) {
      const newTable = {
        id: Date.now(), // ID único para la tabla
        name: tableName,
        months: selectedMonths,
        rows: [],
      };
      console.log(newTable)

      setTables([...tables, newTable]);
      setTableName('');
      // setSelectedMonths([]);
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
          id: Date.now(), // ID único para la fila
          select1: '', // Primer campo select
          select2: '', // Segundo campo select
          montos: months.map(() => ({ monto: 0 })), // Montos para cada mes
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
        return { ...table, rows: updatedRows };
      }
      return table;
    });
    setTables(updatedTables);
  };

  const handleSendTables = () => {
    // Aquí puedes enviar las tablas con su información
    setTableData(tables);
    console.log('Tablas enviadas:', tables);
  };

  const handleChanges = (event) => {
    setState({ ...useState, [event.target.name]: event.target.checked });
  };

  const calculateRowTotal = (row) => {
    return row.montos.reduce((total, { monto }) => total + parseFloat(monto), 0);
  };

  console.log(tableData)

  return (
    <div className="form-group form-group-marginless row mx-0">    
      <div className="col-md-12">
        <h2>Selecciona los Meses:</h2>
        <div>
          {months.map((month, index) => (
             <FormControlLabel
             control={<GreenCheckbox checked={selectedMonths.includes(month)}  onChange={() => handleMonthToggle(month)} name="checkedG" />}
             label= {month}
           />
          ))}
        </div>
        
        <div className="col-md-5">
              <InputLabel id="demo-controlled-open-select-label">Departamento</InputLabel>
                <Select
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  open={open}
                  onClose={handleClose}
                  onOpen={handleOpen}
                  name="tabla"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  placeholder="Nombre de la tabla"
                  style={{ width: 230, paddingRight: '2px' }}
                >
                  {
                    departamentos.map((item, index) => (
                    <MenuItem key={index} value={item.id_area}>{item.nombreArea}</MenuItem>
                  ))}
                  
              </Select>
        </div>

        <div className="col-md-5">
              <Button  className = "btn btn-light-primary mr-4 my-2" color="primary" onClick={handleAddTable}>Agregar Tabla</Button>
        </div>
        <hr></hr>
      </div>
        {/* <Button color="primary" onClick={handleAddTable}>Agregar Tabla</Button> */}
        <div className="col-md-12">
        <div className="table-responsive rounded">

          {tables.map((table) => (
            <div key={table.id} className="table-container">
              {departamentos.map((item) => (
                  item.id_area == table.name ?
                  <h2 key={item.id_area}>{item.nombreArea}</h2>
                  :
                  ''
              ))}
              <table className="table table-borderless table-vertical-center rounded table-hover">
                <thead>
                  <tr  style={{ width: 20 }}>
                    <th className="w-5">Partida</th>
                    <th className="w-5">Subpartida</th>
                    <th className="w-5">nombre</th>

                    {table.months.map((month, monthIndex) => (
                      <th  key={monthIndex}>{month} </th>
                    ))}
                    <th>Total</th>

                    <th> </th>
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row) => (
                    <tr key={row.id}>
                      <td>
                          <Select value={row.select1} name="partida" onChange={(e) => handleSelectChange( table.id, row.id,  'select1', e.target.value)}style={{ width: 150, marginRight: '1rem' }}>
                              {departamentos.find(item => item.id_area == table.name) && departamentos.find(item => item.id_area == table.name).partidas.map((items, index) => (
                                  <MenuItem key={index} value={items.id}>{items.nombre}</MenuItem>
                              ))}
                          </Select>                        
                      </td>
                      <td>
                      {
                         departamentos.length && row.select1 !== '' ?
                              <Select name="subarea" value={row.select2} style={{ width: 150, marginRight: '1rem' }} onChange={(e) => handleSelectChange(table.id, row.id,'select2',e.target.value )} >
                                {departamentos.find(item => item.id_area == table.name).partidas.find(item => item.id == row.select1).subpartidas.map((item, index) => (
                                    <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                ))}

                              </Select>
                            : null
                        }
                             
                      </td>
                      <td>nomrbe</td>
                      {table.months.map((month, monthIndex) => (
                        <td  key={monthIndex}>
                            <CurrencyTextField
                              style={{ width: 80, marginRight: '1rem' }}
                              label="monto"
                              variant="standard"
                              value={row.montos[monthIndex].monto}
                              currencySymbol="$"
                              //minimumValue="0"
                              outputFormat="string"
                              decimalCharacter="."
                              digitGroupSeparator=","
                              autoFocus
                              //className=classes.textField
                              //readonly
                              //disabled
                              //placeholder="Currency"
                              //preDefined={predefinedOptions.percentageEU2dec}
                              // onChange={(event, value)=> setValue(value)}
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
                        //minimumValue="0"
                        outputFormat="string"
                        decimalCharacter="."
                        digitGroupSeparator=","
                        autoFocus
                        //className=classes.textField
                        //readonly
                        disabled
                        style={{ width: 80, marginRight: '1rem' }}
                      />          
                     
                    </td>
                      <td>
                      <TrashIcon onClick={() => handleDeleteRow(table.id, row.id)} style={{ cursor: 'pointer', color: 'red' }} />
                      
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Button  className = "btn btn-light-primary mr-4 my-2" onClick={() => handleAddRow(table.id)}>Agregar Fila</Button>
              <Button  className = "btn btn-light-danger " onClick={() => handleDeleteTable(table.id)}>Eliminar tabla </Button>
            </div>
          ))}
          </div>

        </div>
    <div className="col-md-12">
        {tables.length > 0 && (
          <div>
            <Button className = "btn btn-light-primary mr-4 my-2" onClick={handleSendTables}>Enviar Tablas</Button>
          </div>
        )}
      </div>
    </div>

  );
}

export default App;
