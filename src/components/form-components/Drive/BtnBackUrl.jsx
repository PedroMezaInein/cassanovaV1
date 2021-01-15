import React, { Component } from 'react'
import { Button } from '../../../components/form-components'

class BtnBackUrl extends Component {
    render() {
        const {id_boton, icon, classname_boton, onclick_boton,only_icon, tooltip, url_1, url_2} = this.props
        return (
            <>
                <Button
                    id={id_boton}
                    icon={icon}
                    className={classname_boton}
                    onClick={onclick_boton}
                    only_icon={only_icon}
                    tooltip={tooltip}
                />
                <span className="text-muted font-weight-bold mr-4 ml-2">
                    {url_1} <span className="text-primary font-weight-bolder">{url_2}</span>
                </span>
            </>
        )
    }
}

export default BtnBackUrl