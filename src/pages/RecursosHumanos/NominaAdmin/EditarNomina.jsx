import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Box, Card, CardContent, CardHeader, Grid, Typography, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Select, MenuItem,  InputAdornment, IconButton, InputLabel,
  Dialog, DialogActions, DialogContent, DialogTitle, Container,
  FormControl, Input, FormHelperText, Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale';
import TextField from '@material-ui/core/TextField';

import { setOptions, setMoneyTableForNominas } from '../../../functions/setters';
import { errorAlert, waitAlert, printResponseErrorAlert, doneAlert, validateAlert2, validateAlert } from '../../../functions/alert';
import { NOMINA_ADMIN_COLUMNS, URL_DEV, ADJUNTOS_COLUMNS } from '../../../constants';
import { setSingleHeader } from '../../../functions/routers';
import Button from '@material-ui/core/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { apiPutForm, apiPostForm, apiGet } from './../../../functions/api';
import { parse } from 'date-fns';
import { format } from 'date-fns';



// Componente principal
export default function CrearNomina(props) {
   const { opcionesData, handleClose, reload, data } = props

  const [options, setOptionsState] = useState({ usuarios: [], empresas: [], cuentas: [] });
  const [form, setForm] = useState({
    periodo: '',
    empresa: '',
    fechaInicio: new Date(),
    fechaFin: new Date(),
    timbrado: new Date(),
    cuentanominaimss: '',
    cuentaextraimss: '',
    cuentaefectivo: '',
    cuentaextraefectivo: '',
    cuentaisr: '',
    cuentainfonavit: '',
    cuentaimss: '',
    cuentacomision: '',
    // cuentarcv: '',
    cuentaisn: '',
    editar:'',
    presupuesto: '',
    nomina_id:'',
    nombre:'',
    tipo:'',
    nominasAdmin: [{
      nominImss: '',
      nomina: '',
      efectivo: '',
      extraEfectivo:'',
      comision:'',
      isr: '',
      infonavit: '',
      imss: '',
      rcv: '',
      extraImss: '',
      restanteNomina: '',
      extras: ''
    }],
    adjuntos: { adjunto: { value: '', placeholder: 'Ingresa los adjuntos', files: [] } },
    backupNominasAdmin: [], // ← NUEVO
  });

  const [valoresPresuEmpresaSeleccionada, setValoresPresuEmpresaSeleccionada] = useState([]);
  const [errores, setErrores] = useState({});
  const authUser = useSelector(state => state.authUser);
  const [periodicidadSeleccionada, setPeriodicidadSeleccionada] = useState('');


  const [cuentasActivas, setCuentasActivas] = useState({
    nomina: true,
    extraImss: true,
    efectivo: true,
    extraEfectivo: true,
    comision: true,
    isr: true,
    infonavit: true,
    imss: true,
    rcv: true,
    isn: true,
  });


  // Obtener opciones iniciales
  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const response = await axios.get(`${URL_DEV}v2/rh/nomina-administrativa/${data.id}`, {
        responseType: 'json',
        headers: setSingleHeader(authUser.access_token)
      });
  
      Swal.close();
  
      const { empresas, cuentas, usuarios, nomina, empleadosConPeriodos } = response.data;
      // console.log(response.data)
  
      const usuariosFormateados = usuarios.map(usuario => ({
        ...usuario,
        nombre: `${usuario.nombre} ${usuario.apellido_paterno ?? ''} ${usuario.apellido_materno ?? ''}`.trim()
      }));
  
      setOptionsState({
        empresas: setOptions(empresas, 'name', 'id'),
        cuentas: setOptions(cuentas, 'nombre', 'id'),
        usuarios: setOptions(usuariosFormateados, 'nombre', 'id')
      });
      // console.log(nomina.nominas_administrativas)
      // console.log(nomina)
      // Mapeo para nominasAdmin desde API (modo edición)
      const nominasAdmin = nomina.nominas_administrativas.map(item => ({
        usuario: item.empleado?.id?.toString() || '',
      
        nomina: item.nomina_imss || 0.0,
        extraImss: item.extra_imss || 0.0,
        efectivo: item.efectivo || 0.0,
        extraEfectivo: item.extraEfectivo || 0.0,
        comision: item.comision || 0.0,
        isr: item.isr || 0.0,
        isn: item.isn || 0.0,
        infonavit: item.infonavit || 0.0,
        imss: item.imss || 0.0,
        rcv: item.rcv || 0.0,
        restanteNomina: item.efectivo || 0.0,
        extras: 0.0,
      
        // Asignamos las empleadosConPeriodos desde el objeto empleadosConPeriodos global
        periodicidad_nomina: item.nomina_imss_periodicidad || 'quincenal',
        periodicidad_extraImss: item.extraImss_periodicidad || 'quincenal',        
        periodicidad_efectivo: item.nomina_extras_periodicidad || 'quincenal',
        periodicidad_extraEfectivo: item.extraEfectivo_periodicidad || 'quincenal',
        periodicidad_comision: item.comision_periodicidad || 'quincenal',
        periodicidad_isr: item.isr_periodicidad || 'quincenal',
        periodicidad_infonavit: item.infonavit_periodicidad || 'quincenal',
        periodicidad_imss: item.imss_periodicidad || 'quincenal',
        periodicidad_rcv: item.rcv_periodicidad || 'quincenal',
        periodicidad_isn: item.isn_periodicidad || 'quincenal',

      }));

      // 1. Cargar presupuestos de la empresa inicial (si existe)
      const empresaInicial = empresas.find(e => e.id === nomina?.empresa?.id);
      if (empresaInicial) {
        const presupuestos = empresaInicial.presu || [];
        const valores = presupuestos.map(p => ({
          label: p.nombre,
          value: p.id,
          name: p.nombre,
        }));
        setValoresPresuEmpresaSeleccionada(valores);
      }
        // console.log(nomina)
  
      setForm(prev => ({
        ...prev,
        empresa: nomina?.empresa?.id,
        presupuesto: nomina.presupuesto_id,
        periodo: nomina.periodo,
        año: nomina.año,
        fechaInicio: parse(nomina.fecha_inicio, 'yyyy-MM-dd HH:mm:ss', new Date()),
        fechaFin: parse(nomina.fecha_fin, 'yyyy-MM-dd HH:mm:ss', new Date()),
        timbrado:  new Date(nomina.fecha_nomina),
        editar: nomina.egreso,
        nombre: nomina.nombre,
        cuentanominaimss: nomina.cuentanominaimss,
        cuentaefectivo: nomina.cuentaefectivo,
        cuentaisr: nomina.cuentaisr,
        cuentainfonavit: nomina.cuentainfonavit,
        cuentaimss: nomina.cuentaimss,
        // cuentarcv: nomina.cuentarcv,
        cuentaisn: nomina.cuentaisn,
        nominasAdmin,
        nomina_id:nomina.id,
        backupNominasAdmin: JSON.parse(JSON.stringify(nominasAdmin))
      }));
  
    } catch (error) {
      Swal.close();
      console.error('Error al consultar la nómina:', error);
      errorAlert('Error al consultar', 'No se pudo cargar la nómina para edición');
    }
  };
  
  const handleChangeFecha = (date, tipo) => {
        setForm({
            ...form,
            [tipo]: new Date(date)
        })
    };

  // Handlers
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeNominasAdmin = (key, e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const nominas = [...prev.nominasAdmin];
      nominas[key][name] = value;
      return { ...prev, nominasAdmin: nominas };
    });
  };

    const onChangeAdjunto = (files, tipo) => {
      if (!Array.isArray(files)) return;
  
      setForm(prevForm => {
        const nuevosArchivos = [...(prevForm.adjuntos[tipo]?.files || []), ...files];
  
        return {
          ...prevForm,
          adjuntos: {
            ...prevForm.adjuntos,
            [tipo]: {
              files: nuevosArchivos,
              value: nuevosArchivos.map(f => f.name).join(', '),
              placeholder: 'Archivos seleccionados',
            }
          }
        };
      });
  
      Swal.fire({
        icon: 'success',
        title: 'Archivos agregados',
        text: `Se agregaron ${files.length} archivo(s) correctamente.`,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
    };

  

  const clearFiles = (tipo) => {
    setForm(prevForm => ({
      ...prevForm,
      adjuntos: {
        ...prevForm.adjuntos,
        [tipo]: { files: [], value: '' }
      }
    }));
  };

  // Funciones para actualizar valores
  const updateEmpresa = (value) => {
    const empresaSeleccionada = options.empresas.find(empresa => empresa.value === value);
    
    if (empresaSeleccionada) {
      const presupuestos = empresaSeleccionada.data.presu || [];
      const valores = presupuestos.map(item => ({
        label: item.nombre,
        value: item.id,
        name: item.nombre,
      }));

      setValoresPresuEmpresaSeleccionada(valores);
      handleChange({ target: { value: '', name: 'presupuesto' } });
    } else {
      setValoresPresuEmpresaSeleccionada([]);
    }
    handleChange({ target: { value, name: 'empresa' } });
  };

  const updateUsuario = (value, key) => {
    const usuarioSeleccionado = options.usuarios.find(u => u.value.toString() === value.toString());
    if (!usuarioSeleccionado) return;

    const data = usuarioSeleccionado.data;
    const updatedNomina = {
      usuario: value,
      nomina: data?.nomina_imss || 0,
      extraImss: data?.extraImss || 0,
      efectivo: data?.efectivo || 0,
      extraEfectivo: data?.extraEfectivo || 0,
      comision: data?.comision || 0,
      isr: data?.isn || 0,
      infonavit: data?.infonavit || 0,
      imss: data?.imss || 0,
      rcv: data?.rcv || 0

    };

    setForm(prev => {
      const updatedNominas = [...prev.nominasAdmin];
      updatedNominas[key] = {
        ...updatedNominas[key],
        ...updatedNomina
      };
      return { ...prev, nominasAdmin: updatedNominas };
    });
  };

  // Funciones para manipular filas
  const addRowNominaAdmin = () => {
    setForm(prev => ({
      ...prev,
      nominasAdmin: [...prev.nominasAdmin, {
        usuario: '',
        nominImss: '',
        extraImss:'',
        efectivo: '',
        extraEfectivo: '',
        comision:'',
        restanteNomina: '',
        extras: '',
        nomina: '',
        isr: '',
        infonavit: '',
        imss: '',
        rcv: '',
        periodicidad:'',
      }]
    }));
  };

  const deleteRowNominaAdmin = (key) => {
    setForm(prev => ({
      ...prev,
      nominasAdmin: prev.nominasAdmin.filter((_, i) => i !== key)
    }));
  };

  // Funciones para cálculos
  const getTotal = (key) => {
    const n = form.nominasAdmin[key];
    return ['nomina', 'extraImss','efectivo','extraefectivo','comision','isr','infonavit' ,'imss', 'isn']
      .reduce((acc, k) => acc + parseFloat(n[k] || 0), 0);
  };

  const getTotalByKey = (key, periodicidadKey) =>
    form.nominasAdmin
      .filter(n => n[periodicidadKey] === form.periodo)
      .reduce((sum, el) => sum + parseFloat(el[key] || 0), 0);
  
  
    const getTotales = () => {
      const keys = [
        { campo: 'nomina', periodicidad: 'periodicidad_nomina' },
        { campo: 'extraImss', periodicidad: 'periodicidad_extraImss' },
        { campo: 'efectivo', periodicidad: 'periodicidad_efectivo' },
        { campo: 'extraEfectivo', periodicidad: 'periodicidad_extraEfectivo' },
        { campo: 'comision', periodicidad: 'periodicidad_comision' },
        { campo: 'isr', periodicidad: 'periodicidad_isr' },
        { campo: 'infonavit', periodicidad: 'periodicidad_infonavit' },
        { campo: 'imss', periodicidad: 'periodicidad_imss' },
        { campo: 'isn', periodicidad: 'periodicidad_isn' },
      ];

      return keys.reduce((acc, k) => {
        return acc + getTotalByKey(k.campo, k.periodicidad);
      }, 0);
    };

  // Funciones para opciones
  const getUsuariosDisponibles = (keyActual = null) => {
    const idsSeleccionados = form.nominasAdmin
      .filter((_, idx) => idx !== keyActual)
      .map(n => n.usuario);
    
    return options.usuarios.filter(u => !idsSeleccionados.includes(u.value.toString()));
  };

  const getQuincena = () => [
    { name: 'Quincena', value: 'quincenal' },
    { name: 'Mensual', value: 'mensual' },
    { name: 'Bimestre', value: 'bimestral' },
    { name: 'Semestre', value: 'semestral' },
    { name: 'Anual', value: 'anual' }
  ];

  const getAños = () => {
    const año = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => ({ name: año - i, value: año - i }));
  };

    const { getRootProps, getInputProps } = useDropzone({
        multiple: true,
        accept: "image/*,application/pdf",
        onDrop: (acceptedFiles) => {
           if (acceptedFiles.length > 0) {
               onChangeAdjunto(acceptedFiles, "adjunto");
            }
        },
        });
        

      const cancel = () => {
        console.log('Cancelado por el usuario');
        // ... lo que sea que quieras hacer
      };
        
    const getTotalNominaImss = (key) => {
        var suma = 0
        form.nominasAdmin.forEach(element => {
            let aux = element[key] === undefined ? 0 : element[key]
            suma = suma + parseFloat(aux)
        })
        return suma
    }

    const getTotalextraImss= (key) => {
        var suma = 0
        // console.log(key)
        form.nominasAdmin.forEach(element => {
            let aux = element[key] === undefined ? 0 : element[key]
            suma = suma + parseFloat(aux)
        })
        return suma
    }
      const getTotalefectivo= (key) => {
        var suma = 0
        // console.log(key)
        form.nominasAdmin.forEach(element => {
            let aux = element[key] === undefined ? 0 : element[key]
            suma = suma + parseFloat(aux)
        })
        return suma
    }
      const getTotalextraEfectivo= (key) => {
        var suma = 0
        // console.log(key)
        form.nominasAdmin.forEach(element => {
            let aux = element[key] === undefined ? 0 : element[key]
            suma = suma + parseFloat(aux)
        })
        return suma
    }
    
      const getTotalcomision= (key) => {
        var suma = 0
        // console.log(key)
        form.nominasAdmin.forEach(element => {
            let aux = element[key] === undefined ? 0 : element[key]
            suma = suma + parseFloat(aux)
        })
        return suma
    }
    
    const getTotalExtra= (key) => {
        var suma = 0
        form.nominasAdmin.forEach(element => {
            let aux = element[key] === undefined ? 0 : element[key]
            suma = suma + parseFloat(aux)
        })
        return suma
    }

    const getTotalRestanteNomina= (key) => {
        var suma = 0
        form.nominasAdmin.forEach(element => {
            let aux = element[key] === undefined ? 0 : element[key]
            suma = suma + parseFloat(aux)
        })
        return suma
    }

    const updateQuincena = (nuevaPeriodicidad) => {
      setForm(prev => {
        const nuevaNomina = prev.backupNominasAdmin.map(n => ({
          ...n,
          nomina: convertirMonto(n.nomina, n.periodicidad_nomina, nuevaPeriodicidad),
          extraImss: convertirMonto(n.extraImss, n.periodicidad_extraImss, nuevaPeriodicidad),
          efectivo: convertirMonto(n.efectivo, n.periodicidad_efectivo, nuevaPeriodicidad),
          extraEfectivo: convertirMonto(n.extraEfectivo, n.periodicidad_extraEfectivo, nuevaPeriodicidad),
          comision: convertirMonto(n.comision, n.periodicidad_comision, nuevaPeriodicidad),
          isr: convertirMonto(n.isr, n.periodicidad_isr, nuevaPeriodicidad),
          infonavit: convertirMonto(n.infonavit, n.periodicidad_infonavit, nuevaPeriodicidad),
          imss: convertirMonto(n.imss, n.periodicidad_imss, nuevaPeriodicidad),
          rcv: convertirMonto(n.rcv, n.periodicidad_rcv, nuevaPeriodicidad),
          isn: convertirMonto(n.isn, n.periodicidad_isn, nuevaPeriodicidad),
          restanteNomina: 0,
          extras: 0,
        }));
    
        return {
          ...prev,
          periodo: nuevaPeriodicidad,
          nominasAdmin: nuevaNomina
        };
      });
    };
    
    
    
    

      const updateAño = (value) => {
        setForm(prev => ({
          ...prev,
          año: value
        }));
      };

      const updateTipo = (value) => {
        setForm(prev => ({
          ...prev,
          presupuesto: value
        }));
      };

    //  const handleChangeFecha = (date, tipo) => {
    //     if (!date || isNaN(date)) return;
    //     const formatted = format(date, 'yyyy-MM-dd');
    //     setForm(prev => ({ ...prev, [tipo]: formatted }));
    //     setErrores(prev => ({ ...prev, [tipo]: false }));
    //   };



      const onChangeNominasAdmin = (key, e, campo) => {
        const { value } = e.target;
      
        setForm(prev => {
          const nominas = [...prev.nominasAdmin];
          nominas[key][campo] = value;
          return {
            ...prev,
            nominasAdmin: nominas
          };
        });
      };

      const updateCuenta = (value, name) => {
        setForm(prev => ({
          ...prev,
          [name]: value
        }));
      };

      const limpiarCuenta = (campo) => {
        setForm(prev => {
          const nominas = prev.nominasAdmin.map(n => ({
            ...n,
            [campo]: 0
          }));
          return { ...prev, nominasAdmin: nominas };
        });
      
        setCuentasActivas(prev => ({ ...prev, [campo]: false }));
      };
      
      const restaurarCuenta = (campo) => {
        setForm(prev => {
          const nominas = prev.backupNominasAdmin.map(n => ({
            ...prev.nominasAdmin.find(o => o.usuario === n.usuario),
            [campo]: n[campo]
          }));
          return { ...prev, nominasAdmin: nominas };
        });
      
        setCuentasActivas(prev => ({ ...prev, [campo]: true }));
      };
      
      const columnaEnCero = (campo) => {
        return form.nominasAdmin.every(n => parseFloat(n[campo] || 0) === 0);
      };


      const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = `${d.getMonth() + 1}`.padStart(2, '0');
        const day = `${d.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`; // Resultado: "2025-03-28"
      };


      const addNominaAdminAxios = async (tipo) => {
        waitAlert();
        const { access_token } = authUser;
        const data = new FormData();
    
        const keys = Object.keys(form);
        keys.forEach((key) => {
          if (key === 'nominasAdmin') {
            data.append(key, JSON.stringify(form[key]));
          } else if (key === 'timbrado' || key === 'fechaInicio' || key === 'fechaFin') {
            // 👇 Formatear las fechas
            data.append(key, formatDate(form[key]));
          } else if (key !== 'adjuntos') {
            data.append(key, form[key]);
          }
        });
      
    
         Object.keys(form.adjuntos).forEach((key) => {
          const adjunto = form.adjuntos[key];
          if (adjunto.value !== '') {
            adjunto.files.forEach((file) => {
              data.append(`files_name_${key}[]`, file.name);
              data.append(`files_${key}[]`, file);
            });
            data.append('adjuntos[]', key);
          }
        });
    
        data.append('tipo', tipo); // ✅ aquí agregas bien el tipo
    
        // console.log([...data]); // Esto sirve para revisar el FormData
        // form.tipo =tipo

        apiPostForm(`v2/rh/nomina-administrativa/${form.nomina_id}`, data, access_token) // ✅ aquí mandas el FormData
          .then((response) => {
           Swal.fire({
              icon: 'success',
              title: 'Nómina guardada correctamente',
              html: `<p style="margin-top: 5px; font-size: 14px; color: #444;">
                ${response.data.message ?? 'Todos los datos se registraron sin errores.'}
              </p>`,
              confirmButtonColor: '#28a745',
              confirmButtonText: 'Entendido',
              width: 450,
            });

            handleClose(true);
          })
          .catch((error) => {
            console.error('❌ Error en la subida de archivos:', error);
          });
    };
    

      const periodicityFactors = {
        quincenal: 1,
        mensual: 2,
        bimestral: 4,
        semestral: 12,
        anual: 24,
      };
      
      const convertirMonto = (monto, from, to) => {
        if (!monto || isNaN(monto)) return 0;
        const base = periodicityFactors[from];
        const target = periodicityFactors[to];
        return parseFloat(((monto / base) * target).toFixed(2));
      };
      
      

      
      
      
      
      
      

    

  // Submit handler
  const handleSubmit = (e, tipo, enviar) => {
    e.preventDefault();
  
    const errores = {};
  
    if (!form.empresa) errores.empresa = 'Seleccione una empresa';
    if (!form.periodo) errores.periodo = 'Seleccione un periodo';
    // if (!form.año) errores.año = 'Seleccione un año';
    // if (!form.fecha) errores.fecha = 'Ingrese una fecha válida';
    if (tipo == 'enviar') {
      // Solo pedir cuenta si el total de esa columna es mayor a 0
    
      if (getTotalNominaImss('nomina') !== 0 && !form.cuentanominaimss) {
        errores.cuentanominaimss = 'Ingrese una cuenta nómina válida';
      }
    
      if (getTotalextraImss('efectivo') !== 0 && !form.cuentaefectivo) {
        errores.cuentaefectivo = 'Ingrese una cuenta efectivo válida';
      }
    
      if (getTotalRestanteNomina('isr') !== 0 && !form.cuentaisr) {
        errores.cuentaisr = 'Ingrese una cuenta ISR válida';
      }
    
      if (getTotalExtra('infonavit') !== 0 && !form.cuentainfonavit) {
        errores.cuentainfonavit = 'Ingrese una cuenta INFONAVIT válida';
      }
    
      if (getTotalExtra('imss') !== 0 && !form.cuentaimss) {
        errores.cuentaimss = 'Ingrese una cuenta IMSS válida';
      }
    
      // if (getTotalExtra('rcv') !== 0 && !form.cuentarcv) {
      //   errores.cuentarcv = 'Ingrese una cuenta RCV válida';
      // }
    
      if (getTotalExtra('isn') !== 0 && !form.cuentaisn) {
        errores.cuentaisn = 'Ingrese una cuenta ISN válida';
      }
    }
    
  console.log(errores)
    setErrores(errores);
   
  
    if (Object.keys(errores).length > 0) {
      errorAlert('Error', 'Por favor complete todos los campos obligatorios', errores);
      return;
    }
   if( form.editar == 1){
      Swal.fire({
        icon: 'success',
        title: 'Nomina no se puede editar ya se genero el gasto',
        text: `Nomina ya generada.`,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });

    }else{
    validateAlert2(() => {
          addNominaAdminAxios(tipo);
        }, e, 'form-nominaadmin', tipo, enviar);
    }
   
  };
  
  const clearSingleFile = (tipo, index) => {
    setForm(prevForm => {
      const updatedFiles = prevForm.adjuntos[tipo].files.filter((_, i) => i !== index);
      return {
        ...prevForm,
        adjuntos: {
          ...prevForm.adjuntos,
          [tipo]: {
            ...prevForm.adjuntos[tipo],
            files: updatedFiles,
            value: updatedFiles.map(f => f.name).join(', ')
          }
        }
      };
    });
  };


