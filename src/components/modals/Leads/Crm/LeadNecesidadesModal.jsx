import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'
import { URL_DEV } from '../../../../constants'
import { apiGet, apiPutForm, apiPostForm } from '../../../../functions/api'
import Button from '@material-ui/core/Button';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import { errorAlert, waitAlert, printResponseErrorAlert, deleteAlert, doneAlert} from '../../../../functions/alert'


function LeadNecesidadesModal(props) {
  const {lead ,handleClose} = props

  const [data, setData] = useState([]); // Almacena los datos de la API
  const [categorias, setCategorias] = useState([]); // Almacena las categorías
  const [tabla, setTabla] = useState([]); // Almacena los datos de la tabla
  const [filasEliminadasPorCategoria, setFilasEliminadasPorCategoria] = useState({});
  const [filaSeleccionada, setFilaSeleccionada] = useState({});
  const [open, setOpen] = React.useState('');
  const [totalM2Global, setTotalM2Global] = useState(0);
  const [totalesGlobal, setTotalesGlobal] = useState(0);
  const [totalesFlujo, setTotalesFlujo] = useState(0);
  const [totalesEstructura, setTotalesEstructura] = useState(0);
  const [totalesEstacionamiento, setTotalesEstacionamiento] = useState(0);
  const [flujoSum, setFlujoSum] = useState(0); // New state for sum of the "Flujo" column

  const [openModal, setOpenModal] = useState(false);
  const [nuevoEstacionamiento, setNuevoEstacionamiento] = useState('');

  const [subareaTotals, setSubareaTotals] = useState({});
  const [loading, setLoading] = useState(true);

  const userAuth = useSelector((state) => state.authUser);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleEstacionamientoChange = (e) => {
    const nuevoEstacionamientoValue = e.target.value;
    setNuevoEstacionamiento(nuevoEstacionamientoValue);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        // First, attempt to fetch data from the first API
        const responseFirstAPI =  await apiGet(`necesidades/ver/${lead.id}`, userAuth.access_token);
        const dataFirstAPI = responseFirstAPI.data? responseFirstAPI.data.data : '';
        console.log(dataFirstAPI)
        // Check if there are any results from the first API
        if (dataFirstAPI[0]) {
                  // setLoading(false); // Set loading to false after data is fetched

          // console.log(dataFirstAPI[0].veradjuntos[0].url)
          if (dataFirstAPI[0] && dataFirstAPI[0].veradjuntos[0].url) {
            console.log('PDF URL:', dataFirstAPI[0].veradjuntos[0].url);
            setPdfUrl(dataFirstAPI[0].veradjuntos[0].url);
          }
          setLoading(false);
  
          
        } else {
          // If there are no results from the first API, fetch data from the second API
          const responseSecondAPI =  await apiGet(`crm/necesidades`,  userAuth.access_token);
          const dataSecondAPI = responseSecondAPI.data.necesidades
          setData(responseSecondAPI);

          // Extract categories from the data
          const categoriasUnicas = [...new Set(dataSecondAPI.map((item) => item.area))];
          setCategorias(categoriasUnicas);

          // Initialize the table by category
          const tablaInicial = {};
                categoriasUnicas.forEach((categoria) => {
                  tablaInicial[categoria] = dataSecondAPI.filter((item) => item.area === categoria).map((fila) => ({
                    subArea: fila.subarea || '',
                    areaMinima: fila.areamin || '',
                    medidaRecomendada: fila.medidareco || '',
                    norma: fila.norma || '',
                    cantidad: '',
                    totalM2: '',
                    parametricoXM2: fila.parametrico || '',
                    totales: '',
                  }));
                });
                setTabla(tablaInicial);
                setLoading(false);
        }

        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchData();
  }, []); // Empty dependency array to run only once during component mount





  useEffect(() => { 
    // Calculate totalM2Global by summing the totalM2 values from the tabla
    const newTotalM2Global = Object.keys(tabla).reduce((total, categoria) => {
      return (
        total +
        tabla[categoria].reduce((sumaLocal, fila) => sumaLocal + (parseFloat(fila.totalM2) || 0), 0)
      );
    }, 0);
    setTotalM2Global(newTotalM2Global);
  }, [tabla]);


  const agregarFila = (categoria) => {
    setTabla((prevTabla) => {
      const nuevaFila = {
        subArea: '',
        areaMinima: '',
        medidaRecomendada: '',
        norma: '',
        cantidad: '',
        totalM2: '',
        parametricoXM2: '',
        totales: '',
      };
      const tablaCategoria = [...prevTabla[categoria], nuevaFila];
      return {
        ...prevTabla,
        [categoria]: tablaCategoria,
      };
    });
  };

 // Función para eliminar una fila de la tabla

 const eliminarFila = (categoria, filaIndex) => {
  const filaEliminada = tabla[categoria][filaIndex];

  // Calcula los totales antes de eliminar la fila
  const totalM2Antes = parseFloat(filaEliminada.totalM2) || 0;
  const totalesAntes = parseFloat(filaEliminada.totales) || 0;
  const flujoValue = parseFloat(filaEliminada.total) || 0;

    // Calculate new totalM2Global and totalesGlobal values before removing the row
    const nuevaSumaTotalM2Global = totalM2Global - totalM2Antes;
    const nuevaSumaTotalesGlobal = totalesGlobal - totalesAntes;
  
    const totalflujo = nuevaSumaTotalM2Global * 0.15 * 12500 ;
    const totalEstructura = nuevaSumaTotalM2Global *0.05  * 12500;
  
    setTimeout(() => {
      setTotalM2Global(nuevaSumaTotalM2Global);
      // setTotalesGlobal(nuevaSumaTotalesGlobal);
    }, 0);

  setFilasEliminadasPorCategoria((prevFilasEliminadas) => ({
    ...prevFilasEliminadas,
    [categoria]: prevFilasEliminadas[categoria]
      ? [...prevFilasEliminadas[categoria], filaEliminada]
      : [filaEliminada],
  }));

  setTabla((prevTabla) => {
    const tablaCategoria = [...prevTabla[categoria]];
    tablaCategoria.splice(filaIndex, 1);
    filaEliminada.cantidad = 0;
    filaEliminada.totalM2 = 0;
    filaEliminada.totales = 0;

    // Iterate over all categories and rows to recalculate totals
    const categoriasActuales = Object.keys(prevTabla);
    const nuevaSumaTotalM2Global = categoriasActuales.reduce((sumaGlobal, categoriaActual) => {
      const filasCategoriaActual = prevTabla[categoriaActual];
      return (
        sumaGlobal +
        filasCategoriaActual.reduce((sumaLocal, fila) => sumaLocal + (parseFloat(fila.totalM2) || 0), 0)
      );
    }, 0);      

     const nuevaSumaTotalesGlobal = categoriasActuales.reduce((sumaGlobal, categoriaActual) => {
      const filasCategoriaActual = prevTabla[categoriaActual];
      return (
        sumaGlobal +
        filasCategoriaActual.reduce((sumaLocal, fila) => sumaLocal + (parseFloat(fila.totales) || 0), 0)
      );
    }, 0)
      // Update categoriasActuales and the total sum
      setTotalesGlobal(nuevaSumaTotalesGlobal + totalflujo + totalEstructura);



    return {
      ...prevTabla,
      [categoria]: tablaCategoria,
    };
  });

 
  // Actualiza solo la fila seleccionada en la categoría actual a -1
  setFilaSeleccionada({
    ...filaSeleccionada,
    [categoria]: -1,
  });
};

