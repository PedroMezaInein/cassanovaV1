import React, {useState, useEffect, useCallback} from 'react'
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
// import Layout from '../../../components/layout/layout';
// import { MaterialReactTable } from 'material-react-table';
import { Box } from '@mui/material';
// import { emphasize, styled } from '@mui/material/styles';
// import Breadcrumbs from '@mui/material/Breadcrumbs';
// import Chip from '@mui/material/Chip';
// import HomeIcon from '@mui/icons-material/Home';
// import Tooltip from '@mui/material/Tooltip';
// import ContentCopy from '@mui/icons-material/ContentCopy';
import moment from 'moment';

// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@material-ui/core/TextField';
import {InputLabel  } from '@mui/material';
import Autocomplete from '@material-ui/lab/Autocomplete';

// import { Modal, ModalDelete } from '../../../components/singles';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
// import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import Grid from '@mui/material/Grid';
import { apiPostForm, apiGet, apiPutForm } from '../../../functions/api';
import { es } from 'date-fns/locale'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { waitAlert, errorAlert, printResponseErrorAlert,doneAlert } from '../../../functions/alert'; // importa tus helpers
import { setOptions} from '../../../functions/setters'
import { URL_DEV } from '../../../constants'
import axios from 'axios'
import { setFormHeader, setSingleHeader } from '../../../functions/routers'

import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import Button from '@material-ui/core/Button';

import { Typography } from '@material-ui/core';

import InputMask from 'react-input-mask';
import { format, isValid, parse } from 'date-fns';



export default function EmpleadosAgregar(props)  {
const {reloadData, handleClose } = props

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
  const departamentos = useSelector(state => state.opciones.areas)
  const empresas = useSelector((state) => state.opciones.empresa);
  const [errores, setErrores] = useState({})
  // const esEdicion = Boolean(data && data.id);
  const esEdicion = props.modo === 'editar';
  const [indiceVacunaEditando, setIndiceVacunaEditando] = useState(null);
  const [indiceIncrementoEditando, setIndiceIncrementoEditando] = useState(null);
  const [indiceEstudioEditando, setIndiceEstudioEditando] = useState(null);


  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    email_personal: '',
    telefono_movil: '',
    // telefono_particular: '',
    curp: '',
    nss: '',
    fecha_nacimiento: '',
    fechaInicio:'',
    fechaFin: '',
    nacionalidad: '',
    estado_civil: '',
    cuenta: '',
    domicilio: '',
    numero: '',
    clave: '',
    clabe: '',
    estatus: '',
    empresa: '',
    departamento: '',
    organigrama: '',
    lider: '',
    tipo: '',
    checador: '',
    matricula: '',
    domicilio: '',
    correo_empresa: '',
    email_empresarial: '',
    empresa: '',
    departamentos: [], // ahora será un arreglo
    empresas: [], // ahora será un arreglo
    estatus_empleado: 'Activo',
    tipo_empleado: 'Administrativo',
    checador:'',
    puesto:'',
    responsable:'',
    banco: '',
    fecha_alta_imss: '',
    fecha_baja_imss: '',
    numero_alta_imss: '',
    id_patronal: '',
    numero_baja_imss: '',
    salario_bruto: '',
    total: '',
    nomina_imss:'',
    nomina_extras: '',
    extraImss:'',
    efectivo:'',
    extraEfectivo:'',
    adicionales_efectivo: '',
    isn: '',
    isr:'',
    infonavit: '',
    imss: '',
    rcv: '',

    nombre_emergencia:'',
    nombre_emergencia2:'',
    telefono_emergencia:'',
    telefono_emergencia2:'',

    vacunas: [], // ← aquí guardamos todas las vacunas
    incrementos: [], // 👈 NUEVO


  });

  const camposObligatorios = [
  { campo: 'nombre', label: 'Nombre' },
  { campo: 'apellido_paterno', label: 'Apellido Paterno' },
  // { campo: 'curp', label: 'CURP', validator: validarCURP, mensaje: 'CURP inválido' },
  // { campo: 'rfc', label: 'RFC', validator: validarRFC, mensaje: 'RFC inválido' },
  { campo: 'email_personal', label: 'Correo Personal', validator: validarCorreo, mensaje: 'Correo inválido' },
  { campo: 'telefono_movil', label: 'Teléfono Móvil', validator: validarTelefono, mensaje: 'Debe tener 10 dígitos' },
  // { campo: 'telefono_particular', label: 'Teléfono Particular', validator: validarTelefono, mensaje: 'Debe tener 10 dígitos' },
  { campo: 'empresa', label: 'Empresa' },
  { campo: 'departamentos', label: 'Departamentos', isArray: true },
  // ... puedes seguir agregando campos y validadores
];

const validarFormulario = () => {
  const nuevosErrores = {};

  camposObligatorios.forEach(({ campo, label, validator, mensaje, isArray }) => {
    const valor = form[campo];

    if (isArray) {
      if (!Array.isArray(valor) || valor.length === 0) {
        nuevosErrores[campo] = `El campo "${label}" es obligatorio.`;
      }
    } else if (!valor || valor === '') {
      nuevosErrores[campo] = `El campo "${label}" es obligatorio.`;
    } else if (validator && !validator(valor)) {
      nuevosErrores[campo] = mensaje || `El campo "${label}" no es válido.`;
    }
  });

  setErrores(nuevosErrores);
  return Object.keys(nuevosErrores).length === 0;
};



const validarCURP = (curp) => /^[A-Z]{4}\d{6}[A-Z]{6}\d{2}$/.test(curp.toUpperCase());
const validarRFC = (rfc) => /^([A-ZÑ&]{3,4})\d{6}(?:[A-Z\d]{3})?$/.test(rfc.toUpperCase());
const validarCorreo = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
const validarTelefono = (telefono) => /^\d{10}$/.test(telefono);

const [nuevaVacuna, setNuevaVacuna] = useState({
  tipo: '',
  fecha: null,
  numero_dosis: '', // 👈 Aquí

});

const [nuevoIncremento, setNuevoIncremento] = useState({
  fecha: null,
  monto_inicial: '',
  monto_incremento: '',
  numero_incremento: '',
});

