import React, { Component } from 'react'

class CommentsPanel extends Component {

    render() {
        return (
            <div className="cursor-pointer toggle-off mt-6">
                <div className="d-flex align-items-start card-spacer-x bg-comment">
                    <div className="symbol symbol-35 mr-3 align-self-center">
                        <span className="symbol-label" style={{ backgroundImage: 'url("/default.jpg")' }}></span>
                    </div>
                    <div className="d-flex flex-column flex-grow-1 flex-wrap mr-2">
                        <div className="d-flex">
                            <div className="font-weight-bolder text-primary mr-2">OMAR ABAROA</div>
                            <div className="font-weight-bold text-muted">
                                HACE 1 HORA
                            </div>
                        </div>
                        <div className="d-flex flex-column">
                            <div className="text-muted font-weight-bold toggle-on-item" data-inbox="toggle">Estos textos hacen parecerlo un español que se puede leer. </div>
                            <div className="d-flex flex-column font-size-sm font-weight-bold ">
                                <span className="d-flex align-items-center text-muted text-hover-primary py-1 justify-content-flex-end">
                                    <span className="flaticon2-clip-symbol text-primary icon-1x mr-2"></span>
                                    Requerimientos.pdf
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CommentsPanel