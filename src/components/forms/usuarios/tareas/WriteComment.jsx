import React, { Component } from 'react'
import { InputGray } from '../../../form-components'

class WriteComment extends Component {

    render() {
        const { form, onChange } = this.props
        return (
            <div className="card-spacer-x pb-10 pt-5">
                <div className="card card-custom shadow-sm">
                    <div className="card-body p-0">
                        <form>
                            <div className="d-block">
                                <div className="border-0 ql-container ql-snow" style={{ height: 'auto' }}>
                                    <div className="ql-editor ql-blank px-8">
                                        <InputGray
                                            withtaglabel={0}
                                            withtextlabel={0}
                                            withplaceholder={1}
                                            withicon={0}
                                            withformgroup={0}
                                            placeholder="COMENTARIO"
                                            name="comentario"
                                            value={form.comentario}
                                            onChange={onChange}
                                            rows={3}
                                            as='textarea'
                                            customclass='text-area-white'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between py-5 pl-8 pr-5 border-top">
                                <div className="d-flex align-items-center mr-3">
                                    <div className="btn-group mr-4">
                                        <span className="btn btn-primary font-weight-bold px-6">Enviar</span>
                                    </div>
                                    <span className="btn btn-icon btn-sm btn-clean mr-2 dz-clickable">
                                        <i className="flaticon2-clip-symbol"></i>
                                    </span>
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