import { 
    faProjectDiagram, 
    faUsers, faUsersCog, faTasks,
    faFileInvoiceDollar, faThList, faChartLine,
    faFolder, faShoppingBasket, faToolbox, faFolderOpen, faFilePrescription, faReceipt ,faFilePdf, faCoins, faHandHoldingUsd,
    faArchive, faFileSignature, faLongArrowAltRight, faSearchDollar, faFunnelDollar, faLongArrowAltLeft, faPassport, 
    faPiggyBank, faExchangeAlt, faBalanceScale, faWallet, 
    faUserTie, faSitemap, faHospital, faUserFriends, faUserShield, faCalendarCheck, faHandsHelping, faGavel
} from '@fortawesome/free-solid-svg-icons'

export const URL_DEV = 'http://127.0.0.1:8000/api/';

export const MODULES = [
    {
        name: 'Mi proyecto',
        slug: 'mi-proyecto',
        icon: faProjectDiagram,
        sub: [],
        url: '/mi-proyecto'
    },
    {
        name: 'Usuarios',
        slug: 'usuarios',
        icon: faUsers,
        sub: [
            {
                name: 'Usuarios',
                slug: 'usuarios',
                icon: faUsersCog,
                url: 'usuarios/usuarios'
            },
            {
                name: 'Tareas',
                slug: 'tareas',
                icon: faTasks,
                url: 'usuarios/tareas'
            }
        ]
    },
    {
        name: 'Presupuesto',
        slug: 'presupuesto',
        icon: faFileInvoiceDollar,
        sub: [
            {
                name: 'Conceptos',
                slug: 'conceptos',
                icon: faThList
            },
            {
                name: 'Presupuesto',
                slug: 'presupuesto',
                icon: faFileInvoiceDollar,
            },
            {
                name: 'Rendimiento',
                slug: 'rendimiento',
                icon: faChartLine,
            }
        ]
    },
    {
        name: 'Proyectos',
        slug: 'proyectos',
        icon: faFolder,
        sub: [
            {
                name: 'Compras',
                slug: 'compras',
                icon: faShoppingBasket
            },
            {
                name: 'Herramientas',
                slug: 'herramientas',
                icon: faToolbox,
            },
            {
                name: 'Proyectos',
                slug: 'proyectos',
                icon: faFolderOpen,
            },
            {
                name: 'Remisión',
                slug: 'remision',
                icon: faFilePrescription
            },
            {
                name: 'Solicitud de compra',
                slug: 'solicitud-compra',
                icon: faReceipt,
            },
            {
                name: 'Reportes',
                slug: 'reportes',
                icon: faFilePdf,
            },
            {
                name: 'Utilidad',
                slug: 'utilidad',
                icon: faCoins
            },
            {
                name: 'Ventas',
                slug: 'ventas',
                icon: faHandHoldingUsd,
            }
        ]
    },
    {
        name: 'Administración',
        slug: 'administracion',
        icon: faArchive,
        sub: [
            {
                name: 'Contratos',
                slug: 'contratos',
                icon: faFileSignature
            },
            {
                name: 'Egresos',
                slug: 'egresos',
                icon: faLongArrowAltRight,
            },
            {
                name: 'Facturación',
                slug: 'facturacion',
                icon: faSearchDollar,
            },
            {
                name: 'Flujos',
                slug: 'flujos',
                icon: faFunnelDollar
            },
            {
                name: 'Ingresos',
                slug: 'ingresos',
                icon: faLongArrowAltLeft,
            },
            {
                name: 'Documentos',
                slug: 'documentos',
                icon: faPassport,
            }
        ]
    },
    {
        name: 'Bancos',
        slug: 'bancos',
        icon: faPiggyBank,
        sub: [
            {
                name: 'Cuentas',
                slug: 'Cuentas',
                icon: faWallet
            },
            {
                name: 'Estados de cuenta',
                slug: 'estados-cuenta',
                icon: faBalanceScale,
            },
            {
                name: 'Traspasos',
                slug: 'traspasos',
                icon: faExchangeAlt,
            }
        ]
    },
    {
        name: 'Recursos Humanos',
        slug: 'rh',
        icon: faSitemap,
        sub: [
            {
                name: 'Empleados',
                slug: 'empleados',
                icon: faUserFriends
            },
            {
                name: 'IMSS',
                slug: 'imss',
                icon: faHospital,
            },
            {
                name: 'Nómina admin',
                slug: 'nomina-admin',
                icon: faUserTie,
            },
            {
                name: 'Nómina obras',
                slug: 'nomina-obras',
                icon: faUserShield
            },
            {
                name: 'Préstamos',
                slug: 'prestamos',
                icon: faHandsHelping,
            },
            {
                name: 'Vacaciones',
                slug: 'vacaciones',
                icon: faCalendarCheck,
            }
        ]
    },
    {
        name: 'Normas',
        slug: 'normas',
        icon: faGavel,
        sub: [],
        url:'normas'
    }
]