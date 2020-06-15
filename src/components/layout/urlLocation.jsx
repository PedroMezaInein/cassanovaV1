import React from "react";

export default function UrlLocation() {

    return (
        <>   
            <div className="subheader py-2 py-lg-4 subheader-solid" id="kt_subheader">
                <div className="container-fluid d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
                    <div className="d-flex align-items-center flex-wrap mr-1">
                        <div className="d-flex align-items-baseline mr-5">
                            <h5 className="text-dark font-weight-bold my-2 mr-3">Administración</h5>
                            <div><i className="flaticon2-shelter"></i></div>
                                <ul className="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2 font-size-sm">
                                    <li className="breadcrumb-item">
                                        <div href="" className="text-muted ml-3">Egresos</div>
                                    </li>
                                </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}