const restaurarFila = (categoria) => {
  const filaIndex = parseInt(filaSeleccionada[categoria], 10);
  const filaRestaurar = filasEliminadasPorCategoria[categoria][filaIndex];

  // Establece los valores de cantidad y total en 0
  filaRestaurar.cantidad = 0;
  filaRestaurar.totalM2 = 0;
  filaRestaurar.totales = 0;

  setTabla((prevTabla) => {
    const tablaCategoria = [...prevTabla[categoria], filaRestaurar];
    return {
      ...prevTabla,
      [categoria]: tablaCategoria,
    };
  });

  setFilasEliminadasPorCategoria((prevFilasEliminadas) => {
    const filasRestauradas = [...prevFilasEliminadas[categoria]];
    filasRestauradas.splice(filaIndex, 1);
    return {
      ...prevFilasEliminadas,
      [categoria]: filasRestauradas,
    };
  });

  setFilaSeleccionada({
    ...filaSeleccionada,
    [categoria]: '',
  });
};

const calcularValores = (categoria, filaIndex) => {
  setTabla((prevTabla) => {
    const fila = prevTabla[categoria][filaIndex];
    const cantidad = parseFloat(fila.cantidad) || 0;
    const medidaRecomendada = parseFloat(fila.medidaRecomendada) || 0;
    const parametricoXM2 = parseFloat(fila.parametricoXM2) || 0;
    const totalM2 = (cantidad * medidaRecomendada).toFixed(0);
    const totales = (totalM2 * parametricoXM2).toFixed(0);
    const total = (cantidad * totalM2 * parametricoXM2).toFixed(0);

   
    // Actualiza los valores en la tabla local
    const tablaCategoria = [...prevTabla[categoria]];
    tablaCategoria[filaIndex] = {
      ...fila,
      totalM2,
      totales,
      total,
    };

    // Calcula la suma local para la categoría actual
    const nuevaSumaTotalM2Local = tablaCategoria.reduce((suma, fila) => suma + (parseFloat(fila.totalM2) || 0), 0);
    const nuevaSumaTotalesLocal = tablaCategoria.reduce((suma, fila) => suma + (parseFloat(fila.totales) || 0), 0);

    // Actualiza los totales globales considerando todas las categorías
    const categoriasActuales = Object.keys(prevTabla);
    const nuevaSumaTotalM2Global = categoriasActuales.reduce((sumaGlobal, categoriaActual) => {
      const filasCategoriaActual = prevTabla[categoriaActual];
      return (
        sumaGlobal +
        filasCategoriaActual.reduce((sumaLocal, fila) => sumaLocal + (parseFloat(fila.totalM2) || 0), 0)
      );
    }, 0);
    if (filaIndex !== -1) {

        if (filaIndex !== -1) {
          const nuevaSumaTotalesGlobal = categoriasActuales.reduce((sumaGlobal, categoriaActual) => {
            const filasCategoriaActual = prevTabla[categoriaActual];
            return (
              sumaGlobal +
              filasCategoriaActual.reduce((sumaLocal, fila) => sumaLocal + (parseFloat(fila.totales) || 0), 0)
            );
          }, 0)+
          (totalM2Global * 0.15 )* 12500 + // Add Flujo
          (totalM2Global * 0.05 )* 12500; 

          // Update the totals state
          setTotalesGlobal(nuevaSumaTotalesGlobal);
        }

      if (filaIndex === 0) {
        const flujoSumForCategory = prevTabla[categoria].reduce(
          (sum, row) => sum + (parseFloat(row.total) || 0),
          0
        );
        setFlujoSum(flujoSumForCategory);
      }    
      

      
       // Calculate the subarea total for the current category
      const subareaTotal = tablaCategoria.reduce((total, fila) => {
        if (fila.subArea === fila.subArea) {
          return total + parseFloat(fila.totalM2) || 0;
        }
        return total;
      }, 0);

        // Update the subareaTotals state for the current category
        setSubareaTotals((prevSubareaTotals) => ({
          ...prevSubareaTotals,
          [categoria]: subareaTotal,
        }));

    

      // Actualiza los estados locales y globales
      setTotalM2Global(nuevaSumaTotalM2Global);
      // setTotalesGlobal(nuevaSumaTotalesGlobal);
    }
    return {
      ...prevTabla,
      [categoria]: tablaCategoria,
    };
  });
};

