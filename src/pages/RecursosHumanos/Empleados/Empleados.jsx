import React, {useState, useEffect, useCallback} from 'react'
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import Layout from '../../../components/layout/layout';
import { MaterialReactTable } from 'material-react-table';
import { Box } from '@mui/material';
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import Tooltip from '@mui/material/Tooltip';
import ContentCopy from '@mui/icons-material/ContentCopy';
import { FormularioContrato, LicenciasEquiposForm, HistorialVacaciones, PrestacionesRHList } from "../../../components/forms"
import moment from 'moment';
import { setFormHeader, setSingleHeader } from '../../../functions/routers'
import { Modal, ModalDelete } from '../../../components/singles';
import TextField from '@mui/material/TextField';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import Grid from '@mui/material/Grid';
import { apiPostForm, apiGet, apiPutForm } from '../../../functions/api';
import { es } from 'date-fns/locale'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { waitAlert, errorAlert, printResponseErrorAlert, deleteAlert,sendFileAlert } from '../../../functions/alert'; // importa tus helpers
import { setOptions} from '../../../functions/setters'
import { URL_DEV } from '../../../constants'
import axios from 'axios'
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem, 
  Button,
} from '@mui/material';
import { Typography } from '@material-ui/core';
import EmpleadosAgregar from './EmpleadosAgregar'; // ajusta la ruta si está en otro nivel
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFile from '@mui/icons-material/AttachFile';
import IconButton from '@mui/material/IconButton';
import ComponenteAdjuntos  from './ComponenteAdjuntos'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';



const Empleados = () => {
  const history = useHistory();
  const location = useLocation();
  const authUser = useSelector(state => state.authUser);
  const auth = authUser?.access_token;

  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 50 });
  const [totalRows, setTotalRows] = useState(0);
  const [empleados, setEmpleados] = useState([]);
  const [data, setData] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');


  const [modals, setModals] = useState({
        crearColaborador: { show: false, data: null },
        editarColaborador: { show: false, data: null },
        vacacionesColaborador: { show: false, data: null },
        exportar: { show: false },
        adjuntos: { show: false, data: null },   
        contratoColaborador: { show: false, data: null }, // ← nuevo
        licenciasEquipos: { show: false, data: null }, // ✅ NUEVO
        prestacionesColaborador: { show: false, data: null }, // ✅ NUEVO
        deleteColaborador: { show: false, data: null }, // ✅ NUEVO

    });

    const [formContrato, setFormContrato] = useState({
      fechaInicio: new Date(),
      fechaFin: new Date(),
      periodo: '',
      dias: '',
      periodo_pago: '',
      ubicacion_obra: '',
      pagos_hr_extra: '',
      total_obra: '',
      dias_laborables: '',
      genero: '',
      tipos: [],
      direccion_contrato: '',
      adjuntos: {
        contrato: {
          value: '',
          placeholder: 'Contrato',
          files: []
        },
        carta: {
          value: '',
          placeholder: 'Carta',
          files: []
        }
      }
    });


const [tiposAdjuntos, setTiposAdjuntos] = useState([]);

