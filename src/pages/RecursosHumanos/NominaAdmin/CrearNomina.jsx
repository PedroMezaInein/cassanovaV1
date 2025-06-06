import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Box, Card, CardContent, CardHeader, Grid, Typography, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Select, MenuItem, InputAdornment, IconButton, InputLabel,
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
import { format } from 'date-fns';


// Componente para manejar la carga de archivos
const FileUpload = ({ onFileChange, onClear, files, label }) => {
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: "image/*,application/pdf",
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileChange(acceptedFiles[0]);
      }
    },
  });

  return (
    <Paper sx={{ padding: 2 }} elevation={0}>
      <InputLabel sx={{ fontWeight: "bold", fontSize: "16px", mb: 2 }}>
        {label}
      </InputLabel>

      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed #28A745",
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
          borderRadius: "8px",
          transition: "all 0.3s",
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

      {files.length > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 2,
            padding: "10px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            borderLeft: "4px solid #28A745",
            gap: 2
          }}
        >
          <Typography
            variant="body2"
            sx={{ flex: 1, color: "#333" }}
            title={files[0].name}
          >
            <strong>📄</strong> {files[0].name}
          </Typography>

          {files[0].type.includes("image") ? (
            <img
              src={URL.createObjectURL(files[0])}
              alt="Vista previa"
              width="50"
              style={{ borderRadius: "4px", objectFit: "cover" }}
            />
          ) : (
            <IconButton
              color="primary"
              href={URL.createObjectURL(files[0])}
              target="_blank"
            >
              <VisibilityIcon />
            </IconButton>
          )}

          <IconButton color="error" onClick={onClear}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )}
    </Paper>
  );
};

// Componente para los selectores de fecha
const DatePickerField = ({ value, onChange, label, error }) => (
  <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
    <KeyboardDatePicker
      disableToolbar
      label={label}
      format="dd/MM/yyyy"
      margin="normal"
      value={value}
      placeholder="dd/mm/yyyy"
      onChange={onChange}
      className="w-100"
      KeyboardButtonProps={{
        'aria-label': 'change date',
      }}
      error={error}
    />
  </MuiPickersUtilsProvider>
);

// Componente para los campos de entrada monetarios
const MoneyInput = ({ value, onChange, label, name }) => (
  <FormControl variant="standard" sx={{ minWidth: 160 }}>
    <Input
      value={value}
      onChange={onChange}
      name={name}
      startAdornment={<InputAdornment position="start">$</InputAdornment>}
      inputProps={{
        className: 'form-control-sm text-center',
        inputMode: 'decimal',
        pattern: '[0-9.]*',
      }}
      type="text"
    />
    <FormHelperText>{label}</FormHelperText>
  </FormControl>
);

