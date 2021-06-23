import React, { Component } from 'react'
import '../../../styles/select_custom_gray.css';
import { SelectSearchGray } from '..';
import { setOptions } from '../../../functions/setters';

class DoubleSelectSearchGray extends Component {

    state = {
        options: {
            one: [],
            two: []
        },
        form: {
            one: '',
            two: ''
        }
    }

    componentDidMount(){
        const { options: opciones, form: formulario, one, two } = this.props
        const { options, form } = this.state
        form.one = formulario[one.name]
        form.two = formulario[two.name]
        options.two = opciones[two.opciones]
        options.one = opciones[one.opciones]
        this.setState({...this.state, options, form})
    }

    update = (value, tipo) => {
        const { onChange, one, two } = this.props
        const { options, form } = this.state
        onChange(value, tipo === 'one' ? one.name : two.name)
        form[tipo] = value
        if(tipo === 'one'){
            onChange('', two.name)
            options.one.forEach((element) => {
                if(element.value.toString() === value.toString()){
                    options.two = setOptions(element[two.opciones], 'nombre', 'id')
                    form.two = ''
                }
            })
        }
        this.setState({...this.state, form, options})
    }

    render() {
        const { options, form } = this.state
        const { one, two } = this.props
        return (
            <div className = 'py-4'>
                <div className="text-left mt-4">
                    <SelectSearchGray options = { options.one } placeholder = { one.placeholder } value = { form.one } 
                        onChange = { (value) => { this.update(value, 'one') } } withtaglabel = { 1 } withtextlabel = { 1 } withicon={1}/>
                </div>
                <div className="text-left">
                    <SelectSearchGray options = { options.two } placeholder = { two.placeholder } value = { form.two }
                        onChange = { (value) => { this.update(value, 'two') } } withtaglabel = { 1 } withtextlabel = { 1 } withicon={1}/>
                </div>
            </div>
            
        )
    }
}

export default DoubleSelectSearchGray