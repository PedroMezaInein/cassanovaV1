export const COLORES_GRAFICAS_MESES = [ '#AB47BC', '#5C6BC0', '#42A5F5', '#26C6DA', 
    '#26A69A', '#66BB6A', '#D4E157', '#FFEE58', '#FFA726', '#FF7043', '#8D6E63', '#78909C' ]

export const COLORES_CALENDARIO_PROYECTOS = [ '#9e6e36', '#9e6e36', '#10c7a6', '#5b7533', '#b0b1ca', '#beac49', '#34c1e7',
    '#6dc14f', '#21b3af','#f05c34', '#6462cc', '#39a5f1',  '#9bac45', '#a2a5da', '#94c7ac', 
    '#68c979', '#e88f6b', '#65b1a0', '#64c6ce', '#10b27a', '#14a4e3',  '#5da48e', '#9eb6a1', '#8690c6', '#7ca0cd' ]

export const INEIN_RED = '#D8005A'
export const IM_AZUL = '#7096c1'
export const IM_DORADO = '#bdab71'

// DEV

export const PROD_LINK = 'https://proyectosadmin.xyz/api/'
export const DEV_LINK = 'http://localhost:8000/api/'
export const FRONT_LINK = process.env.NODE_ENV === 'production' ? 'https://inein.com.mx/' : 'localhost:3000/';
//export const DEV_LINK = 'https://apiapp1.inein.com.mx/api/'

export const URL_DEV = process.env.NODE_ENV === 'production' ? PROD_LINK : DEV_LINK

export const URL_ASSETS = process.env.NODE_ENV === 'production' ? 'https://proyectosadmin.xyz' : 'http://127.0.0.1:8000'
//export const URL_ASSETS = process.env.NODE_ENV === 'production' ? 'https://proyectosadmin.xyz' : 'https://apiapp1.inein.com.mx'

export const PUSHER_OBJECT = { broadcaster: 'pusher', key: '112ff49dfbf7dccb6934', cluster: 'us2', forceTLS: false }

export const MAIN_FRONT = process.env.NODE_ENV === 'production' ? 'https://inein.com.mx' : 'http://localhost:3000'
export const LEADS_FRONT = process.env.NODE_ENV === 'production' ? 'https://leads.inein.com.mx' : 'http://localhost:3001'

export const COLORS = ["#E53935", "#CB4335", "#AB47BC", "#7D3C98", "#C15994", "#2471A3", "#2E86C1","#42A5F5", "#4DD0E1", "#17A589", "#229954", "#28B463", "#9CCC65", "#FFC42C", "#D4AC0D", "#FF7043", "#D68910", "#CA6F1E", "#9F6A57", "#707B7C"];

//Expresiones Regulares

    export const RFC = '[A-Z,Ñ,&]{3,4}[0-9]{2}[0-1][0-9][0-3][0-9][A-Z,0-9]?[A-Z,0-9]?[0-9,A-Z]?'
    // eslint-disable-next-line
    export const DATE ='(^(((0[1-9]|1[0-9]|2[0-8])[\/](0[1-9]|1[012]))|((29|30|31)[\/](0[13578]|1[02]))|((29|30)[\/](0[4,6,9]|11)))[\/](19|[2-9][0-9])\d\d$)|(^29[\/]02[\/](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)'
    export const TEL = '^[0-9]{10}$'
    // eslint-disable-next-line
    export const EMAIL = '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$'
    // eslint-disable-next-line
    export const NSS = '^(\d{2})(\d{2})(\d{2})\d{5}$'
    // eslint-disable-next-line
    export const CURP = '/^[a-z]{4}\d{6}[HM][a-z]{5}\d{2}$/i'
//Form

// Table
export const TABLE_SIZE = 20

export const LEADS_COLUMNS = [                
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Convertido', accessor: 'convertido' },
    { Header: 'Empresa', accessor: 'empresa' },
    { Header: 'Nombre', accessor: 'nombre' },
    { Header: 'Contacto', accessor: 'contacto' },
    { Header: 'Comentario', accessor: 'comentario' },
    { Header: 'Servicios', accessor: 'servicios' },
    { Header: 'Origen', accessor: 'origen' },
    { Header: 'Tipo de lead', accessor: 'tipo_lead' },
    { Header: 'Fecha', accessor: 'fecha' }
]

export const REPORTE_MERCA_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'EMPRESA', accessor: 'empresa' },
    { Header: 'FECHA', accessor: 'fecha' },
    { Header: 'REPORTE', accessor: 'reporte' }
]

export const PROSPECTOS_COLUMNS = [                
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Estatus', accessor: 'estatusProspecto' },
    { Header: 'Empresa', accessor: 'empresa' },
    { Header: 'Proyecto', accessor: 'tipoProyecto' },
    { Header: 'Vendedor', accessor: 'vendedor' },
    { Header: 'Lead', accessor: 'lead' },
    { Header: 'Descripción del Prospecto', accessor: 'descripcion' },
    { Header: 'Preferencia de contacto', accessor: 'preferencia' },    
    { Header: 'Motivo contratación o cancelación', accessor: 'motivo' },
    { Header: 'Fecha de conversión', accessor: 'fechaConversion' }
]

export const CONTACTO_COLUMNS = [
    { Header: 'Usuario', accessor: 'usuario' },
    { Header: 'Medio Contacto', accessor: 'medio' },
    { Header: 'Estado', accessor: 'estado' },
    { Header: 'Comentario', accessor: 'comentario' },
    { Header: 'Fecha', accessor: 'fecha' }
]

