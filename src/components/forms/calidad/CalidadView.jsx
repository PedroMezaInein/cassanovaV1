import React, { Component } from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'


class CalidadView extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        const { form, onChange, changeCP, estado, municipio, colonias, updateColonia, formeditado } = this.props
        return (
            <div className="card card-custom gutter-b">
                <div className="card-body">

                    <div className="d-flex">

                        <div className="flex-shrink-0 mr-4">
                            <div className="symbol symbol-50 symbol-lg-120 symbol-light-primary">
                                <span className="font-size-h3 symbol-label font-weight-boldest">K-D-V</span>
                            </div>
                        </div>

                        <div className="flex-grow-1">
                            <div className="d-flex align-items-center justify-content-between flex-wrap mt-2">
                                <div className="mr-3">
                                    <div className="d-flex align-items-center text-dark font-size-h5 font-weight-bold mr-3">KERALTY - DISEÑO - VIA 515 - PROYECTO</div>
                                    <div className="d-flex flex-wrap my-2">
                                        <div className="text-muted font-weight-bold mr-lg-5 mr-5 mb-lg-0 mb-2 mt-2">
                                            <i className="far fa-user-circle icon-md mr-2"></i>
                                                KERALTY MEXICO SA DE CV - CLIENTE
                                        </div>
                                    </div>
                                </div>

                                <div className="my-lg-0 my-1">
                                    <OverlayTrigger overlay={<Tooltip>Aceptar</Tooltip>}>
                                        <a className="btn btn-icon btn-light-success success2 btn-sm mr-2 ml-auto"><i className="flaticon2-check-mark icon-sm"></i></a>
                                    </OverlayTrigger>
                                    <OverlayTrigger overlay={<Tooltip>Rechazar</Tooltip>}>
                                        <a className="btn btn-icon  btn-light-danger btn-sm pulse pulse-danger"><i className="flaticon2-cross icon-sm"></i></a>
                                    </OverlayTrigger>
                                </div>
                            </div>

                            <div className="d-flex align-items-center flex-wrap justify-content-between">
                                <div className="font-weight-bold text-dark-50 py-lg-2 col-md-12 text-justify pl-0">
                                    I distinguish three main text objectives could be merely to inform people.
                                    A second could be persuade people.You want people to bay objective. - DESCRIPCIÓN
                                </div>
                            </div>
                            {/* <div className="d-flex align-items-center flex-wrap justify-content-between">
                                <div className="font-weight-bold text-dark-50 py-lg-2 col-md-8 text-justify pl-0">
                                    I distinguish three main text objectives could be merely to inform people.
                                    A second could be persuade people.You want people to bay objective. - DESCRIPCIÓN
                                </div>
                                <div className="d-flex justify-content-center col-md-4">
                                    <img className="rounded img-calidad" src="https://www.arquima.net/wp-content/uploads/2018/03/madera-3.jpg" />
                                </div>
                            </div> */}
                        </div>
                    </div>
                    <div className="d-flex justify-content-center mt-4">
                        <img className="rounded img-calidad" src="https://www.arquima.net/wp-content/uploads/2018/03/madera-3.jpg" />
                    </div>

                    <div className="separator separator-solid my-4"></div>
                    <div className="row row-paddingless">
                        <div className="col-md-4">
                            <div className="d-flex justify-content-center">
                                <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                    <div className="symbol-label">
                                        <span className="svg-icon svg-icon-lg svg-icon-primary">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                    <polygon points="0 0 24 0 24 24 0 24" />
                                                    <path d="M5.85714286,2 L13.7364114,2 C14.0910962,2 14.4343066,2.12568431 14.7051108,2.35473959 L19.4686994,6.3839416 C19.8056532,6.66894833 20,7.08787823 20,7.52920201 L20,20.0833333 C20,21.8738751 19.9795521,22 18.1428571,22 L5.85714286,22 C4.02044787,22 4,21.8738751 4,20.0833333 L4,3.91666667 C4,2.12612489 4.02044787,2 5.85714286,2 Z" fill="#000000" fillRule="nonzero" opacity="0.3" />
                                                    <rect fill="#000000" x="6" y="11" width="9" height="2" rx="1" />
                                                    <rect fill="#000000" x="6" y="15" width="5" height="2" rx="1" />
                                                </g>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <div className="font-size-h6 text-dark-75 font-weight-bolder">PARTIDA</div>
                                    <div className="font-size-sm text-muted font-weight-bold mt-1">PARTIDA</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="d-flex justify-content-center">
                                <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                    <div className="symbol-label">
                                        <span className="svg-icon svg-icon-lg svg-icon-primary">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                    <rect x="0" y="0" width="24" height="24" />
                                                    <path d="M15.9497475,3.80761184 L13.0246125,6.73274681 C12.2435639,7.51379539 12.2435639,8.78012535 13.0246125,9.56117394 L14.4388261,10.9753875 C15.2198746,11.7564361 16.4862046,11.7564361 17.2672532,10.9753875 L20.1923882,8.05025253 C20.7341101,10.0447871 20.2295941,12.2556873 18.674559,13.8107223 C16.8453326,15.6399488 14.1085592,16.0155296 11.8839934,14.9444337 L6.75735931,20.0710678 C5.97631073,20.8521164 4.70998077,20.8521164 3.92893219,20.0710678 C3.1478836,19.2900192 3.1478836,18.0236893 3.92893219,17.2426407 L9.05556629,12.1160066 C7.98447038,9.89144078 8.36005124,7.15466739 10.1892777,5.32544095 C11.7443127,3.77040588 13.9552129,3.26588995 15.9497475,3.80761184 Z" fill="#000000" />
                                                    <path d="M16.6568542,5.92893219 L18.0710678,7.34314575 C18.4615921,7.73367004 18.4615921,8.36683502 18.0710678,8.75735931 L16.6913928,10.1370344 C16.3008685,10.5275587 15.6677035,10.5275587 15.2771792,10.1370344 L13.8629656,8.7228208 C13.4724413,8.33229651 13.4724413,7.69913153 13.8629656,7.30860724 L15.2426407,5.92893219 C15.633165,5.5384079 16.26633,5.5384079 16.6568542,5.92893219 Z" fill="#000000" opacity="0.3" />
                                                </g>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <div className="font-size-h6 text-dark-75 font-weight-bolder">MANTENIMIENTO</div>
                                    <div className="font-size-sm text-muted font-weight-bold mt-1">TIPO DE TRABAJO</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="d-flex justify-content-center">
                                <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                    <div className="symbol-label">
                                        <span className="svg-icon svg-icon-lg svg-icon-primary">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                    <rect x="0" y="0" width="24" height="24" />
                                                    <polygon fill="#000000" opacity="0.3" points="6 3 18 3 20 6.5 4 6.5" />
                                                    <path d="M6,5 L18,5 C19.1045695,5 20,5.8954305 20,7 L20,19 C20,20.1045695 19.1045695,21 18,21 L6,21 C4.8954305,21 4,20.1045695 4,19 L4,7 C4,5.8954305 4.8954305,5 6,5 Z M9,9 C8.44771525,9 8,9.44771525 8,10 C8,10.5522847 8.44771525,11 9,11 L15,11 C15.5522847,11 16,10.5522847 16,10 C16,9.44771525 15.5522847,9 15,9 L9,9 Z" fill="#000000" />
                                                </g>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <div className="font-size-h6 text-dark-75 font-weight-bolder">09/07/2020</div>
                                    <div className="font-size-sm text-muted font-weight-bold mt-1">FECHA</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default CalidadView