const [nuevoEstudio, setNuevoEstudio] = useState({
  carrera: '',
  institucion: '',
  cedula: '',
  fecha_titulacion: null,
});

  const [opciones, setOpciones] = useState({
    empresas: [],
    departamentos: [],
    bancos: [],
    organigrama: [],
    puestos: [],
    estado_civil: [],
    responsable: [],
    registro_patronal: [],
//     estado_civil: [
//       { value: 'Soltero(a)', name: 'Soltero(a)', label: 'Soltero(a)' },
//       { value: 'Casado(a)', name: 'Casado(a)', label: 'Casado(a)' },
//       { value: 'Divorciado(a)', name: 'Divorciado(a)', label: 'Divorciado(a)' },
//       { value: 'Viudo(a)', name: 'Viudo(a)', label: 'Viudo(a)' },
//       { value: 'Union libre', name: 'Unión libre', label: 'Unión libre' },
//   ]
  });
  useEffect(() => {
    if (auth) {
      getOptionsAxios(auth, setOpciones);
    }
  }, [auth]);


  useEffect(() => {
    if (esEdicion && props.data) {
      const emp = props.data;
      // console.log(emp)
      setForm({
        nombre: emp.nombre || '',
        apellido_paterno: emp.apellido_paterno || '',
        apellido_materno: emp.apellido_materno || '',
        rfc: emp.rfc || '',
        curp: emp.curp || '',
        nss: emp.nss || '',
        fecha_nacimiento: emp.fecha_nacimiento || '',
        domicilio: emp.domicilio || '',
        email_personal: emp.email_personal || '',
        telefono_movil: emp.telefono_movil || '',
        // telefono_particular: emp.telefono_particular || '',
        nacionalidad: emp.nacionalidad || '',
        estado_civil: emp.estado_civil?.id || '',
        nombre_emergencia:emp.nombre_emergencia || '',
        nombre_emergencia2: emp.nombre_emergencia2 || '',
        telefono_emergencia: emp.telefono_emergencia || '',
        telefono_emergencia2: emp.telefono_emergencia2 || '',
        empresa: String(emp.empresa?.id || ''),

        departamentos: emp?.departamentos?.map(d => ({
          value: String(d.id),
          name: d.nombre,
        })) || [],
        empresas: emp?.empleados_empresas?.map(e => ({
          value: String(e.empresa[0]?.id),
          name: e.empresa[0]?.name,
        })) || [],
        estatus_empleado: ['Activo', 'Inactivo'].includes(emp.estatus_empleado)
          ? emp.estatus_empleado
          : 'Activo',
        organigrama: emp.organigrama?.[0]?.id_organigrama?.toString() || '',
        puesto: emp.puesto.toString() || '',
        responsable: emp.organigrama?.[0]?.id_lider?.toString() || '',
        tipo_empleado: emp.tipo_empleado || '',
        checador: emp.checador || '',
        vacaciones_disponibles: emp.vacaciones_disponibles || '',
        matricula: emp.matricula || '',
        email_empresarial: emp.email_empresarial || '',
        banco: emp.banco || '',
        cuenta: emp.cuenta || '',
        clabe: emp.clabe || '',
        id_patronal: emp.id_patronal?.toString() || '',
        fechaInicio: emp.fecha_inicio|| '',
        fechaFin: emp.fecha_fin|| '',
        fecha_alta_imss:  emp.fecha_alta_imss|| '',
        fecha_baja_imss:  emp.fecha_baja_imss|| '',
        numero_alta_imss: emp.numero_alta_imss || '',
        numero_baja_imss: emp.numero_baja_imss || '',
        numero_empleado : emp.numero_empleado || '',
        salario_bruto: emp.salario_bruto || '',
        total: emp.total || '',
        extraImss: emp.extraImss || '',
        nomina_imss: emp.nomina_imss || '',
        efectivo: emp.efectivo || '',
        extraEfectivo: emp.extraEfectivo || '',
        extraImss: emp.extraImss || '',
        comision: emp.comision || '',
        nomina_extras: emp.nomina_extras || '',
        adicionales_efectivo: emp.adicionales_efectivo || '',
        isn: emp.isn || '',
        isr: emp.isr || '',       
        infonavit: emp.infonavit || '',
        imss: emp.imss || '',
        rcv: emp.rcv  || '',
        vacunas: emp.vacunas || [],
        incrementos: emp.incrementos || [],
        estudios:  emp.estudios || [],// 👈 nuevo campo


      });
    }
  }, [esEdicion, props.data]);
  
  


  const getOptionsAxios = async (authToken, setOpciones) => {
    waitAlert();
  
    try {
      const response = await axios.get(`${URL_DEV}rh/empleado/options`, {
        headers: {
          Accept: '*/*',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      Swal.close();
  
      const {
        empresas,
        departamentos,
        bancos,
        organigrama,
        puestos,
        estado_civil,
        empleados,
        patronal,
      } = response.data;
  
      setOpciones({
        empresas: setOptions(empresas, 'name', 'id'),
        departamentos: setOptions(departamentos, 'nombre', 'id'),
        bancos: setOptions(bancos, 'nombre', 'id'),
        organigrama: setOptions(organigrama, 'nombre', 'id'),
        puestos: setOptions(puestos, 'nombre_puesto', 'id'),
        estado_civil: setOptions(estado_civil, 'nombre_ec', 'id'),
        responsable: setOptions(empleados, 'nombre', 'id'),
        registro_patronal: setOptions(patronal, 'name_patronal', 'id'),
      });
    } catch (error) {
      printResponseErrorAlert(error);
    }
  };
  


const steps = esEdicion
  ? ['Datos Personales', 'Datos de Empresa', 'Datos Contratacion', 'Expediente']
  : ['Datos Personales', 'Datos de Empresa', 'Datos Contratacion'];

  const [activeStep, setActiveStep] = useState(0);

const handleNext = () => {
  // Validar campos antes de avanzar
  const esValido = validarCamposDelPaso(activeStep);
  if (!esValido) {
    Swal.fire('Error', 'Corrige los errores en el formulario antes de continuar.', 'error');
    return;
  }

  if (activeStep < steps.length - 1) {
    setActiveStep((prev) => prev + 1);
  } else {
    if (esEdicion) {
      updateEmpleadoAxios();
    } else {
      addEmpleadoAxios();
    }
  }
};

const updateEmpleadoAxios = async () => {
  waitAlert();

  try {
    const data = new FormData();

   Object.entries(form).forEach(([key, value]) => {
      if (['departamentos', 'empresas', 'vacunas', 'incrementos', 'estudios'].includes(key)) {
        data.append(key, JSON.stringify(value)); // Serializa los arreglos
      } else {
        data.append(key, value ?? '');
      }
    });

    const response = await axios.post(
      `${URL_DEV}v2/rh/empleados/${props.data.id}?_method=PUT`, // 👈 importante: override POST como PUT
      data,
      {
        headers: {
          ...setSingleHeader(auth),
          'Content-Type': 'multipart/form-data',
        },
      }
    );
      Swal.close()
      Swal.fire({
          icon: 'success',
          title: 'Colaborador actualizcado',
          text: 'El colaborador fue modificado con éxito',
          showConfirmButton: false,
          timer: 1500
      })
    
        reloadData()
      handleClose()
    // doneAlert(response.data.message || 'El colaborador fue modificado con éxito');
    // Swal.fire('Éxito', response.data.message || 'Colaborador actualizado correctamente', 'success');
    history.push({ pathname: '/rh/colaboradores' });
  } catch (error) {
    if (error.response) {
      printResponseErrorAlert(error);
    } else {
      errorAlert('Ocurrió un error desconocido. Verifica tu conexión o intenta de nuevo.');
      console.error('Error no relacionado a respuesta HTTP:', error);
    }
  }
};




  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

 

  const handleInputChange = (e) => {
    if (e.target.name === 'empresa' && opciones?.empresas) {
        const cuentas = opciones.empresas.find((empresa) => empresa.id === e.target.value)?.cuentas || [];
        setForm((prevForm) => ({
            ...prevForm,
            [e.target.name]: e.target.value,
            cuentas,
        }));
    }  else {
        setForm((prevForm) => ({
            ...prevForm,
            [e.target.name]: e.target.value,
        }));
    }
};
  
  
  
  // const handleGuardar = async () => {
  //   try {
  //     console.log(form)
  //     const nuevosErrores = {};

  //   if (!validarCURP(form.curp)) nuevosErrores.curp = 'CURP inválido';
  //   if (!validarRFC(form.rfc)) nuevosErrores.rfc = 'RFC inválido';
  //   if (!validarCorreo(form.email_personal)) nuevosErrores.email_personal = 'Correo inválido';
  //   if (!validarTelefono(form.telefono_movil)) nuevosErrores.telefono_movil = 'Debe tener 10 dígitos';
  //   if (!validarTelefono(form.telefono_particular)) nuevosErrores.telefono_particular = 'Debe tener 10 dígitos';

  //   if (Object.keys(nuevosErrores).length > 0) {
  //   setErrores(nuevosErrores);
  //   Swal.fire('Error', 'Corrige los errores en el formulario', 'error');
  //   return;
  //   }

  //     const response = await apiPostForm('v2/rh/empleados', form, auth); // Asegúrate de tener apiPost
  //     Swal.fire('Éxito', 'Colaborador creado correctamente', 'success');
  //     setOpenModal(false);
  //     // Opcional: recargar datos
  //     setPagination(prev => ({ ...prev })); // Forzar refetch
  //   } catch (error) {
  //     console.error(error);
  //     Swal.fire('Error', 'No se pudo crear el colaborador', 'error');
  //   }
  // };

  // const toggleModal = (key) => {
  //   setModals(prev => ({
  //     ...prev,
  //     [key]: {
  //       ...prev[key],
  //       show: !prev[key]?.show,
  //     },
  //   }));
  // };

  const handleChange = (e) => {
    if (e.target.name === 'empresa' && opciones?.empresas) {
        const cuentas = opciones.empresas.find((empresa) => empresa.id === e.target.value)?.cuentas || [];
        setForm((prevForm) => ({
            ...prevForm,
            [e.target.name]: e.target.value,
            cuentas,
        }));
    }  else {
      setForm((prevForm) => ({
            ...prevForm,
            [e.target.name]: e.target.value,
        }));
    }
};

// función reutilizable para todos los Autocomplete
const handleAutocompleteChange = (name) => (event, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value ? value.value || value.id : '',
    }));
  };

  

const handleChangeFecha = (date, tipo) => {
  if (!date) return;

  // Si es string, intentar parsearlo
  let parsedDate = typeof date === 'string' ? parse(date, 'dd/MM/yyyy', new Date()) : date;

  // Validar que sea una fecha válida
  if (!isValid(parsedDate)) return;

  // Ajuste de zona horaria
  const localDate = new Date(parsedDate.getTime() + Math.abs(parsedDate.getTimezoneOffset() * 60000));
  const formatted = format(localDate, 'yyyy-MM-dd');

  setForm((prevForm) => ({
    ...prevForm,
    [tipo]: formatted
  }));
};