export const CLIENTES_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Empresa', accessor: 'empresa', customRender: true },
    { Header: 'Nombre', accessor: 'nombre', customRender: true },
    { Header: 'Proyecto', accessor: 'proyecto', customRender: true },
    { Header: 'Dirección', accessor: 'direccion' },
    { Header: 'Puesto', accessor: 'puesto', customRender: true },
    { Header: 'RFC', accessor: 'rfc', customRender: true },
    { Header: 'Fecha', accessor: 'fecha', customRender: true }
]

export const CUENTAS_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Nombre', accessor: 'nombre' },
    { Header: 'Empresa', accessor: 'empresa' },
    { Header: 'Empresa principal', accessor: 'principal' },
    { Header: 'Banco', accessor: 'banco' },
    { Header: 'Número de cuenta', accessor: 'numero' },
    { Header: 'Balance', accessor: 'balance' },
    { Header: 'Estatus', accessor: 'estatus', customRender: true },
    { Header: 'Tipo', accessor: 'tipo' },
    { Header: 'Fecha', accessor: 'fecha', customRender: true },    
    { Header: 'Descripción', accessor: 'descripcion', customRender: true }
]

export const EDOS_CUENTAS_COLUMNS = [
    { Header: 'Opciones', accessor: 'actions' },
    { Header: 'Estado de cuenta', accessor: 'estado' },
    { Header: 'Fecha', accessor: 'fecha' }
]

export const ADJ_CONTRATOS_COLUMNS = [
    { Header: 'Opciones', accessor: 'actions' },
    { Header: 'Contratos', accessor: 'adjunto' }
]

export const EDOS_CUENTAS_COLUMNS_2 = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'ID', accessor: 'identificador' },
    { Header: 'Cuenta', accessor: 'cuenta' },
    { Header: 'Estado de cuenta', accessor: 'estado' },
    { Header: 'Fecha', accessor: 'fecha', customRender: true }
]

export const TRASPASOS_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'ID', accessor: 'identificador' },
    { Header: 'Origen', accessor: 'origen' },
    { Header: 'Destino', accessor: 'destino' },
    { Header: 'Monto', accessor: 'monto' },
    { Header: 'Comentario', accessor: 'comentario', customRender: true },
    { Header: 'Usuario', accessor: 'usuario' },
    { Header: 'Fecha', accessor: 'fecha', customRender: true }
]

export const INGRESOS_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions', customRender: true },
    { Header: 'ID', accessor: 'identificador', customRender: true },
    { Header: 'Fecha', accessor: 'fecha', customRender: true },
    { Header: 'Cliente', accessor: 'cliente', customRender: true },
    { Header: 'Factura', accessor: 'factura', customRender: true },
    { Header: 'Área', accessor: 'area', customRender: true },
    { Header: 'Sub-A', accessor: 'subarea', customRender: true },
    { Header: 'Total', accessor: 'total', customRender: true },
    { Header: 'Cuenta', accessor: 'cuenta', customRender: true },
    { Header: 'Impuesto', accessor: 'impuesto', customRender: true },
    { Header: 'Pago', accessor: 'tipoPago', customRender: true },
    { Header: 'Descripción', accessor: 'descripcion', customRender: true },
    { Header: 'Estatus', accessor: 'estatusCompra', customRender: true }
]

export const EGRESOS_COLUMNS = [
    { Header: 'Opciones', accessor: 'actions' },
    { Header: 'ID', accessor: 'identificador' },    
    { Header: 'Fecha', accessor: 'fecha', customRender: true },
    { Header: 'Proveedor', accessor: 'proveedor' },
    { Header: 'Factura', accessor: 'factura' },
    { Header: 'Área', accessor: 'area', customRender: true },
    { Header: 'Sub-Área', accessor: 'subarea', customRender: true },
    { Header: 'Monto', accessor: 'monto' },
    { Header: 'Comisión', accessor: 'comision' },
    { Header: 'Total', accessor: 'total' },
    { Header: 'Cuenta', accessor: 'cuenta' },
    { Header: 'Pago', accessor: 'tipoPago', customRender: true },    
    { Header: 'Impuesto', accessor: 'impuesto', customRender: true },
    { Header: 'Estatus', accessor: 'estatusCompra', customRender: true }, 
    { Header: 'Descripción', accessor: 'descripcion', customRender: true }
]

export const FACTURAS_COLUMNS = [
    { Header: 'Opciones', accessor: 'actions' },
    { Header: 'Folio', accessor: 'folio' },
    { Header: 'Estatus', accessor: 'estatus' },
    { Header: 'Fecha', accessor: 'fecha' },
    { Header: 'Serie', accessor: 'serie' },
    { Header: 'Emisor', accessor: 'emisor' },
    { Header: 'Receptor', accessor: 'receptor' },
    { Header: 'Subtotal', accessor: 'subtotal' },
    { Header: 'Total', accessor: 'total' },
    { Header: 'Monto acumulado', accessor: 'acumulado' },
    { Header: 'Monto restante', accessor: 'restante' },
    { Header: 'Adjuntos', accessor: 'adjuntos' },
    { Header: 'Descripción', accessor: 'descripcion' },   
    { Header: 'Número de certificado', accessor: 'noCertificado' },
    { Header: 'Uso CFDI', accessor: 'usoCFDI' }
]

