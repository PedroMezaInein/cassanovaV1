import React, { Component } from 'react'
import SelectSearch from 'react-select-search'
import InputGray from './InputGray'
import '../../../styles/select_custom_gray.css';
import { SelectSearchGray } from '..';
import { setOptions } from '../../../functions/setters';

class DoubleSelectSearchGray extends Component {

    state = {
        options: {
            areas: [],
            subareas: []
        },
        form: {
            area: '',
            subarea: ''
        }
    }

    componentDidMount(){
        const { options: opciones, form: formulario } = this.props
        const { options, form } = this.state
        form.area = formulario.area
        form.subarea = formulario.subarea
        options.subareas = opciones.subareas
        options.areas = opciones.areas
        this.setState({...this.state, options, form})
    }

    update = (value, tipo) => {
        const { onChange } = this.props
        const { options, form } = this.state
        onChange(value, tipo)
        form[tipo] = value
        if(tipo === 'area'){
            onChange('', 'subarea')
            options.areas.forEach((element) => {
                if(element.value.toString() === value.toString()){
                    options.subareas = setOptions(element.subareas, 'nombre', 'id')
                    form.subarea = ''
                }
            })
        }
        this.setState({...this.state, form, options})
    }

    render() {
        const { options, form } = this.state
        return (
            <div className = 'py-4'>
                <div className="text-left mt-4">
                    <SelectSearchGray options = { options.areas } placeholder="SELECCIONA EL ÁREA" name = "area" value = { form.area } 
                        onChange = { (value) => { this.update(value, 'area') } } withtaglabel = { 1 } withtextlabel = { 1 } />
                </div>
                <div className="text-left">
                    <SelectSearchGray options = { options.subareas } placeholder="SELECCIONA EL SUBÁREA" name = "subarea" value = { form.subarea }
                        onChange = { (value) => { this.update(value, 'subarea') } } withtaglabel = { 1 } withtextlabel = { 1 } />
                </div>
            </div>
            
        )
    }
}

export default DoubleSelectSearchGray