useEffect(() => {
  const fetchTipos = async () => {
    try {
      const res = await apiGet('v2/rh/empleados/tipos-adjuntos', auth);
      setTiposAdjuntos(res.data.data || []);
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los tipos de adjuntos.', 'error');
    }
  };

  fetchTipos();
}, []);


  const StyledBreadcrumb = styled(Chip)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800],
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': { backgroundColor: emphasize(theme.palette.grey[100], 0.06) },
    '&:active': { boxShadow: theme.shadows[1], backgroundColor: emphasize(theme.palette.grey[100], 0.12) },
  }));

  const [anchorElMenuAcciones, setAnchorElMenuAcciones] = useState(null);
  const [empleadoMenu, setEmpleadoMenu] = useState(null);

  const abrirMenuAcciones = (event, empleado) => {
    setAnchorElMenuAcciones(event.currentTarget);
    setEmpleadoMenu(empleado);
  };

  const cerrarMenuAcciones = () => {
    setAnchorElMenuAcciones(null);
    setEmpleadoMenu(null);
  };


  const transformarEmpleados = (empleadosData) => {
    const campos = [
      { group: 'Datos Personales', label: 'Nombre', field: 'nombre' },
      { group: 'Datos Personales', label: 'RFC', field: 'rfc' },
      { group: 'Datos Personales', label: 'CURP', field: 'curp' },
      { group: 'Datos Personales', label: 'NSS', field: 'nss' },
      { group: 'Datos Personales', label: 'Fecha nacimiento', field: 'fecha_nacimiento' },
      { group: 'Datos Personales', label: 'Nacionalidad', field: 'nacionalidad' },
      { group: 'Datos Personales', label: 'Estado civil', field: 'estado_civil' },
      { group: 'Datos Personales', label: 'Domicilio', field: 'domicilio' },
      { group: 'Datos Personales', label: 'CEL', field: 'telefono_movil' },
      { group: 'Datos Personales', label: 'Correo', field: 'email_personal' },
      { group: 'Datos Personales', label: 'Tel', field: 'telefono_particular' },  
      { group: 'Datos Personales', label: 'Cuenta', field: 'banco_nombre' },
      { group: 'Datos Personales', label: 'Numero', field: 'cuenta' },
      { group: 'Datos Personales', label: 'Clabe', field: 'clabe' },
      { group: 'Datos Personales', label: 'Co. Emerg', field: 'nombre_emergencia' },
      { group: 'Datos Personales', label: 'Tel', field: 'telefono_emergencia' },
      { group: 'Datos Personales', label: 'Co. Emerg 2', field: 'nombre_emergencia2' },
      { group: 'Datos Personales', label: 'Tel 2', field: 'telefono_emergencia2' },
      { group: 'Datos Personales', label: 'Carrera', field: 'estudios_carreras' },
      { group: 'Datos Personales', label: 'No.cedula', field: 'estudios_cedulas' },

      { group: 'Datos Empresa', label: 'Estatus', field: 'estatus_empleado' },
      { group: 'Datos Empresa', label: 'Empresa', field: 'empresa' },
      { group: 'Datos Empresa', label: 'Departamento', field: 'departamento' },
      { group: 'Datos Empresa', label: 'Puesto', field: 'puesto' },
      { group: 'Datos Empresa', label: 'Fecha Alta', field: 'fecha_inicio' },
      { group: 'Datos Empresa', label: 'Matricula', field: 'matricula' },
      { group: 'Datos Empresa', label: 'No. Empleado', field: 'no_empleado' },
      { group: 'Datos Empresa', label: 'Organigrama', field: 'organigrama' },
      { group: 'Datos Empresa', label: 'Jefe directo', field: 'lider' },
      { group: 'Datos Empresa', label: 'Correo insitucional', field: 'email_empresarial' },
      { group: 'Datos Empresa', label: 'Pass correo', field: 'password' },
      { group: 'Datos Empresa', label: 'Pass equipo', field: 'password2' },
      { group: 'Datos Empresa', label: 'Fecha baja imss', field: 'fecha_baja_imss' },
      { group: 'Datos Empresa', label: 'Fechas de Incremento', field: 'incrementos_fechas' },
      { group: 'Datos Empresa', label: 'Montos de Incremento', field: 'incrementos_montos' },
      { group: 'Datos Nomina', label: 'SDIMSS', field: 'salario_diario' },
      { group: 'Datos Nomina', label: 'SCM', field: 'total' },
      { group: 'Datos Nomina', label: 'SCQ', field: 'salario_bruto' },
      { group: 'Datos Nomina', label: 'ISR', field: 'isr' },
      { group: 'Datos Nomina', label: 'Infonavit', field: 'infonavit' },
      { group: 'Datos Nomina', label: 'RCV', field: 'rcv' },
      { group: 'Datos Nomina', label: 'ISN', field: 'isn' },


      // { group: 'Datos Empresa', label: 'Checador', field: 'checador' },

      // { group: 'Datos Empresa', label: 'Tipo', field: 'tipo_empleado' },
      // { group: 'Datos Empresa', label: 'Vacaciones', field: 'vacaciones_disponibles' },
    ];
  
    const formattedData = [];
      let lastGroup = '';

    campos.forEach((campo, idx) => {
      if (campo.group !== lastGroup) {
        formattedData.push({
          field: campo.group,
          isGroup: true,
          values: empleadosData.map(() => ''),
        });

        // Insertamos la fila del semáforo después del grupo "Datos Personales"
        if (campo.group === 'Datos Personales') {
          formattedData.push({
            field: 'Estatus Documental',
            isSemaforo: true,
            values: empleadosData.map(emp => emp),
          });
        }

        lastGroup = campo.group;
      }
      
      
  
      formattedData.push({
        field: campo.label,
        isGroup: false,
        values: empleadosData.map(emp => {
          switch (campo.field) {
            case 'empresa':
              return emp?.empresa?.name ?? 'N/A';
            case 'departamento':
              return emp?.departamentos?.[0]?.nombre ?? 'N/A';
            case 'nombre':
              return `${emp?.nombre ?? ''} ${emp?.apellido_paterno ?? ''} ${emp?.apellido_materno ?? ''}`.trim() || 'N/A';
            case 'estado_civil':
              return emp?.estado_civil?.nombre_ec ?? 'N/A';
            case 'organigrama':
              return emp?.organigrama?.[0]?.organigrama?.nombre ?? 'N/A';
            case 'lider':
              const lider = emp?.organigrama?.[0]?.liders;
              return `${lider?.nombre ?? ''} ${lider?.apellido_paterno ?? ''} ${lider?.apellido_materno ?? ''}`.trim() || 'N/A';
            case 'estudios_carreras':
              return (emp?.estudios || []).map(e => e.carrera).join(', ') || 'N/A';
            case 'estudios_cedulas':
              return (emp?.estudios || []).map(e => e.cedula).join(', ') || 'N/A';
            case 'incrementos_fechas':
              return (emp?.incrementos || [])
                .map(i => moment(i.fecha).format('YYYY-MM-DD'))
                .join(', ') || 'N/A';

            case 'incrementos_montos':
              return (emp?.incrementos || [])
                .map(i => `$${parseFloat(i.monto_incremento).toFixed(2)}`)
                .join(', ') || 'N/A';

            default:
              return emp[campo.field] ?? 'N/A';
          }
        }),
      });
    });
  
    return formattedData;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const page = pagination.pageIndex + 1;
        const pageSize = pagination.pageSize;
        const response = await apiGet(`v2/rh/empleados?type=admin&page=${page}&page_size=${pageSize}`, auth);
        const { data: empleadosData, total } = response.data.data;
        // console.log(empleadosData.datos_generales)
        setEmpleados(empleadosData);
        const datosFormateados = transformarEmpleados(empleadosData);
        setData(datosFormateados);
        setTotalRows(total);
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudieron cargar los datos.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize, globalFilter, columnFilters]);
  
  


  const columns = [
   

    {
      accessorKey: 'field',
      header: 'Campo',
      muiTableHeadCellProps: {
      sx: {
      position: 'sticky',
      left: 0,
      zIndex: 10,
      backgroundColor: 'white', // Fondo blanco para que no se tape
      },
      },
      muiTableBodyCellProps: {
      sx: {
      position: 'sticky',
      left: 0,
      zIndex: 5,
      backgroundColor: 'white',
      },
      },
    },
    ...empleados.map((emp, index) => ({
    accessorKey: `${index}`,
    header: `Colaborador ${emp.id}`,
    size: 200,
    Cell: ({ row }) => {
      const value = row.original.values[index];
      const fieldName = row.original.field;
      const noCopyFields = ['Datos Personales', 'Datos Administrativos', 'Datos Nomina', 'ID'];
    
      // Mostrar menú de acciones solo en la fila "Datos Personales"
      if (row.original.isGroup && fieldName === 'Datos Personales') {
        let colorFondo = '#e3f2fd';
    
        return (
          <Box
            sx={{
              fontWeight: 'bold',
              backgroundColor: colorFondo,
              py: 1,
              px: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {row.original.field}
            <IconButton
              size="small"
              onClick={(e) => abrirMenuAcciones(e, empleados[index])}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        );
      }
    
      if (row.original.isGroup || noCopyFields.includes(fieldName)) {
        let colorFondo = '#f0f0f0';
        if (fieldName === 'Datos Administrativos') colorFondo = '#fce4ec';
    
        return (
          <Box sx={{ fontWeight: 'bold', backgroundColor: colorFondo, py: 1, px: 1 }}>
            {row.original.field}
          </Box>
        );
      }
        if (row.original.isSemaforo && row.original.field === 'Estatus Documental') {
          const empleado = row.original.values[index];
          return (
            <SemaforoDocumentosPorCodigo empleado={empleado} tiposAdjuntos={tiposAdjuntos} />
          );
        }

    
      return (
        <Tooltip title={value || 'Sin información'} arrow>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              gap: '8px',
            }}
            onClick={() => navigator.clipboard.writeText(value || '')}
          >
            <ContentCopy style={{ fontSize: 16, color: '#888' }} />
            <span>{value || 'N/A'}</span>
          </Box>
        </Tooltip>
      );
    },
    
    })),    
    ];
    

  
  

  const toggleModal = (key) => {
    setModals(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        show: !prev[key]?.show,
      },
    }));
  };

  const [modalDinamico, setModalDinamico] = useState({
    show: false,
    tipo: '',
    data: null,
  });
  
  const abrirModalDinamico = (tipo, data) => {
    setModalDinamico({
      show: true,
      tipo,
      data,
    });
  };
  
  const cerrarModalDinamico = () => {
    setModalDinamico({
      show: false,
      tipo: '',
      data: null,
    });
  };


  const cerrarModalYRefrescar = (key) => {
    setModals(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        show: false,
        data: null
      }
    }));
    // fetchData();
    reloadData(); // ← Usamos la nueva función reutilizable

  };
 

  const reloadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const page = pagination.pageIndex + 1;
      const pageSize = pagination.pageSize;
      const searchQuery = globalFilter ? `&search=${globalFilter}` : '';
      const response = await apiGet(`v2/rh/empleados?type=admin&page=${page}&page_size=${pageSize}${searchQuery}`, auth);
      const { data: empleadosData, total } = response.data.data;
      // console.log(empleadosData)
      setEmpleados(empleadosData);
      const datosFormateados = transformarEmpleados(empleadosData);
      setData(datosFormateados);
      setTotalRows(total);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudieron cargar los datos.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, globalFilter, auth]);

  
  useEffect(() => {
    reloadData();
  }, [reloadData, columnFilters]);

  const onChangeRange = (range) => {
  const { startDate, endDate } = range;
  const dias = moment(endDate).diff(moment(startDate), 'days') + 1;

  setFormContrato(prev => ({
    ...prev,
    fechaInicio: startDate,
    fechaFin: endDate,
    dias
  }));
};

