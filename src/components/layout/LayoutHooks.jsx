import React from 'react';
import useOptionsArea from '../../hooks/useOptionsArea';
import useOptionsVehiculos from '../../hooks/useOptionsVehiculos';

export default function LayoutHooks() { 
    useOptionsArea();
    useOptionsVehiculos();
    return (
        <>
        </>
    );
}