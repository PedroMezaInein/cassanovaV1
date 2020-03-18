import { 
    faProjectDiagram, 
    faUsers, faUsersCog, faTasks, faBuilding,
    faFileInvoiceDollar, faThList, faChartLine,
    faFolder, faShoppingBasket, faToolbox, faFolderOpen, faFilePrescription, faReceipt ,faFilePdf, faCoins, faHandHoldingUsd,
    faArchive, faFileSignature, faLongArrowAltRight, faSearchDollar, faFunnelDollar, faLongArrowAltLeft, faPassport, 
    faPiggyBank, faExchangeAlt, faBalanceScale, faWallet, 
    faUserTie, faSitemap, faHospitalAlt, faUserFriends, faUserShield, faCalendarCheck, faHandsHelping, 
    faMailBulk, faSearch, faComments, faAddressCard,
    faGavel
} from '@fortawesome/free-solid-svg-icons'


// DEV
/* export const URL_DEV = 'http://127.0.0.1:8000/api/';
export const URL_ASSETS = 'http://127.0.0.1:8000'; */

export const PROD_LINK = 'https://demo.proyectosadmin.com/api/'
export const DEV_LINK = 'http://127.0.0.1:8000/api/'

export const URL_DEV = process.env.NODE_ENV === 'production' ? PROD_LINK : DEV_LINK
export const URL_ASSETS = process.env.NODE_ENV === 'production' ? 'https://demo.proyectosadmin.com' : 'http://127.0.0.1:8000'

// PROD / DEV
/* export const URL_DEV = 'https://demo.proyectosadmin.com/api/';
export const URL_ASSETS = 'https://demo.proyectosadmin.com'; */

export const CP_URL = 'https://api-sepomex.hckdrk.mx/query/info_cp/'
//Icons

export const ICONS_MODULES = { 
    'faProjectDiagram': faProjectDiagram, 
    'faUsers' : faUsers, 'faUsersCog' : faUsersCog, 'faTasks' : faTasks, 'faBuilding' : faBuilding,
    'faFileInvoiceDollar': faFileInvoiceDollar, 'faThList':faThList, 'faChartLine':faChartLine,
    'faFolder':faFolder, 'faShoppingBasket':faShoppingBasket, 'faToolbox':faToolbox, 'faFolderOpen':faFolderOpen, 'faFilePrescription':faFilePrescription, 
        'faReceipt':faReceipt, 'faFilePdf':faFilePdf, 'faCoins':faCoins, 'faHandHoldingUsd':faHandHoldingUsd,
    'faArchive':faArchive, 'faFileSignature':faFileSignature, 'faLongArrowAltRight':faLongArrowAltRight, 'faSearchDollar':faSearchDollar, 
        'faFunnelDollar':faFunnelDollar, 'faLongArrowAltLeft':faLongArrowAltLeft, 'faPassport':faPassport, 
    'faPiggyBank': faPiggyBank, 'faExchangeAlt':faExchangeAlt, 'faBalanceScale':faBalanceScale, 'faWallet':faWallet, 
    'faUserTie':faUserTie, 'faSitemap':faSitemap, 'faHospitalAlt':faHospitalAlt, 'faUserFriends':faUserFriends, 'faUserShield':faUserShield, 
        'faCalendarCheck':faCalendarCheck, 'faHandsHelping':faHandsHelping, 
    'faMailBulk':faMailBulk, 'faSearch':faSearch, 'faComments':faComments, 'faAddressCard':faAddressCard,
    'faGavel':faGavel,
}

//Form

export const EMPTY_EMPLEADO = {
    tipo_empleado: '',
    empresa:'',
    puesto:'',
    fecha_inicio: '',
    estatus: '',
    rfc: '',
    nss: '',
    curp: '',
    banco: '',
    cuenta: '',
    clabe: '',
    nombre_emergencia: '',
    telefono_emergencia: '',
}

export const EMPTY_CONTACTO = {
    comentario: '',
    fechaContacto: '',
    success: 'Contactado',
    tipoContacto: '',
    newTipoContacto: ''
}

export const EMPTY_CLIENTE = {
    empresa: '',
    nombre:'',
    puesto: '',
    cp: '',
    estado: '',
    municipio: '',
    colonia: '',
    calle: '',
    perfil: ''
}

export const EMPTY_PROSPECTO = {
    descripcion: '',
    vendedor: '',
    preferencia: '',
    motivo: '',
    cliente: '',
    tipoProyecto: '',
    estatusContratacion: '',
    estatusProspecto: '',
    newEstatusProspecto: '',
    newTipoProyecto: '',
    newEstatusContratacion: ''
}

//Colors
export const DARK_BLUE = "#325693"
export const DARK_BLUE_20 = "#32569320"
export const DARK_BLUE_40 = "#32569340"
export const DARK_BLUE_60 = "#32569360"
export const DARK_BLUE_80 = "#32569380"
export const DARK_BLUE_90 = "#32569390"

export const BLUE = "#7096c1"
export const BLUE_20 = "#7096c120"
export const BLUE_40 = "#7096c140"
export const BLUE_60 = "#7096c160"
export const BLUE_80 = "#7096c180"

export const L_BLUE = "#c7d0df"
export const L_BLUE_20 = "#c7d0df20"
export const L_BLUE_40 = "#c7d0df40"
export const L_BLUE_60 = "#c7d0df60"
export const L_BLUE_80 = "#c7d0df80"

