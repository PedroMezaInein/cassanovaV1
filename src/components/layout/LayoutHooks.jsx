import React from 'react';
import {useSelector} from 'react-redux';
import useOptionsArea from '../../hooks/useOptionsArea';
import useOptionsVehiculos from '../../hooks/useOptionsVehiculos';

export default function LayoutHooks() { 
    const opciones = useSelector(state => state.opciones);
    useOptionsArea();    
    useOptionsVehiculos();
    return (
        <>
        </>
    );
}