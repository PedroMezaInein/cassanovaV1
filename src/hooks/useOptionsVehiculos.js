import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { apiGet } from '../functions/api'
import { saveOptionsVehiculos } from '../redux/actions/actions'

const useOptionsVehiculos = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.authUser)

    apiGet('vehiculos/options', user.access_token)
        .then((response) => {
            dispatch(saveOptionsVehiculos(response.data))
        })
        .catch((error) => {
            console.log(error)
        })
}

export default useOptionsVehiculos;