const onChangeContrato = (e) => {
  const { name, value, type } = e.target;

  setFormContrato(prev => {
    let updated = { ...prev, [name]: value };

    if (type === 'radio') {
      updated.periodo = value;
      if (value === 'indefinido') {
        updated.dias = '';
      }
    }

    if (name === 'pagos_hr_extra' || name === 'total_obra') {
      updated[name] = value.replace(/[,]/gi, '');
    }

    if (name === 'periodo') {
      const contratos = empleadoMenu?.contratos ?? [];
      if (contratos.length === 0) {
        updated.fechaInicio = new Date(moment(empleadoMenu?.fecha_inicio));
      } else {
        const fechasFin = contratos.map(c => c.fecha_fin).filter(f => f);
        fechasFin.sort((a, b) => new Date(b) - new Date(a));
        updated.fechaInicio = new Date(moment(fechasFin[0]));
      }
    }

    return updated;
  });
};

const generarContrato = async () => {

   const empleado = modals.contratoColaborador?.data;
  if (!empleado || !empleado.id) {
    return errorAlert('No hay un colaborador seleccionado para generar el contrato.');
  }
  waitAlert();
  try {
    // console.log(empleadoMenu)
    const response = await axios.put(
      `${URL_DEV}v2/rh/empleados/${empleado.id}/contratos/generar?tipo_contrato=${'administrativo'}`,
      formContrato,
      { headers: setSingleHeader(auth) }
    );

    const { contrato } = response.data;
    // console.log(response);
    // doneAlert(response.data.message ?? 'El contrato fue generado con éxito.');

    Swal.close()
    Swal.fire({
        icon: 'success',
        title: 'Contrato generado',
        text: 'El contrato fue generado con éxito.',
        showConfirmButton: false,
        timer: 1500
    })

    if (contrato?.contrato) window.open(contrato.contrato, '_blank');
    if (contrato?.carta) window.open(contrato.carta, '_blank');

    setFormContrato(prev => ({ ...prev, tipos: [] }));
    reloadData(); // Refrescar tabla si es necesario
    toggleModal('contratoColaborador');

  } catch (error) {
     console.log(error)
      if (error.response) {
        printResponseErrorAlert(error);
      } else {
        errorAlert('Ocurrió un error de red o sin respuesta del servidor.');
      }
  }
};


