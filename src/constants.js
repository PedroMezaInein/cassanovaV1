import { 
    faProjectDiagram, 
    faUsers, faUsersCog, faTasks, faBuilding,
    faFileInvoiceDollar, faThList, faChartLine,
    faFolder, faShoppingBasket, faToolbox, faFolderOpen, faFilePrescription, faReceipt ,faFilePdf, faCoins, faHandHoldingUsd,
    faArchive, faFileSignature, faLongArrowAltRight, faSearchDollar, faFunnelDollar, faLongArrowAltLeft, faPassport, 
    faPiggyBank, faExchangeAlt, faBalanceScale, faWallet, 
    faUserTie, faSitemap, faHospitalAlt, faUserFriends, faUserShield, faCalendarCheck, faHandsHelping, faGavel
} from '@fortawesome/free-solid-svg-icons'


// DEV
export const URL_DEV = 'http://127.0.0.1:8000/api/';
export const URL_ASSETS = 'http://127.0.0.1:8000';

// PROD / DEV
/* export const URL_DEV = 'https://api-app1.herokuapp.com/api/';
export const URL_ASSETS = 'https://api-app1.herokuapp.com'; */


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
    'faGavel':faGavel
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