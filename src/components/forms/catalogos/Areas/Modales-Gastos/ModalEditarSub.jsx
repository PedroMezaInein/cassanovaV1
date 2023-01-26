import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'

import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

import Swal from 'sweetalert2'

function ModalEditarSub (props){

    console.log(props)
    return(
        <div>
            <h2>Modal Doble Click</h2>
        </div>
    )
}

export {ModalEditarSub}