const handleCloses = () => {
  setOpen(false);
};

const handleOpen = (categoria) => {
  setOpen(categoria);
};

const enviarFormulario = () => {
  // Filter out rows without quantities or square meters
  const rowsWithQuantitiesAndM2 = Object.keys(tabla).reduce((acc, categoria) => {
    const rowsWithQM2 = tabla[categoria].filter(
      (fila) =>
        parseFloat(fila.cantidad) > 0 &&
        parseFloat(fila.totalM2) > 0 &&
        subareaTotals[categoria] > 0
    );
    return rowsWithQM2.length > 0 ? { ...acc, [categoria]: rowsWithQM2 } : acc;
  }, {});

  // Create a new object to send to the API with filtered rows
  // const dataToSend = { ...data, tabla: rowsWithQuantitiesAndM2 };

  // Calculate and include values for Flujo, Estructura, Total m2, and SubTotal

  const flujoValue = totalM2Global * 0.15;
  const estructuraValue = totalM2Global * 0.05;
  const totalM2Value = totalM2Global + flujoValue + estructuraValue;
  const subTotalValue = totalesGlobal;

  const formData = {
    flujoValue: flujoValue.toFixed(0),
    estructuraValue: estructuraValue.toFixed(0),
    totalM2Value:totalM2Value.toFixed(0),
    subTotalValue: totalesGlobal.toFixed(0), 
    data: rowsWithQuantitiesAndM2,  
    lead: lead,   
  };
  console.log(lead)

  console.log(formData)

  // Send the filtered data to the API
  apiPostForm('necesidades', formData, userAuth.access_token)
    .then((response) => {
      console.log('Data successfully sent to the API:', response);
      handleClose()
      doneAlert('Agregado con éxito')

      // You may want to perform additional actions after sending the data
    })
    .catch((error) => {
      console.error('Error sending data to the API:', error);
      // Handle the error as needed
    });
};

