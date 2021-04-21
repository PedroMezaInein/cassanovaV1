import React, { Component } from 'react'

class WriteComment extends Component {

    render() {
        return (
            <div className="card-spacer-x pb-10 pt-5">
                <div className="card card-custom shadow-sm">
                    <div className="card-body p-0">
                        <form>
                            <div className="d-block">
                                <div className="border-0 ql-container ql-snow" style={{ height: '85px' }}>
                                    <div className="ql-editor ql-blank px-8">
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
                                <div className="d-flex align-items-center">
                                    <span className="btn btn-icon btn-sm btn-clean text-hover-danger">
                                        <i className="flaticon2-rubbish-bin-delete-button"></i>
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