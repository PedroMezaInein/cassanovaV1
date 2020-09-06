import React, { Component } from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import {Tooltip, Card, Nav, Tab} from 'react-bootstrap'
import Moment from 'react-moment'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import ItemSlider from '../../singles/ItemSlider';
import {ProcesoTicketForm} from '../../forms';
class CalidadView extends Component {

    getIniciales = nombre => {
        let aux = nombre.split(' ');
        let iniciales = ''
        aux.map((element) => {
            if (element !== '-')
                iniciales = iniciales + element.charAt(0) + ' '
        })
        return iniciales
    }

    render() {

        const { data, changeEstatus, handleChange, form, options, onChange, onSubmit, generateEmail, deleteFile } = this.props
        return (
            <>
                <div className="card card-custom gutter-b">
                    <div className="card-body">
                        <div className="d-flex">
                            <div className="mr-4" id="symbol_calidad">
                                <div className="symbol symbol-50 symbol-lg-120 symbol-light-primary">
                                    <span className="font-size-h6 symbol-label font-weight-boldest ">
                                        {
                                            data ?
                                                data.proyecto ?
                                                    this.getIniciales(data.proyecto.nombre)
                                                : ''
                                            : ''
                                        }
                                    </span>
                                </div>
                            </div>

                            <div className="flex-grow-1">
                                <div className="d-flex align-items-start justify-content-between flex-wrap mt-2">
                                    <div className="mr-3">
                                        <div className="d-flex align-items-center text-dark font-size-h5 font-weight-bold mr-3">
                                            {
                                                data ?
                                                    data.proyecto ?
                                                        data.proyecto.nombre
                                                    : ''
                                                : ''
                                            }
                                        </div>
                                        <div className="d-flex flex-wrap mt-2">
                                            <div className="text-muted font-weight-bold my-2">
                                                <i className="far fa-user-circle icon-md mr-2"></i>
                                                {
                                                    data ?
                                                        data.usuario ?
                                                            data.usuario.name
                                                        : ''
                                                    : ''
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                    {
                                        data ?
                                            data.estatus_ticket ?
                                                <span className="label label-lg bg- label-inline font-weight-bold py-2" 
                                                    style={{
                                                        color: `${data.estatus_ticket.letra}`,
                                                        backgroundColor: `${data.estatus_ticket.fondo}`,
                                                        fontSize:"11.7px"
                                                    }} >
                                                    {data.estatus_ticket.estatus}
                                                </span>
                                            :''
                                        :''
                                    }
                                    </div>
                                </div>

                                <div className="d-flex align-items-start flex-wrap justify-content-between">
                                    <div className="font-weight-bold text-dark-50 py-lg-2 col-md-10 text-justify pl-0">
                                        {
                                            data ?
                                                data.descripcion
                                            : ''
                                        }
                                    </div>
                                    {
                                        data ?
                                            data.estatus_ticket ?
                                                data.estatus_ticket.estatus === 'En revisión' ?   
                                                    <>
                                                        <OverlayTrigger overlay={<Tooltip>Aceptar</Tooltip>}>
                                                            <a onClick={() => { changeEstatus('Aceptado') }} className="btn btn-icon btn-light-success success2 btn-sm mr-2 ml-auto"><i className="flaticon2-check-mark icon-sm"></i></a>
                                                        </OverlayTrigger>
                                                        <OverlayTrigger overlay={<Tooltip>Rechazar</Tooltip>}>
                                                            <a onClick={() => { changeEstatus('Rechazado') }} className="btn btn-icon  btn-light-danger btn-sm pulse pulse-danger"><i className="flaticon2-cross icon-sm"></i></a>
                                                        </OverlayTrigger>
                                                    </>
                                                : ''
                                            : ''
                                        : '' 
                                    }
                                    
                                </div>
                            </div>
                        </div>
                        <div className="separator separator-solid my-4"></div>
                        <div className="row row-paddingless">
                            <div className="col-md-4">
                                <div className = "d-flex justify-content-center" >
                                    <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                        <div className="symbol-label">
                                            <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                <SVG src={toAbsoluteUrl('/images/svg/File.svg')} />
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-size-h6 text-dark-75 font-weight-bolder">
                                            {
                                                data ?
                                                    data.partida ?
                                                        data.partida.nombre
                                                    : ''
                                                : ''
                                            }
                                        </div>
                                        <div className="font-size-sm text-muted font-weight-bold mt-1">PARTIDA</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className = "d-flex justify-content-center" >
                                    <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                        <div className="symbol-label">
                                            <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                <SVG src={toAbsoluteUrl('/images/svg/Tools.svg')} />
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-size-h6 text-dark-75 font-weight-bolder">
                                            {
                                                data ?
                                                    data.tipo_trabajo ?
                                                        data.tipo_trabajo.tipo
                                                    : ''
                                                : ''
                                            }
                                        </div>
                                        <div className="font-size-sm text-muted font-weight-bold mt-1">TIPO DE TRABAJO</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className = "d-flex justify-content-center" >
                                    <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                        <div className="symbol-label">
                                            <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                <SVG src={toAbsoluteUrl('/images/svg/Box1.svg')} />
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-size-h6 text-dark-75 font-weight-bolder">
                                            {
                                                data ?
                                                    data.created_at ?
                                                        <Moment format="DD/MM/YYYY">
                                                            {data.created_at}
                                                        </Moment>
                                                    : ''
                                                : ''
                                            }
                                        </div>
                                        <div className="font-size-sm text-muted font-weight-bold mt-1">FECHA</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div class="row gutter-b">
                    {
                        data ?
                            data.estatus_ticket ?
                                (data.estatus_ticket.estatus !== 'En revisión' && data.estatus_ticket.estatus !== 'Rechazado') || (data.fotos.length) ?
                                    <div className={data.estatus_ticket.estatus === 'En proceso' || data.estatus_ticket.estatus === 'Terminado' ? 'col-lg-4' : 'col-lg-12'}>
                                        <Card className="card-custom card-stretch">
                                            <Tab.Container defaultActiveKey="first">
                                                <Card.Header>
                                                    <Card.Title>
                                                        <span class="card-label">Adjuntos</span>
                                                    </Card.Title>
                                                    <div class="card-toolbar">
                                                        <Nav variant="pills">
                                                            {
                                                                data.fotos.length ?
                                                                <Nav.Item>
                                                                    <Nav.Link eventKey={data.fotos.length ===0 ?"second":"first"}>FOTOS</Nav.Link>
                                                                </Nav.Item>
                                                                :''
                                                            }
                                                            {
                                                                data.estatus_ticket.estatus==='Rechazado' ? 
                                                                '':
                                                                    <Nav.Item>
                                                                        <Nav.Link eventKey={data.fotos.length ===0 ?"first":"second"}>PRESUPUESTO</Nav.Link>
                                                                    </Nav.Item>
                                                                    
                                                            }
                                                        </Nav>
                                                    </div>
                                                </Card.Header>
                                                <Card.Body>

                                                    <Tab.Content>
                                                        <Tab.Pane eventKey={data.fotos.length ===0 ?"second":"first"}>
                                                            {
                                                                data.fotos.length ?
                                                                    <>
                                                                        {/* <div className={data.estatus_ticket.estatus !== 'En espera' && data.estatus_ticket.estatus !== 'Rechazado' 
                                                                    ? 'col-md-6' : 'col-md-12'}> */}
                                                                        <ItemSlider items={data.fotos} item={'fotos'} />
                                                                        {/* </div> */}
                                                                    </>
                                                                    : ''
                                                            }
                                                        </Tab.Pane>
                                                        {
                                                            data.estatus_ticket.estatus==='Rechazado' ? 
                                                            '':
                                                                <Tab.Pane eventKey={data.fotos.length ===0 ?"first":"second"}>
                                                                    {/* <div className = { data.fotos.length ? 'col-md-6' : 'col-md-12'}> */}
                                                                    <ItemSlider multiple={false} items={form.adjuntos.presupuesto.files}
                                                                        item='presupuesto' handleChange={handleChange} />
                                                                    {/* </div> */}
                                                                </Tab.Pane>
                                                            
                                                        }
                                                    </Tab.Content>
                                                </Card.Body>
                                            </Tab.Container>
                                        </Card>
                                    </div>
                                    : ''
                                : ''
                            : ''
                    }
                    {
                        data ?
                            data.estatus_ticket ?
                                (data.estatus_ticket.estatus === 'En proceso' || data.estatus_ticket.estatus === 'Terminado') ?
                                    <div class="col-lg-8">
                                        <div class="card card-custom card-stretch">
                                            <div class="card-header">
                                                <div class="card-title">
                                                    <h3 class="card-label">TICKET EN PROCESO</h3>
                                                </div>
                                            </div>
                                            <div class="card-body pt-0">

                                                <>
                                                    <ProcesoTicketForm form={form} options={options} onChange={onChange} formEditado={1}
                                                        handleChange={handleChange} onSubmit={onSubmit} generateEmail={generateEmail} estatus={data.estatus_ticket.estatus}
                                                        deleteFile={deleteFile} />
                                                </>

                                            </div>
                                        </div>
                                    </div>
                                    : ''
                                : ''
                            : ''
                    }
                </div>
            </>
        )
    }

}

export default CalidadView


















// import React, { Component } from 'react'
// import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
// import Tooltip from 'react-bootstrap/Tooltip'
// import Moment from 'react-moment'
// import SVG from "react-inlinesvg";
// import { toAbsoluteUrl } from "../../../functions/routers"
// import ItemSlider from '../../singles/ItemSlider';
// import {ProcesoTicketForm} from '../../forms';
// class CalidadView extends Component {

//     getIniciales = nombre => {
//         let aux = nombre.split(' ');
//         let iniciales = ''
//         aux.map((element) => {
//             if (element !== '-')
//                 iniciales = iniciales + element.charAt(0) + ' '
//         })
//         return iniciales
//     }

//     render() {

//         const { data, changeEstatus, handleChange, form, options, onChange, onSubmit, generateEmail, deleteFile } = this.props
//         return (
//             <>
//                 <div className="card card-custom gutter-b">
//                     <div className="card-body">
//                         <div className="d-flex">
//                             <div className="mr-4" id="symbol_calidad">
//                                 <div className="symbol symbol-50 symbol-lg-120 symbol-light-primary">
//                                     <span className="font-size-h6 symbol-label font-weight-boldest ">
//                                         {
//                                             data ?
//                                                 data.proyecto ?
//                                                     this.getIniciales(data.proyecto.nombre)
//                                                 : ''
//                                             : ''
//                                         }
//                                     </span>
//                                 </div>
//                             </div>

//                             <div className="flex-grow-1">
//                                 <div className="d-flex align-items-start justify-content-between flex-wrap mt-2">
//                                     <div className="mr-3">
//                                         <div className="d-flex align-items-center text-dark font-size-h5 font-weight-bold mr-3">
//                                             {
//                                                 data ?
//                                                     data.proyecto ?
//                                                         data.proyecto.nombre
//                                                     : ''
//                                                 : ''
//                                             }
//                                         </div>
//                                         <div className="d-flex flex-wrap mt-2">
//                                             <div className="text-muted font-weight-bold my-2">
//                                                 <i className="far fa-user-circle icon-md mr-2"></i>
//                                                 {
//                                                     data ?
//                                                         data.usuario ?
//                                                             data.usuario.name
//                                                         : ''
//                                                     : ''
//                                                 }
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="mb-2">
//                                     {
//                                         data ?
//                                             data.estatus_ticket ?
//                                                 <span className="label label-lg bg- label-inline font-weight-bold py-2" 
//                                                     style={{
//                                                         color: `${data.estatus_ticket.letra}`,
//                                                         backgroundColor: `${data.estatus_ticket.fondo}`,
//                                                         fontSize:"11.7px"
//                                                     }} >
//                                                     {data.estatus_ticket.estatus}
//                                                 </span>
//                                             :''
//                                         :''
//                                     }
//                                     </div>
//                                 </div>

//                                 <div className="d-flex align-items-start flex-wrap justify-content-between">
//                                     <div className="font-weight-bold text-dark-50 py-lg-2 col-md-10 text-justify pl-0">
//                                         {
//                                             data ?
//                                                 data.descripcion
//                                             : ''
//                                         }
//                                     </div>
//                                     {
//                                         data ?
//                                             data.estatus_ticket ?
//                                                 data.estatus_ticket.estatus === 'En revisión' ?   
//                                                     <>
//                                                         <OverlayTrigger overlay={<Tooltip>Aceptar</Tooltip>}>
//                                                             <a onClick={() => { changeEstatus('Aceptado') }} className="btn btn-icon btn-light-success success2 btn-sm mr-2 ml-auto"><i className="flaticon2-check-mark icon-sm"></i></a>
//                                                         </OverlayTrigger>
//                                                         <OverlayTrigger overlay={<Tooltip>Rechazar</Tooltip>}>
//                                                             <a onClick={() => { changeEstatus('Rechazado') }} className="btn btn-icon  btn-light-danger btn-sm pulse pulse-danger"><i className="flaticon2-cross icon-sm"></i></a>
//                                                         </OverlayTrigger>
//                                                     </>
//                                                 : ''
//                                             : ''
//                                         : '' 
//                                     }
                                    
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="separator separator-solid my-4"></div>
//                         <div className="row row-paddingless">
//                             <div className="col-md-4">
//                                 <div className = "d-flex justify-content-center" >
//                                     <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
//                                         <div className="symbol-label">
//                                             <span className="svg-icon svg-icon-lg svg-icon-primary">
//                                                 <SVG src={toAbsoluteUrl('/images/svg/File.svg')} />
//                                             </span>
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <div className="font-size-h6 text-dark-75 font-weight-bolder">
//                                             {
//                                                 data ?
//                                                     data.partida ?
//                                                         data.partida.nombre
//                                                     : ''
//                                                 : ''
//                                             }
//                                         </div>
//                                         <div className="font-size-sm text-muted font-weight-bold mt-1">PARTIDA</div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="col-md-4">
//                                 <div className = "d-flex justify-content-center" >
//                                     <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
//                                         <div className="symbol-label">
//                                             <span className="svg-icon svg-icon-lg svg-icon-primary">
//                                                 <SVG src={toAbsoluteUrl('/images/svg/Tools.svg')} />
//                                             </span>
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <div className="font-size-h6 text-dark-75 font-weight-bolder">
//                                             {
//                                                 data ?
//                                                     data.tipo_trabajo ?
//                                                         data.tipo_trabajo.tipo
//                                                     : ''
//                                                 : ''
//                                             }
//                                         </div>
//                                         <div className="font-size-sm text-muted font-weight-bold mt-1">TIPO DE TRABAJO</div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="col-md-4">
//                                 <div className = "d-flex justify-content-center" >
//                                     <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
//                                         <div className="symbol-label">
//                                             <span className="svg-icon svg-icon-lg svg-icon-primary">
//                                                 <SVG src={toAbsoluteUrl('/images/svg/Box1.svg')} />
//                                             </span>
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <div className="font-size-h6 text-dark-75 font-weight-bolder">
//                                             {
//                                                 data ?
//                                                     data.created_at ?
//                                                         <Moment format="DD/MM/YYYY">
//                                                             {data.created_at}
//                                                         </Moment>
//                                                     : ''
//                                                 : ''
//                                             }
//                                         </div>
//                                         <div className="font-size-sm text-muted font-weight-bold mt-1">FECHA</div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         {
//                             data ?
//                                 data.estatus_ticket ?
//                                     (data.estatus_ticket.estatus !== 'En revisión' && data.estatus_ticket.estatus !== 'Rechazado') || (data.fotos.length) ?
//                                         <>
//                                             <div className="separator separator-solid my-4"></div>
                                            
//                                             <div className="row row-paddingless">
//                                                 {
//                                                     data.fotos.length ?
//                                                         <div className={data.estatus_ticket.estatus !== 'En espera' && data.estatus_ticket.estatus !== 'Rechazado' 
//                                                             ? 'col-md-6' : 'col-md-12'}>
//                                                             <div className="text-center text-dark font-size-h5 font-weight-bold">
//                                                                 Fotos
//                                                             </div>
//                                                             <ItemSlider items={data.fotos} item={'fotos'} />
//                                                         </div>
//                                                     : ''

//                                                 }
//                                                 <div className = { data.fotos.length ? 'col-md-6' : 'col-md-12'}>
//                                                     <div className="text-center text-dark font-size-h5 font-weight-bold">
//                                                         Presupuesto
//                                                     </div>
//                                                     <ItemSlider multiple = { false } items = { form.adjuntos.presupuesto.files } 
//                                                         item = 'presupuesto' handleChange = { handleChange } /> 
//                                                 </div>
//                                             </div>
//                                         </>
//                                     : ''
//                                 : ''
//                             : ''
//                         }
//                         {
//                             data ?
//                                 data.estatus_ticket ?
//                                     (data.estatus_ticket.estatus === 'En proceso' || data.estatus_ticket.estatus === 'Terminado') ?
//                                         <>
//                                             <div className="separator separator-solid my-4"></div>
//                                             <ProcesoTicketForm form = { form } options = { options } onChange = { onChange } formEditado = { 1 } 
//                                                 handleChange = { handleChange } onSubmit = { onSubmit } generateEmail = { generateEmail } estatus = { data.estatus_ticket.estatus }
//                                                 deleteFile = { deleteFile } />
//                                         </>
//                                     : ''
//                                 : ''
//                             :''
//                         }
//                     </div>
//                 </div>
//             </>
//         )
//     }

// }

// export default CalidadView