export const FACTURAS_COLUMNS_2 = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Folio', accessor: 'folio' },
    { Header: 'Fecha', accessor: 'fecha' },
    { Header: 'Serie', accessor: 'serie' },
    { Header: 'Emisor', accessor: 'emisor' },
    { Header: 'Receptor', accessor: 'receptor' },
    { Header: 'Subtotal', accessor: 'subtotal' },
    { Header: 'Total', accessor: 'total' },
    { Header: 'Adjuntos', accessor: 'adjuntos' },
    { Header: 'Descripción', accessor: 'descripcion' },
    { Header: 'Uso CFDI', accessor: 'usoCFDI' },
    { Header: 'Folio Fiscal', accessor: 'noCertificado' }
]

export const PROVEEDORES_COLUMNS = [
    { Header: 'Opciones', accessor: 'actions' },
    { Header: 'Nombre', accessor: 'nombre', customRender: true },
    { Header: 'Razón Social', accessor: 'razonSocial', customRender: true },
    { Header: 'Contacto', accessor: 'contacto', customRender: true },
    { Header: 'Cuenta', accessor: 'cuenta' },
    { Header: 'Área', accessor: 'area', customRender: true },
    { Header: 'Sub-área', accessor: 'subarea', customRender: true },
    { Header: 'Total de compras', accessor: 'total' },
    { Header: 'RFC', accessor: 'rfc', customRender: true }
]

export const PROVEEDORES_MERCA_COLUMNS = [
    { Header: 'Opciones', accessor: 'actions' },
    { Header: 'Razón Social', accessor: 'razonSocial', customRender: true },
    { Header: 'RFC', accessor: 'rfc', customRender: true },
    { Header: 'Área', accessor: 'subarea', customRender: true }
]

export const AREAS_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Área', accessor: 'area', customRender: true },
    { Header: 'Sub áreas', accessor: 'subareas', customRender: true }
]

export const AREAS_COMPRAS_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Área', accessor: 'area', customRender: true },
    { Header: 'Sub áreas', accessor: 'subareas', customRender: true },
    { Header: 'Partida', accessor: 'partida' }
]

export const PARTIDAS_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Clave', accessor: 'clave' },
    { Header: 'Partida', accessor: 'partida', customRender: true },
    { Header: 'Sub partidas', accessor: 'subpartidas', customRender: true }
]

export const PARTIDAS_DISEÑO_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Partida', accessor: 'partida', customRender: true },
    { Header: 'Tipo', accessor: 'tipo', customRender: true }
]

export const UNIDADES_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Unidad', accessor: 'unidad', customRender: true }
]
export const ROLES_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Rol', accessor: 'rol', customRender: true },
    { Header: 'Color', accessor: 'color', customRender: true }
]
export const ETIQUETAS_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Etiqueta', accessor: 'etiqueta', customRender: true },
    { Header: 'Color', accessor: 'color', customRender: true }
]
export const ORIGENES_COLUMNS = [
    { Header: 'Opciones', accessor: 'actions' },
    { Header: 'Origen', accessor: 'origen',  customRender: true }
]

export const RED_SOCIAL_COLUMNS = [
    { Header: 'Opciones', accessor: 'actions' },
    { Header: 'Red Social', accessor: 'redSocial', customRender: true }
]

export const BANCOS_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Banco', accessor: 'banco',  customRender: true }
]

export const CONCEPTOS_FACTURACION_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Clave', accessor: 'clave',  customRender: true },
    { Header: 'Descripción', accessor: 'descripcion',  customRender: true }
]

export const TIPOS_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Tipo', accessor: 'tipo', customRender: true }
]

export const PRESTACIONES_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Prestaciones', accessor: 'prestacion', customRender: true },
    { Header: 'Descripción', accessor: 'descripcion', customRender: true }
]

export const PROYECTOS_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions', orderable: false, customRender: true },
    { Header: 'Estatus', accessor: 'status', customRender: true },
    { Header: 'Nombre', accessor: 'nombre', customRender: true },
    { Header: 'T.Proyecto', accessor: 'tipo_proyecto', customRender: true },
    { Header: 'Cliente', accessor: 'cliente', customRender: true, orderable: false },
    { Header: 'Dirección', accessor: 'direccion', orderable: false },
    { Header: 'Contacto', accessor: 'contacto', customRender: true, orderable: false },
    { Header: 'Empresa', accessor: 'empresa' },
    { Header: 'F.Inicio', accessor: 'fechaInicio', customRender: true },
    { Header: 'F.Fin', accessor: 'fechaFin', customRender: true },
    { Header: 'Fases', accessor: 'fases', orderable: false },
    { Header: 'Descripción', accessor: 'descripcion', customRender: true }
]

export const VENTAS_COLUMNS = [
    { Header: 'Opciones', accessor: 'actions', customRender: true },
    { Header: 'ID', accessor: 'identificador', customRender: true },
    { Header: 'Fecha', accessor: 'fecha', customRender: true },
    { Header: 'Cliente', accessor: 'cliente', customRender: true },
    { Header: 'Proyecto', accessor: 'proyecto', customRender: true },
    { Header: 'Factura', accessor: 'factura', customRender: true },
    { Header: 'Área', accessor: 'area', customRender: true },
    { Header: 'Sub-A', accessor: 'subarea', customRender: true },
    { Header: 'Total', accessor: 'total', customRender: true },
    { Header: 'Cuenta', accessor: 'cuenta', customRender: true },
    { Header: 'Impuesto', accessor: 'impuesto', customRender: true },
    { Header: 'Pago', accessor: 'tipoPago', customRender: true },
    { Header: 'Estatus', accessor: 'estatusCompra', customRender: true },
    { Header: 'Descripción', accessor: 'descripcion', customRender: true },
    { Header: 'Tipo', accessor: 'tipo', customRender: true, searchable: false, orderable: false}
]