const clearFiles = (name, key) => {
  setFormContrato(prev => {
    const adjuntos = { ...prev.adjuntos };
    const files = [...adjuntos[name].files].filter((_, i) => i !== key);

    adjuntos[name].files = files;
    if (files.length === 0) {
      adjuntos[name].value = '';
    }

    return {
      ...prev,
      adjuntos
    };
  });
};


const onChangeAdjuntos = (valor, colaborador) => {
  const tipo = valor.target.id;

  if (!colaborador || !colaborador.id) {
    return errorAlert('Colaborador inválido');
  }

  sendFileAlert(valor, (success) => {
    addAdjuntoAxios(success, tipo, colaborador);
  });
};

const addAdjuntoAxios = async (valor, tipo, colaborador) => {
    if (!colaborador?.id) {
    return errorAlert('Colaborador inválido.');
  }

  waitAlert();

  const file = valor?.target?.file || valor?.file;
  const name = valor?.target?.name || valor?.name;

  if (!file) {
    return errorAlert('Adjunta solo un archivo');
  }

  try {
    const data = new FormData();
    data.append('file', file);

    const response = await axios.post(
      `${URL_DEV}v2/rh/empleados/${colaborador.id}/contratos/${name}/adjuntar?tipo=${tipo}`,
      data,
      { headers: setFormHeader(auth) }
    );

    const { empleado } = response.data;

    // Opcional: Si necesitas actualizar el empleado en el estado
    setEmpleadoMenu(empleado); // Si usas useState para esto

        Swal.close()
    Swal.fire({
        icon: 'success',
        title: 'Adjunto subido',
        text: 'El adjunto fue registrado con éxito.',
        showConfirmButton: false,
        timer: 1500
    })

    // Opcional: recargar la lista de empleados
    reloadData();

  } catch (error) {
       console.log(error)
        if (error.response) {
          printResponseErrorAlert(error);
        } else {
          errorAlert('Ocurrió un error de red o sin respuesta del servidor.');
        }
    }
};