const addEmpleadoAxios = async () => {
  waitAlert();

  try {
    const data = new FormData();
    const aux = Object.keys(form);
    // console.log(form)
    const nuevosErrores = {};

    // if (!validarCURP(form.curp)) nuevosErrores.curp = 'CURP inválido';
    // if (!validarRFC(form.rfc)) nuevosErrores.rfc = 'RFC inválido';
    // if (!validarCorreo(form.email_personal)) nuevosErrores.email_personal = 'Correo inválido';
    // if (!validarTelefono(form.telefono_movil)) nuevosErrores.telefono_movil = 'Debe tener 10 dígitos';
    // if (!validarTelefono(form.telefono_particular)) nuevosErrores.telefono_particular = 'Debe tener 10 dígitos';
    const esValido = validarFormulario();
    if (!esValido) {
      Swal.fire('Error', 'Corrige los errores del formulario', 'error');
      return;
    }

    // if (Object.keys(nuevosErrores).length > 0) {
    // setErrores(nuevosErrores);
    // Swal.fire('Error', 'Corrige los errores en el formulario', 'error');
    // return;
    // }


    aux.forEach((element) => {
      switch (element) {
        case 'adjuntos':
          break;

        case 'departamentos':
          form.departamentos.forEach((el) => {
            data.append(`${element}[]`, el.value);
          });
          break;

        case 'empresas':
          form.empresas.forEach((el) => {
            data.append(`${element}[]`, el.value);
          });
          break;

        default:
          data.append(element, form[element]);
          break;
      }
    });

    // Si tienes adjuntos:
    if (form.adjuntos) {
      const adjKeys = Object.keys(form.adjuntos);
      adjKeys.forEach((element) => {
        if (form.adjuntos[element].value !== '') {
          for (let i = 0; i < form.adjuntos[element].files.length; i++) {
            data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name);
            data.append(`files_${element}[]`, form.adjuntos[element].files[i].file);
          }
          data.append('adjuntos[]', element);
        }
      });
    }

    const response = await axios.post(`${URL_DEV}v2/rh/empleados`, data, {
      headers: {
        Authorization: `Bearer ${auth}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    Swal.fire('Éxito', response.data.message || 'Colaborador creado correctamente', 'success');
    handleClose()

    setOpenModal(false);
    setPagination((prev) => ({ ...prev })); // Forzar refetch
  } catch (error) {
    printResponseErrorAlert(error);
  }
};

const handleSubmit = async () => {
  try {
    waitAlert();
    if (esEdicion) {
      await apiPutForm(`v2/rh/nomina-administrativa/${data.id}`, form, auth);
    } else {
      await apiPostForm(`v2/rh/nomina-administrativa`, form, auth);
    }
    Swal.close();
    handleClose();
  } catch (error) {
    printResponseErrorAlert(error);
  }
};

// const cerrarModalYRefrescar = () => {
//   toggleModal('editarColaborador');
//   fetchData(); // puedes exponer esta función con useCallback si es necesario
// };


const agregarVacuna = () => {
  if (!nuevaVacuna.tipo || !nuevaVacuna.fecha) return;

  const vacunaConDosis = {
    ...nuevaVacuna,
    numero_dosis:
      nuevaVacuna.numero_dosis ||
      (form.vacunas.filter((v) => v.tipo === nuevaVacuna.tipo).length + 1),
  };

  setForm((prev) => {
    const vacunasActualizadas = [...prev.vacunas];

    if (indiceVacunaEditando !== null) {
      // Editar solo la vacuna seleccionada
      vacunasActualizadas[indiceVacunaEditando] = vacunaConDosis;
    } else {
      // Agregar una nueva
      vacunasActualizadas.push(vacunaConDosis);
    }

    return {
      ...prev,
      vacunas: vacunasActualizadas,
    };
  });

  // Resetear el formulario de vacunas
  setNuevaVacuna({ tipo: '', fecha: null, numero_dosis: '' });
  setIndiceVacunaEditando(null); // ← Esto es clave para salir del modo edición
};





const eliminarVacuna = (index) => {
  setForm(prev => ({
    ...prev,
    vacunas: prev.vacunas.filter((_, i) => i !== index),
  }));
};

const agregarIncremento = () => {
  if (!nuevoIncremento.fecha  || !nuevoIncremento.monto_incremento) return;

  let numero_incremento = nuevoIncremento.numero_incremento;
  if (!numero_incremento) {
    numero_incremento = form.incrementos.length + 1;
  }

  const incrementoFinal = {
    ...nuevoIncremento,
    numero_incremento,
    monto_inicial: form.total, // ✅ aquí es donde lo asignas automáticamente
  };

  setForm((prev) => {
  const nuevos = [...prev.incrementos];

  if (indiceIncrementoEditando !== null) {
    nuevos[indiceIncrementoEditando] = incrementoFinal;
  } else {
    nuevos.push(incrementoFinal);
  }

  return { ...prev, incrementos: nuevos };
});

setIndiceIncrementoEditando(null); // salir del modo edición


  setNuevoIncremento({
    fecha: null,
    monto_inicial: '', // este ya no se usará manualmente
    monto_incremento: '',
    numero_incremento: '',
  });
};



const eliminarIncremento = (index) => {
  setForm((prev) => ({
    ...prev,
    incrementos: prev.incrementos.filter((_, i) => i !== index),
  }));
};


const agregarEstudio = () => {
  const { carrera, institucion, cedula } = nuevoEstudio;
  if (!carrera || !institucion || !cedula) {
    Swal.fire('Error', 'Llena todos los campos obligatorios', 'warning');
    return;
  }

  setForm((prev) => {
  const nuevos = [...prev.estudios];

  if (indiceEstudioEditando !== null) {
    nuevos[indiceEstudioEditando] = nuevoEstudio;
  } else {
    nuevos.push(nuevoEstudio);
  }

  return { ...prev, estudios: nuevos };
});

setIndiceEstudioEditando(null); // salir del modo edición

  setNuevoEstudio({
    carrera: '',
    institucion: '',
    cedula: '',
    fecha_titulacion: null,
  });
};


const eliminarEstudio = (index) => {
  setForm((prev) => ({
    ...prev,
    estudios: prev.estudios.filter((_, i) => i !== index),
  }));
};


const camposObligatoriosPorPaso = {
  0: [
    { campo: 'nombre', label: 'Nombre' },
    { campo: 'apellido_paterno', label: 'Apellido Paterno' },
    { campo: 'apellido_materno', label: 'Apellido Materno' },
    // { campo: 'curp', label: 'CURP', validator: validarCURP, mensaje: 'CURP inválido' },
    { campo: 'curp', label: 'CURP' },
    { campo: 'rfc', label: 'RFC', validator: validarRFC, mensaje: 'RFC inválido' },
    { campo: 'nss', label: 'NSS'},
    { campo: 'fecha_nacimiento', label: 'Fecha Nacimiento'},

    { campo: 'email_personal', label: 'Correo Personal', validator: validarCorreo, mensaje: 'Correo inválido' },
    { campo: 'telefono_movil', label: 'Teléfono Móvil', validator: validarTelefono, mensaje: 'Debe tener 10 dígitos' },
    // { campo: 'telefono_particular', label: 'Teléfono Particular', validator: validarTelefono, mensaje: 'Debe tener 10 dígitos' },
    { campo: 'domicilio', label: 'Domicilio' },
    { campo: 'nombre_emergencia', label: 'Contacto de emergencia' },
    { campo: 'telefono_emergencia', label: 'Telefono de emergencia' },


  ],
  1: [
    { campo: 'empresa', label: 'Empresa' },
    { campo: 'departamentos', label: 'Departamentos', isArray: true },
    { campo: 'estatus_empleado', label: 'Estatus' },
    { campo: 'email_empresarial', label: 'Correo empresarial' },
    { campo: 'puesto', label: 'Puesto' },
    // { campo: 'checador', label: 'Numero de checador' },

  ],
  2: [
    { campo: 'banco', label: 'Banco' },
    { campo: 'cuenta', label: 'Cuenta' },
    { campo: 'clabe', label: 'Clabe' },
    { campo: 'fechaInicio', label: 'Fecha de Ingreso' },
    { campo: 'id_patronal', label: 'Registro patronal' },

    { campo: 'salario_bruto', label: 'Sueldo Bruto Mensual' },
    { campo: 'total', label: 'Sueldo completo' },
    { campo: 'nomina_imss', label: 'Nomina imss quincenal' },
    // { campo: 'nomina_extras', label: 'Efectivo Quincenal' },
    { campo: 'comision', label: 'Comision Efectiva' },   
    { campo: 'efectivo', label: 'efectivo' },        
     
    // { campo: 'imss', label: 'Imss' },
    // { campo: 'isr', label: 'isr' },
    // { campo: 'isn', label: 'isn' },
    // { campo: 'infonavit', label: 'Infonavit' },
    // { campo: 'rcv', label: 'rcv' },
  ]
}


const validarCamposDelPaso = (paso) => {
  const nuevosErrores = {};
  const camposDelPaso = camposObligatoriosPorPaso[paso] || [];

  camposDelPaso.forEach(({ campo, label, validator, mensaje, isArray }) => {
    const valor = form[campo];

    if (isArray) {
      if (!Array.isArray(valor) || valor.length === 0) {
        nuevosErrores[campo] = `El campo "${label}" es obligatorio.`;
      }
    } else if (!valor || valor === '') {
      nuevosErrores[campo] = `El campo "${label}" es obligatorio.`;
    } else if (validator && !validator(valor)) {
      nuevosErrores[campo] = mensaje || `El campo "${label}" no es válido.`;
    }
  });

  setErrores((prev) => ({ ...prev, ...nuevosErrores }));
  console.log(nuevosErrores)
  return Object.keys(nuevosErrores).length === 0;
};



  
  
  
  return (
  <>
     
          <DialogContent dividers>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* STEP 1: Datos personales */}
            {activeStep === 0 && (
              <>
                <Grid container spacing={3}>
                <Grid item xs={12}>
                      <Box sx={{ mt: 2, mb: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          Datos de ingreso
                        </Typography>
                      </Box>
                    </Grid> 
                  <Grid item xs={12} sm={6} md={3}>                   
                    <TextField name="nombre" label="Nombre"  type="text" defaultValue={form.nombre} onChange={handleChange} InputLabelProps={{ shrink: true, }}  error={!!errores.nombre}   helperText={errores.nombre || ''} multiline className="w-100" />
                    {/* <TextField label="Nombre" name="nombre" type="text" multiline className="w-100"  InputLabelProps={{ shrink: true,}} defaultValue={nuevoColaborador.nombre} onChange={handleChange} /> */}
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField label="Apellido Paterno" name="apellido_paterno" type="text" fullWidth value={form.apellido_paterno} error={!!errores.apellido_paterno}   helperText={errores.apellido_paterno || ''}onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField label="Apellido Materno" name="apellido_materno" type="text" fullWidth value={form.apellido_materno} error={!!errores.apellido_materno}   helperText={errores.apellido_materno || ''} onChange={handleInputChange} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="CURP"
                    name="curp"
                    type="text"
                    fullWidth
                    value={form.curp}
                    onChange={(e) => {
                        const valor = e.target.value.toUpperCase();
                        setForm((prev) => ({ ...prev, curp: valor }));

                        // Validación en tiempo real
                        if (valor.length === 0) {
                        setErrores((prev) => ({ ...prev, curp: '' }));
                        } else if (valor.length < 18) {
                        setErrores((prev) => ({ ...prev, curp: 'Faltan caracteres (18)' }));
                        } else {
                        setErrores((prev) => ({ ...prev, curp: '' }));
                        }
                    }}
                    error={!!errores.curp}
                    helperText={errores.curp}
                    />

                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="RFC"
                    name="rfc"
                    type="text"
                    fullWidth
                    value={form.rfc}
                    onChange={(e) => {
                        const valor = e.target.value.toUpperCase();
                        setForm((prev) => ({ ...prev, rfc: valor }));

                        if (valor.length === 0) {
                        setErrores((prev) => ({ ...prev, rfc: '' }));
                        } else if (valor.length < 12) {
                        setErrores((prev) => ({ ...prev, rfc: 'Faltan caracteres (12-13)' }));
                        } else {
                        setErrores((prev) => ({ ...prev, rfc: '' }));
                        }
                    }}
                    error={!!errores.rfc}
                    helperText={errores.rfc}
                    />

                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                     <TextField
                        label="NSS"
                        name="nss"
                        type="text"
                        fullWidth
                        value={form.nss}
                        onChange={(e) => {
                            const valor = e.target.value.replace(/\D/g, ''); // solo números
                            setForm((prev) => ({ ...prev, nss: valor }));

                            if (valor.length === 0) {
                            setErrores((prev) => ({ ...prev, nss: '' }));
                            } else if (valor.length < 11) {
                            setErrores((prev) => ({ ...prev, nss: 'Faltan caracteres (11)' }));
                            } else if (valor.length > 11) {
                            setErrores((prev) => ({ ...prev, nss: 'Demasiados caracteres' }));
                            } else {
                            setErrores((prev) => ({ ...prev, nss: '' }));
                            }
                        }}
                        error={!!errores.nss}
                        helperText={errores.nss}
                        />

                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    {/* <TextField label="Fecha nacimiento" name="fecha_nacimiento" type="text" fullWidth value={form.fecha_nacimiento} onChange={handleInputChange} /> */}
                     <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                        <KeyboardDatePicker
                          label="Fecha de nacimiento"
                          format="dd/MM/yyyy"
                          value={form.fecha_nacimiento !== '' ? form.fecha_nacimiento : null}
                          onChange={(e) => handleChangeFecha(e, 'fecha_nacimiento')}

                          fullWidth
                          error={!!errores.fecha_nacimiento}   
                          helperText={errores.fecha_nacimiento || ''} 
                        />
                    </MuiPickersUtilsProvider>
                   
                    {/* <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                      <KeyboardDatePicker
                          disableToolbar
                          label="Fecha de nacimiento"
                          format="dd/MM/yyyy"
                          margin="normal"
                          name="fecha_nacimiento"
                          value={form.fecha_nacimiento !== '' ? form.fecha_nacimiento : null}
                          placeholder="dd/mm/yyyy"
                          onChange={(e) => handleChangeFecha(e, 'fecha_nacimiento')}
                          className="w-100"
                          KeyboardButtonProps={{
                              'aria-label': 'change date',
                          }}
                          error={!!errores.fecha_nacimiento}   
                          helperText={errores.fecha_nacimiento || ''} 
                      />
                  </MuiPickersUtilsProvider> */}
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField label="Nacionalidad" name="nacionalidad" type="text" fullWidth value={form.nacionalidad} error={!!errores.nacionalidad}   helperText={errores.nacionalidad || ''} onChange={handleInputChange} />
                  </Grid>                  
                  <Grid item xs={12} sm={6} md={3}>
                    {/* <TextField label="Teléfono Móvil" name="telefono_movil" type="text" fullWidth value={form.telefono_movil} onChange={handleInputChange} /> */}
                    <InputMask
                        mask="(999) 999-9999"
                        value={form.telefono_movil}
                        onChange={(e) => {
                            const valor = e.target.value.replace(/\D/g, '');
                            setForm((prev) => ({ ...prev, telefono_movil: valor }));

                            if (valor.length === 0) {
                            setErrores((prev) => ({ ...prev, telefono_movil: '' }));
                            } else if (valor.length < 10) {
                            setErrores((prev) => ({ ...prev, telefono_movil: 'Faltan caracteres (10)' }));
                            } else if (valor.length > 10) {
                            setErrores((prev) => ({ ...prev, telefono_movil: 'Demasiados caracteres' }));
                            } else {
                            setErrores((prev) => ({ ...prev, telefono_movil: '' }));
                            }
                        }}
                        >
                        {(inputProps) => (
                            <TextField
                            {...inputProps}
                            label="Teléfono Móvil"
                            name="telefono_movil"
                            fullWidth
                            error={!!errores.telefono_movil}
                            helperText={errores.telefono_movil}
                            />
                        )}
                        </InputMask>


                  </Grid>
                  {/* <Grid item xs={12} sm={6} md={3}>
                     <InputMask
                        mask="(999) 999-9999"
                        value={form.telefono_particular}
                        onChange={(e) => {
                            const valor = e.target.value.replace(/\D/g, '');
                            setForm((prev) => ({ ...prev, telefono_particular: valor }));

                            if (valor.length === 0) {
                            setErrores((prev) => ({ ...prev, telefono_particular: '' }));
                            } else if (valor.length < 10) {
                            setErrores((prev) => ({ ...prev, telefono_particular: 'Faltan caracteres (10)' }));
                            } else if (valor.length > 10) {
                            setErrores((prev) => ({ ...prev, telefono_particular: 'Demasiados caracteres' }));
                            } else {
                            setErrores((prev) => ({ ...prev, telefono_particular: '' }));
                            }
                        }}
                        >
                        {(inputProps) => (
                            <TextField
                            {...inputProps}
                            label="Teléfono Particular"
                            name="telefono_particular"
                            fullWidth
                            error={!!errores.telefono_particular}
                            helperText={errores.telefono_particular}
                            />
                        )}
                        </InputMask>
                  </Grid> */}
                  <Grid item xs={12} sm={6} md={3}>
                    {/* <TextField label="Estado Civil" name="estado_civil" type="text" fullWidth value={form.estado_civil} onChange={handleInputChange} /> */}
                    {opciones.estado_civil.length > 0 && (
                        <>
                        <InputLabel>Estado civil</InputLabel>
                        <div> 
                        <Autocomplete
                            id="estado_civil-autocomplete"
                            options={opciones.estado_civil}
                            getOptionLabel={(option) => option.name || option.label || ''}
                            isOptionEqualToValue={(option, value) => String(option.value) === String(value)}
                            value={
                              opciones.estado_civil.find((item) => String(item.value) === String(form.estado_civil)) || null
                            }
                            onChange={(event, newValue) => {
                              setForm((prevForm) => ({
                                ...prevForm,
                                estado_civil: newValue ? newValue.value : '',
                              }));
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Estado Civil"
                                variant="outlined"
                                error={!!errores.estado_civil}
                                helperText={errores.estado_civil || ''}
                              />
                            )}
                          />

                        </div>

                        </>
                        
                        )}   
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Correo Personal"
                        name="email_personal"
                        type="email"
                        fullWidth
                        value={form.email_personal}
                        onChange={handleInputChange}
                        onBlur={(e) =>
                            setErrores((prev) => ({
                            ...prev,
                            email_personal: validarCorreo(e.target.value) ? '' : 'Correo inválido',
                            }))
                        }
                        error={!!errores.email_personal}
                        helperText={errores.email_personal}
                        />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <TextField label="Domicilio" name="domicilio" type="text" fullWidth value={form.domicilio} error={!!errores.domicilio} helperText={errores.domicilio} onChange={handleInputChange} />
                    
                  </Grid> 

                  <Grid item xs={12}>
                    <Box sx={{ mt: 2, mb: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        Datos de Emergencia
                      </Typography>
                    </Box>
                  </Grid> 
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField label="Contacto de emergencia" name="nombre_emergencia" type="text" fullWidth value={form.nombre_emergencia} error={!!errores.nombre_emergencia} helperText={errores.nombre_emergencia}  onChange={handleInputChange} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                     <InputMask
                        mask="(999) 999-9999"
                        value={form.telefono_emergencia}
                        onChange={(e) => {
                            const valor = e.target.value.replace(/\D/g, '');
                            setForm((prev) => ({ ...prev, telefono_emergencia: valor }));

                            if (valor.length === 0) {
                            setErrores((prev) => ({ ...prev, telefono_emergencia: '' }));
                            } else if (valor.length < 10) {
                            setErrores((prev) => ({ ...prev, telefono_emergencia: 'Faltan caracteres (10)' }));
                            } else if (valor.length > 10) {
                            setErrores((prev) => ({ ...prev, telefono_emergencia: 'Demasiados caracteres' }));
                            } else {
                            setErrores((prev) => ({ ...prev, telefono_emergencia: '' }));
                            }
                        }}
                        >
                        {(inputProps) => (
                            <TextField
                            {...inputProps}
                            label="Teléfono de emergencia"
                            name="telefono_emergencia"
                            fullWidth
                            error={!!errores.telefono_emergencia}
                            helperText={errores.telefono_emergencia}
                            />
                        )}
                        </InputMask>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField label="Contacto de emergencia 2" name="nombre_emergencia2" type="text" fullWidth value={form.nombre_emergencia2} onChange={handleInputChange} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                     <InputMask
                        mask="(999) 999-9999"
                        value={form.telefono_emergencia2}
                        onChange={(e) => {
                            const valor = e.target.value.replace(/\D/g, '');
                            setForm((prev) => ({ ...prev, telefono_emergencia2: valor }));

                            if (valor.length === 0) {
                            setErrores((prev) => ({ ...prev, telefono_emergencia2: '' }));
                            } else if (valor.length < 10) {
                            setErrores((prev) => ({ ...prev, telefono_emergencia2: 'Faltan caracteres (10)' }));
                            } else if (valor.length > 10) {
                            setErrores((prev) => ({ ...prev, telefono_emergencia2: 'Demasiados caracteres' }));
                            } else {
                            setErrores((prev) => ({ ...prev, telefono_emergencia2: '' }));
                            }
                        }}
                        >
                        {(inputProps) => (
                            <TextField
                            {...inputProps}
                            label="Teléfono de emergencia 2"
                            name="telefono_emergencia2"
                            fullWidth
                            error={!!errores.telefono_emergencia2}
                            helperText={errores.telefono_emergencia2}
                            />
                        )}
                        </InputMask>
                  </Grid>
                  
                </Grid>

              </>
            )}

            {/* STEP 2: Empresa */}
            {activeStep === 1 && (
              <>
                <Grid container spacing={3}>          
                   {/* SECCIÓN: Datos de jerarquía */}
                  <Grid item xs={12}>
                    <Box sx={{ mt: 2, mb: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        Datos de la empresa
                      </Typography>
                    </Box>
                  </Grid>     
                  <Grid item xs={12} sm={6} md={3}>
                        {opciones.empresas.length > 0 && (
                            <>
                            <InputLabel>Empresa</InputLabel>
                            <div> 
                            <Autocomplete
                            id="estado_civil-autocomplete"
                            options={opciones.empresas}
                            getOptionLabel={(option) => option.name || option.nombre || ''}
                            isOptionEqualToValue={(option, value) => String(option.value) === String(value)}
                            value={
                              opciones.empresas.find((item) => String(item.value) === String(form.empresa)) || null
                            }
                           onChange={(event, newValue) => {
                              setForm((prevForm) => ({
                                ...prevForm,
                                empresa: newValue ? String(newValue.value) : '',
                              }));
                            }}

                            renderInput={(params) => (
                                <TextField
                                {...params}
                                label="Empresa"
                                variant="outlined"
                                error={!!errores.empresa}
                                helperText={errores.empresa || ''}
                                />
                            )}
                            />
                        </div>
                        </>
                        )}             
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                   {opciones.departamentos.length > 0 && (
                        <>
                          <InputLabel>Departamentos</InputLabel>
                          <Autocomplete
                            multiple
                            id="departamentos-autocomplete"
                            options={opciones.departamentos}
                            getOptionLabel={(option) => option.name || option.nombre || ''}
                            isOptionEqualToValue={(option, value) => String(option.value) === String(value.value)}
                            value={form.departamentos}
                            onChange={(event, newValue) => {
                              setForm((prevForm) => ({
                                ...prevForm,
                                departamentos: newValue,
                              }));
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Departamentos"
                                placeholder="Selecciona uno o más"
                                variant="outlined"
                                error={!!errores.departamentos}
                                helperText={errores.departamentos || ''}
                              />
                            )}
                          />
                        </>
                      )}
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                  {opciones.empresas.length > 0 && (
                        <>
                          <InputLabel>Empresas</InputLabel>
                          <Autocomplete
                            multiple
                            id="empresas-autocomplete"
                            options={opciones.empresas}
                            getOptionLabel={(option) => option.name || option.nombre || ''}
                           isOptionEqualToValue={(option, value) => String(option.value) === String(value.value)}
                            value={form.empresas}
                            onChange={(event, newValue) => {
                              setForm((prevForm) => ({
                                ...prevForm,
                                empresas: newValue,
                              }));
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Empresas"
                                placeholder="Selecciona uno o más"
                                variant="outlined"
                                error={!!errores.empresas}
                                helperText={errores.empresas || ''}
                              />
                            )}
                          />
                        </>
                      )}                 
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">Estatus del empleado</FormLabel>
                        <RadioGroup
                            row
                            aria-label="estatus_empleado"
                            name="estatus_empleado"
                            value={form.estatus_empleado}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                estatus_empleado: e.target.value
                              }))
                            }
                          >
                            <FormControlLabel value="Activo" control={<Radio />} label="Activo" />
                            <FormControlLabel value="Inactivo" control={<Radio />} label="Inactivo" />
                          </RadioGroup>

                      </FormControl>
                    </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                   <FormControl component="fieldset">
                      <FormLabel component="legend">Tipo de empleado</FormLabel>
                      <RadioGroup
                        row
                        name="tipo_empleado"
                        value={form.tipo_empleado}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            tipo_empleado: e.target.value,
                          }))
                        }
                      >
                        <FormControlLabel value="Administrativo" control={<Radio />} label="Administrativo" />
                        <FormControlLabel value="Obra" control={<Radio />} label="Obra" />
                      </RadioGroup>
                    </FormControl>

                  </Grid>
                  {/* <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Número Checador"
                        name="checador"
                        fullWidth
                        value={form.checador}
                        onChange={(e) => {
                            const valor = e.target.value.replace(/\D/g, ''); // solo dígitos

                            setForm((prev) => ({ ...prev, checador: valor }));

                            if (valor.length === 0) {
                            setErrores((prev) => ({ ...prev, checador: 'Campo requerido' }));
                            } else if (valor.length > 2) {
                            setErrores((prev) => ({ ...prev, checador: 'Máximo 2 dígitos' }));
                            } else {
                            setErrores((prev) => ({ ...prev, checador: '' }));
                            }
                        }}
                        error={!!errores.checador}
                        helperText={errores.checador}
                        />


                  </Grid>  */}
                  {/* <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        label="Matrícula"
                        name="matricula"
                        type="text"
                        fullWidth
                        value={form.matricula}
                        onChange={(e) => {
                            const valor = e.target.value;

                            // Elimina cualquier caracter que no sea letra o número
                            const soloAlfanumerico = valor.replace(/[^a-zA-Z0-9]/g, '');

                            setForm((prev) => ({ ...prev, matricula: soloAlfanumerico }));

                            if (soloAlfanumerico.length === 0) {
                            setErrores((prev) => ({ ...prev, matricula: 'Campo requerido' }));
                            } else if (soloAlfanumerico.length < 4) {
                            setErrores((prev) => ({ ...prev, matricula: 'Debe tener al menos 4 caracteres' }));
                            } else {
                            setErrores((prev) => ({ ...prev, matricula: '' }));
                            }
                        }}
                        error={!!errores.matricula}
                        helperText={errores.matricula}
                        />

                  </Grid>                   */}
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Correo empresarial"
                        name="email_empresarial"
                        type="email"
                        fullWidth
                        value={form.email_empresarial}
                        onChange={(e) => {
                            setForm((prev) => ({ ...prev, email_empresarial: e.target.value }));
                        }}
                        onBlur={(e) => {
                            setErrores((prev) => ({
                            ...prev,
                            email_empresarial: validarCorreo(e.target.value) ? '' : 'Correo inválido',
                            }));
                        }}
                        error={!!errores.email_empresarial}
                        helperText={errores.email_empresarial}
                        />

                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ mt: 2, mb: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        Datos de Jerarquía
                      </Typography>
                    </Box>
                  </Grid>  
                  <Grid item xs={12} sm={6} md={3}>
                    {opciones.organigrama.length > 0 && (
                      <>
                        <InputLabel>Organigrama</InputLabel>
                        <Autocomplete
                          id="organigrama-autocomplete"
                          options={opciones.organigrama}
                          getOptionLabel={(option) => option.name || option.nombre || ''}
                          isOptionEqualToValue={(option, value) => option.value === value.value}
                          value={
                            opciones.organigrama.find((item) => item.value === form.organigrama) || null
                          }
                          onChange={(event, newValue) => {
                            setForm((prevForm) => ({
                              ...prevForm,
                              organigrama: newValue ? newValue.value : '',
                            }));
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Organigrama"
                              variant="outlined"
                              error={!!errores.organigrama}
                              helperText={errores.organigrama || ''}
                            />
                          )}
                        />
                      </>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    {opciones.puestos.length > 0 && (
                      <>
                        <InputLabel>Puesto</InputLabel>
                        <Autocomplete
                          id="organigrama-autocomplete"
                          options={opciones.puestos}
                          name="puesto"
                          getOptionLabel={(option) => option.name || option.nombre || ''}
                          isOptionEqualToValue={(option, value) => option.value === value.value}
                          value={
                            opciones.puestos.find(
                              (item) => String(item.value) === String(form.puesto)
                            ) || null
  }
                          onChange={(event, newValue) => {
                            setForm((prevForm) => ({
                              ...prevForm,
                              puesto: newValue ? newValue.value : '',
                            }));
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Puesto"
                              variant="outlined"
                              error={!!errores.puesto}
                              helperText={errores.puesto || ''}
                            />
                          )}
                        />
                      </>
                    )}
                  </Grid>
                  

                  <Grid item xs={12} sm={6} md={3}>
                    {opciones.responsable.length > 0 && (
                      <>
                        <InputLabel>Responsable</InputLabel>
                        <Autocomplete
                          id="organigrama-autocomplete"
                          options={opciones.responsable}
                          getOptionLabel={(option) => option.name || option.nombre || ''}
                          isOptionEqualToValue={(option, value) => option.value === value.value}
                          value={
                            opciones.responsable.find((item) => item.value === form.responsable) || null
                          }
                          onChange={(event, newValue) => {
                            setForm((prevForm) => ({
                              ...prevForm,
                              responsable: newValue ? newValue.value : '',
                            }));
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Responsable"
                              variant="outlined"
                              error={!!errores.responsable}
                              helperText={errores.responsable || ''}
                            />
                          )}
                        />
                      </>
                    )}
                  </Grid>                
                </Grid>
              </>
            )}

            {/* STEP 3: Bancarios */}
            {activeStep === 2 && (
              <>

                <Grid container spacing={3}>          
                   {/* SECCIÓN: Datos de jerarquía */}
                    <Grid item xs={12}>
                      <Box sx={{ mt: 2, mb: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          Datos de Contratacion
                        </Typography>
                      </Box>
                    </Grid>  

                  <Grid item xs={12} sm={6} md={3}>
                  {opciones.bancos.length > 0 && (
                      <>
                        <InputLabel>Banco</InputLabel>
                        <Autocomplete
                          id="organigrama-autocomplete"
                          options={opciones.bancos}
                          getOptionLabel={(option) => option.name || option.nombre || ''}
                          isOptionEqualToValue={(option, value) => option.value === value.value}
                          value={
                            opciones.bancos.find((item) => item.value === form.banco) || null
                          }
                          onChange={(event, newValue) => {
                            setForm((prevForm) => ({
                              ...prevForm,
                              banco: newValue ? newValue.value : '',
                            }));
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Banco"
                              variant="outlined"
                              error={!!errores.banco}
                              helperText={errores.banco || ''}
                            />
                          )}
                        />
                      </>
                    )}
                  </Grid> 
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField label="Cuenta" name="cuenta" type="text" fullWidth value={form.cuenta} error={!!errores.cuenta}   helperText={errores.cuenta || ''} onChange={handleInputChange} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField label="Clabe" name="clabe" type="text" fullWidth value={form.clabe} error={!!errores.clabe}   helperText={errores.clabe || ''} onChange={handleInputChange} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                        <KeyboardDatePicker
                          label="Fecha de Ingreso"
                          format="dd/MM/yyyy"
                          name="fechaInicio"
                          value={form.fechaInicio !== '' ? form.fechaInicio : null}
                          onChange={(e) => handleChangeFecha(e, 'fechaInicio')}

                          fullWidth
                          error={!!errores.fechaInicio}   
                          helperText={errores.fechaInicio || ''} 
                        />
                    </MuiPickersUtilsProvider>
{/* 
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                      <KeyboardDatePicker
                          disableToolbar
                          label="Fecha de Ingreso"
                          format="dd/MM/yyyy"
                          margin="normal"
                          name="fechaInicio"
                          value={form.fechaInicio !== '' ? form.fechaInicio : null}
                          placeholder="dd/mm/yyyy"
                          onChange={(e) => handleChangeFecha(e, 'fechaInicio')}
                          className="w-100"
                          KeyboardButtonProps={{
                              'aria-label': 'change date',
                          }}
                          error={errores.fechaInicio ? true : false}
                      />
                  </MuiPickersUtilsProvider> */}
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>

                     <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                        <KeyboardDatePicker
                          label="Fecha de Baja"
                          format="dd/MM/yyyy"
                          name="fechaFin"
                          value={form.fechaFin !== '' ? form.fechaFin : null}
                          onChange={(e) => handleChangeFecha(e, 'fechaFin')}

                          fullWidth
                          error={!!errores.fechaFin}   
                          helperText={errores.fechaFin || ''} 
                        />
                    </MuiPickersUtilsProvider>

                    {/* <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                      <KeyboardDatePicker
                          disableToolbar
                          label="Fecha de Baja"
                          format="dd/MM/yyyy"
                          margin="normal"
                          name="fechaFin"
                          value={form.fechaFin !== '' ? form.fechaFin : null}
                          placeholder="dd/mm/yyyy"
                          onChange={(e) => handleChangeFecha(e, 'fechaFin')}
                          className="w-100"
                          KeyboardButtonProps={{
                              'aria-label': 'change date',
                          }}
                          error={errores.fechaFin ? true : false}
                      />
                  </MuiPickersUtilsProvider> */}
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>

                     <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                        <KeyboardDatePicker
                          label="Fecha Alta Imss"
                          format="dd/MM/yyyy"
                          name="fecha_alta_imss"
                          value={form.fecha_alta_imss !== '' ? form.fecha_alta_imss : null}
                          onChange={(e) => handleChangeFecha(e, 'fecha_alta_imss')}

                          fullWidth
                          error={!!errores.fecha_alta_imss}   
                          helperText={errores.fecha_alta_imss || ''} 
                        />
                    </MuiPickersUtilsProvider>


                    {/* <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                      <KeyboardDatePicker
                          disableToolbar
                          label="Fecha Alta Imss"
                          format="dd/MM/yyyy"
                          margin="normal"
                          name="fecha_alta_imss"
                          value={form.fecha_alta_imss !== '' ? form.fecha_alta_imss : null}
                          placeholder="dd/mm/yyyy"
                          onChange={(e) => handleChangeFecha(e, 'fecha_alta_imss')}
                          className="w-100"
                          KeyboardButtonProps={{
                              'aria-label': 'change date',
                          }}
                          error={errores.fecha_alta_imss ? true : false}
                      />
                  </MuiPickersUtilsProvider> */}
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>

                     <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                        <KeyboardDatePicker
                          label="Fecha Baja Imss"
                          format="dd/MM/yyyy"
                          name="fecha_baja_imss"
                          value={form.fecha_baja_imss !== '' ? form.fecha_baja_imss : null}
                          onChange={(e) => handleChangeFecha(e, 'fecha_baja_imss')}

                          fullWidth
                          error={!!errores.fecha_baja_imss}   
                          helperText={errores.fecha_baja_imss || ''} 
                        />
                    </MuiPickersUtilsProvider>


                    {/* <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                      <KeyboardDatePicker
                          disableToolbar
                          label="Fecha Baja Imss"
                          format="dd/MM/yyyy"
                          margin="normal"
                          name="fecha_baja_imss"
                          value={form.fecha_baja_imss !== '' ? form.fecha_baja_imss : null}
                          placeholder="dd/mm/yyyy"
                          onChange={(e) => handleChangeFecha(e, 'fecha_baja_imss')}
                          className="w-100"
                          KeyboardButtonProps={{
                              'aria-label': 'change date',
                          }}
                          error={errores.fecha_baja_imss ? true : false}
                      />
                  </MuiPickersUtilsProvider> */}
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <TextField label="Folio Alta Imss" name="numero_alta_imss" type="text" fullWidth value={form.numero_alta_imss} error={!!errores.numero_alta_imss}   helperText={errores.numero_alta_imss || ''} onChange={handleInputChange} />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    {opciones.registro_patronal.length > 0 && (
                        <>
                          <InputLabel>Registro Patronal</InputLabel>
                          <Autocomplete
                            id="organigrama-autocomplete"
                            options={opciones.registro_patronal}
                            getOptionLabel={(option) => option.name || option.nombre || ''}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            value={
                              opciones.registro_patronal.find((item) => item.value === form.id_patronal) || null
                            }
                            onChange={(event, newValue) => {
                              setForm((prevForm) => ({
                                ...prevForm,
                                id_patronal: newValue ? newValue.value : '',
                              }));
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Registro Patronal"
                                variant="outlined"
                                error={!!errores.id_patronal}
                                helperText={errores.id_patronal || ''}
                              />
                            )}
                          />
                        </>
                      )}
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <TextField label="Folio Baja Imss" name="numero_baja_imss" type="text" fullWidth value={form.numero_baja_imss} error={!!errores.numero_baja_imss}   helperText={errores.numero_baja_imss || ''}  onChange={handleInputChange} />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ mt: 2, mb: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        Datos de Contrato
                      </Typography>
                    </Box>
                  </Grid> 

                    <Grid item xs={12} sm={6} md={3}>
                        <TextField   label="Sueldo bruto mensual" name="salario_bruto" type="number" fullWidth value={form.salario_bruto} error={!!errores.salario_bruto}   helperText={errores.salario_bruto || ''} onChange={handleInputChange}
                          InputProps={{  startAdornment: <span style={{ marginRight: 8 }}>$</span>, inputProps: { min: 0, step: 0.01 },  }}  />
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <TextField   label="Sueldo Completo" name="total" type="number" fullWidth value={form.total}  error={!!errores.total}   helperText={errores.total || ''}  onChange={handleInputChange}
                          InputProps={{  startAdornment: <span style={{ marginRight: 8 }}>$</span>, inputProps: { min: 0, step: 0.01 },  }}  />
                      </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ mt: 2, mb: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        Datos de Nomina
                      </Typography>
                    </Box>
                  </Grid> 

                  <Grid item xs={12} sm={6} md={3}>
                    <TextField   label="Sueldo Bruto Mensual" name="salario_bruto" type="number" fullWidth value={form.salario_bruto}  error={!!errores.salario_bruto}   helperText={errores.salario_bruto || ''}  onChange={handleInputChange}
                      InputProps={{  startAdornment: <span style={{ marginRight: 8 }}>$</span>, inputProps: { min: 0, step: 0.01 },  }}  />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField   label="Nomina Imss Quincenal" name="nomina_imss" type="number" fullWidth value={form.nomina_imss}  error={!!errores.nomina_imss}   helperText={errores.nomina_imss || ''}  onChange={handleInputChange}
                      InputProps={{  startAdornment: <span style={{ marginRight: 8 }}>$</span>, inputProps: { min: 0, step: 0.01 },  }}  />
                  </Grid>
                   <Grid item xs={12} sm={6} md={3}>
                    <TextField   label="Extra Nomina Imss" name="extraImss" type="number" fullWidth value={form.extraImss}  error={!!errores.extraImss}   helperText={errores.extraImss || ''}  onChange={handleInputChange}
                      InputProps={{  startAdornment: <span style={{ marginRight: 8 }}>$</span>, inputProps: { min: 0, step: 0.01 },  }}  />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField   label="Efectivo Quincenal" name="efectivo" type="number" fullWidth value={form.efectivo}  error={!!errores.efectivo}   helperText={errores.efectivo || ''}  onChange={handleInputChange}
                      InputProps={{  startAdornment: <span style={{ marginRight: 8 }}>$</span>, inputProps: { min: 0, step: 0.01 },  }}  />
                  </Grid>
                   <Grid item xs={12} sm={6} md={3}>
                    <TextField   label="Extra Efectivo" name="extraEfectivo" type="number" fullWidth value={form.extraEfectivo}  error={!!errores.extraEfectivo}   helperText={errores.extraEfectivo || ''}  onChange={handleInputChange}
                      InputProps={{  startAdornment: <span style={{ marginRight: 8 }}>$</span>, inputProps: { min: 0, step: 0.01 },  }}  />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField   label="Comision Efectiva" name="comision" type="number" fullWidth value={form.comision}  error={!!errores.comision}   helperText={errores.comision || ''}  onChange={handleInputChange}
                      InputProps={{  startAdornment: <span style={{ marginRight: 8 }}>$</span>, inputProps: { min: 0, step: 0.01 },  }}  />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ mt: 2, mb: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        Prestaciones
                      </Typography>
                    </Box>
                  </Grid> 

                  <Grid item xs={12} sm={6} md={3}>
                    <TextField   label="Isn" name="isn" type="number" fullWidth value={form.isn}  error={!!errores.isn}   helperText={errores.isn || ''}   onChange={handleInputChange}
                      InputProps={{  startAdornment: <span style={{ marginRight: 8 }}>$</span>, inputProps: { min: 0, step: 0.01 },  }}  />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField   label="Isr" name="isr" type="number" fullWidth value={form.isr}  error={!!errores.isr}   helperText={errores.isr || ''}   onChange={handleInputChange}
                      InputProps={{  startAdornment: <span style={{ marginRight: 8 }}>$</span>, inputProps: { min: 0, step: 0.01 },  }}  />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField   label="Infonavit / rcv" name="infonavit" type="number" fullWidth value={form.infonavit} error={!!errores.infonavit}   helperText={errores.infonavit || ''}   onChange={handleInputChange}
                      InputProps={{  startAdornment: <span style={{ marginRight: 8 }}>$</span>, inputProps: { min: 0, step: 0.01 },  }}  />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField   label="Imss" name="imss" type="number" fullWidth value={form.imss} error={!!errores.imss}   helperText={errores.imss || ''}   onChange={handleInputChange}
                      InputProps={{  startAdornment: <span style={{ marginRight: 8 }}>$</span>, inputProps: { min: 0, step: 0.01 },  }}  />
                  </Grid>
                  {/* <Grid item xs={12} sm={6} md={3}>
                    <TextField   label="Rcv" name="rcv" type="number" fullWidth value={form.rcv} error={!!errores.rcv}   helperText={errores.rcv || ''}   onChange={handleInputChange}
                      InputProps={{  startAdornment: <span style={{ marginRight: 8 }}>$</span>, inputProps: { min: 0, step: 0.01 },  }}  />
                  </Grid> */}
                
                  </Grid> 
               
              </>
            )}

          {activeStep === 3 && esEdicion &&  (
            <>
              {/* Vacunación */}
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6">Vacunación</Typography>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Tipo de vacuna"
                    value={nuevaVacuna.tipo}
                    onChange={(e) =>
                      setNuevaVacuna((prev) => ({ ...prev, tipo: e.target.value }))
                    }
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <InputLabel>Dosis</InputLabel>
                  <Autocomplete
                    id="dosis-autocomplete"
                    options={[
                      { label: 'Primera', value: '1' },
                      { label: 'Segunda', value: '2' },
                      { label: 'Tercera', value: '3' },
                      { label: 'Refuerzo', value: 'refuerzo' },
                    ]}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value}
                    value={
                      [
                        { label: 'Primera', value: '1' },
                        { label: 'Segunda', value: '2' },
                        { label: 'Tercera', value: '3' },
                        { label: 'Refuerzo', value: 'refuerzo' },
                      ].find((opt) => opt.value === nuevaVacuna.numero_dosis) || null
                    }
                    onChange={(event, newValue) => {
                      setNuevaVacuna((prev) => ({
                        ...prev,
                        numero_dosis: newValue ? newValue.value : '',
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Dosis" variant="outlined" />
                    )}
                  />
                </Grid>
                  <Grid item xs={12} sm={2}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                    <KeyboardDatePicker
                      label="Fecha de aplicación"
                      format="dd/MM/yyyy"
                      value={nuevaVacuna.fecha}
                      onChange={(date) =>
                        setNuevaVacuna((prev) => ({ ...prev, fecha: date }))
                      }
                      fullWidth
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
               
                <Grid item xs={12} sm={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={agregarVacuna}
                    fullWidth
                  >
                    {indiceVacunaEditando !== null ? 'Guardar cambios' : 'Agregar'}
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Box mt={2}>
                    {form.vacunas.length === 0 ? (
                      <Typography>No hay vacunas registradas.</Typography>
                    ) : (
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Tipo</th>
                            <th>Dosis</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {form.vacunas.map((vac, i) => (
                            <tr key={i}>
                              <td>{vac.tipo}</td>
                              <td>{vac.numero_dosis}</td>
                              <td>
                                {vac.fecha
                                  ? moment(vac.fecha).format('DD/MM/YYYY')
                                  : ''}
                              </td>
                              <td>
                                <Button color="error" onClick={() => eliminarVacuna(i)}>
                                  Eliminar
                                </Button>
                                <Button
                                  color="primary"
                                  onClick={() => {
                                    setNuevaVacuna(form.vacunas[i]);
                                    setIndiceVacunaEditando(i); // IMPORTANTE
                                  }}
                                >
                                  Editar
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </Box>
                </Grid>
              </Grid>

              {/* Incrementos salariales */}
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6">Incrementos salariales</Typography>
                </Grid>
                  <Grid item xs={12} sm={2}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                    <KeyboardDatePicker
                      label="Fecha de incremento"
                      format="dd/MM/yyyy"
                      value={nuevoIncremento.fecha}
                      onChange={(date) =>
                        setNuevoIncremento((prev) => ({ ...prev, fecha: date }))
                      }
                      fullWidth
                    />
                  </MuiPickersUtilsProvider>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Monto inicial"
                    type="number"
                    value={form.total}
                    onChange={(e) =>
                      setNuevoIncremento((prev) => ({
                        ...prev,
                        monto_inicial: e.target.value,
                      }))
                    }
                    fullWidth
                    disabled
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Monto Sueldo con incremento"
                    type="number"
                    value={nuevoIncremento.monto_incremento}
                    onChange={(e) =>
                      setNuevoIncremento((prev) => ({
                        ...prev,
                        monto_incremento: e.target.value,
                      }))
                    }
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <Button variant="contained" color="primary" onClick={agregarIncremento} fullWidth>
                    Agregar incremento
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Box mt={2}>
                    {form.incrementos.length === 0 ? (
                      <Typography>No hay incrementos registrados.</Typography>
                    ) : (
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Fecha</th>
                            <th>Monto Inicial</th>
                            <th>Incremento</th>
                            <th># Incremento</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {form.incrementos.map((inc, i) => (
                            <tr key={i}>
                              <td>
                                {inc.fecha
                                  ? moment(inc.fecha).format('DD/MM/YYYY')
                                  : ''}
                              </td>
                              <td>${parseFloat(inc.monto_inicial).toFixed(2)}</td>
                              <td>${parseFloat(inc.monto_incremento).toFixed(2)}</td>
                              <td>{inc.numero_incremento}</td>
                              <td>
                                <Button
                                  color="error"
                                  onClick={() => eliminarIncremento(i)}
                                >
                                  Eliminar
                                </Button>
                                <Button
                                    color="primary"
                                    onClick={() => {
                                      setNuevoIncremento(form.incrementos[i]);
                                      setIndiceIncrementoEditando(i); // ⚠️ importante para saber que es edición
                                    }}
                                  >
                                    Editar
                                  </Button>

                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </Box>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6">Estudios</Typography>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Carrera"
                    value={nuevoEstudio.carrera}
                    onChange={(e) =>
                      setNuevoEstudio((prev) => ({ ...prev, carrera: e.target.value }))
                    }
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Institución"
                    value={nuevoEstudio.institucion}
                    onChange={(e) =>
                      setNuevoEstudio((prev) => ({ ...prev, institucion: e.target.value }))
                    }
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <TextField
                    label="Cédula profesional"
                    value={nuevoEstudio.cedula}
                    onChange={(e) =>
                      setNuevoEstudio((prev) => ({ ...prev, cedula: e.target.value }))
                    }
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                    <KeyboardDatePicker
                      label="Fecha de titulación"
                      format="dd/MM/yyyy"
                      value={nuevoEstudio.fecha_titulacion}
                      onChange={(date) =>
                        setNuevoEstudio((prev) => ({ ...prev, fecha_titulacion: date }))
                      }
                      fullWidth
                    />
                  </MuiPickersUtilsProvider>
                </Grid>

                <Grid item xs={12} sm={2}>
                  <Button variant="contained" color="primary" onClick={agregarEstudio} fullWidth>
                    Agregar estudio
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Box mt={2}>
                    {form.estudios.length === 0 ? (
                      <Typography>No hay estudios registrados.</Typography>
                    ) : (
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Carrera</th>
                            <th>Institución</th>
                            <th>Cédula</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {form.estudios.map((est, i) => (
                            <tr key={i}>
                              <td>{est.carrera}</td>
                              <td>{est.institucion}</td>
                              <td>{est.cedula}</td>
                              <td>
                                {est.fecha_titulacion
                                  ? moment(est.fecha_titulacion).format('DD/MM/YYYY')
                                  : ''}
                              </td>
                              <td>
                                <Button color="error" onClick={() => eliminarEstudio(i)}>
                                  Eliminar
                                </Button>
                                <Button
                                  color="primary"
                                  onClick={() => {
                                    setNuevoEstudio(form.estudios[i]);
                                    setIndiceEstudioEditando(i); // habilita edición
                                  }}
                                >
                                  Editar
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </Box>
                </Grid>
              </Grid>

            </>
          )}





          </DialogContent>

          <DialogActions sx={{ justifyContent: 'space-between' }}>
            <Button onClick={handleBack} variant="contained" disabled={activeStep === 0} startIcon={<KeyboardArrowLeft />}>
              Atrás
            </Button>
            <Button onClick={handleNext} variant="contained" endIcon={<KeyboardArrowRight />}>
              {activeStep === steps.length - 1 ? 'Guardar' : 'Siguiente'}
            </Button>
          </DialogActions>

    
          </>
  );
};

