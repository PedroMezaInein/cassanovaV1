import React, { Component } from 'react'
import { onChangeAdjunto } from '../../../../functions/onChanges'
import { MentionsInput, Mention } from 'react-mentions'
import classNames from '../../../../styles/mention.scss'
class WriteComment extends Component {

    handleChange = e => {
        const { onChange } = this.props
        const { value } = e.target
        onChange({target:{value: value, name: 'comentario'}})
    }

    render() {
        const { form, clearFiles, mentions, onSubmit } = this.props
        return (
            <div className="card-spacer-x pb-10 pt-5">
                <div className="card card-custom shadow-sm">
                    <div className="card-body p-0">
                        <form>
                            <div className="d-block">
                                <div className="border-0 ql-container ql-snow" style={{ height: 'auto' }}>
                                    <div className="ql-blank px-8 py-5">
                                        <MentionsInput  value = { form.comentario }  onChange={this.handleChange}  placeholder = 'COMENTARIO'
                                            className="mentions-white"  rows = '3' spellCheck = { false }>
                                            <Mention trigger = "@" data = { mentions.users }  className={classNames.mentions__mention} 
                                                renderSuggestion = { ( suggestion, search, highlightedDisplay, index, focused ) => (
                                                    <div className={`user ${focused ? 'focused' : ''}`}>
                                                        {highlightedDisplay}
                                                    </div> ) } />
                                            <Mention markup = "@[__display__](#:__id__)" trigger = "#" data = { mentions.proyectos } /* className={classNames.mentions__mention}  */
                                                style = {{ color: 'red'}}
                                                renderSuggestion = { ( suggestion, search, highlightedDisplay, index, focused ) => (
                                                    <div className={`user ${focused ? 'focused' : ''}`}>
                                                        {highlightedDisplay}
                                                    </div>
                                                ) } />
                                        </MentionsInput>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between py-5 pl-8 pr-5 border-top">
                                <div className="d-flex align-items-center mr-3">
                                    <div className="btn-group mr-4" onClick = { onSubmit } >
                                        <span className="btn btn-primary font-weight-bold px-6">Enviar</span>
                                    </div>
                                    <span>
                                        <label htmlFor="file-upload" className="btn btn-icon btn-sm btn-clean mr-2 dz-clickable mb-0">
                                            <i className="flaticon2-clip-symbol"></i>
                                        </label>
                                        <input 
                                            id="file-upload" 
                                            type="file"
                                            onChange={ (e) => { this.setState({...this.state,form: onChangeAdjunto(e, form) });}}
                                            placeholder={form.adjuntos.adjunto_comentario.placeholder}
                                            value={form.adjuntos.adjunto_comentario.value}
                                            name='adjunto_comentario'
                                            accept="image/*, application/pdf"
                                        />
                                    </span>
                                    <div>
                                        {
                                            form.adjuntos.adjunto_comentario.files.map((file, key) => {
                                                return (
                                                    <div className="tagify form-control p-1 col-md-12  d-flex justify-content-center align-items-center" tabIndex="-1" style={{ borderWidth: "0px" }} key={key}>
                                                        <div className="tagify__tag tagify__tag--primary tagify--noAnim" >
                                                            <div
                                                                title="Borrar archivo"
                                                                className="tagify__tag__removeBtn"
                                                                role="button"
                                                                aria-label="remove tag"
                                                                onClick = {(e) => { e.preventDefault(); clearFiles('adjunto_comentario', key); }}
                                                            >
                                                            </div>
                                                            {
                                                                file.url ?
                                                                    <a rel="noopener noreferrer"  href={file.url} target="_blank" className="pt-2 pb-2">
                                                                        <div><span className="tagify__tag-text p-1 white-space">{file.name}</span></div>
                                                                    </a>
                                                                    :
                                                                    <div><span className="tagify__tag-text p-1 white-space pt-2 pb-2">{file.name}</span></div>
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default WriteComment