const cancelarContrato = (contratoId ,empleado) => {
  deleteAlert(
    '¿DESEAS TERMINAR EL CONTRATO?',
    '',
    () => cancelarContratoAxios(contratoId, empleado), // ✅ esta sí es la función real que hace la petición
    'SI, TERMINAR'
  );
};


const cancelarContratoAxios = async (idContrato, empleado) => {
  waitAlert();
  // console.log(idContrato)
  // console.log(empleado.id)
  try {
    const response = await axios.get(
      `${URL_DEV}v2/rh/empleados/${empleado.id}/contratos/${idContrato}/terminar`,
      { headers: setSingleHeader(auth) }
    );

     Swal.close()
    Swal.fire({
        icon: 'success',
        title: 'Contrato Terminado',
        text: 'Contrato terminado con éxito.',
        showConfirmButton: false,
        timer: 1500
    })
    // await reloadEmpleado(); // ✅ actualiza los contratos del formulario

    // doneAlert(response.data.message ?? 'Contrato terminado con éxito.');
    reloadData();

  } catch (error) {
    console.log(error)
     if (error.response) {
      printResponseErrorAlert(error);
    } else {
      errorAlert('Ocurrió un error de red o sin respuesta del servidor.');
    }
    // printResponseErrorAlert(error);
  }
};


const renovarContrato = async (empleado) => {
  waitAlert();
  // console.log(empleado.id)
  try {
    const response = await axios.put(
      `${URL_DEV}v2/rh/empleados/${empleado.id}/contratos/renovar?tipo_contrato=administrativo`,
      formContrato,
      { headers: setSingleHeader(auth) }
    );

    const { contrato } = response.data;
    
     Swal.close()
    Swal.fire({
        icon: 'success',
        title: 'Contrato actualizado',
        text: 'El contrato fue generado con éxito',
        showConfirmButton: false,
        timer: 1500
    })
    // doneAlert(response.data.message ?? 'El contrato fue generado con éxito.');

    if (contrato?.contrato) window.open(contrato.contrato, '_blank');
    if (contrato?.carta) window.open(contrato.carta, '_blank');

    setFormContrato(prev => ({ ...prev, tipos: [] }));
    setModals(prev => ({
      ...prev,
      contratoColaborador: { show: false, data: null }
    }));

    reloadData();

  } catch (error) {
    console.error(error);
    if (error.response) {
      printResponseErrorAlert(error);
    } else {
      errorAlert('Ocurrió un error de red o sin respuesta del servidor.');
    }
  }
};