export const COMPRAS_COLUMNS = [
    { Header: 'Opciones', accessor: 'actions',customRender: true, searchable: false },
    { Header: 'ID', accessor: 'identificador', customRender: true },
    { Header: 'Fecha', accessor: 'fecha', customRender: true },    
    { Header: 'Proveedor', accessor: 'proveedor', customRender: true },
    { Header: 'Proyecto', accessor: 'proyecto', customRender: true },
    { Header: 'Factura', accessor: 'factura', customRender: true },
    { Header: 'Área', accessor: 'area', customRender: true },
    { Header: 'Sub-A', accessor: 'subarea', customRender: true },
    { Header: 'Monto', accessor: 'monto', customRender: true },
    { Header: 'Comisión', accessor: 'comision', customRender: true },
    { Header: 'Total', accessor: 'total', customRender: true },
    { Header: 'Cuenta', accessor: 'cuenta', customRender: true },
    { Header: 'Impuesto', accessor: 'impuesto', customRender: true },
    { Header: 'Pago', accessor: 'tipoPago', customRender: true },    
    { Header: 'Estatus', accessor: 'estatusCompra', customRender: true },
    { Header: 'Descripción', accessor: 'descripcion', customRender: true },
    { Header: 'Tipo', accessor: 'tipo', customRender: true, searchable: false, orderable: false}
]

export const DEVOLUCIONES_COLUMNS = [
    { Header: 'Opciones', accessor: 'actions' },
    { Header: 'ID', accessor: 'identificador' },
    { Header: 'Fecha', accessor: 'fecha', customRender: true },    
    { Header: 'Proveedor', accessor: 'proveedor' },
    { Header: 'Proyecto', accessor: 'proyecto', customRender: true },
    { Header: 'Factura', accessor: 'factura' },
    { Header: 'Área', accessor: 'area', customRender: true },
    { Header: 'Sub-A', accessor: 'subarea', customRender: true },
    { Header: 'Monto', accessor: 'monto' },
    { Header: 'Comisión', accessor: 'comision' },
    { Header: 'Total', accessor: 'total' },
    { Header: 'Cuenta', accessor: 'cuenta' },
    { Header: 'Impuesto', accessor: 'impuesto', customRender: true },
    { Header: 'Pago', accessor: 'tipoPago', customRender: true },    
    { Header: 'Estatus', accessor: 'estatusCompra', customRender: true },
    { Header: 'Descripción', accessor: 'descripcion', customRender: true }
]

export const SOLICITUD_COMPRA_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Proyecto', accessor: 'proyecto', customRender: true },
    { Header: 'Proveedor', accessor: 'proveedor', customRender: true },
    { Header: 'Empresa', accessor: 'empresa', customRender: true },
    { Header: 'Monto', accessor: 'monto', customRender: true },
    { Header: 'Factura', accessor: 'factura', customRender: true },
    { Header: 'Pago',  accessor: 'tipoPago', customRender: true },
    { Header: 'Descripción', accessor: 'descripcion', customRender: true },
    { Header: 'Notas', accessor: 'notas', customRender: true },
    { Header: 'Fecha', accessor: 'fecha', customRender: true },
    { Header: 'Área', accessor: 'area', customRender: true },
    { Header: 'Sub-Área', accessor: 'subarea', customRender: true },
    { Header: 'Tipo', accessor: 'tipo', customRender: true, searchable: false, orderable: false}
]
export const SOLICITUD_EGRESO_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Proveedor', accessor: 'proveedor', customRender: true },
    { Header: 'Empresa', accessor: 'empresa', customRender: true },
    { Header: 'Monto', accessor: 'monto', customRender: true },
    { Header: 'Factura', accessor: 'factura', customRender: true },
    { Header: 'Pago', accessor: 'tipoPago', customRender: true },   
    { Header: 'Fecha', accessor: 'fecha', customRender: true },
    { Header: 'Sub-Área', accessor: 'subarea', customRender: true },
    { Header: 'Descripción', accessor: 'descripcion', customRender: true }
]

export const PAGOS_COLUMNS = [
    { Header: 'Opciones', accessor: 'actions'},
    { Header: 'ID', accessor: 'identificador'},
    { Header: 'Fecha', accessor: 'fecha'},
    { Header: 'Proveedor', accessor: 'proveedor'},
    { Header: 'Factura', accessor: 'factura'},
    { Header: 'Subárea', accessor: 'subarea'},
    { Header: 'Monto', accessor: 'monto'},
    { Header: 'Comisión', accessor: 'comision'},
    { Header: 'Total', accessor: 'total'},
    { Header: 'Cuenta', accessor: 'cuenta'},
    { Header: 'Pago', accessor: 'pago'},
    { Header: 'Impuesto', accessor: 'impuesto'},
    { Header: 'Estatus', accessor: 'estatus'}
]

export const SOLICITUD_VENTA_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Proyecto', accessor: 'proyecto',customRender: true },
    { Header: 'Empresa', accessor: 'empresa',customRender: true },
    { Header: 'Monto', accessor: 'monto',customRender: true },
    { Header: 'Factura', accessor: 'factura', customRender: true },
    { Header: 'Pago', accessor: 'tipoPago',customRender: true },
    { Header: 'Área', accessor: 'area',customRender: true },
    { Header: 'Sub-Área', accessor: 'subarea',customRender: true },
    { Header: 'Fecha', accessor: 'fecha',customRender: true },
    { Header: 'Descripción', accessor: 'descripcion',customRender: true },
    { Header: 'Tipo', accessor: 'tipo', customRender: true, searchable: false, orderable: false}
]

