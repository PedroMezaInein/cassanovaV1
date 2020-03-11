import React, { Component } from 'react'
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';

function CustomToggle({ children, eventKey } ) {
    
    const handleClick = useAccordionToggle(eventKey, (e) => {}); 

    return (
        <div onClick={handleClick} className="accordion__toggler">
            {children}
        </div>
    );
}

export default CustomToggle