const regeneratePdf = (empleado, contrato) => {
  deleteAlert(
    '¿ESTÁS SEGURO?',
    'GENERARÁS UN NUEVO CONTRATO',
    () => regeneratePdfAxios(empleado.id, contrato?.id),
    'SI, REGENERAR'
  );
};


const regeneratePdfAxios = async (empleadoId, contratoId) => {
  waitAlert();
  try {
    const response = await axios.get(
      `${URL_DEV}v2/rh/empleados/${empleadoId}/contratos/${contratoId}/regenerar`,
      { headers: setSingleHeader(auth) }
    );

    const { empleado, contrato } = response.data;
      Swal.close()
    Swal.fire({
        icon: 'success',
        title: 'Contrato regenerado',
        text: 'Contrato regenerado con éxito',
        showConfirmButton: false,
        timer: 1500
    })

    // doneAlert(response.data.message ?? 'Contrato regenerado con éxito.');

    if (contrato?.contrato) window.open(contrato.contrato, '_blank');
    if (contrato?.carta) window.open(contrato.carta, '_blank');

    reloadData(); // Refresca si hace falta
  } catch (error) {
      console.error(error);
    if (error.response) {
      printResponseErrorAlert(error);
    } else {
      errorAlert('Ocurrió un error de red o sin respuesta del servidor.');
    }
  }
};

const deleteContratoAxios = async (contrato, empleado) => {
  waitAlert();
  // console.log(contrato)
  // console.log(empleado)
  try {
    const response = await axios.delete(
      `${URL_DEV}v2/rh/empleados/${empleado.id}/contratos/${contrato.id}`,
      { headers: setSingleHeader(auth) }
    );

      Swal.close()
    Swal.fire({
        icon: 'success',
        title: 'Contrato eliminado',
        text: 'Contrato eliminado con éxito.',
        showConfirmButton: false,
        timer: 1500
    })
    // doneAlert(response.data.message ?? 'Contrato eliminado con éxito.');

    setFormContrato(prev => ({
      ...prev,
      tipos: []
    }));

    reloadData();

    setModals(prev => ({
      ...prev,
      contratoColaborador: { show: false, data: null }
    }));

  } catch (error) {
    console.error(error);
    printResponseErrorAlert(error);
  }
};

const deleteEmpleadoAxios = async () => {
  try {
    const { id } = modals.deleteColaborador.data;
    const response = await axios.delete(`${URL_DEV}rh/empleado/${id}`, {
      headers: setSingleHeader(auth)
    });

    Swal.close();
    Swal.fire('Eliminado', 'El colaborador fue eliminado exitosamente.', 'success');
    reloadData();
    toggleModal('deleteColaborador');
  } catch (error) {
    printResponseErrorAlert(error);
  }
};

const SemaforoDocumentosPorCodigo = ({ empleado, tiposAdjuntos }) => {
  if (!empleado?.datos_generales) return null;

  const documentosEmpleado = empleado.datos_generales;

  // Obtener códigos únicos obligatorios
  const codigosObligatorios = [...new Set(
    tiposAdjuntos
      .filter(tipo => tipo.obligatorio === 1)
      .map(tipo => tipo.codigo)
  )];

  return (
    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
      {codigosObligatorios.map(codigo => {
        const tieneDocumento = documentosEmpleado.some(
          doc => doc?.tipo_adjunto?.codigo === codigo
        );

        const color = tieneDocumento ? 'green' : 'red';

        return (
          <Tooltip
            key={codigo}
            title={codigo}
          >
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                backgroundColor: color,
                display: 'inline-block'
              }}
            />
          </Tooltip>
        );
      })}
    </Box>
  );
};






// const reloadEmpleado = async () => {
//   console.log(empleadoMenu)
//   try {
//     const response = await axios.get(`${URL_DEV}v2/rh/empleados/${empleadoMenu.id}`, {
//       headers: setSingleHeader(auth),
//     });
//     const empleadoActualizado = response.data.empleado;

//     setEmpleadoMenu(empleadoActualizado); // o como se llame tu estado actual del empleado
//   } catch (error) {
//     console.error(error);
//     if (error.response) {
//       printResponseErrorAlert(error);
//     } else {
//       errorAlert('Ocurrió un error de red o sin respuesta del servidor.');
//     }
//     // printResponseErrorAlert(error);
//   }
// };











