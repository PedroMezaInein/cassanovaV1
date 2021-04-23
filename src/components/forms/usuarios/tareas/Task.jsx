import React, { Component } from 'react'
import { WriteComment, CommentsPanel } from '../../../../components/forms'
import { printDate } from '../../../../functions/printers'
import moment from 'moment'
import { Dropdown, DropdownButton } from 'react-bootstrap'
class Task extends Component {

    colorDate(){
        const { tarea } = this.props
        let textColor=''
        var date = moment(tarea.fecha_limite)
        var now = moment();
        if (now > date) {
            textColor= 'text-danger'
        } else {
            textColor= 'text-success'
        }
        return textColor
    }

    isActiveTag = (tag, tarea) => {
        if(tag.value ==='nueva_etiqueta')
            return false
        let flag = tarea.etiquetas.find((etiqueta) => {
            return etiqueta.id.toString() === tag.value
        })
        if(flag)
            return false
        return true
    }

    render() {
        const {showTask, mostrarListPanel, tarea, completarTarea, updateFav, form, onChange, clearFiles, openModalEdit, user, mentions, onSubmit, options, updateTagInTask } = this.props
        if(tarea)
            return (
                <div className={showTask ? 'col-xl-12 gutter-b' : 'd-none'}>
                    <div className="card card-custom card-stretch">
                    <div class="card-header border-0 pt-5">
                            <div class="d-flex align-items-center">
                                <span>
                                    <span className="btn btn-light btn-hover-secondary font-weight-bold p-3" onClick={() => { mostrarListPanel() }}>
                                        <i className="fas fa-arrow-left icon-md p-0"></i>
                                    </span>
                                </span>
                                <div className="ml-3">
                                    <div className="text-dark-75 font-weight-bolder mb-1 font-size-h4">{tarea.titulo}</div>
                                    <span className="text-muted font-weight-bold d-block mt-1">
                                        <div className="row form-group-marginless w-100 mx-0 justify-content-center">
                                            <div className="col-md-auto text-center px-0">
                                                <span className={`font-weight-bolder font-size-lg ${this.colorDate()}`}>
                                                    {printDate(tarea.fecha_limite)}
                                                </span>
                                            </div>
                                            <div className="col-md-auto">
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <span className={`btn btn-icon btn-xs text-hover-warning`}
                                                        onClick={(e) => { e.preventDefault(); updateFav(tarea) }}>
                                                        <i className={`flaticon-star ${tarea.prioritario ? 'text-warning' : 'text-muted'}`}></i>
                                                    </span>
                                                    <span id="down-tag">
                                                        <DropdownButton
                                                            title={
                                                                <i className="flaticon-add-label-button text-muted p-0 font-size-14px"></i>
                                                            }
                                                            id={`dropdown-button-tag`}
                                                            className="d-inline-block"
                                                            drop={'left'}>
                                                            {
                                                                options.tags.map((tag, key) => {
                                                                    if(this.isActiveTag(tag, tarea))
                                                                        return (
                                                                            <div key={key}>
                                                                                <Dropdown.Item className="p-0" key={key} onClick={() => { updateTagInTask(tag, tarea) }}>
                                                                                    <span className="navi-link w-100">
                                                                                        <span className="navi-text">
                                                                                            <span className="label label-xl label-inline rounded-0 w-100 font-weight-bold"
                                                                                                style={{
                                                                                                    color: `${tag.name ==='Nueva etiqueta' ? '#80808f' : 'white' }`,
                                                                                                    backgroundColor: tag.color ,
                                                                                                }}>
                                                                                                { tag.name }
                                                                                            </span>
                                                                                        </span>
                                                                                    </span>
                                                                                </Dropdown.Item>
                                                                            </div>
                                                                        )
                                                                    return <></>
                                                                })
                                                            }
                                                        </DropdownButton>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-md-auto d-contents">
                                                {
                                                    tarea.etiquetas ?
                                                        tarea.etiquetas.map((etiqueta) => {
                                                            return (
                                                                <div className="d-table ml-1 cursor-pointer " id="tag-tagify" key={etiqueta.id} >
                                                                    <div className="tagify align-items-center border-0 d-inline-block">
                                                                        <div className="d-flex align-items-center tagify__tag tagify__tag__newtable px-3px border-radius-3px m-0 flex-row-reverse" style={{ backgroundColor: etiqueta.color, color: 'white!important' }}>
                                                                            <div className="tagify__tag__removeBtn ml-0 px-0" style={{ color: 'white!important' }} onClick={(e) => { console.log('ETIQUETA', etiqueta) }}></div>
                                                                            <div className="p-2-5px">
                                                                                <span className="tagify__tag-text white-space font-weight-bold letter-spacing-0-4 font-size-11px" style={{ backgroundColor: etiqueta.color, color: 'white' }}>
                                                                                    <div className="mt-2px">
                                                                                        {etiqueta.titulo}
                                                                                    </div>
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                        : <></>
                                                }
                                            </div>
                                        </div>
                                    </span>
                                </div>
                            </div>
                            <div class="card-toolbar">
                                {
                                    tarea.responsables.map((responsable) => {
                                        if (responsable.name === user.name) {
                                            return (
                                                <span key={user.id} className="btn btn-default btn-icon btn-sm mr-2" onClick={(e) => { openModalEdit(tarea) }}>
                                                    <i className="las la-edit icon-xl"></i>
                                                </span>
                                            )
                                        }
                                        return <></>
                                    })
                                }
                                <span className="btn btn-light-success btn-sm text-uppercase font-weight-bolder text-hover" onClick={() => { completarTarea(tarea) }}>
                                    COMPLETAR
                                </span>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="mb-3">
                                <div className="cursor-pointer">
                                    <div className="d-flex align-items-start card-spacer-x py-4">
                                        <div className="d-flex flex-column flex-grow-1 flex-wrap">
                                            <div className="d-flex">
                                                <span className="font-size-lg font-weight-bold text-dark-75 mr-3 align-self-center">
                                                    {tarea.responsables.length > 1 ? 'Responsables:':'Responsable:'}
                                                </span>
                                                <div className="font-size-lg font-weight-bold text-dark-50 mr-3 text-justify">
                                                    {
                                                        tarea.responsables.map((responsable, index) => {
                                                            return(
                                                                <span key = { index } className ='mr-2'>
                                                                    { responsable.name }
                                                                    { index + 1 < tarea.responsables.length && ','}
                                                                </span>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-spacer-x pt-2 pb-5 toggle-off-item">
                                        <div className="mb-1 text-justify font-weight-light mb-5">
                                            {tarea.descripcion}
                                        </div>
                                    </div>
                                </div>
                                <div className="separator separator-dashed separator-border-3"></div>
                                <CommentsPanel tarea = { tarea }  proyectos = { mentions.proyectos } />
                            </div>
                        </div>
                        <WriteComment form={form} onChange={onChange} clearFiles={clearFiles} mentions = { mentions } onSubmit = { onSubmit } />
                    </div>
                </div>
            )
        return (<></>)
    }
}

export default Task