export const CONCEPTOS_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Partida', accessor: 'partida', customRender: true },
    { Header: 'Subpartida', accessor: 'subpartida', customRender: true },
    { Header: 'Clave', accessor: 'clave' },
    { Header: 'Unidad', accessor: 'unidad', customRender: true },
    { Header: 'Costo', accessor: 'costo', customRender: true },
    { Header: 'Descripción', accessor: 'descripcion', class: 'desc-big', customRender: true },
    { Header: 'Proveedor', accessor: 'proveedor', customRender: true }
]

export const ACCESOS_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Plataforma', accessor: 'plataforma', customRender: true },
    { Header: 'Usuario y Contraseña', accessor: 'usuario', customRender: true },
    { Header: 'Correo y teléfono de alta', accessor: 'correo', customRender: true },
    { Header: 'Empresas', accessor: 'empresa', customRender: true, orderable: false },
    { Header: 'Departamento', accessor: 'departamento', customRender: true, orderable: false },
    { Header: 'Responsables', accessor: 'responsables', customRender: true, orderable: false },
    { Header: 'Descripción', accessor: 'descripcion', class: 'desc-big', customRender: true }
]

export const BODEGA_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Nombre', accessor: 'nombre', customRender: true },
    { Header: 'Partida', accessor: 'partida', customRender: true },
    { Header: 'Unidad', accessor: 'unidad', customRender: true },
    { Header: 'Cantidad', accessor: 'cantidad' },
    { Header: 'Ubicación', accessor: 'ubicacion', customRender: true },
    { Header: 'Descripción', accessor: 'descripcion', customRender: true },
    { Header: 'Adjuntos', accessor: 'adjuntos' }

]

export const DOCUMENTOS_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Empresa', accessor: 'empresa', customRender: true },
    { Header: 'Nombre', accessor: 'nombre', customRender: true },
    { Header: 'Fecha', accessor: 'fecha', customRender: true },
    { Header: 'Documento', accessor:'documento' }
]

export const IMSS_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Empresa', accessor: 'empresa', customRender: true },
    { Header: 'Fecha', accessor: 'fecha', customRender: true },
    { Header: 'Adjunto', accessor:'adjunto' }
]

export const PRESTAMOS_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Empleado', accessor: 'empleado' },
    { Header: 'Fecha', accessor: 'fecha', customRender: true },
    { Header: 'Descripción', accessor: 'descripcion', customRender: true },
    { Header: 'Monto', accessor: 'monto' },
    { Header: 'Acumulado', accessor: 'acumulado' },
    { Header: 'Restante', accessor: 'restante' }
]

export const UBICACIONES_BODEGA_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Usuario', accessor: 'user' },
    { Header: 'Ubicación', accessor: 'ubicacion' },
    { Header: 'Comentario', accessor: 'comentario' },
    { Header: 'Fecha', accessor: 'fecha' }
]

export const RENDIMIENTOS_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Materiales', accessor: 'materiales', customRender: true },
    { Header: 'Unidad', accessor: 'unidad', customRender: true },
    { Header: 'Costo', accessor: 'costo', customRender: true },
    { Header: 'Proveedor', accessor: 'proveedor', customRender: true },
    { Header: 'Rendimiento', accessor: 'rendimiento', customRender: true },
    { Header: 'Descripción', accessor: 'descripcion', customRender: true }
]

export const REMISION_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Fecha', accessor: 'fecha', customRender: true },
    { Header: 'Proyecto', accessor: 'proyecto', customRender: true },
    { Header: 'Área', accessor: 'area', customRender: true },
    { Header: 'Sub - Área', accessor: 'subarea', customRender: true },
    { Header: 'Descripción', accessor: 'descripcion', customRender: true },
    { Header: 'Adjunto', accessor: 'adjunto' }
]

export const EMPRESA_COLUMNS = [
    { Header: 'Opciones', accessor: 'actions', searchable: false, orderable: false },
    { Header: 'Logo', accessor: 'logo', searchable: false, orderable: false },
    { Header: 'Nombre', accessor: 'name', customRender: true },
    { Header: 'Razón social', accessor: 'razonSocial', customRender: true },
    { Header: 'RFC', accessor: 'rfc', customRender: true },
    { Header: 'Departamentos', accessor: 'departamento', customRender: true, orderable: false }
]

export const CONTRATOS_CLIENTES_COLUMNS = [
    { Header: 'Opciones', accessor: 'actions' },
    { Header: 'Nombre', accessor: 'nombre', customRender: true },
    { Header: 'Cliente', accessor: 'cliente', customRender: true },
    { Header: 'Empresa', accessor: 'empresa', customRender: true },
    { Header: 'Fecha de inicio', accessor: 'fechaInicio', customRender: true },
    { Header: 'Fecha de fin', accessor: 'fechaFin', customRender: true },
    { Header: 'Monto con IVA', accessor: 'monto', customRender: true },
    { Header: 'Monto Pagado', accessor: 'acumulado' },
    { Header: 'Pendiente por pagar', accessor: 'pendiente' },
    { Header: 'Tipo de contrato', accessor: 'contrato', customRender: true },
    { Header: 'Descripción', accessor: 'descripcion', customRender: true }
]

