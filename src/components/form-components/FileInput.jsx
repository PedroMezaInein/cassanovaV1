import React, { Component } from 'react'

class FileInput extends Component {

    state = {
        fileValido: !this.props.requirevalidation
    }

    validarFileInput(e) {
        const { value } = e.target
        const { requirevalidation } = this.props
        if (value !== '' && value !== null && value !== undefined) {
            if (requirevalidation) {
                if (value > 0) {
                    this.setState({
                        fileValido: true
                    })
                } else {
                    this.setState({
                        fileValido: false

                    })
                }
            } else {
                this.setState({
                    fileValido: true

                })
            }
        } else {
            if (requirevalidation) {
                this.setState({
                    fileValido: false
                })
            } else {
                this.setState({
                    fileValido: true
                })
            }

        }
    }

    componentDidUpdate(nextProps) {
        if (nextProps.value !== this.props.value)
            if (!nextProps.requirevalidation) {
                this.setState({
                    ...this.state,
                    fileValido: true
                })
            } else {
                if (this.props.value !== '') {
                    this.validarFileInput({ target: { value: this.props.value } })
                }
            }

    }

    componentDidMount() {
        const { formeditado, value } = this.props
        if (formeditado) {
            this.validarFileInput({ target: { value: value } })
        }
    }

    render() {
        const { onChangeAdjunto, placeholder, value, name, id, accept, files, deleteAdjunto, messageinc, deleteAdjuntoAvance, _key, classbtn, iconclass, color_label, classinput, requirevalidation, ...props } = this.props
        let newfileValido = files.length > 0 ? true: false;
        return (
            <>
                {/* <label className="col-form-label ">{placeholder}</label> */}
                {/* <div className="input-icon">
                    <span className="input-icon input-icon-right">
                        <i className={"fas fa-paperclip m-0 kt-font-boldest text-primary"}></i>
                    </span>
                    <div className={'custom-file'}>
                        <input
                            onChange={(e) => { e.preventDefault(); this.validarFileInput(e); onChangeAdjunto(e) }}
                            value={value}
                            name={name}
                            type="file"
                            id={id}
                            accept={accept}
                            {...props}
                            className={fileValido ? " custom-file-input is-valid " : " custom-file-input is-invalid"}
                        />
                        <label className="custom-file-label" htmlFor="customFile"></label>
                    </div>
                </div> */}
                <span>
                    <label htmlFor={id} className={classbtn}>
                        <i className={iconclass}></i> {placeholder}
                    </label>
                    <input
                        onChange={(e) => { e.preventDefault(); this.validarFileInput(e); onChangeAdjunto(e) }}
                        value={value}
                        name={name}
                        type="file"
                        id={id}
                        accept={accept}
                        {...props}
                        className={classinput}
                    />
                </span>
                {
                    requirevalidation?
                    <span className={newfileValido ? "form-text text-danger hidden" : "form-text text-danger is-invalid font-size-xs"}> {messageinc} </span>
                    :<></>
                }
                <div className="flex-wrap d-flex d-flex justify-content-center align-items-center">
                    {
                        files.map((file, key) => {
                            return (
                                <div className={this.props.multiple ? "tagify form-control p-1 col-md-6  d-flex justify-content-center align-items-center" : "tagify form-control p-1 col-md-12  d-flex justify-content-center align-items-center"} tabIndex="-1" style={{ borderWidth: "0px" }} key={key}>
                                    <div className={`tagify__tag tagify__tag--${color_label ? 'color_label' : 'primary'} tagify--noAnim`} >
                                        <div
                                            title="Borrar archivo"
                                            className="tagify__tag__removeBtn"
                                            role="button"
                                            aria-label="remove tag"
                                            onClick=
                                            {
                                                deleteAdjunto
                                                    ? (e) => { e.preventDefault(); deleteAdjunto(name, key); }
                                                    : deleteAdjuntoAvance
                                                        ?
                                                        (e) => { e.preventDefault(); deleteAdjuntoAvance(name, key, _key) }
                                                        : ''
                                            }
                                        >
                                        </div>
                                        {
                                            file.url ?
                                                <a rel="noopener noreferrer"  href={file.url} target="_blank" className="pt-2 pb-2">
                                                    <div><span className="tagify__tag-text p-1 white-space font-weight-bold">{file.name}</span></div>
                                                </a>
                                                :
                                                <div><span className="tagify__tag-text p-1 white-space pt-2 pb-2 font-weight-bold">{file.name}</span></div>
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </>
        )
    }
}

export default FileInput