// const handleNext = () => {
//   if (activeStep < steps.length - 1) {
//     setActiveStep((prev) => prev + 1);
//   } else {
//     addEmpleadoAxios(); // Reemplaza el viejo handleGuardar aquí
//   }
// };

 
  

  return (
    <Layout authUser={authUser?.access_token} location={location} history={history} active="rh">
      <Box sx={{ padding: '20px' }}>
        <Box mb={2}>
          <Breadcrumbs aria-label="breadcrumb">
            <StyledBreadcrumb component="a" href="#" label="Home" icon={<HomeIcon fontSize="small" />} />
            <StyledBreadcrumb component="a" href="#" label="RH" />
            <StyledBreadcrumb component="a" href="/rh/colaboradores" label="Colaboradores" />
          </Breadcrumbs>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, overflowX: 'auto', overflowY: 'auto'}}>
          <MaterialReactTable
            columns={columns}
            data={data}
            state={{
              isLoading,
              pagination,
              columnFilters,
              globalFilter,            // ✅ pasa el valor del filtro

            }}
            manualPagination
            onGlobalFilterChange={setGlobalFilter} // ✅ actualiza el valor
            enableGlobalFilter={true} // Habilita el buscador global
            manualFiltering={true} // 🔥 Importante para globalFilter en modo backend

            rowCount={totalRows}
            onPaginationChange={setPagination}
            enableDensityToggle
            enableColumnOrdering
            enableColumnFilters={false}
            enableFullScreenToggle={false}
            enablePagination
            enableRowVirtualization
            muiTablePaginationProps={{
              rowsPerPageOptions: [10, 25, 50, 100],
              labelRowsPerPage: "Filas por página",
              shape: "rounded",
              variant: "outlined",
            }}
            paginationDisplayMode="pages"
            initialState={{
              pagination: { pageSize: 50, pageIndex: 0 },
              density: 'compact',
            }}
            renderTopToolbarCustomActions={({ table }) => (
              <Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
              <Button
                sx={{ backgroundColor: '#0A3E27', color: '#fff', '&:hover': { backgroundColor: '#075633' } }}
                variant="contained"
                onClick={() => toggleModal('crearColaborador')}
              >
                Agregar Colaborador
              </Button>
              
              </Box>
            )}
          />
        </Box>
      </Box>


      <Modal size="xl" title="Crear Colaborador" show={modals.crearColaborador?.show} handleClose={() => toggleModal('crearColaborador')} >
        <EmpleadosAgregar handleClose={() => toggleModal('crearColaborador')}  data={modals.crearColaborador?.data}   reloadData={reloadData} />        
      </Modal>
      <Modal size="xl" title="Editar Colaborador" show={modals.editarColaborador?.show} handleClose={() => toggleModal('editarColaborador')}>
        <EmpleadosAgregar  handleClose={() => toggleModal('editarColaborador')} data={modals.editarColaborador?.data} modo="editar" reloadData={reloadData} />
      </Modal>
       <Modal size="lg" title="Historial Vacaciones" show={modals.vacacionesColaborador?.show} handleClose={() => toggleModal('vacacionesColaborador')}>
        <HistorialVacaciones at={auth} empleado = { modals.vacacionesColaborador?.data }/>
      </Modal>
      <Modal size="xl" title="Contrato" show={modals.contratoColaborador?.show} handleClose={() => toggleModal('contratoColaborador')} >
        <FormularioContrato
           empleado={modals.contratoColaborador?.data}
          form={formContrato}
          onChangeRange={onChangeRange}
          onChangeContrato={onChangeContrato}
          generarContrato={generarContrato}
          clearFiles={clearFiles}
          onChangeAdjuntos={onChangeAdjuntos}
          cancelarContrato={cancelarContrato}
          renovarContrato={(empleado) => renovarContrato(empleado)} // ✅ se pasa como prop
          regeneratePdf={regeneratePdf}
          // reloadEmpleado={reloadEmpleado} // ✅ nueva prop

          // formeditado={formeditado}
          user={authUser?.user}
          deleteContrato={deleteContratoAxios}
        />
      </Modal>
      <ModalDelete
          title={'¿Quieres eliminar el colaborador?'}
          show={modals.deleteColaborador?.show}
          handleClose={() => toggleModal('deleteColaborador')}
          onClick={(e) => {
            e.preventDefault();
            waitAlert();
            deleteEmpleadoAxios();
          }}
        />

      <Modal
        size="xl"
        title="Licencias y Equipos"
        show={modals.licenciasEquipos?.show}
        handleClose={() => toggleModal('licenciasEquipos')}
      >
        {
          modals.licenciasEquipos?.show &&
          <LicenciasEquiposForm
            at={authUser?.access_token} // o authUser?.access_token si usas eso
            empleado={modals.licenciasEquipos.data}
            esColaborador={true}
            adminView={false}
          />
        }
      </Modal>
        
        <Modal size="lg" title="Prestaciones del colaborador"  show={modals.prestacionesColaborador?.show}  handleClose={() => toggleModal('prestacionesColaborador')} >
          {
            modals.prestacionesColaborador?.show &&
            <PrestacionesRHList
              at={authUser?.access_token}
              empleado={modals.prestacionesColaborador?.data}
            />
          }
        </Modal>

 



      <Menu
        anchorEl={anchorElMenuAcciones}
        open={Boolean(anchorElMenuAcciones)}
        onClose={cerrarMenuAcciones}
        reload={reloadData} 
      >
       

       <MenuItem onClick={() => {
          cerrarMenuAcciones();
          setModals(prev => ({
            ...prev,
            editarColaborador: { show: true, data: empleadoMenu }
          }));
        }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />

          Editar Colaborador
        </MenuItem>
         <MenuItem onClick={() => {
          cerrarMenuAcciones();
          setModals(prev => ({
            ...prev,
            deleteColaborador: { show: true, data: empleadoMenu }
          }));
        }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
          Eliminar Colaborador
        </MenuItem>

        <MenuItem onClick={() => {
        const adjuntos = empleadoMenu?.datos_generales || [];

          cerrarMenuAcciones();
          abrirModalDinamico('adjuntos', {
            ...empleadoMenu,
            adjuntos,
          });
          }}>
          <AttachFile fontSize="small" sx={{ mr: 1 }} />
          Adjuntos
        </MenuItem>

       <MenuItem onClick={() => {
        cerrarMenuAcciones();
        setModals(prev => ({
          ...prev,
          vacacionesColaborador: { show: true, data: empleadoMenu }
        }));
      }}>
        <KeyboardArrowRight fontSize="small" sx={{ mr: 1 }} />
        Historial de Vacaciones
      </MenuItem>

      <MenuItem onClick={() => {
        cerrarMenuAcciones();
        setModals(prev => ({
          ...prev,
          contratoColaborador: { show: true, data: empleadoMenu }
        }));
      }}>
        <KeyboardArrowRight fontSize="small" sx={{ mr: 1 }} />
        Contrato
      </MenuItem>

      <MenuItem onClick={() => {
        cerrarMenuAcciones();
        setModals(prev => ({
          ...prev,
          licenciasEquipos: { show: true, data: empleadoMenu }
        }));
      }}>
        <KeyboardArrowRight fontSize="small" sx={{ mr: 1 }} />
        Licencias y Equipos
      </MenuItem>

      <MenuItem onClick={() => {
        cerrarMenuAcciones();
        setModals(prev => ({
          ...prev,
          prestacionesColaborador: { show: true, data: empleadoMenu }
        }));
      }}>
        <KeyboardArrowRight fontSize="small" sx={{ mr: 1 }} />
        Prestaciones
      </MenuItem>




        {/* {/* <MenuItem onClick={() => {
          cerrarMenuAcciones();
          abrirModalDinamico('prestaciones', empleadoMenu);
        }}>
          <KeyboardArrowRight fontSize="small" sx={{ mr: 1 }} />
          Prestaciones
        </MenuItem> */}
      </Menu> 

      <Modal
        size="lg"
        title={
          modalDinamico.tipo === 'adjuntos'
            ? ''
            : modalDinamico.tipo === 'vacaciones'
            ? 'Historial de Vacaciones'
            : modalDinamico.tipo === 'prestaciones'
            ? 'Prestaciones'
            : ''
        }
        show={modalDinamico.show}
        handleClose={cerrarModalDinamico}
      >
        {modalDinamico.tipo === 'adjuntos' && <ComponenteAdjuntos colaborador={modalDinamico.data} />}
        {/* {modalDinamico.tipo === 'vacaciones' && <ComponenteVacaciones colaborador={modalDinamico.data} />}
        {modalDinamico.tipo === 'prestaciones' && <ComponentePrestaciones colaborador={modalDinamico.data} />} */}
      </Modal>



    

    </Layout>
  );
};

export default Empleados;