const enviarCotizacionCliente = async () => {
  // Mostrar un cuadro de diálogo de confirmación
  const confirmacion = await Swal.fire({
    title: 'Confirmar Envío',
    text: '¿Estás seguro de que deseas enviar el programa de necesidades al cliente?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, enviar',
    cancelButtonText: 'Cancelar',
  });

  // Verificar si el usuario confirmó la acción
  if (confirmacion.isConfirmed) {
    try {
      console.log(lead)

      // Realizar la solicitud a tu API para enviar la cotización al cliente
      // const responseFirstAPI =  await apiGet(`necesidades/vsendEmailer/${lead.id}`, userAuth.access_token);

      //  apiGet(`necesidades/sendEmail/${lead.id}`, userAuth.access_token)
       apiPostForm('necesidades/sendEmail', lead, userAuth.access_token)
        .then((response) => {
          console.log('Data successfully sent to the API:', response);
          handleClose()
          doneAlert('Agregado con éxito')
          Swal.fire('Cotización Enviada', 'La cotización ha sido enviada al correo del cliente.', 'success');

        // You may want to perform additional actions after sending the data
      })
      .catch((error) => {
        console.error('Error sending data to the API:', error);
        // Handle the error as needed
      });
    } catch (error) {
      // Manejar errores en caso de que la solicitud falle
      console.error('Error al enviar la cotización:', error);

      // Proporcionar retroalimentación al usuario sobre el error
      Swal.fire('Error', 'Hubo un problema al enviar la cotización.', 'error');
    }
  } else {
    // El usuario ha cancelado la acción
    Swal.fire('Envío Cancelado', 'No se ha enviado el programa de necesidades.', 'info');
  }
};

