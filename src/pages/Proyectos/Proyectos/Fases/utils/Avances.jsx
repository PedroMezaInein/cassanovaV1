import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Avances  } from './../../../../../components/forms'

import Swal from 'sweetalert2'

export default function Avance(props) {
    const { proyecto, activo, reload } = props
    const auth = useSelector(state => state.authUser);

    return (
        <>
            <Avances
                proyecto={proyecto}
                user={auth}
                at={auth.access_token}
                refresh={reload}
                isActive={activo}
                /* onClick={this.onClick} */
            />
        </>
    )
}