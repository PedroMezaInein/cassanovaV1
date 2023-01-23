import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'

function ModalEditar (props) {
    const {data} = props
    const auth = useSelector(state => state.authUser.access_token)

    return (
        <>
        {data.nombreArea}
        </>
    )
}

export {ModalEditar}