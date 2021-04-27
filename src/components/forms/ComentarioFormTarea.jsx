import React, { Component } from 'react'
import { ItemSlider } from '../../components/singles'
import { Form } from 'react-bootstrap'
import { validateAlert } from '../../functions/alert'
import { Button } from '../../components/form-components'
import { MentionsInput, Mention } from 'react-mentions'
import classNames from '../../styles/mention.scss'
class ComentarioFormTarea extends Component {

    handleChange = e => {
        const { onChange } = this.props
        const { value } = e.target
        onChange({target:{value: value, name: 'comentario'}})
    }

    render() {
        const { addComentario, form, handleChange, color, users, proyectos } = this.props
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
                            <div>
                                <label className="col-form-label font-weight-bold text-dark-60">
                                    Comentario
                                </label>
                            </div>
                            <MentionsInput  value = { form.comentario }  onChange={this.handleChange}  placeholder = 'COMENTARIO'
                                className="mentions"   rows = '3' spellCheck = { false }>
                                <Mention trigger = "@" data = { users }  className={classNames.mentions__mention} 
                                    renderSuggestion = { ( suggestion, search, highlightedDisplay, index, focused ) => (
                                        <div className={`user ${focused ? 'focused' : ''}`}>
                                            {highlightedDisplay}
                                        </div>
                                    ) } />
                                <Mention markup = "@[__display__](#:__id__)" trigger = "#" data = { proyectos } /* className={classNames.mentions__mention}  */
                                    style = {{ color: 'red'}}
                                    renderSuggestion = { ( suggestion, search, highlightedDisplay, index, focused ) => (
                                        <div className={`user ${focused ? 'focused' : ''}`}>
                                            {highlightedDisplay}
                                        </div>
                                    ) } />
                            </MentionsInput>
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

export default ComentarioFormTarea