// console.log(filasEliminadas)
// console.log(subareaTotals)
  return (
    
    <div className="table-responsive rounded">
       {loading ? (
        <p>Loading...</p>
      ) : (
        <>
         {pdfUrl ? ( 
          <div>            
            {/* <h1>Programa de necesidades</h1> */}
            {pdfUrl ? (
                <div>
                  <Button className="btn btn-light-primary mr-4 my-2" onClick={enviarCotizacionCliente}>
                      Enviar al Cliente
                    </Button>   
                  <iframe src={pdfUrl} width="100%" height="500px" title="PDF Viewer" />
                </div>

              ) : (
                <>
                  <h1>En esta cotización se debe incluir </h1>
                             
                  </>
              )}
          </div>

         ) : (
          <>
      <tr>
            <th colSpan={12}>Totales</th>          
             <TextField  label="Flujo"  variant="standard" value={(totalM2Global * 0.15).toFixed(0)}  // Muestra la suma de "totales"
              currencySymbol="$" outputFormat="string" decimalCharacter="."  digitGroupSeparator="," autoFocus readonly disabled
              style={{ width: 120, marginRight: '1rem' }}
            />
            <TextField label="Estructura" variant="standard" value={(totalM2Global * 0.05).toFixed(0)} // Muestra la suma de "totales" 
            currencySymbol="$" outputFormat="string" decimalCharacter="." digitGroupSeparator="," autoFocus readonly disabled  style={{ width: 120, marginRight: '1rem' }}
            />
             {/* <CurrencyTextField  label="Estacionamiento"  variant="standard"   value={totalesEstacionamiento.toFixed(2)} // Muestra la suma de "totales"
              currencySymbol="$" outputFormat="string"  decimalCharacter="." digitGroupSeparator="," autoFocus readonly  style={{ width: 100, marginRight: '1rem' }}
              onChange={handleEstacionamientoChange}

            /> */}

            <TextField label="Total m2" variant="standard"   value={(totalM2Global + (totalM2Global * 0.15) + (totalM2Global * 0.05)).toFixed(0)} // Muestra la suma de "total de m2"
              currencySymbol="M2" outputFormat="string" decimalCharacter="." digitGroupSeparator=","autoFocus readonly disabled style={{ width: 120, marginRight: '1rem' }}
            />
            <TextField label="SubTotal" variant="standard" value={totalesGlobal.toFixed(0)} // Muestra la suma de "totales"
             outputFormat="string"  decimalCharacter="." digitGroupSeparator="," autoFocus readonly disabled style={{ width: 120, marginRight: '1rem' }}
            />
            
          </tr>

          <Dialog open={openModal} onClose={handleCloseModal}>
            {/* Modal content */}
            <div>
              <h1>En esta cotización se debe incluir </h1>
              <br />
              {/* <p>New Value: {nuevoEstacionamiento}</p> */}
              <p class= "text-center"> <strong>  Estacionamiento, central de mezclas y bunker </strong></p>
            </div>
          </Dialog>
          
      <table className="table table-borderless table-vertical-center rounded table-hover">
        
        <thead>                
          <tr>
            <th>Sub Área</th>
            {/* <th>Área Min</th> */}
            <th>Área Recomendada</th>
            {/* <th>Norma</th> */}
            <th>Cantidad</th>
            <th>Total m2</th>
            {/* <th>Paramétrico x m2</th> */}
            {/* <th>Total</th> Encabezado para la columna de totales */}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
        {categorias.length > 0 && categorias.map((categoria, categoriaIndex) => (
            <>
              <tr>
                <th style={{  backgroundColor: '#cdce94',textAlign: 'center' }} colSpan={7}>{categoria}</th>
              </tr>
              
              {tabla && tabla[categoria] && tabla[categoria].map((fila, filaIndex) => (
                <tr key={filaIndex}>
                  <td >{fila.subArea}</td>
                  {/* <td>
                   <TextField label="areaminima"  variant="standard" value={fila.areaMinima} outputFormat="string"
                      decimalCharacter="."  digitGroupSeparator="," autoFocus readonly disabled   style={{ width: 80, marginRight: '1rem' }}
                    />    
                  </td> */}
                  <td>
                    <TextField label="medina recomendada"  variant="standard" value={fila.medidaRecomendada}   outputFormat="string"
                      decimalCharacter="."  digitGroupSeparator="," autoFocus readonly disabled   style={{  marginRight: '1rem' }}
                    /> 
                    </td>
                  {/* <td colSpan={1}>{fila.norma}</td> */}
                  <td>
                  <TextField label="Cantidad" variant="standard" value={fila.cantidad} currencySymbol="" outputFormat="string" decimalCharacter="." digitGroupSeparator="," autoFocus readonly
                         onChange={(e) => {
                            const nuevaCantidad = e.target.value;
                            setTabla((prevTabla) => {
                              const tablaCategoria = [...prevTabla[categoria]];
                              tablaCategoria[filaIndex] = {
                                ...fila,
                                cantidad: nuevaCantidad,
                              };
                              return {
                                ...prevTabla,
                                [categoria]: tablaCategoria,
                              };
                            });
                            calcularValores(categoria, filaIndex);
                          }}
                        style={{ width: 80, marginRight: '1rem' }}
                      />    
                   
                  </td>
                  <td>
                    <TextField label="M2"  value={fila.totalM2}  currencySymbol="	m2" outputFormat="string"
                       autoFocus readonly disabled   style={{ width: 80, marginRight: '1rem' }}
                    />    
                  </td>
                  {/* <td>
                  <CurrencyTextField label="total" variant="standard" value={fila.parametricoXM2} currencySymbol="$" outputFormat="string"  decimalCharacter="."
                        digitGroupSeparator=","  autoFocus readonly disabled
                        onChange={(e) => {
                          const nuevoParametrico = e.target.value;
                          setTabla((prevTabla) => {
                            const tablaCategoria = [...prevTabla[categoria]];
                            tablaCategoria[filaIndex] = {
                              ...fila,
                              parametricoXM2: nuevoParametrico,
                            };
                            return {
                              ...prevTabla,
                              [categoria]: tablaCategoria,
                            };
                          });
                          calcularValores(categoria, filaIndex);
                        }}
                        style={{ width: 80, marginRight: '1rem' }}

                      />       
                    
                  </td> */}
                  {/* <td>
                      <CurrencyTextField label="total" variant="standard" value={fila.totales} currencySymbol="$" outputFormat="string" decimalCharacter="." digitGroupSeparator="," autoFocus 
                      readonly disabled  style={{ width: 80, marginRight: '1rem' }}
                      />    
                    </td> */}
                  <td>                   
                     <Button className = "btn btn-light-danger "  onClick={() => eliminarFila(categoria, filaIndex)}>Eliminar Fila</Button>                   
                  </td>
                </tr>
              ))}
               {filasEliminadasPorCategoria[categoria] && (
                  <tr>
                    <td colSpan={1}>
                      <InputLabel id={`select-label-${categoria}`}>Agregar eliminadas</InputLabel>
                        <Select
                          labelId={`select-label-${categoria}`}
                          id={`select-${categoria}`}                          
                          open={  open === categoria ? true : false}
                          onClose={handleCloses}                        
                          onOpen={ ()=>{handleOpen(categoria)} }
                          name={filaSeleccionada[categoria] || ''}
                          value={filaSeleccionada[categoria] || ''}
                          onChange={(e) => setFilaSeleccionada({
                            ...filaSeleccionada,
                            [categoria]: e.target.value,
                          })}
                          placeholder="Nombre de la tabla"
                          style={{ width: 250, paddingRight: '2px' }}
                        >
                         {filasEliminadasPorCategoria[categoria] && filasEliminadasPorCategoria[categoria].map((filaEliminada, index) => (
                            <MenuItem key={index} value={index}>{`${filaEliminada.subArea} - ${filaEliminada.norma}`}</MenuItem>
                          ))}
                          
                      </Select>
                      {filaSeleccionada[categoria] !== '' && (
                        <Button className = "btn btn-light-primary mr-4 my-2" 
                          onClick={() => restaurarFila(categoria)}
                          style={{ marginLeft: '10px' }}
                        >
                          Restaurar
                        </Button>
                      )}
                    </td>
                  </tr>
                  )}

           <tr>
              <td colSpan={3}>Total M2 de {categoria}:</td>
              <td>
                <CurrencyTextField
                  value={subareaTotals[categoria] ? subareaTotals[categoria].toFixed(0) : ''}
                  currencySymbol=" m2"
                  outputFormat="string"
                  decimalCharacter="."
                  digitGroupSeparator=","
                  autoFocus
                  readonly
                  disabled
                  style={{ width: 80, marginRight: '1rem' }}
                />
              </td>
              {/* Add more columns for other data if needed */}
            </tr>
             </>
          ))}
        </tbody>
      </table>
      <Button className = "btn btn-light-primary mr-4 my-2" onClick={enviarFormulario}>Enviar Formulario</Button>
      </>
      )}
       </>

      )}

    </div>



    
  );
}

export default LeadNecesidadesModal;
