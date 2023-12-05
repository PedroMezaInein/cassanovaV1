import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { URL_DEV } from '../../../../constants';
import axios from 'axios';
import { ContactSupportOutlined } from '@material-ui/icons';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';
import { setSingleHeader, } from '../../../../functions/routers'
import { errorAlert, printResponseErrorAlert, waitAlert, doneAlert } from '../../../../functions/alert'
import Swal from 'sweetalert2'



function TablaMeses(props) {
  const { reload, handleClose } = props

  const [empleadosPorDepartamento, setEmpleadosPorDepartamento] = useState({});
  const [meses, setMeses] = useState([]);
  const [departamento, setDepartamento] = useState(''); // Inicialmente vacío
  const [empleadosAcumulados, setEmpleadosAcumulados] = useState([]); // Estado para los datos acumulados
  const [departmentTotals, setDepartmentTotals] = useState({});
  const [employeeTotals, setEmployeeTotals] = useState({});
  const [totalGlobal, setTotalGlobal] = useState(0);
  const [totalsByMonth, setTotalsByMonth] = useState({});
  const [departamentosData, setDepartamentosData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [totalesPorMes, setTotalesPorMes] = useState({});
  const [departamentosAgregados, setDepartamentosAgregados] = useState([]);
  const usuario = useSelector(state => state.authUser.departamento.departamentos[0])
  const [selectedYear, setSelectedYear] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const availableYears = ['2023', '2024', '2025','2026','2027','2028' /* Add more years here */];

  // Utiliza useSelector para obtener los departamentos del estado de Redux.
  const departamentos = useSelector((state) => state.opciones.areas);
  const auth = useSelector((state) => state.authUser.access_token);

  
  useEffect(() => {
    cargarNombresMeses();
  }, []);
  
  const cargarNombresMeses = () => {
    const nombresMeses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    setMeses(nombresMeses);
  };

  const cargarDatosDesdeAPI = (departamentoSeleccionado) => {
    if (empleadosPorDepartamento[departamentoSeleccionado]) {
      // Los datos de este departamento ya se han cargado, no es necesario hacer nada
      return;
    }

    // Realiza una solicitud a tu API para obtener los datos de empleados para el departamento seleccionado.
    axios.get(`${URL_DEV}presupuestosdep/prestaciones?departamento=${departamentoSeleccionado}`, {
      headers: { Authorization: `Bearer ${auth}` }
    })
      .then((response) => {
          const empleados = response.data.empleados;
          const updatedDepartamentosData = [
            ...departamentosData,
            { id: departamentoSeleccionado, datos: empleados }
          ];

          const updatedEmpleadosPorDepartamento = {
            ...empleadosPorDepartamento,
            [departamentoSeleccionado]: true
          };

          setEmpleadosPorDepartamento(updatedEmpleadosPorDepartamento);
          setDepartamento(departamentoSeleccionado);
          setDepartamentosData(updatedDepartamentosData);
          calcularTotales(updatedDepartamentosData);

     
      })
      .catch((error) => {
        console.error('Error al cargar datos desde la API: ', error);
      });
  };


  const calcularTotales = (data) => {
    let updatedTotalesPorMes = {}; // Initialize an empty object for the monthly totals
    let updatedTotalGlobal = 0;
  
    if (data.length > 0) {
      data.forEach((departamentoInfo) => {
        Object.keys(departamentoInfo.datos).forEach((array) => {
          departamentoInfo.datos[array].forEach((empleado) => {
            Object.values(empleado.prestaciones).forEach((prestaciones) => {
              meses.forEach((mes) => {
                const pagoPorEmpleado = prestaciones.pago_por_empleado;
                updatedTotalesPorMes[mes] = (updatedTotalesPorMes[mes] || 0) + pagoPorEmpleado;
                updatedTotalGlobal += pagoPorEmpleado;
              });
            });
          });
        });
      });
     
    }

     // Check if there are no departments in the data
     if (data.length == 0) {
      meses.forEach((mes) => {
        updatedTotalesPorMes[mes] = 0; // Set monthly totals to 0
      });
      updatedTotalGlobal = 0; // Set the global total to 0
    }
    setTotalesPorMes(updatedTotalesPorMes);
    setTotalGlobal(updatedTotalGlobal);

  }; 



   // Define a function to calculate the start and end dates based on the selected year
   const calculateDates = (year) => {
      const start = new Date(year, 0, 1); // January 1st of the selected year
      const end = new Date(year, 11, 31); // December 31st of the selected year
      return { start, end };
    };

     // Handle the change in the selected budget year
    const handleYearChange = (event) => {
      const year = event.target.value;
      setSelectedYear(year);
      const { start, end } = calculateDates(year);
      setStartDate(start.toISOString()); // Convert to ISO date format if needed
      setEndDate(end.toISOString());
    };


  const enviarFormulario = () => {
    // Create an object to store the form data, including the tableData and totalGlobal.
    const tableData = [];
    if (!selectedYear) {
      errorAlert('Por favor, selecciona un año del presupuesto.')
      // doneAlert('Por favor, selecciona un año del presupuesto.')
      return;
    }
    if (departamentosData.length === 0) {
      // Display an error message or perform any desired action
      errorAlert('Debes seleccionar al menos un departamento.');
      return;
    }

  let totalEmployees = 0; // Initialize the total employee count


  // Iterate over the data in your table and add it to the tableData array.
  Object.values(departamentosData).forEach((departamentoInfo) => {
    Object.values(departamentoInfo.datos).forEach((array) => {
      array.forEach((empleado) => {
        Object.values(empleado.prestaciones).forEach((prestaciones) => {
          const rowData = {
            departamento: empleado.departamentos[0].nombre || 'N/A',
            departamento_id: empleado.departamentos[0].id || 'N/A',
            id_empleado: empleado.id ? empleado.id : '',
            nombre: `${empleado.nombre} ${empleado.apellido_paterno} ${empleado.apellido_materno}`,
            puesto: empleado.puestos ? empleado.puestos.nombre_puesto : '',
            prestacion: prestaciones.nombre ? prestaciones.nombre : '',
            prestacion_costo: prestaciones.pago_por_empleado ? prestaciones.pago_por_empleado : '',
            totalMeces: prestaciones.pago_por_empleado ? (prestaciones.pago_por_empleado * 12).toFixed(2) : '',
          };

          // Add the monthly data to the rowData object.
          meses.forEach((mes) => {
            rowData[mes] = empleado[mes];
          });

          // Add the rowData object to the tableData array.
          tableData.push(rowData);
          totalEmployees += 1; // Increment the total employee count

        });
      });
    });
  });

   // Create an object to store the complete form data.
      const formData = {
        tableData: tableData,
        totalGlobal: totalGlobal.toFixed(2),
        totalEmployees: totalEmployees, // Include the total employee count
        departamento:usuario.id,
        tipo:'prestaciones',
        year: selectedYear, // Include the selected budget year
        fecha_inicio: startDate,
        fecha_fin: endDate,
        modal: 'Presupuesto Prestaciones',

      };

    // Now, you have all the table data in the tableData array.
    // You can send this data to your server using an HTTP request.
     axios.post(URL_DEV + 'presupuestosdep/create', formData, { headers: setSingleHeader(auth) })
      .then((response) => {
        console.log(response)
        console.log('Formulario enviado con éxito');

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
        // doneAlert('Presupuesto generado con éxito')
        // handleClose()

        // You can perform any other actions after sending the data here.
      })
      .catch((error) => {
        console.error('Error al enviar el formulario: ', error);
      });
  };
  

  const handleCloses = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleRemoveDepartamento = (departamentoId) => {
    const updatedDepartamentosAgregados = departamentosAgregados.filter((depId) => depId !== departamentoId);
    setDepartamentosAgregados(updatedDepartamentosAgregados);
  
    // Elimina los datos de empleados por departamento
    const updatedEmpleadosPorDepartamento = { ...empleadosPorDepartamento };
    delete updatedEmpleadosPorDepartamento[departamentoId];
    setEmpleadosPorDepartamento(updatedEmpleadosPorDepartamento);
  
    // Elimina los datos del departamento de departamentosData
    const updatedDepartamentosData = departamentosData.filter((data) => data.id !== departamentoId);
    setDepartamentosData(updatedDepartamentosData);
  
    // After removing the department data, recalculate the totals
    // recalculateTotals(updatedDepartamentosData);
    calcularTotales(updatedDepartamentosData);

    
  };
  



  return (
    <div  className="form-group form-group-marginless row mx-0">
      <div className="col-md-4"> 
      <InputLabel id="demo-controlled-open-select-label">Departamento</InputLabel>
            <Select labelId="demo-controlled-open-select-label"   open={open}  onClose={handleCloses}  onOpen={handleOpen}
              name="departamento" value={departamento}   onChange={(e) => cargarDatosDesdeAPI(e.target.value)} placeholder="Departamento"
              style={{ width: 230, paddingRight: '2px' }}
            >
              {
                departamentos.map((dep, ) => (
                <MenuItem  key={dep.id_area} value={dep.id_area} >{dep.nombreArea}</MenuItem>
              ))}
              
          </Select>
      </div>

      <div className="col-md-4"> 
      <InputLabel htmlFor="budgetYear" id="demo-controlled-open-select-label">Año del Presupuesto:</InputLabel>

            <Select
              id="budgetYear"
              name="budgetYear"
              value={selectedYear}
              onChange={handleYearChange}
              >
              <option value="">Selecciona un año</option>
              {availableYears.map((year) => (
                 <MenuItem  key={year} value={year} 
                 >{year}</MenuItem>
              ))}
            </Select>
       
      </div>
   
      <div className="col-md-4">
                <h2>Total Global: {totalGlobal.toLocaleString('es-MX', {style: 'currency', currency: 'MXN',minimumFractionDigits: 2,maximumFractionDigits: 2,})}</h2>        
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
                    { totalesPorMes[mes] ? totalesPorMes[mes].toLocaleString('es-MX', {style: 'currency', currency: 'MXN',minimumFractionDigits: 2,maximumFractionDigits: 2,}): 0}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
            
               {Object.values(departamentosData).map((departamentoInfo) => (
                  <React.Fragment key={departamentoInfo.id}>
                    {Object.values(departamentoInfo.datos).map((array) => (
                        Object.values(array).map((empleado) => (
                            Object.values(empleado.prestaciones).map((prestaciones) => (
                                <tr key={empleado}>
                                    <td>  
                                    {empleado.departamentos ? empleado.departamentos[0].nombre : 'N/A' } 
                                    </td>
                                    <td>{empleado.nombre} {empleado.apellido_paterno} {empleado.apellido_materno}</td>
                                    <td>{empleado.puestos ? empleado.puestos.nombre_puesto : ''}</td>
                                    <td>{prestaciones.nombre ? prestaciones.nombre : ''}</td>

                                    {meses.map((mes, index) => (
                                    <td key={index}>{empleado[mes]} { (prestaciones.pago_por_empleado).toLocaleString('es-MX', {style: 'currency', currency: 'MXN',minimumFractionDigits: 2,maximumFractionDigits: 2,}) }</td>
                                    ))}
                                </tr>  
                            ))                      
                          ))                  
                      ))}
                    <tr>
                      <td></td>
                      <td></td>
                      <td> <Button  className = "btn mr-4 my-2" color="secondary" startIcon={<DeleteIcon />} onClick={() => handleRemoveDepartamento(departamentoInfo.id)}>Eliminar</Button></td>
                      <td> 
                         {departamentos && departamentos.map((item) => (
                          item.id_area ==  departamentoInfo.id  ?
                            <strong> <p key={item.id_area}> Subtotales {item.nombreArea} </p> </strong>
                            :
                            ''
                        ))}
                      </td>
                      {meses.map((mes, index) => (
                        
                        <td key={index}>
                        <strong>
                            {
                              Object.values(departamentoInfo.datos).map((array) => (
                                // Object.values(array).map((data) => (
                                  Object.values(array).map((empleado) => (
                                      empleado.prestaciones.reduce((total, prestaciones) => total + prestaciones.pago_por_empleado, 0) 
                                ))  .reduce((acumulador, totalEmpleado) => acumulador + totalEmpleado, 0)
                                .toLocaleString('es-MX', {style: 'currency', currency: 'MXN',minimumFractionDigits: 2,maximumFractionDigits: 2,})
                              ))                  
                            // ))
                            }
                        </strong>
                        </td>
                      ))}
                      
                    </tr>
                  </React.Fragment>
                ))}
            </tbody>
          </table>
              <Button  className = "btn  mr-4 my-2"  startIcon={<SaveIcon />} color="primary"  onClick={enviarFormulario} >Guardar</Button>
            <div>
        </div>
          </div> 
      </div>
    </div>
  );
}

export default TablaMeses;
