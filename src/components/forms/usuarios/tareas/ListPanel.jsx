import React, { Component } from 'react'
import { ItemTaskList } from '../../../../components/forms'
import Form from 'react-bootstrap/Form'
class ListPanel extends Component {
    render() {
        const { openModal, onChange, form, options, mostrarTarea, showListPanel, tareas } = this.props
        return (
            <div className={showListPanel ? 'col-xl-12 gutter-b' : 'col-xl-6'}>
                <div className="card card-custom card-stretch">
                    <div className="card-header p-6 border-0">
                        <div>
                            <Form.Control className="form-control text-uppercase form-control-solid"
                                value={form.filtrarTarea} onChange={onChange} name='filtrarTarea' as="select">
                                <option value={0}>Selecciona el filtrado</option>
                                {
                                    options.filtrarTareas.map((tarea, key) => {
                                        return (
                                            <option key={key} value={tarea.value} className="bg-white">{tarea.text}</option>
                                        )
                                    })
                                }
                            </Form.Control>
                        </div>
                        <span className="btn btn-light-success btn-sm font-weight-bolder align-self-center" onClick={(e) => { openModal() }} >Nueva tarea</span>
                    </div>                   
                    <div className="card-body pt-2">
                        <div className="table-responsive">
                            <div className="list list-hover min-w-500px">
                                <ItemTaskList tareas = { tareas } mostrarTarea={mostrarTarea}/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="d-flex align-items-center my-2 my-6 card-spacer-x justify-content-end">
                            <div className="d-flex align-items-center mr-2">
                                <span className="text-muted font-weight-bold mr-2">1 - 10 de 20</span>
                            </div>
                            <span className="btn btn-default btn-icon btn-sm mr-2">
                                <i className="ki ki-bold-arrow-back icon-sm"></i>
                            </span>
                            <span className="btn btn-default btn-icon btn-sm">
                                <i className="ki ki-bold-arrow-next icon-sm"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ListPanel