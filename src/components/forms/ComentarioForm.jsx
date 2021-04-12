import React, { Component } from 'react'
import { InputGray } from '../form-components'
import { ItemSlider } from '../../components/singles'
import { Form } from 'react-bootstrap'
import { validateAlert } from '../../functions/alert'
import { Button } from '../../components/form-components'

class ComentarioForm extends Component {
    render() {
        const { addComentario, form, onChange, handleChange, color } = this.props
        return (
            <div>
                <Form id="form-comentario"
                    onSubmit={
                        (e) => {
                            e.preventDefault();
                            validateAlert(addComentario, e, 'form-comentario')
                        }
                    }>
                    <div className="form-group row form-group-marginless mt-3 d-flex justify-content-center">
                        <div className="col-md-11 align-self-center">
                            <InputGray
                                withtaglabel={1}
                                withtextlabel={1}
                                withplaceholder={1}
                                withicon={0}
                                requirevalidation={0}
                                placeholder='COMENTARIO'
                                value={form.comentario}
                                name='comentario'
                                onChange={onChange}
                                as="textarea"
                                rows="3"
                            />
                        </div>
                    </div>
                    <div className="form-group row form-group-marginless mt-3 d-flex justify-content-center">
                        <div className="col-md-12 d-flex justify-content-center align-self-center mt-4">
                            <div className='w-100'>
                                <div className="text-center font-weight-bolder mb-2">
                                    {form.adjuntos.adjunto_comentario.placeholder}
                                </div>
                                <ItemSlider
                                    multiple={true}
                                    items={form.adjuntos.adjunto_comentario.files}
                                    item='adjunto_comentario'
                                    handleChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="card-footer py-3 pr-1">
                        <div className="row mx-0">
                            <div className="col-lg-12 text-right pr-0 pb-0">
                                <Button icon='' className={`btn btn-light-${color} font-weight-bold`}
                                    onClick={
                                        (e) => {
                                            e.preventDefault();
                                            validateAlert(addComentario, e, 'form-comentario')
                                        }
                                    } text="ENVIAR" />
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        )
    }
}

export default ComentarioForm