export const BONE = "#ecedef"
export const BONE_20 = "#ecedef20"
export const BONE_40 = "#ecedef40"
export const BONE_60 = "#ecedef60"
export const BONE_80 = "#ecedef80"

export const GOLD = '#b4a26d'
export const GOLD_20 = '#b4a26d20'
export const GOLD_40 = '#b4a26d40'
export const GOLD_60 = '#b4a26d60'
export const GOLD_80 = '#b4a26d80'

// Table
export const TABLE_SIZE = 20

// Columns table
// Leads
export const LEADS_COLUMNS = [                
    {
        Header: ' ',
        accessor: 'actions',
    },
    {
        Header: 'Nombre',
        accessor: 'nombre',
    },
    {
        Header: 'Contacto',
        accessor: 'contacto',
    },
    {
        Header: 'Comentario',
        accessor: 'comentario',
    },
    {
        Header: 'Servicios',
        accessor: 'servicios',
    },
    {
        Header: 'Empresa',
        accessor: 'empresa',
    },
    {
        Header: 'Origen',
        accessor: 'origen',
    },
    {
        Header: 'Fecha',
        accessor: 'fecha',
    },
]

export const PROSPECTOS_COLUMNS = [                
    {
        Header: ' ',
        accessor: 'actions',
    },
    {
        Header: 'Lead',
        accessor: 'lead',
    },
    {
        Header: 'Empresa',
        accessor: 'empresa',
    },
    {
        Header: 'Cliente',
        accessor: 'cliente',
    },
    {
        Header: 'Tipo Proyecto',
        accessor: 'tipoProyecto',
    },
    {
        Header: 'Descripción del prospecto',
        accessor: 'descripcion',
    },
    {
        Header: 'Vendedor',
        accessor: 'vendedor',
    },
    {
        Header: 'Preferencia de contacto',
        accessor: 'preferencia',
    },
    {
        Header: 'Estatus del prospecto',
        accessor: 'estatusProspecto',
    },
    {
        Header: 'Motivo contratación o cancelación',
        accessor: 'motivo',
    },
    {
        Header: 'Estatus contratación',
        accessor: 'estatusContratacion',
    },
    {
        Header: 'Fecha de conversión',
        accessor: 'fechaConversion',
    },
]

export const CONTACTO_COLUMNS = [
    {
        Header: 'Usuario',
        accessor: 'usuario',
    },
    {
        Header: 'Medio Contacto',
        accessor: 'medio',
    },
    {
        Header: 'Estado',
        accessor: 'estado',
    },
    {
        Header: 'Comentario',
        accessor: 'comentario',
    },
    {
        Header: 'Fecha',
        accessor: 'fecha',
    },
]

export const CLIENTES_COLUMNS = [
    {
        Header: ' ',
        accessor: 'actions',
    },
    {
        Header: 'Empresa',
        accessor: 'empresa',
    },
    {
        Header: 'Dirección',
        accessor: 'direccion',
    },
    {
        Header: 'Perfil',
        accessor: 'perfil',
    },
    {
        Header: 'Nombre',
        accessor: 'nombre',
    },
    {
        Header: 'Puesto',
        accessor: 'puesto',
    },
    {
        Header: 'Fecha',
        accessor: 'fecha',
    },
]

export const CUENTAS_COLUMNS = [
    {
        Header: ' ',
        accessor: 'actions',
    },
    {
        Header: 'Nombre',
        accessor: 'nombre',
    },
    {
        Header: 'Empresa',
        accessor: 'empresa',
    },
    {
        Header: 'Banco',
        accessor: 'banco',
    },
    {
        Header: 'Número de cuenta',
        accessor: 'numero',
    },
    {
        Header: 'Balance',
        accessor: 'balance',
    },
    {
        Header: 'Descripción',
        accessor: 'descripcion',
    },
    {
        Header: 'Estatus',
        accessor: 'estatus',
    },
    {
        Header: 'Tipo',
        accessor: 'tipo',
    },
    {
        Header: 'Fecha',
        accessor: 'fecha',
    },
]

export const EDOS_CUENTAS_COLUMNS = [
    {
        Header: ' ',
        accessor: 'actions',
    },
    {
        Header: 'Estado de cuenta',
        accessor: 'estado',
    },
    {
        Header: 'Fecha',
        accessor: 'fecha',
    },
]

export const EDOS_CUENTAS_COLUMNS_2 = [
    {
        Header: ' ',
        accessor: 'actions',
    },
    {
        Header: 'Cuenta',
        accessor: 'cuenta',
    },
    {
        Header: 'Estado de cuenta',
        accessor: 'estado',
    },
    {
        Header: 'Fecha',
        accessor: 'fecha',
    },
]

export const TRASPASOS_COLUMNS = [
    {
        Header: ' ',
        accessor: 'actions',
    },
    {
        Header: 'Origen',
        accessor: 'origen',
    },
    {
        Header: 'Destino',
        accessor: 'destino',
    },
    {
        Header: 'Monto',
        accessor: 'monto',
    },
    {
        Header: 'Comentario',
        accessor: 'comentario',
    },
    {
        Header: 'Usuario',
        accessor: 'usuario',
    },

    {
        Header: 'Fecha',
        accessor: 'fecha',
    },
]