import React, { Component } from 'react'
import { setDateTableLG, setMoneyText } from '../../../functions/setters';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
class PresupuestoGenerado extends Component {

    hasMontos = () => {
        const { pdfs } = this.props
        let flag = false
        pdfs.forEach((pdf) => {
            if(pdf.pivot.hasOwnProperty('monto'))
                flag = true
        })
        return flag
    }

    render() {
        const { pdfs, actionsEnable, onClick } = this.props
        return (
            <div className="table-responsive mt-4">
                <table className="table  table-head-bg table-borderless table-vertical-center">
                    <thead>
                        <tr className="text-left">
                            <th className="pl-7">
                                <span className="text-center text-muted font-size-sm">Adjunto</span>
                            </th>
                            <th className="text-center text-muted font-size-sm">IDENTIFICADOR</th>
                            { 
                                this.hasMontos() ? 
                                    <th className="text-center text-muted font-size-sm">Monto</th>
                                : <></>
                            }
                            { actionsEnable ?  <th></th> : <></> }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            pdfs.map((pdf, index) => {
                                let flag = this.hasMontos()
                                return(
                                    <tr key = { index } >
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div>
                                                    <a rel="noopener noreferrer" target="_blank" href={pdf.url} className="text-dark-75 font-weight-bolder text-hover-success mb-1 font-size-lg">{pdf.name}</a>
                                                    <span className="text-muted font-weight-bold d-block">
                                                        {
                                                            setDateTableLG(pdf.created_at)
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-dark-75 font-weight-bolder d-block font-size-lg">{pdf.pivot.identificador}</span>
                                        </td>
                                        {
                                            flag ?
                                                <td className="text-center">
                                                    <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                                                        { setMoneyText(pdf.pivot.monto) }
                                                    </span>
                                                </td>
                                            : <></>
                                        }
                                        {
                                            actionsEnable ? 
                                                <td className="text-center">
                                                    <span onClick = { (e) => { e.preventDefault(); onClick('send-presupuesto', pdf); } } 
                                                        className="btn btn-default btn-icon btn-sm mr-2 btn-hover-text-success">
                                                        <span className="svg-icon svg-icon-md svg-icon-primary">
                                                            <SVG src={toAbsoluteUrl('/images/svg/Sending-mail.svg')} />
                                                        </span>
                                                    </span>
                                                </td>
                                            : <></>
                                        }
                                        
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default PresupuestoGenerado