// console.log(cuentasActivas)
// console.log(form)
// console.log(options)

  return (
    <form id="form-nominaadmin" onSubmit={(e) => handleSubmit(e, "guardar", false)}>

    <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <Container maxWidth="xl">
        {/* <DialogTitle  >Editar Gasto</DialogTitle> */}
        <DialogContent >

        <Grid container spacing={3}>    
            <Grid item  xs={12} sm={6} md={3}>
                <Paper sx={{padding: 2,  textAlign: 'center', }} elevation={0} >
                <Autocomplete
                    id="empresas-autocomplete"
                    options={options.empresas}
                    getOptionLabel={(option) => option.name || option.label || ''}
                    isOptionEqualToValue={(option, value) => option.value === value}
                    value={options.empresas.find((item) => Number(item.value) === form.empresa) || null}
                    onChange={(_, newValue) => {
                        updateEmpresa(newValue ? newValue.value : '')
                        // setErrores(prev => ({...prev, empresa: undefined}));
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
                    </Paper>
            </Grid>   
            <Grid item  xs={12} sm={6} md={3}>
                <Paper sx={{padding: 2,  textAlign: 'center', }} elevation={0} >

                <Autocomplete
                    id="quincena-autocomplete"
                    options={getQuincena()}
                    getOptionLabel={(option) => option.name || ''}
                    isOptionEqualToValue={(option, value) => option.value === value}
                    value={getQuincena().find((item) => item.value === form.periodo) || null}
                    onChange={(_, newValue) => {
                        updateQuincena(newValue ? newValue.value : '')
                    }}
                    renderInput={(params) => (
                        <TextField
                        {...params}
                        label="Periodo"
                        variant="outlined"
                        error={form.periodo === ''}
                        helperText={form.periodo === '' ? 'Selecciona la periodo' : ''}
                        />
                    )}
                    />
               </Paper>
            </Grid>   
                    
            {/* <Grid item  xs={12} sm={6} md={3}>
                <Paper sx={{padding: 2,  textAlign: 'center', }} elevation={0} >        
                <Autocomplete
                    id="año-autocomplete"
                    options={getAños()}
                    getOptionLabel={(option) => option.name.toString()}
                    isOptionEqualToValue={(option, value) => option.value === value}
                    value={getAños().find((item) => item.value === form.año) || null}
                    onChange={(_, newValue) => {
                        updateAño(newValue ? newValue.value : '')
                    }}
                    renderInput={(params) => (
                        <TextField
                        {...params}
                        label="Año"
                        variant="outlined"
                        error={form.año === ''}
                        helperText={form.año === '' ? 'Selecciona el año' : ''}
                        />
                    )}
                    />
                </Paper>
            </Grid>    */}

            <Grid item  xs={12} sm={6} md={3}>
                <Paper sx={{padding: 2,  textAlign: 'center', }} elevation={0} >        
                <Autocomplete
                    id="presupuesto-autocomplete"
                    options={valoresPresuEmpresaSeleccionada}
                    getOptionLabel={(option) => option.name || option.label || ''}
                    isOptionEqualToValue={(option, value) => option.value === value}
                    value={valoresPresuEmpresaSeleccionada.find((item) => item.value === form.presupuesto) || null}
                    onChange={(_, newValue) => {
                        updateTipo(newValue ? newValue.value : '')
                    }}
                    renderInput={(params) => (
                        <TextField
                        {...params}
                        label="Presupuesto"
                        variant="outlined"
                        error={form.presupuesto === ''}
                        helperText={form.presupuesto === '' ? 'Selecciona el tipo de proyecto' : ''}
                        />
                    )}
                    />

                </Paper>
            </Grid>   

        </Grid>    
        <Grid container spacing={3}>    
             <Grid item  xs={12} sm={6} md={3} justifyContent="space-around">
                <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                {/* <InputLabel>Fecha de Compra</InputLabel> */}
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                    <KeyboardDatePicker
                        disableToolbar
                        label="Fecha Inicio"
                        format="dd/MM/yyyy"
                        margin="normal"
                        name="fechaInicio"
                        value={form.fechaInicio!== '' ? form.fechaInicio : null}
                        placeholder="dd/mm/yyyy"
                          onChange={(e) => handleChangeFecha(e, 'fechaInicio')}
                     
                        className="w-100"
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                        error={!!errores.fechaInicio}
                        helperText={errores.fechaInicio || ''}
                    />
                </MuiPickersUtilsProvider>
                </Paper>
            </Grid>
            <Grid item  xs={12} sm={6} md={3} justifyContent="space-around">
                <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                {/* <InputLabel>Fecha de Compra</InputLabel> */}
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                    <KeyboardDatePicker
                        disableToolbar
                        label="Fecha Fin"
                        format="dd/MM/yyyy"
                        margin="normal"
                        name="fechaFin"
                        // value={form.fechaFin ? parse(form.fechaFin, 'dd/mm/yyyy', new Date()) : null}
                        value={form.fechaFin!== '' ? form.fechaFin : null}
                        placeholder="dd/mm/yyyy"
                        onChange={(date) => {
                            handleChangeFecha(date, 'fechaFin');
                            setErrores(prev => ({...prev, fechaFin: undefined}));
                        }}                       
                        className="w-100"
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                        error={!!errores.fechaFin}
                        helperText={errores.fechaFin || ''}
                    />
                </MuiPickersUtilsProvider>
                </Paper>
            </Grid>
             <Grid item  xs={12} sm={6} md={3} justifyContent="space-around">
                <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                {/* <InputLabel>Fecha de Compra</InputLabel> */}
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                    <KeyboardDatePicker
                        disableToolbar
                        label="Fecha de timbrado"
                        format="dd/MM/yyyy"
                        margin="normal"
                        name="timbrado"
                        value={form.timbrado!== '' ? form.timbrado : null}
                        // value={form.timbrado ? parse(form.timbrado, 'yyyy-MM-dd', new Date()) : null}
                        placeholder="dd/mm/yyyy"
                        // onChange={(date) => {
                        //     handleChangeFecha(date, 'timbrado');
                        //     setErrores(prev => ({...prev, timbrado: undefined}));
                        // }} 
                        onChange={(e) => handleChangeFecha(e, 'timbrado')}                      
                        className="w-100"
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                        error={!!errores.timbrado}
                        helperText={errores.timbrado || ''}
                    />
                </MuiPickersUtilsProvider>
                </Paper>
            </Grid>
             <Grid item  xs={12} sm={8} md={3}>
                  <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                  <InputLabel>Descripción</InputLabel>
                  <TextField
                      name="nombre"
                      label="Nombre"
                      type="text"
                      value={form.nombre!== '' ? form.nombre : null}
                      onChange={handleChange}
                      InputLabelProps={{
                          shrink: true,
                      }}
                      multiline
                      className="w-100"
                      error={errores.nombre ? true : false}
                  />
                  </Paper>
              </Grid>

            

        </Grid> 
        <Grid item xs={12} sm={12}>
            <Paper sx={{ padding: 2 }} elevation={1}>
              <InputLabel sx={{ fontWeight: "bold", fontSize: "16px", mb: 2 }}>
                Subir Archivo (Adjunto)
              </InputLabel>

              <Grid container spacing={2}>
                {/* Dropzone a la izquierda */}
                <Grid item xs={12} md={6}>
                  <Box
                    {...getRootProps()}
                    sx={{
                      border: "2px dashed #28A745",
                      padding: "20px",
                      textAlign: "center",
                      cursor: "pointer",
                      borderRadius: "8px",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      "&:hover": {
                        backgroundColor: "#E3F3E1",
                      },
                    }}
                  >
                    <input {...getInputProps()} />
                    <CloudUploadIcon sx={{ fontSize: 40, color: "#28A745", mb: 1 }} />
                    <Typography variant="body2" sx={{ color: "#555" }}>
                      Arrastra y suelta el archivo aquí o haz clic para seleccionar
                    </Typography>
                  </Box>
                </Grid>

                {/* Lista de archivos a la derecha */}
                <Grid item xs={12} md={6}>
                  {form.adjuntos?.adjunto?.files?.length > 0 ? (
                    <Box>
                      {form.adjuntos.adjunto.files.map((file, index) => {
                        const isImage = file.type?.includes("image");
                        const fileURL = URL.createObjectURL(file);
                        return (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              mb: 1,
                              padding: "10px",
                              backgroundColor: "#f9f9f9",
                              borderRadius: "8px",
                              borderLeft: "4px solid #28A745",
                              gap: 2,
                            }}
                          >
                            <Typography variant="body2" sx={{ flex: 1, color: "#333" }}>
                              <strong>📄</strong> {file.name}
                            </Typography>
                            {isImage ? (
                              <img
                                src={fileURL}
                                alt="Vista previa"
                                width="50"
                                style={{ borderRadius: "4px", objectFit: "cover" }}
                              />
                            ) : (
                              <IconButton color="primary" href={fileURL} target="_blank">
                                <VisibilityIcon />
                              </IconButton>
                            )}
                            <IconButton
                              color="error"
                              onClick={() => clearSingleFile("adjunto", index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        );
                      })}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No hay archivos seleccionados
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Grid>


        <TableContainer component={Paper}>
            <Table  aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: '.5%' }} >  </TableCell>
                        <TableCell  >  </TableCell>
                        <TableCell  >Nómina IMSS</TableCell>
                        <TableCell  >Extra IMSS</TableCell>
                        <TableCell align="right">Efectivo QNAL</TableCell>
                        <TableCell align="right">Extra Efectivo</TableCell>
                        <TableCell align="right">Comision</TableCell>
                        <TableCell align="right">ISR</TableCell>
                        <TableCell align="right">Infonavit / Rcv</TableCell>
                        <TableCell align="right">Imss</TableCell>
                        <TableCell align="right">ISN</TableCell>
                        <TableCell align="right">Total</TableCell>

                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ width: '.5%' }}>  </TableCell>

                         <TableCell > COLABORADOR </TableCell>

                         <TableCell  >
                            <Box alignItems="center" >
                              <Autocomplete
                                
                                id="cuenta-nomina-autocomplete"
                                options={options.cuentas}
                                getOptionLabel={(option) => option.name || option.label || ''}
                                isOptionEqualToValue={(option, value) => option.value === value}
                                value={options.cuentas.find((item) => item.value === form.cuentanominaimss) || null}
                                onChange={(_, newValue) => {
                                  updateCuenta(newValue ? newValue.value : '', 'cuentanominaimss');
                                }}
                                disabled={columnaEnCero('nomina') } // ✅ aquí va la lógica
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="SELECCIONA"
                                    variant="outlined"
                                    error={!!errores.cuentanominaimss}
                                    helperText={errores.cuentanominaimss || ''}
                                    // error={!form.cuentanominaimss}
                                    // helperText={!form.cuentanominaimss ? "SELECCIONA LA CUENTA" : ''}
                                    InputProps={{
                                      ...params.InputProps,
                                    }}
                                  />
                                )}
                                fullWidth
                              />

                              {cuentasActivas.nomina ? (
                                <Tooltip title="Eliminar montos">
                                  <IconButton onClick={() => limpiarCuenta('nomina')} color="error">
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <Tooltip title="Restaurar montos">
                                  <IconButton onClick={() => restaurarCuenta('nomina')} color="primary">
                                    <AddCircleOutlineIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>

                          <TableCell >
                          <Box  alignItems="center" >
                            <Autocomplete
                              
                              id="cuenta-nomina-autocomplete"
                              options={options.cuentas}
                              getOptionLabel={(option) => option.name || option.label || ''}
                              isOptionEqualToValue={(option, value) => option.value === value}
                              value={options.cuentas.find((item) => item.value === form.cuentaextraimss) || null}
                              onChange={(_, newValue) => {
                                updateCuenta(newValue ? newValue.value : '', 'cuentaextraimss');
                              }}
                              disabled={columnaEnCero('extraImss') } // ✅ aquí va la lógica
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="SELECCIONA"
                                  variant="outlined"
                                  error={!!errores.cuentaextraimss}
                                  helperText={errores.cuentaextraimss || ''}
                                  InputProps={{
                                    ...params.InputProps,
                                  }}
                                />
                              )}
                              fullWidth
                            />

                            {cuentasActivas.extraImss ? (
                              <Tooltip title="Eliminar montos">
                                <IconButton onClick={() => limpiarCuenta('extraImss')} color="error">
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Restaurar montos">
                                <IconButton onClick={() => restaurarCuenta('extraImss')} color="primary">
                                  <AddCircleOutlineIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>


                     {/* ---------- Cuenta EFECTIVO ---------- */}
                <TableCell >
                  <Box alignItems="center" gap={1}>
                    <Autocomplete
                      id="cuenta-efectivo-autocomplete"
                      options={options.cuentas}
                      getOptionLabel={(option) => option.name || option.label || ''}
                      isOptionEqualToValue={(option, value) => option.value === value}
                      value={options.cuentas.find((item) => item.value === form.cuentaefectivo) || null}
                      onChange={(_, newValue) => {
                        updateCuenta(newValue ? newValue.value : '', 'cuentaefectivo');
                      }}
                      disabled={columnaEnCero('efectivo') }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="SELECCIONA"
                          variant="outlined"
                          error={!!errores.cuentaefectivo}
                          helperText={errores.cuentaefectivo || ''}
                          
                          InputProps={{
                            ...params.InputProps,
                          }}
                        />
                      )}
                      fullWidth
                    />
                    {cuentasActivas.efectivo ? (
                      <Tooltip title="Eliminar montos">
                        <IconButton onClick={() => limpiarCuenta('efectivo')} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Restaurar montos">
                        <IconButton onClick={() => restaurarCuenta('efectivo')} color="primary">
                          <AddCircleOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>

                <TableCell >
                  <Box  alignItems="center" gap={1}>
                    <Autocomplete
                      id="cuenta-efectivo-autocomplete"
                      options={options.cuentas}
                      getOptionLabel={(option) => option.name || option.label || ''}
                      isOptionEqualToValue={(option, value) => option.value === value}
                      value={options.cuentas.find((item) => item.value === form.cuentaextraefectivo) || null}
                      onChange={(_, newValue) => {
                        updateCuenta(newValue ? newValue.value : '', 'cuentaextraefectivo');
                      }}
                      disabled={columnaEnCero('extraEfectivo') }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="SELECCIONA"
                          variant="outlined"
                          error={!!errores.cuentaextraefectivo}
                          helperText={errores.cuentaextraefectivo || ''}
                          
                          InputProps={{
                            ...params.InputProps,
                          }}
                        />
                      )}
                      fullWidth
                    />
                    {cuentasActivas.extraEfectivo ? (
                      <Tooltip title="Eliminar montos">
                        <IconButton onClick={() => limpiarCuenta('extraEfectivo')} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Restaurar montos">
                        <IconButton onClick={() => restaurarCuenta('extraEfectivo')} color="primary">
                          <AddCircleOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
                <TableCell >
                  <Box  alignItems="center" gap={1}>
                    <Autocomplete
                      id="cuenta-comision-autocomplete"
                      options={options.cuentas}
                      getOptionLabel={(option) => option.name || option.label || ''}
                      isOptionEqualToValue={(option, value) => option.value === value}
                      value={options.cuentas.find((item) => item.value === form.cuentacomision) || null}
                      onChange={(_, newValue) => {
                        updateCuenta(newValue ? newValue.value : '', 'cuentacomision');
                      }}
                      disabled={columnaEnCero('comision') }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="SELECCIONA"
                          variant="outlined"
                          error={!!errores.cuentacomision}
                          helperText={errores.cuentacomision || ''}
                          
                          InputProps={{
                            ...params.InputProps,
                          }}
                        />
                      )}
                      fullWidth
                    />
                    {cuentasActivas.comision ? (
                      <Tooltip title="Eliminar montos">
                        <IconButton onClick={() => limpiarCuenta('comision')} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Restaurar montos">
                        <IconButton onClick={() => restaurarCuenta('comision')} color="primary">
                          <AddCircleOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>

                {/* ---------- Cuenta ISR ---------- */}
                <TableCell >
                  <Box alignItems="center" >
                    <Autocomplete
                      id="cuenta-isr-autocomplete"
                      options={options.cuentas}
                      getOptionLabel={(option) => option.name || option.label || ''}
                      isOptionEqualToValue={(option, value) => option.value === value}
                      value={options.cuentas.find((item) => item.value === form.cuentaisr) || null}
                      onChange={(_, newValue) => {
                        updateCuenta(newValue ? newValue.value : '', 'cuentaisr');
                      }}
                      disabled={columnaEnCero('isr') || !cuentasActivas.isr}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="SELECCIONA"
                          variant="outlined"
                          error={!!errores.cuentaisr}
                          helperText={errores.cuentaisr || ''}
                          InputProps={{
                            ...params.InputProps,
                          }}
                        />
                      )}
                      fullWidth
                    />
                    {cuentasActivas.isr ? (
                      <Tooltip title="Eliminar montos">
                        <IconButton onClick={() => limpiarCuenta('isr')} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Restaurar montos">
                        <IconButton onClick={() => restaurarCuenta('isr')} color="primary">
                          <AddCircleOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>

                {/* ---------- Cuenta INFONAVIT ---------- */}
                <TableCell >
                  <Box alignItems="center" gap={1}>
                    <Autocomplete
                      id="cuenta-infonavit-autocomplete"
                      options={options.cuentas}
                      getOptionLabel={(option) => option.name || option.label || ''}
                      isOptionEqualToValue={(option, value) => option.value === value}
                      value={options.cuentas.find((item) => item.value === form.cuentainfonavit) || null}
                      onChange={(_, newValue) => {
                        updateCuenta(newValue ? newValue.value : '', 'cuentainfonavit');
                      }}
                      disabled={columnaEnCero('infonavit') || !cuentasActivas.infonavit}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="SELECCIONA"
                          variant="outlined"
                          error={!!errores.cuentainfonavit}
                          helperText={errores.cuentainfonavit || ''}
                          InputProps={{
                            ...params.InputProps,
                          }}
                        />
                      )}
                      fullWidth
                    />
                    {cuentasActivas.infonavit ? (
                      <Tooltip title="Eliminar montos">
                        <IconButton onClick={() => limpiarCuenta('infonavit')} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Restaurar montos">
                        <IconButton onClick={() => restaurarCuenta('infonavit')} color="primary">
                          <AddCircleOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>

                {/* ---------- Cuenta IMSS ---------- */}
                <TableCell >
                  <Box alignItems="center" gap={1}>
                    <Autocomplete
                      id="cuenta-imss-autocomplete"
                      options={options.cuentas}
                      getOptionLabel={(option) => option.name || option.label || ''}
                      isOptionEqualToValue={(option, value) => option.value === value}
                      value={options.cuentas.find((item) => item.value === form.cuentaimss) || null}
                      onChange={(_, newValue) => {
                        updateCuenta(newValue ? newValue.value : '', 'cuentaimss');
                      }}
                      disabled={columnaEnCero('imss') || !cuentasActivas.imss}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="SELECCIONA"
                          variant="outlined"
                          error={!!errores.cuentaimss}
                          helperText={errores.cuentaimss || ''}
                          InputProps={{
                            ...params.InputProps,
                          }}
                        />
                      )}
                      fullWidth
                    />
                    {cuentasActivas.imss ? (
                      <Tooltip title="Eliminar montos">
                        <IconButton onClick={() => limpiarCuenta('imss')} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Restaurar montos">
                        <IconButton onClick={() => restaurarCuenta('imss')} color="primary">
                          <AddCircleOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
                {/* ---------- Cuenta ISN ---------- */}
                <TableCell >
                  <Box alignItems="center" gap={1}>
                    <Autocomplete
                      id="cuenta-imss-autocomplete"
                      options={options.cuentas}
                      getOptionLabel={(option) => option.name || option.label || ''}
                      isOptionEqualToValue={(option, value) => option.value === value}
                      value={options.cuentas.find((item) => item.value === form.cuentaisn) || null}
                      onChange={(_, newValue) => {
                        updateCuenta(newValue ? newValue.value : '', 'cuentaisn');
                      }}
                      disabled={columnaEnCero('isn') || !cuentasActivas.isn}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="SELECCIONA"
                          variant="outlined"
                          error={!!errores.cuentaisn}
                          helperText={errores.cuentaisn || ''}
                          InputProps={{
                            ...params.InputProps,
                          }}
                        />
                      )}
                      fullWidth
                    />
                    {cuentasActivas.isn ? (
                      <Tooltip title="Eliminar montos">
                        <IconButton onClick={() => limpiarCuenta('isn')} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Restaurar montos">
                        <IconButton onClick={() => restaurarCuenta('isn')} color="primary">
                          <AddCircleOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>

                {/* ---------- Cuenta RCV ---------- */}
                {/* <TableCell >
                  <Box alignItems="center" gap={1}>
                    <Autocomplete
                      id="cuenta-rcv-autocomplete"
                      options={options.cuentas}
                      getOptionLabel={(option) => option.name || option.label || ''}
                      isOptionEqualToValue={(option, value) => option.value === value}
                      value={options.cuentas.find((item) => item.value === form.cuentarcv) || null}
                      onChange={(_, newValue) => {
                        updateCuenta(newValue ? newValue.value : '', 'cuentarcv');
                      }}
                      disabled={columnaEnCero('rcv') || !cuentasActivas.rcv}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="SELECCIONA"
                          variant="outlined"
                          error={!!errores.cuentarcv}
                          helperText={errores.cuentarcv || ''}
                          InputProps={{
                            ...params.InputProps,
                          }}
                        />
                      )}
                      fullWidth
                    />
                    {cuentasActivas.rcv ? (
                      <Tooltip title="Eliminar montos">
                        <IconButton onClick={() => limpiarCuenta('rcv')} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Restaurar montos">
                        <IconButton onClick={() => restaurarCuenta('rcv')} color="primary">
                          <AddCircleOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell> */}
         
                    </TableRow>
                    <TableRow>
                        <TableCell>  </TableCell>
                        <TableCell>  </TableCell>

                        <TableCell align="right">
                            <div className="p-1 my-0 text-primary bg-primary-o-40 font-weight-bolder text-center"> 
                            {setMoneyTableForNominas(getTotalNominaImss("nomina"))} 
                            </div>
                        </TableCell>
                        <TableCell align="right">
                            <div className="p-1 my-0 text-primary bg-primary-o-40 font-weight-bolder text-center"> 
                            {setMoneyTableForNominas(getTotalextraImss("extraImss"))} 
                            </div>
                        </TableCell>
                        <TableCell align="right">
                          <div className="p-1 my-0 text-primary bg-primary-o-40 font-weight-bolder text-center"> 
                            {setMoneyTableForNominas(getTotalefectivo("efectivo"))}
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          <div className="p-1 my-0 text-primary bg-primary-o-40 font-weight-bolder text-center"> 
                            {setMoneyTableForNominas(getTotalextraEfectivo("extraEfectivo"))}
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          <div className="p-1 my-0 text-primary bg-primary-o-40 font-weight-bolder text-center"> 
                            {setMoneyTableForNominas(getTotalcomision("comision"))}
                          </div>
                        </TableCell>
                        <TableCell align="right">
                           <div className="p-1 my-0 text-primary bg-primary-o-40 font-weight-bolder text-center"> 
                            {setMoneyTableForNominas(getTotalRestanteNomina("isr"))}
                            </div>

                        </TableCell>
                        <TableCell align="right">
                            <div className="p-1 my-0 text-primary bg-primary-o-40 font-weight-bolder text-center"> 
                                {setMoneyTableForNominas(getTotalExtra("infonavit"))}
                            </div>

                        </TableCell>
                        <TableCell align="right">
                            <div className="p-1 my-0 text-primary bg-primary-o-40 font-weight-bolder text-center"> 
                                {setMoneyTableForNominas(getTotalExtra("imss"))}
                            </div>

                        </TableCell>
                        <TableCell align="right">
                            <div className="p-1 my-0 text-primary bg-primary-o-40 font-weight-bolder text-center"> 
                                {setMoneyTableForNominas(getTotalExtra("isn"))}
                            </div>

                        </TableCell>
                        {/* <TableCell align="right">
                            <div className="p-1 my-0 text-primary bg-primary-o-40 font-weight-bolder text-center"> 
                                {setMoneyTableForNominas(getTotalExtra("rcv"))}
                            </div>

                        </TableCell> */}
                        <TableCell align="right">
                            <div className="p-1 my-0 text-primary bg-primary-o-40 font-weight-bolder text-center"> 
                                {setMoneyTableForNominas(getTotales())}
                            </div>

                        </TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                {
                   form.nominasAdmin.map((nominaAdmin, key) => { 
                    return (
                        <>
                        <TableRow key={key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell  align="right">
                                <IconButton variant="contained" color="secondary" onClick={() => deleteRowNominaAdmin(key)} >
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>

                            <TableCell align="right">
                            <Autocomplete
                                style={{ width: 270 }}
                                id={`usuario-autocomplete-${key}`}
                                options={getUsuariosDisponibles(key)}
                                getOptionLabel={(option) => option.label || option.name || ''}
                                isOptionEqualToValue={(option, value) => option.value === value}
                                value={getUsuariosDisponibles(key).find(item => item.value === nominaAdmin.usuario) || null}
                                onChange={(_, newValue) => {
                                    updateUsuario(newValue ? newValue.value : '', key);
                                    setErrores(prev => ({...prev, [`nomina-${key}-usuario`]: undefined}));
                                  }}
                                //  sx={{ width: '30%' }}  // 👈 aquí defines el tamaño fijo
                                renderInput={(params) => (
                                    <TextField
                                    {...params}
                                    label="SELECCIONA EL EMPLEADO"
                                    variant="outlined"
                                    error={!!errores[`nomina-${key}-usuario`]}
                                    helperText={errores[`nomina-${key}-usuario`] || ''}
                                    InputProps={{
                                        ...params.InputProps,
                                    }}
                                    />
                                )}
                                />
                            </TableCell>
                            <TableCell align="right">
                                <FormControl variant="standard" sx={{ minWidth: 200 }}>
                                    <Input id={`nomina-${key}`} value={nominaAdmin.nomina} 
                                    onChange={(e) => {
                                        onChangeNominasAdmin(key, e, 'nomina');
                                        setErrores(prev => ({...prev, [`nomina-${key}-nomina`]: undefined}));
                                      }}
                                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                    inputProps={{
                                        className: 'form-control-sm text-center',
                                        inputMode: 'decimal', // sugiere teclado numérico en móvil
                                        pattern: '[0-9]*',     // opcional para validación
                                    }}
                                    type="text"
                                    />
                                    <FormHelperText>
                                        {errores[`nomina-${key}-nomina`] || 'Nómina IMSS'}
                                    </FormHelperText>
                                </FormControl>
                            </TableCell>
                             <TableCell align="right">
                                <FormControl variant="standard" sx={{ minWidth: 200 }}>
                                    <Input id={`nomina-${key}`} value={nominaAdmin.extraImss} 
                                    onChange={(e) => {
                                        onChangeNominasAdmin(key, e, 'extraImss');
                                        setErrores(prev => ({...prev, [`nomina-${key}-extraImss`]: undefined}));
                                      }}
                                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                    inputProps={{
                                        className: 'form-control-sm text-center',
                                        inputMode: 'decimal', // sugiere teclado numérico en móvil
                                        pattern: '[0-9]*',     // opcional para validación
                                    }}
                                    type="text"
                                    />
                                    <FormHelperText>
                                        {errores[`nomina-${key}-extraImss`] || 'Extra IMSS'}
                                    </FormHelperText>
                                </FormControl>
                            </TableCell>
                            <TableCell align="right">
                                <FormControl variant="standard" sx={{ minWidth: 160 }}>
                                <Input id={`efectivo-${key}`} value={nominaAdmin.efectivo} onChange={(e) => onChangeNominasAdmin(key, e, 'efectivo')}
                                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                    inputProps={{
                                    className: 'form-control-sm text-center',
                                    inputMode: 'decimal',
                                    pattern: '[0-9.]*',
                                    }}
                                    type="text"
                                />
                                <FormHelperText>Efectivo QNAL</FormHelperText>
                                </FormControl>
                            </TableCell>
                             <TableCell align="right">
                              <FormControl variant="standard" sx={{ minWidth: 160 }}>
                              <Input id={`extraEfectivo-${key}`} value={nominaAdmin.extraEfectivo} onChange={(e) => onChangeNominasAdmin(key, e, 'extraEfectivo')}
                                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                  inputProps={{
                                  className: 'form-control-sm text-center',
                                  inputMode: 'decimal',
                                  pattern: '[0-9.]*',
                                  }}
                                  type="text"
                              />
                              <FormHelperText>Extra Efectivo</FormHelperText>
                              </FormControl>
                          </TableCell>
                          <TableCell align="right">
                              <FormControl variant="standard" sx={{ minWidth: 160 }}>
                              <Input id={`comision-${key}`} value={nominaAdmin.comision} onChange={(e) => onChangeNominasAdmin(key, e, 'comision')}
                                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                  inputProps={{
                                  className: 'form-control-sm text-center',
                                  inputMode: 'decimal',
                                  pattern: '[0-9.]*',
                                  }}
                                  type="text"
                              />
                              <FormHelperText>comision</FormHelperText>
                              </FormControl>
                          </TableCell>


                            <TableCell align="right">
                                <FormControl variant="standard" sx={{ minWidth: 160 }}>
                                <Input  id={`isr-${key}`} value={nominaAdmin.isr} onChange={(e) => onChangeNominasAdmin(key, e, 'isr')}
                                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                    inputProps={{
                                    className: 'form-control-sm text-center',
                                    inputMode: 'decimal',
                                    pattern: '[0-9.]*',
                                    }}
                                    type="text"
                                />
                                <FormHelperText>ISR</FormHelperText>
                                </FormControl>

                            </TableCell>


                            <TableCell align="right">
                              <FormControl variant="standard" sx={{ minWidth: 160 }}>
                                <Input
                                    id={`infonavit-${key}`}
                                    value={nominaAdmin.infonavit}
                                    onChange={(e) => onChangeNominasAdmin(key, e, 'infonavit')}
                                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                    inputProps={{
                                    className: 'form-control-sm text-center',
                                    inputMode: 'decimal',
                                    pattern: '[0-9.]*',
                                    }}
                                    type="text"
                                />
                                <FormHelperText>Infonavit</FormHelperText>
                                </FormControl>
                            </TableCell>
                            <TableCell align="right">
                                 <FormControl variant="standard" sx={{ minWidth: 160 }}>
                                    <Input
                                        id={`imss-${key}`}
                                        value={nominaAdmin.imss}
                                        onChange={(e) => onChangeNominasAdmin(key, e, 'imss')}
                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                        inputProps={{
                                        className: 'form-control-sm text-center',
                                        inputMode: 'decimal',
                                        pattern: '[0-9.]*',
                                        }}
                                        type="text"
                                    />
                                    <FormHelperText>IMSS</FormHelperText>
                                </FormControl>

                            </TableCell>
                            <TableCell align="right">
                                 <FormControl variant="standard" sx={{ minWidth: 160 }}>
                                    <Input
                                        id={`isn-${key}`}
                                        value={nominaAdmin.isn}
                                        onChange={(e) => onChangeNominasAdmin(key, e, 'isn')}
                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                        inputProps={{
                                        className: 'form-control-sm text-center',
                                        inputMode: 'decimal',
                                        pattern: '[0-9.]*',
                                        }}
                                        type="text"
                                    />
                                    <FormHelperText>ISN</FormHelperText>
                                </FormControl>

                            </TableCell>
                            {/* <TableCell align="right">
                                <FormControl variant="standard" sx={{ minWidth: 160 }}>
                                <Input
                                    id={`rcv-${key}`}
                                    value={nominaAdmin.rcv}
                                    onChange={(e) => onChangeNominasAdmin(key, e, 'rcv')}
                                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                    inputProps={{
                                    className: 'form-control-sm text-center',
                                    inputMode: 'decimal',
                                    pattern: '[0-9.]*',
                                    }}
                                    type="text"
                                />
                                <FormHelperText>RCV</FormHelperText>
                                </FormControl>
                            </TableCell> */}
                            <TableCell align="center">
                                 <div className="font-size-lg font-weight-bolder"> {setMoneyTableForNominas(getTotal(key))} </div>
                            </TableCell>
                        </TableRow>                          
                        </>
                        )
                    })
                }

                  
                </TableBody>
            </Table>
            {
                options.usuarios.length > 0 &&
                <div className="d-flex justify-content-center">
                    <button type="button" className="btn btn-sm btn-bg-light btn-icon-primary btn-hover-light-primary font-weight-bolder text-primary align-self-center font-size-13px" onClick={addRowNominaAdmin}>AGREGAR COLABORADOR</button>
                </div>
            }

                {Object.keys(errores).length > 0 && (
                <Box sx={{ width: '100%', p: 2, backgroundColor: '#fff3f3', borderRadius: 1 }}>
                    <Typography color="error" variant="body1">
                    ❌ Por favor complete todos los campos obligatorios marcados
                    </Typography>
                </Box>
                )}
            
        </TableContainer>   
     </DialogContent>
    
     <DialogActions>
        <Button 
            color="primary" 
            variant="contained" 
            onClick={(e) => handleSubmit(e, "guardar", false)}
            sx={{ mr: 2 }}
            disabled={!form.periodo || !form.empresa || !form.nombre || !form.fechaInicio || !form.fechaFin || form.editar == 1  }
        >
            Guardar
        </Button>

        <Button 
            style={{ 
            backgroundColor: form.periodo && form.empresa ? '#0A3E27' : '#cccccc', 
            color: '#fff',
            '&:hover': { 
                backgroundColor: form.periodo && form.empresa ? '#0A3E27' : '#cccccc' 
            } 
            }} 
            variant="contained" 
            onClick={(e) => handleSubmit(e, "enviar", true)}
            disabled={!form.periodo || !form.empresa || !form.timbrado || form.editar == 1 }
        >
            Enviar
        </Button>
    </DialogActions>

    </Container>
    </Box>
</form>
  );
}