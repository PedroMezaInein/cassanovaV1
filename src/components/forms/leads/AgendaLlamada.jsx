import React, { Component } from 'react'
// import { CalendarDay } from '../../form-components'
// import { TimePicker } from 'antd';
// import 'antd/dist/antd.css';
class AgendaLlamada extends Component {
    render() {
        const { changeHora, form, onChange} = this.props
        return (
            <div className="">
                hola?
                {/* <CalendarDay /> */}
                {/* <TimePicker.RangePicker
                    format="h:mm"
                    minuteStep={5}
                    allowClear={true} 
                    
                    placeholder={['Inicio', 'Fin']}
                    showNow={false}
                    inputReadOnly
                    hideDisabledOptions
                    className="time-picker"
                    onChange={changeHora}
                    value={[form.horaInicio, form.horaFin]}
                /> */}
                {/* bordered = {false} */}
                {/* <InputGray
                    placeholder='NOMBRE DEL LEAD'
                    withicon={1}
                    iconclass="far fa-user"
                    name='name'
                    value={form.name}
                    onChange={onChange}
                /> */}

            </div>
        )
    }
}

export default AgendaLlamada