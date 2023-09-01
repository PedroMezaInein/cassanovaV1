import empresasTable from './EmpresasTable'
import leadsTable from './LeadsTable'
import dataTable from './Data'
import facturaTable from './Administracion/FacturaTable'
import SolicitudFacturacionTabla from './Solicitudes/SolicitudFacturacionTabla'
import FacturasFormTable from './FacturasFormTable'

import PaginaWeb from './crm/PaginaWeb'
import PaginaRp from './crm/PaginaRp'
import LeadContacto from './crm/LeadContacto'
import NoContratados from './crm/NoContratados'
import RhProveedores from './crm/RhProveedores'
import TableLeadDetenidos from './crm/TableLeadDetenidos'
import TableLeadContratados from './crm/TableLeadContratados'
import TableLeadsNegociacion from './crm/TableLeadsNegociacion'

export const EmpresasTable = empresasTable
export const LeadsTable = leadsTable
export const DataTable = dataTable
export const FacturaTable = facturaTable

export { SolicitudFacturacionTabla, FacturasFormTable,
    PaginaWeb, 
    PaginaRp,
    LeadContacto,
    NoContratados,
    RhProveedores,
    TableLeadDetenidos,
    TableLeadContratados,
    TableLeadsNegociacion
 }