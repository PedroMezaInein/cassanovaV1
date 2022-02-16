// import React, { Component } from 'react'
// import { setMoneyText } from '../../../functions/setters'
// import moment from 'moment';
// import 'moment/locale/es';

// class TablePresupuestos extends Component {
//     formatDay(fecha) {
//         let fecha_presupuesto = moment(fecha);
//         let formatDate = fecha_presupuesto.locale('es').format("DD MMM YYYY");
//         return formatDate.replace('.', '');
//     }
//     isActiveButton(direction) {
//         const { presupuestos_info } = this.props
//         if (presupuestos_info.total_paginas > 1) {
//             if (direction === 'prev') {
//                 if (presupuestos_info.numPage > 0) {
//                     return true;
//                 }
//             } else {
//                 if (presupuestos_info.numPage < 10) {
//                     if (presupuestos_info.numPage < presupuestos_info.total_paginas - 1) {
//                         return true;
//                     }
//                 }
//             }
//         }
//         return false;
//     }

//     setEstatusPresupuesto = (presupuesto) => {
//         let estatus = ''
//         let fondo = ''
//         let letra = ''
//         if(presupuesto.pivot.url === null && presupuesto.pivot.motivo_cancelacion === null){
//             estatus = 'En espera'
//             fondo = '#d9f1ff'
//             letra = '#0b6ca3'
//         }
//         if(presupuesto.pivot.url !== null){
//             estatus = 'Aceptado'
//             fondo = '#f0e3fd'
//             letra = '#0b6ca3'
//         }
//         if(presupuesto.pivot.motivo_cancelacion !== null){
//             estatus = 'Rechazado'
//             fondo = '#f0e3fd'
//             letra = '#764ca2'
//         }
//         return(
//             <div className="text-center white-space-nowrap">
//                 <span style = { { backgroundColor:`${fondo}`, color: `${letra}`, border: 'transparent', padding: '0.3rem 0.6rem', width:'auto', 
//                     margin: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '8.5px', fontWeight: 500, 
//                     borderRadius:'0.42rem' }} > {estatus} </span>
//             </div>
//         )    
//     }

//     render() {
//         const { presupuestos, onClickPrev, onClickNext, presupuestos_info, typePresupuesto, openFilter, changeTicketTab } = this.props
//         return (
//             <div className="container">
//                 <div className="text-center">
//                     <div className="btn-group btn-group-sm">
//                         <button type="button" className={`btn btn-fill-vert btn-group-presupuestos ${typePresupuesto === 'proyecto' ? 'active' : ''}`} onClick={ () => { changeTicketTab('proyecto')}}>Presupuestos del proyecto</button>
//                         <button type="button" className={`btn btn-fill-vert btn-group-presupuestos ${typePresupuesto === 'all' ? 'active' : ''}`} onClick={ () => {changeTicketTab('all')}}>Todos los presupuestos</button>
//                     </div>
//                 </div>
//                 <div className="d-flex justify-content-end mb-10">
//                     <span className='btn btn-sm btn-transparent btn-hover-light-primary text-primary font-weight-bolder font-size-13px box-shadow-button' onClick={() => { openFilter('presupuesto')}}>
//                         <i className="la la-filter icon-xl text-primary"></i> Filtrar
//                     </span>
//                 </div>
//                 <div className="tab-content">
//                     <div className="table-responsive">
//                         <table className="table table-borderless table-vertical-center table-hover  rounded bg-white" id="table-tickets">
//                             <thead>
//                                 <tr className="text-center text-proyecto">
//                                     <th>Estatus</th>
//                                     <th>ID</th>
//                                     <th style={{ minWidth: '100px' }}>Fecha</th>
//                                     {
//                                         typePresupuesto === 'all'?
//                                             <th style={{ minWidth: '100px' }}>Proyecto</th>
//                                         :<></>
//                                     }
//                                     <th style={{ minWidth: '125px' }}>Fase</th>
//                                     <th style={{ minWidth: '125px' }}>Costo con IVA</th>
//                                     <th>Tiempo de ejecución</th>
//                                     <th style={{ minWidth: '90px' }}></th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {
//                                     presupuestos.length === 0 ?
//                                         <tr className="text-dark-75 font-weight-light text-center" >
//                                             <td colSpan={typePresupuesto === 'all'?'8':'7'}>
//                                                 Aún no hay presupuestos
//                                             </td>
//                                         </tr>
//                                         : <></>
//                                 }
//                                 {
//                                     presupuestos.map((pres, index) => {
//                                         return(
//                                             <tr className="text-dark-75 font-weight-light text-center" key={index}>
//                                                 <td> { this.setEstatusPresupuesto(pres.presupuesto[0]) } </td>
//                                                 <td> { pres.presupuesto[0].pivot.identificador } </td>
//                                                 <td> { this.formatDay(pres.presupuesto[0].fecha) } </td>
//                                                 { typePresupuesto === 'all'? pres.presupuesto[0].proyecto.nombre : <></> }
//                                                 <td> { pres.presupuesto[0].area.nombre } </td>
//                                                 <td> { setMoneyText( pres.presupuesto[0].pivot.monto ) } </td>
//                                                 <td> { pres.presupuesto[0].tiempo_ejecucion } días </td>
//                                                 <td className="white-space-nowrap">
//                                                     <div className="d-flex justify-content-evenly">
//                                                         <a className="btn btn-icon btn-bg-light btn-text-info btn-hover-info btn-sm"
//                                                             target = '_blank' href = { pres.url } rel="noreferrer">
//                                                             <i className="las la-file-pdf text-info icon-lg" />
//                                                         </a>
//                                                     </div>
//                                                 </td>
//                                             </tr>    
//                                         )
//                                     })
//                                 }
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//                 <div className={presupuestos_info.total === 0 ? "d-flex justify-content-end" : "d-flex justify-content-between"} >
//                     {
//                         presupuestos_info.total > 0 ?
//                             <div className="text-body font-weight-bolder font-size-md">
//                                 Página {parseInt(presupuestos_info.numPage) + 1} de {presupuestos_info.total_paginas}
//                             </div>
//                             : ''
//                     }
//                     <div>
//                         {
//                             this.isActiveButton('prev') ?
//                                 <span className="btn btn-icon btn-xs btn-light-primary mr-2 my-1" onClick={onClickPrev}><i className="ki ki-bold-arrow-back icon-xs"></i></span>
//                                 : ''
//                         }
//                         {
//                             this.isActiveButton('next') ?
//                                 <span className="btn btn-icon btn-xs btn-light-primary mr-2 my-1" onClick={onClickNext}><i className="ki ki-bold-arrow-next icon-xs"></i></span>
//                                 : ''
//                         }
//                     </div>
//                 </div>
//             </div>
//         )
//     }
// }

// export default TablePresupuestos