export const CONTRATOS_PROVEEDORES_COLUMNS = [
    { Header: 'Opciones', accessor: 'actions' },
    { Header: 'Nombre', accessor: 'nombre', customRender: true },
    { Header: 'Proveedor', accessor: 'proveedor', customRender: true },
    { Header: 'Empresa', accessor: 'empresa', customRender: true },
    { Header: 'Fecha de inicio', accessor: 'fechaInicio', customRender: true },
    { Header: 'Fecha de fin', accessor: 'fechaFin', customRender: true },
    { Header: 'Monto con IVA', accessor: 'monto', customRender: true },
    { Header: 'Monto Pagado', accessor: 'acumulado' },
    { Header: 'Pendiente por pagar', accessor: 'pendiente' },
    { Header: 'Tipo de contrato', accessor: 'contrato', customRender: true },
    { Header: 'Descripción', accessor: 'descripcion', customRender: true }
]

export const UTILIDADES_COLUMNS = [
    { Header: 'Proyecto', accessor: 'proyecto' },
    { Header: 'Ventas', accessor: 'ventas' },
    { Header: 'Compras', accessor: 'compras' },
    { Header: 'Utilidad', accessor: 'utilidad' },
    { Header: 'Margen', accessor: 'margen' }
]

export const FLUJOS_COLUMNS = [
    { Header: 'Cuenta', accessor: 'cuenta' },
    { Header: 'Ingresos', accessor: 'ingresos' },
    { Header: 'Egresos', accessor: 'egresos' },
    { Header: 'Ventas', accessor: 'ventas' },
    { Header: 'Compras', accessor: 'compras' },
    { Header: 'Traspasos', accessor: 'traspasos' },
    { Header: 'Total', accessor: 'total' }
]

export const NOMINA_OBRA_COLUMNS = [
    { Header: 'Opciones', accessor: 'actions' },
    { Header: 'Nómina de Obra', accessor: 'periodo' },
    { Header: 'Fecha inicio', accessor: 'fechaInicio' },
    { Header: 'Fecha fin', accessor: 'fechaFin' },
    { Header: 'Total Pago de Nómina', accessor: 'totalPagoNomina' },
    { Header: 'Restante Nómina', accessor: 'restanteNomina' },
    { Header: 'Extras', accessor: 'extras' },
    { Header: 'Gran Total', accessor: 'granTotal' }
]

export const NOMINA_OBRA_SINGLE_COLUMNS = [
    { Header: 'ID del empleado', accessor: 'idEmpleado' },
    { Header: 'Empleado', accessor: 'empleado' },
    { Header: 'Proyecto', accessor: 'proyecto' },
    { Header: 'Salario x hr', accessor: 'salario_hr' },
    { Header: 'Horas trabajadas', accessor: 'hr_trabajadas' },
    { Header: 'Salario x hr extra', accessor: 'salario_hr_extras' },
    { Header: 'Horas trabajadas extras', accessor: 'hr_extras' },
    { Header: 'Nómina IMSS', accessor: 'nominaIMSS', total: 'totalNominaImss' },
    { Header: 'Extras', accessor: 'extras', total: 'totalRestanteNomina' },
    { Header: 'Viáticos', accessor: 'viaticos', total: 'totalExtras' },
    { Header: 'Total', accessor: 'total', total: 'total' }
]

export const ADJUNTOS_COLUMNS = [
    { Header: 'Opciones', accessor: 'actions' },
    { Header: 'Adjunto', accessor: 'url' },
    { Header: 'Tipo', accessor: 'tipo' }
]
export const ADJUNTOS_COLUMNS_URL = [
    { Header: 'Adjuntos', accessor: 'url' }
]
export const NOTAS_COLUMNS = [
    { Header: 'Opciones', accessor: 'actions' },
    { Header: 'Número de nota', accessor: 'numero_nota' },
    { Header: 'Fecha', accessor: 'fecha' },
    { Header: 'Proveedor', accessor: 'proveedor' },
    { Header: 'Tipo', accessor: 'tipo_nota' },
    { Header: 'Notas', accessor: 'notas' },
    { Header: 'Adjunto', accessor: 'adjunto' }
]
export const ADJUNTOS_PRESUPUESTOS_COLUMNS = [
    { Header: 'Adjunto', accessor: 'url' },
    { Header: 'ID', accessor: 'identificador' }
]

export const NOMINA_ADMIN_COLUMNS = [
    { Header: 'Opciones', accessor: 'actions' },
    { Header: 'Periodo de Nómina', accessor: 'periodo' },
    { Header: 'Fecha inicio', accessor: 'fechaInicio' },
    { Header: 'Fecha fin', accessor: 'fechaFin' },
    { Header: 'Total Nómina IMSS', accessor: 'totalNominaIMSS' },
    { Header: 'Restante Nómina', accessor: 'restanteNomina' },
    { Header: 'Extras', accessor: 'extras' },
    { Header: 'Gran Total', accessor: 'granTotal' }
]

export const NOMINA_ADMIN_SINGLE_COLUMNS = [
    { Header: 'ID del empleado', accessor: 'idEmpleado' },
    { Header: 'Empleado', accessor: 'empleado' },
    { Header: 'Nómina IMSS', accessor: 'nominaIMSS', total: 'totalNominaImss' },
    { Header: 'Extras', accessor: 'extras', total: 'totalRestanteNomina' },
    { Header: 'Viáticos', accessor: 'viaticos', total: 'totalExtras' },
    { Header: 'Total', accessor: 'total', total: 'total' }
]

