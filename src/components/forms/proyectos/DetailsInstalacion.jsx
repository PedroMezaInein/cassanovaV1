// import React, { Component } from 'react';
// import moment from 'moment'
// import 'moment/locale/es' 
// import { deleteAlert } from '../../../functions/alert'

// class DetailsInstalacion extends Component {

//     formatDay (fecha){
//         let fecha_instalacion = moment(fecha);
//         let format = fecha_instalacion.locale('es').format("DD MMM YYYY");
//         return format.replace('.', '');
//     }

//     getactiveClass = () => {
//         const { instalacion } = this.props
//         switch(instalacion.tipo){
//             case 'Instalación':
//                 return 'color-instalacion'
//             case 'Mantenimiento preventivo':
//                 return 'color-mantenimiento-preventivo'
//             default:
//                 return 'color-mantenimiento'
//         }
//     }

//     render() {
//         const { instalacion, deleteInstalacion } = this.props
//         return (
//             <>
            
//                 {
//                     instalacion.tipo === 'Instalación'&& deleteInstalacion && 
//                     <div className="d-flex justify-content-flex-end mt-3">
//                         <span className="btn btn-sm btn-bg-light btn-hover-light-danger text-dark-50 text-hover-danger font-weight-bolder font-size-13px py-3" 
//                             onClick={(e) => { deleteAlert('¿ESTÁS SEGURO DE ELIMINAR LA INSTALACIÓN DEL EQUIPO?', '',  () => deleteInstalacion(instalacion.instalacion)) }}>
//                             <i className="far fa-trash-alt icon-md text-dark-50 text-hover-danger mr-1"></i>
//                             ELIMINAR
//                         </span>
//                     </div>
//                 }
//                 {
                    
//                     instalacion&&
//                     <div className="card-body py-5 mx-4 mt-7">
//                         <div className="text-center mb-5">
//                             <span className={`font-size-h4 font-weight-bolder text-gray-700 letter-spacing-4px ${this.getactiveClass()}`}>
//                                 DATOS DE {instalacion.tipo}
//                             </span>
//                         </div>
//                         <div className="d-flex flex-center">
//                             <div className={`d-flex ${instalacion.tipo !== 'Mantenimiento correctivo' ? 'justify-content-between' : 'justify-content-center'} mx-auto w-xl-900px`}>
//                                 <div className="octagon d-flex flex-center h-150px w-150px bg-white mx-2">
//                                     <div className="text-center">
//                                         <i className={`flaticon2-calendar-5 icon-3x ${this.getactiveClass()}`}></i>
//                                         <div className="mt-1">
//                                             <div className="font-size-h6 font-weight-bolder text-gray-800 d-flex align-items-center justify-content-center">
//                                                 <div className="min-w-70px">{this.formatDay(instalacion.instalacion.fecha)}</div>
//                                             </div>
//                                             <span className="text-dark-50 font-weight-light">FECHA</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {
//                                     instalacion.tipo !== 'Mantenimiento correctivo' &&
//                                         <>
//                                             <div className="octagon d-flex flex-center h-150px w-150px bg-white mx-2">
//                                                 <div className="text-center">
//                                                     <i className={`flaticon-clock-2 icon-3x ${this.getactiveClass()}`}></i>
//                                                     <div className="mt-1">
//                                                         <div className="font-size-h6 font-weight-bolder text-gray-800 d-flex align-items-center justify-content-center" >
//                                                             <div className="min-w-50px">{instalacion.instalacion.duracion} {instalacion.instalacion.duracion === 1 ? 'AÑO':'AÑOS'}</div>
//                                                         </div>
//                                                         <span className="text-dark-50 font-weight-light">DURACIÓN</span>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="octagon d-flex flex-center h-150px w-150px bg-white mx-2">
//                                                 <div className="text-center">
//                                                     <i className={`flaticon-calendar-with-a-clock-time-tools icon-3x ${this.getactiveClass()}`}></i>
//                                                     <div className="mt-1">
//                                                         <div className="font-size-h6 font-weight-bolder text-gray-800 d-flex align-items-center justify-content-center">
//                                                             <div className="min-w-50px">{instalacion.instalacion.periodo} {instalacion.instalacion.periodo === 1 ? 'MES':'MESES'}</div>
//                                                         </div>
//                                                         <span className="text-dark-50 font-weight-light">PERIODO</span>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </>
//                                 }
//                             </div>
//                         </div>
//                         <div className="text-dark-75 font-weight-bolder mt-8">
//                             <span className="text-center font-size-h5 mb-7 d-block">{instalacion.instalacion.equipo.texto}</span>
//                             {
//                                 instalacion.instalacion.equipo.observaciones &&
//                                 <span className="mb-3 d-block">
//                                     <div className="font-weight-light text-justify"><span className={`font-weight-bold ${this.getactiveClass()}`}>OBSERVACIONES: </span>{instalacion.instalacion.equipo.observaciones}</div>
//                                 </span>
//                             }
//                             {
//                                 instalacion.instalacion.proyecto.nombre&&
//                                 <span className="mb-3 d-block">
//                                     <span className={`${this.getactiveClass()}`}>PROYECTO: </span><span>{instalacion.instalacion.proyecto.nombre}</span>
//                                 </span>
//                             }
//                             {
//                                 instalacion.contadorPeriodo&&
//                                 <span className="mb-3 d-block">
//                                     <span className={`${this.getactiveClass()}`}>PERIODO: </span><span>{instalacion.contadorPeriodo} DE {(instalacion.instalacion.duracion*12)/instalacion.instalacion.periodo} MESES</span>
//                                 </span>
//                             }
//                             {
//                                 instalacion.instalacion.equipo.ficha_tecnica &&
//                                 <span className="d-block text-right">
//                                     <u><a rel="noopener noreferrer"  href={instalacion.instalacion.equipo.ficha_tecnica} target="_blank" className={`font-weight-bolder text-hover-primary ${this.getactiveClass()}`}>FICHA TECNICA</a></u>
//                                 </span>
//                             }
//                         </div>
//                     </div>
//                 }
//             </>
//         );
//     }
// }

// export default DetailsInstalacion;