import React, { Component } from 'react'
import { Form } from 'react-bootstrap' 
import { Input, Button } from '../../form-components'
import { faPlus} from '@fortawesome/free-solid-svg-icons' 
import { validateAlert, questionAlert } from '../../../functions/alert'

class PartidaForm extends Component {
    handleChange = function(e, element){
        const { editSubpartida } = this.props
        editSubpartida(e.target.innerHTML.toUpperCase(), element)
    }.bind(this);
    render() {
        const { title, form, onChange, addSubpartida, deleteSubpartida, onSubmit, formeditado, requirevalidation, partida,  ...props } = this.props
        return (
            <Form id="form-partida"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-partida')
                    }
                }
                {...props}
            >
                <div className="form-group row form-group-marginless pt-4">
                    <div className="col-md-5">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            name="partida"
                            value={form.partida}
                            placeholder="NOMBRE DE LA PARTIDA"
                            onChange={onChange}
                            iconclass={"far fa-window-maximize"}
                            messageinc="Incorrecto. Ingresa el nombre de la partida."
                        />
                    </div>
                    <div className="col-md-5">
                        <Input
                            requirevalidation={0}
                            formeditado={formeditado}
                            name="subpartida"
                            value={form.subpartida}
                            placeholder="SUBPARTIDA "
                            onChange={onChange}
                            iconclass={"far fa-window-restore"}
                        />
                    </div>
                    <div className="col-md-2 mt-3 d-flex justify-content-center align-items-center">
                        <Button icon={faPlus} pulse={"pulse-ring"} className={"btn btn-icon btn-light-primary pulse pulse-primary mr-5"} onClick={addSubpartida} />
                    </div>
                </div>
                <div className="d-flex flex-wrap justify-content-center">
                    {
                        partida ?
                            partida.subpartidas.map((element, key) => {
                                return (
                                    <div className="tagify form-control p-2 d-flex justify-content-center align-items-center w-auto" tabIndex="-1" style={{ borderWidth: "0px" }} key={key}>
                                        <div className=" image-upload d-flex px-3 align-items-center tagify__tag tagify__tag--success tagify--noAnim"  >
                                            <div title="Borrar archivo" className="tagify__tag__removeBtn" role="button"
                                                aria-label="remove tag" onClick={(e) => { questionAlert('¿ESTÁS SEGURO?', 'DESEAS ELIMINAR EL SUBPARTIDA', () => deleteSubpartida(element))}} >
                                            </div>
                                            <div>
                                                <span className="tagify__tag-text p-1 white-space" contentEditable = { true } 
                                                    onBlur={ (e) => { e.preventDefault(); this.handleChange(e,element); } }
                                                    onInput={ (e) => { e.preventDefault(); this.handleChange(e,element); } } >
                                                    {element.nombre}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        : ''
                    }
                    {
                        form.subpartidas.map((element, key) => {
                            return (
                                <div className="tagify form-control p-2 d-flex justify-content-center align-items-center w-auto" tabIndex="-1" style={{ borderWidth: "0px" }} key={key}>
                                    <div className=" image-upload d-flex px-3 align-items-center tagify__tag tagify__tag--primary tagify--noAnim"  >
                                        <div
                                            title="Borrar archivo"
                                            className="tagify__tag__removeBtn"
                                            role="button"
                                            aria-label="remove tag"
                                            onClick={(e) => { questionAlert('¿ESTÁS SEGURO?', 'DESEAS ELIMINAR EL SUBPARTIDA', () => deleteSubpartida(element)) }} 
                                        >
                                        </div>
                                        <div>
                                            <span className="tagify__tag-text p-1 white-space">
                                                {element}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                {
                    form.partida !== '' && (form.subpartidas.length > 0 || form.subpartidasEditable.length > 0) ?
                        <div className="mt-3 text-center">
                            <Button icon='' className="mx-auto" 
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        validateAlert(onSubmit, e, 'form-partida')
                                    }
                                }
                                text="ENVIAR" />
                        </div>
                        : ''
                }

            </Form>
        )
    }
}

export default PartidaForm