export const EMPLEADOS_COLUMNS = [
    { Header: 'Opciones', accessor: 'actions' },
    { Header: 'Nombre', accessor: 'nombre', customRender: true },
    { Header: 'Empresa', accessor: 'empresa', customRender: true },
    { Header: 'Departamento', accessor: 'departamento', customRender: true, orderable: false },
    { Header: 'Puesto', accessor: 'puesto', customRender: true },
    { Header: 'RFC', accessor: 'rfc', customRender: true },
    { Header: 'NSS', accessor: 'nss', customRender: true },
    { Header: 'CURP', accessor: 'curp', customRender: true },
    { Header: 'Estatus', accessor: 'estatus', customRender: true },
    { Header: 'F.Inicio', accessor: 'fechaInicio', customRender: true },
    { Header: 'Cuenta de Depósito', accessor: 'cuenta' },
    { Header: 'Contacto de Emergencia', accessor: 'nombre_emergencia', customRender: true },
    { Header: 'Días de vacaciones disponibles', accessor: 'vacaciones_tomadas', customRender: true }
]

export const EMPLEADOS_COLUMNS_OBRA = [
    { Header: 'Opciones', accessor: 'actions_obra' },
    { Header: 'Nombre', accessor: 'nombre_obra' },
    { Header: 'Empresa', accessor: 'empresa_obra' },
    { Header: 'Puesto', accessor: 'puesto_obra' },
    { Header: 'RFC', accessor: 'rfc_obra' },
    { Header: 'NSS', accessor: 'nss_obra' },
    { Header: 'CURP', accessor: 'curp_obra' },
    { Header: 'Estatus', accessor: 'estatus_obra' },
    { Header: 'Fecha de Inicio', accessor: 'fechaInicio_obra' },
    { Header: 'Tipo de Empleado', accessor: 'tipo_empleado_obra' },
    { Header: 'Cuenta de Depósito', accessor: 'cuenta_obra' },
    { Header: 'Contacto de Emergencia', accessor: 'nombre_emergencia_obra' },
    { Header: 'Días de Vacaciones Tomadas', accessor: 'vacaciones_tomadas_obra' }
]

export const PRESUPUESTO_COLUMNS = [
    { Header: 'Opciones', accessor: 'actions',  customRender: true, searchable: false },
    { Header: 'Estatus', accessor: 'estatus' },
    { Header: 'Tipo', accessor: 'tipo_presupuesto', orderable: false },
    { Header: 'Empresa', accessor: 'empresa' },
    { Header: 'Proyecto', accessor: 'proyecto' },
    { Header: 'Área', accessor: 'area' },
    { Header: 'Fecha del presupuesto', accessor: 'fecha' },
    { Header: 'Tiempo de ejecución', accessor: 'tiempo_ejecucion' }
    
]

export const PRESUPUESTO_UTILIDAD_COLUMNS = [
    { Header: 'Opciones', accessor: 'actions', customRender: true, searchable: false },
    { Header: 'Estatus', accessor: 'estatus' },
    { Header: 'Tipo', accessor: 'tipo_presupuesto', orderable: false },
    { Header: 'Empresa', accessor: 'empresa' },
    { Header: 'Proyecto', accessor: 'proyecto' },
    { Header: 'Área', accessor: 'area' },
    { Header: 'Fecha del presupuesto', accessor: 'fecha' },
    { Header: 'Tiempo de ejecución', accessor: 'tiempo_ejecucion' }   
]

export const USUARIOS = [                
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Nombre', accessor: 'name', customRender: true },
    { Header: 'Correo', accessor: 'email', customRender: true },
    { Header: 'Departamento', accessor: 'departamento', customRender: true }
]

export const CLIENTES = [                
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Nombre', accessor: 'name', customRender: true },
    { Header: 'Correo', accessor: 'email', customRender: true },
    { Header: 'Proyecto', accessor: 'proyecto', customRender: true }
]

export const PRECIO_M2_DISEÑOS_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'M2', accessor: 'm2' },
    { Header: 'Esquema 1', accessor: 'esquema1' },
    { Header: 'Esquema 2', accessor: 'esquema2' },
    { Header: 'Esquema 3', accessor: 'esquema3' }
]
export const PRESUPUESTO_DISEÑO_COLUMNS = [
    { Header: 'Opciones', accessor: 'actions' },
    { Header: 'Empresa', accessor: 'empresa' },
    { Header: 'Fecha', accessor: 'fecha' },
    { Header: 'M2', accessor: 'm2' },
    { Header: 'Esquema', accessor: 'esquema' },
    { Header: 'Total', accessor: 'total' },
    { Header: '# Cotización', accessor: 'cotizacion', orderable: false }
]
export const TICKETS_ESTATUS = [
    { Header: 'Opciones', accessor: 'actions' },
    { Header: 'Estatus', accessor: 'estatus' },
    { Header: 'Fecha', accessor: 'fecha' },
    { Header: 'Partida', accessor: 'partida' },
    { Header: 'Tipo de trabajo', accessor: 'tipo_trabajo' },
    { Header: 'Descripción', accessor: 'descripcion' },
    { Header: 'Motivo de cancelación', accessor: 'motivo' }
]
export const CARTAS_GARANTIAS_TICKETS = [
    { Header: 'Opciones', accessor: 'actions' },
    { Header: 'Fecha', accessor: 'fecha', customRender: true },
    { Header: 'Proyecto', accessor: 'proyecto', customRender: true },
    { Header: 'Área', accessor: 'area', customRender: true },
    { Header: 'Subárea', accessor: 'subarea', customRender: true }
]
export const PROYECTOS_TICKETS = [
    { Header: 'Opciones', accessor: 'actions',customRender: true, searchable: false },
    { Header: 'ID', accessor: 'identificador' },
    { Header: 'Estatus', accessor: 'estatus' },
    { Header: 'F. solicitud', accessor: 'fecha' },
    { Header: 'F. termino', accessor: 'fecha_termino' },
    { Header: 'Proyecto', accessor: 'proyectos' },
    { Header: 'Solicitó', accessor: 'solicito' },
    { Header: 'Tipo de trabajo', accessor: 'tipo_trabajo' },
    { Header: 'Costo del presupuesto', accessor: 'costo_presupuesto' },
    { Header: 'Monto pagado', accessor: 'monto_pagado' },
    { Header: 'Descripción', accessor: 'descripcion' },
    { Header: 'Motivo de cancelación', accessor: 'motivo' }
]
export const ADJUNTOS_EMPRESA_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Empresa', accessor: 'empresa' },
    { Header: 'Tipo de adjunto', accessor: 'tipo_adjunto' },
    { Header: 'Adjunto', accessor: 'adjunto' }
]
export const DETAILS_CUENTAS = [
    { Header: 'Traspaso ID', accessor: 'idTraspaso' },
    { Header: 'Fecha', accessor: 'fecha' },
    { Header: 'Monto', accessor: 'monto' }
]
export const SERVICIOS_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions', },
    { Header: 'Servicio', accessor: 'servicio', customRender: true },
    { Header: 'Empresa', accessor: 'empresa' }
]
export const CONTRATOS_RRHH_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Empleado', accessor: 'empleado' },
    { Header: 'Periodo',  accessor: 'periodo' },
    { Header: 'Fecha Inicio', accessor: 'fecha_inicio' },
    { Header: 'Fecha Fin', accessor: 'fecha_fin' },
    { Header: 'Estatus', accessor: 'estatus' }
]

