import React, { Component } from 'react'
import { ItemTaskList } from '../../../../components/forms'
import Form from 'react-bootstrap/Form'
class ListPanel extends Component {

    getPagination = () => {
        const { limit, page, numTotal } = this.props.pagination
        let limiteInf = (limit*page) + 1
        let limiteSup = (limit*(page + 1))
        limiteSup = limiteSup > numTotal ? numTotal : limiteSup
        return limiteInf.toString() + ' - ' + limiteSup.toString()
    }

    printNextButton = () => {
        const { pagination: {limit, page, numTotal}, next } = this.props
        let limiteSup = Math.ceil(numTotal / limit)
        if(page === limiteSup - 1)
            return(
                <span className="btn btn-default btn-icon btn-sm disabled">
                    <i className="ki ki-bold-arrow-next icon-sm"></i>
                </span>
            )
        return(
            <span className="btn btn-default btn-icon btn-sm text-hover text-hover-muted" onClick = { next } >
                <i className="ki ki-bold-arrow-next icon-sm"></i>
            </span>
        )
    }

    printPrevButton = () => {
        const { pagination: { page }, prev } = this.props
        if(page === 0)
            return(
                <span className="btn btn-default btn-icon btn-sm disabled mr-2">
                    <i className="ki ki-bold-arrow-back icon-sm"></i>
                </span>
            )
        return(
            <span className="btn btn-default btn-icon btn-sm text-hover text-hover-muted mr-2" onClick = { prev } >
                <i className="ki ki-bold-arrow-back icon-sm text-muted"></i>
            </span>
            )
    }

    render() {
        const { openModal, onChange, form, options, mostrarTarea, showListPanel, tareas, user, updateFav, pagination, addLabel, filterByName, updateTagInTask } = this.props
        return (
            <div className={showListPanel ? 'col-xl-12 gutter-b' : 'd-none'}>
                <div className="card card-custom card-stretch">
                    <div className="card-header p-6 border-0">
                        <div className = 'd-flex'>
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
                            <Form.Control className="form-control text-uppercase form-control-solid ml-2" placeholder = 'Nombre'
                                value={form.filtrarTareaNombre} onChange={onChange} onBlur = { filterByName } name='filtrarTareaNombre'>
                            </Form.Control>
                        </div>
                        <span className="btn btn-light-success btn-sm font-weight-bolder align-self-center" onClick={(e) => { openModal() }} >Nueva tarea</span>
                    </div>                   
                    <div className="card-body pt-2">
                        <div className="table-responsive" id="table-tareas">
                            <table className="table table-head-custom table-head-bg table-vertical-center table-hover">
                                <tbody>
                                    <ItemTaskList addLabel = { addLabel } user = { user } tareas = { tareas } mostrarTarea={mostrarTarea} updateFav = { updateFav }  options = { options } updateTagInTask={updateTagInTask}/>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {
                        pagination.limit < pagination.numTotal &&
                            <div>
                                <div className="d-flex align-items-center my-2 my-6 card-spacer-x justify-content-end">
                                    <div className="d-flex align-items-center mr-2">
                                        <span className="text-muted font-weight-bold mr-2">{this.getPagination()} de {pagination.numTotal}</span>
                                    </div>
                                    { this.printPrevButton() }
                                    { this.printNextButton() }
                                </div>
                            </div>
                    }
                </div>
            </div>
        )
    }
}

export default ListPanel