// Componente principal
export default function CrearNomina(props) {
  const { handleClose, reload, getProveedores } = props;
  const [options, setOptionsState] = useState({ usuarios: [], empresas: [], cuentas: [] });
  const [form, setForm] = useState({
    periodo: '',
    empresa: '',
    fechaInicio: new Date(),
    fechaFin: new Date(),
    fecha: new Date(),
    cuentanominaimss: '',
    cuentaefectivo: '',
    cuentaisr: '',
    cuentainfonavit: '',
    cuentaimss: '',
    cuentarcv: '',
    cuentaisn: '',
    presupuesto: '',
    nombre:'',
    nominasAdmin: [{
      usuario: '',
      nominImss: '',
      nomina: '',
      efectivo: '',
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
    efectivo: true,
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
      const response = await axios.options(`${URL_DEV}v2/rh/nomina-administrativa`, {
        responseType: 'json',
        headers: setSingleHeader(authUser.access_token)
      });

      Swal.close();
      
      const { usuarios, empresas, cuentas, empleadosConPeriodos } = response.data;
      // console.log(response.data)
      const usuariosFormateados = empleadosConPeriodos.map(usuario => ({
        ...usuario,
        nombre: `${usuario.nombre} ${usuario.apellido_paterno ?? ''} ${usuario.apellido_materno ?? ''}`.trim()
      }));

      setOptionsState({
        empresas: setOptions(empresas, 'name', 'id'),
        cuentas: setOptions(cuentas, 'nombre', 'id'),
        usuarios: setOptions(usuariosFormateados, 'nombre', 'id')
      });

      const nominasAdmin = empleadosConPeriodos.map(element => ({
        usuario: element.id.toString(),
        nominImss: element.nomina_imss || 0.0,
        nomina: element.nomina_imss || 0.0,
        efectivo: element.nomina_extras || 0.0,
        isr: element.isr || 0.0,
        isn: element.isn || 0.0,
        infonavit: element.infonavit || 0.0,
        imss: element.imss || 0.0,
        rcv: element.rcv || 0.0,
        extraImss: 0.0,
        restanteNomina: element.nomina_extras || 0.0,
        extras: 0.0,
        // Periodicidades individuales
        periodicidad_nomina: element.nomina_imss_periodicidad || 'quincenal',
        periodicidad_efectivo: element.nomina_extras_periodicidad || 'quincenal',
        periodicidad_isr: element.isr_periodicidad || 'quincenal',
        periodicidad_infonavit: element.infonavit_periodicidad || 'quincenal',
        periodicidad_imss: element.imss_periodicidad || 'quincenal',
        periodicidad_rcv: element.rcv_periodicidad || 'quincenal',
        periodicidad_isn: element.isn_periodicidad || 'quincenal',

      }));

      setForm(prev => ({
        ...prev,
        nominasAdmin,
        backupNominasAdmin: JSON.parse(JSON.stringify(nominasAdmin)) // Deep copy

      }));

    } catch (error) {
      Swal.close();
      console.error('Error fetching options:', error);
      errorAlert('Error al consultar las opciones', 'Ocurrió un error al consultar opciones');
    }
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

  const onChangeAdjunto = (file, tipo) => {
    if (!file || !(file instanceof File)) return;
  
    const nuevoAdjunto = {
      files: [file],
      value: file.name,
      placeholder: 'Archivo seleccionado'
    };
  
    setForm(prevForm => ({
      ...prevForm,
      adjuntos: {
        ...prevForm.adjuntos,
        [tipo]: nuevoAdjunto
      }
    }));
  
    Swal.fire({
      icon: 'success',
      title: 'Archivo agregado',
      text: `Se agregó correctamente el archivo "${file.name}"`,
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
      efectivo: data?.nomina_extras || 0,
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
        extraImss: '',
        restanteNomina: '',
        extras: '',
        nomina: '',
        efectivo: '',
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
    return ['nominImss', 'extraImss', 'restanteNomina', 'extras']
      .reduce((acc, k) => acc + parseFloat(n[k] || 0), 0);
  };

  const getTotalByKey = (key, periodicidadKey) =>
    form.nominasAdmin
      .filter(n => n[periodicidadKey] === form.periodo)
      .reduce((sum, el) => sum + parseFloat(el[key] || 0), 0);
  
  
  const getTotales = () => ['nominImss', 'extraImss', 'restanteNomina', 'extras']
    .map(getTotalByKey)
    .reduce((a, b) => a + b, 0);

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
        multiple: false,
        accept: "image/*,application/pdf",
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            onChangeAdjunto(file, "adjunto");
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
          efectivo: convertirMonto(n.efectivo, n.periodicidad_efectivo, nuevaPeriodicidad),
          isr: convertirMonto(n.isr, n.periodicidad_isr, nuevaPeriodicidad),
          infonavit: convertirMonto(n.infonavit, n.periodicidad_infonavit, nuevaPeriodicidad),
          imss: convertirMonto(n.imss, n.periodicidad_imss, nuevaPeriodicidad),
          rcv: convertirMonto(n.rcv, n.periodicidad_rcv, nuevaPeriodicidad),
          isn: convertirMonto(n.isn, n.periodicidad_isn, nuevaPeriodicidad),

          extraImss: 0,
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

      const handleChangeFecha = (date, tipo) => {
        if (!date) return;
      
        // 🛠️ Solución clave: setear hora a mediodía para evitar timezone shifts
        const safeDate = new Date(date);
        safeDate.setHours(12, 0, 0, 0); // <- 12:00:00 local
      
        setForm(prev => ({
          ...prev,
          [tipo]: safeDate // guardamos como Date (no string)
        }));
      
        setErrores(prev => ({
          ...prev,
          [tipo]: false
        }));
      };
      

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
          } else if (key === 'fecha' || key === 'fechaInicio' || key === 'fechaFin') {
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
      
        data.append('tipo', tipo);
      
        // try {
        //   const response = await axios.post(
        //     `${URL_DEV}v2/rh/nomina-administrativa`,
        //     data,
        //     { headers: setFormHeader(access_token) }
        //   );
      
        //   Swal.fire({
        //     icon: 'success',
        //     title: 'Éxito',
        //     text: response.data.message ?? 'La nómina fue registrada con éxito.',
        //   });
          
        // } catch (error) {
        //   if (error.response) {
        //     printResponseErrorAlert(error); // ✅ si viene de axios
        //   } else {
        //     Swal.fire({
        //       icon: 'error',
        //       title: 'Error',
        //       text: 'Ocurrió un error inesperado. Revisa la consola para más detalles.',
        //     });
        //     console.error('Error inesperado:', error);
        //   }
        // }
        // console.log(data)
        // console.log(data.fechaInicio)
        // console.log(data.fechaFin)
        // console.log(data.fecha)


          apiPostForm(`v2/rh/nomina-administrativa`, data, access_token).then(
              (response) => {
                  const { factura } = response.data
                  console.log('Subida de archivos :', response)
  
                  Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: response.data.message ?? 'La nómina fue registrada con éxito.',
                  });
                  handleClose(true);
  
              }, (error) => { }
          ).catch((error) => {
              console.error('❌ Error en la subida de archivos:', error)
              console.error(error, 'error')
          })
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
    if (!form.fecha) errores.fecha = 'Ingrese una fecha válida';
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
    
      if (getTotalExtra('rcv') !== 0 && !form.cuentarcv) {
        errores.cuentarcv = 'Ingrese una cuenta RCV válida';
      }
    
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
  
    validateAlert2(() => {
      // console.log('Formulario enviado:', { tipo, enviar, form });
      addNominaAdminAxios(tipo);
    }, e, 'form-nominaadmin', tipo, enviar);
  };
  


// console.log(cuentasActivas)
// console.log(form)

  return (
    <form id="form-nominaadmin" onSubmit={(e) => handleSubmit(e, "guardar", false)}>

    <Box sx={{ overflowX: 'auto' }}>
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
                    value={options.empresas.find((item) => item.value === form.empresa) || null}
                    onChange={(_, newValue) => {
                        updateEmpresa(newValue ? newValue.value : '')
                        setErrores(prev => ({...prev, empresa: undefined}));
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
                        label="Fecha"
                        format="dd/MM/yyyy"
                        margin="normal"
                        name="fechaInicio"
                        value={form.fechaInicio !== '' ? form.fechaInicio : null}
                        placeholder="dd/mm/yyyy"
                        onChange={(date) => {
                            handleChangeFecha(date, 'fechaInicio');
                            setErrores(prev => ({...prev, fechaInicio: undefined}));
                        }}                       
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
                        label="Fecha"
                        format="dd/MM/yyyy"
                        margin="normal"
                        name="fechaFin"
                        value={form.fechaFin !== '' ? form.fechaFin : null}
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
            <Grid item  xs={12} sm={8} md={3}>
                <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                <InputLabel>Nombre nomina</InputLabel>
                <TextField
                    name="nombre"
                    label="Nombre"
                    type="text"
                    defaultValue={form.nombre}
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

            <Grid item xs={12} sm={8} md={3}>
                <Paper sx={{ padding: 2 }} elevation={0}>
                    <InputLabel sx={{ fontWeight: "bold", fontSize: "16px", mb: 2 }}>
                    Subir Archivo (Adjunto)
                    </InputLabel>                   

                    <Box
                    {...getRootProps()}
                    sx={{
                        border: "2px dashed #28A745",
                        padding: "20px",
                        textAlign: "center",
                        cursor: "pointer",
                        borderRadius: "8px",
                        transition: "all 0.3s",
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

                    {form.adjuntos?.adjunto?.files?.length > 0 && (
                    (() => {
                        const file = form.adjuntos.adjunto.files[0];
                        if (!file) return null;

                        const isImage = file.type?.includes("image");
                        const fileURL = URL.createObjectURL(file);

                        return (
                        <Box
                            sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 2,
                            padding: "10px",
                            backgroundColor: "#f9f9f9",
                            borderRadius: "8px",
                            borderLeft: "4px solid #28A745",
                            gap: 2,
                            }}
                        >
                            <Typography
                            variant="body2"
                            sx={{ flex: 1, color: "#333" }}
                            title={file.name}
                            >
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

                            <IconButton color="error" onClick={() => clearFiles("adjunto")}>
                            <DeleteIcon />
                            </IconButton>
                        </Box>
                        );
                    })()
                    )}
                </Paper>
                </Grid>



        </Grid> 


        <TableContainer component={Paper} >
            <Table >
             <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: '.5%' }} >  </TableCell>
                        <TableCell  >  </TableCell>
                        <TableCell  >Nómina IMSS</TableCell>
                        <TableCell align="right">Efectivo QNAL</TableCell>
                        <TableCell align="right">ISR</TableCell>
                        <TableCell align="right">Infonavit</TableCell>
                        <TableCell align="right">Imss</TableCell>
                        <TableCell align="right">Prestaciones RCV</TableCell>
                        <TableCell align="right">ISN</TableCell>
                        <TableCell align="right">Total</TableCell>

                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ width: '.5%' }}>  </TableCell>

                         <TableCell > COLABORADOR </TableCell>

                         <TableCell >
                            <Box  alignItems="center" >
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
                                    // helperText={!form.cuentanominaimss ? "SELECCIONA" : ''}
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


                     {/* ---------- Cuenta EFECTIVO ---------- */}
                <TableCell >
                  <Box  alignItems="center" gap={1}>
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

                {/* ---------- Cuenta ISR ---------- */}
                <TableCell >
                  <Box  alignItems="center" >
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
                  <Box  alignItems="center" gap={1}>
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
                  <Box  alignItems="center" gap={1}>
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

                {/* ---------- Cuenta RCV ---------- */}
                <TableCell >
                  <Box  alignItems="center" gap={1}>
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
                </TableCell>
                 {/* ---------- Cuenta ISN ---------- */}
                <TableCell >
                  <Box  alignItems="center" gap={1}>
                    <Autocomplete
                      id="cuenta-rcv-autocomplete"
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
                            {setMoneyTableForNominas(getTotalextraImss("efectivo"))}
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
                                {setMoneyTableForNominas(getTotalExtra("rcv"))}
                            </div>

                        </TableCell>
                        <TableCell align="right">
                            <div className="p-1 my-0 text-primary bg-primary-o-40 font-weight-bolder text-center"> 
                                {setMoneyTableForNominas(getTotalExtra("isn"))}
                            </div>

                        </TableCell>
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
            disabled={!form.periodo || !form.empresa}
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
            disabled={!form.periodo || !form.empresa}
        >
            Enviar
        </Button>
    </DialogActions>

    </Container>
    </Box>
</form>
  );
}