export const EQUIPOS_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions'},
    { Header: 'Equipo', accessor: 'equipo', customRender: true },
    { Header: 'Marca', accessor: 'marca', customRender: true },
    { Header: 'Modelo', accessor: 'modelo', customRender: true },
    { Header: 'Proveedor', accessor: 'proveedor', customRender: true },
    { Header: 'Partida', accessor: 'partida', customRender: true },
    { Header: 'Observaciones', accessor: 'observaciones', customRender: true },
    { Header: 'Ficha técnica', accessor: 'ficha', customRender: true, searchable: false, orderable: false }
]
export const MANTENIMIENTOS = [
    { Header: 'Opciones', accessor: 'actions', customRender: true, searchable: false },
    { Header: 'Proyecto', accessor: 'proyecto', customRender: true },
    { Header: 'Tipo', accessor: 'tipo', customRender: true },
    { Header: 'Equipo', accessor: 'equipo', customRender: true },
    { Header: 'Estatus', accessor: 'estatus', customRender: true },
    { Header: 'Costo', accessor: 'costo', customRender: true },
    { Header: 'Presupuesto', accessor: 'presupuesto', customRender: true, searchable: false, orderable: false },
    { Header: 'Fecha', accessor: 'fecha', customRender: true, tipo: 'fecha' }
]

export const SOLICITUD_FACTURA_COLUMNS = [
    { Header: 'Opciones', accessor: 'actions', customRender: true, searchable: false, orderable: false },
    { Header: 'Emisor', accessor: 'emisor', customRender: true },
    { Header: 'Receptor', accessor: 'receptor', customRender: true },
    { Header: 'Detalle', accessor: 'detalle', customRender: true },
    { Header: 'Monto', accessor: 'monto', customRender: true },
    { Header: 'Tipo de pago', accessor: 'tipoPago', customRender: true },
    { Header: 'Forma de pago', accessor: 'formaPago', customRender: true },
    { Header: 'Método de pago', accessor: 'metodoPago', customRender: true },
    { Header: 'Estatus', accessor: 'estatusFactura', customRender: true },
    { Header: 'Origen', accessor: 'origen', customRender: true , orderable: false },
]
export const LICENCIAS = [
    { Header: 'Opciones', accessor: 'actions',customRender: true, searchable: false },
    { Header: 'Tipo', accessor: 'tipo', customRender: true },
    { Header: 'Nombre', accessor: 'nombre', customRender: true },
    { Header: 'Duración', accessor: 'duracion', customRender: true },
    { Header: 'Cantidad', accessor: 'cantidad', customRender: true },
    { Header: 'Códigos', accessor: 'codigos', customRender: true },
]
export const PRESTACIONES_RH_COLUMNS = [
    { Header: 'Opciones', accessor: 'actions',customRender: true, searchable: false },
    { Header: 'Nombre', accessor: 'nombre', customRender: true },
    { Header: 'Periodo', accessor: 'periodo', customRender: true },
    { Header: 'Pago por empleado', accessor: 'pago_por_empleado', customRender: true },
    { Header: 'Proveedor', accessor: 'proveedor', customRender: true },
    { Header: 'Descripción', accessor: 'descripcion', customRender: true },
]
export const CALENDARIO_PAGOS_ADMIN = [
    { Header: 'Opciones', accessor: 'actions', customRender: true, searchable: false },
    { Header: 'Proveedor', accessor: 'proveedor', customRender: true },
    { Header: 'Nombre del servicio', accessor: 'nombre', customRender: true },
    { Header: 'Periodo', accessor: 'periodo', customRender: true },
    { Header: 'Monto', accessor: 'monto', customRender: true },
    { Header: 'Fecha', accessor: 'fecha', customRender: true, tipo: 'fecha' }
]