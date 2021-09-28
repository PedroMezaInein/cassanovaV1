import React, { Component } from 'react';
import Select from 'react-select';
import $ from "jquery";
class FixedMultiOptionsGray extends Component {
    state = {
        value: this.props.defaultvalue,
        countFixed: 0
    };
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }
    componentDidMount() {
        const { options } = this.props
        $('.css-2b097c-container').attr('id', 'css-2b097c-container-gray')
        let count = 0;
        options.forEach((option) => {
            if (option.isFixed) {
                count++;
            }
            return false
        })
        this.setState({
            countFixed: count
        });
    }
    onChange(value, { action, removedValue }) {
        const { options, onChange, name } = this.props
        switch (action) {
            case 'remove-value':
            case 'pop-value':
                if (removedValue.isFixed) {
                    return;
                }
                break;
            case 'clear':
                value = options.filter(v => v.isFixed);
                break;
            default:
                break;
        }
        value = this.orderOptions(value);
        onChange(value, name)
        this.setState({
            value: value
        });
    }
    orderOptions = values => {
        return values.filter(v => v.isFixed).concat(values.filter(v => !v.isFixed));
    };
    render() {
        const { options, placeholder, defaultvalue, iconclass, requirevalidation, messageinc, bgcolor, name } = this.props
        const { value, countFixed } = this.state
        const customStyles = {
            indicatorSeparator: () => ({
                backgroundColor: 'transparent !important'
            }),
            multiValue: (base, state) => ({
                backgroundColor: `${state.data.isFixed ? '#2171c1' : '#e5e5e8'}`,
                borderRadius: '2px!important',
                color: '#80808F!important',
                margin: '2px 3px!important',
                display: 'flex',
                minWidth: '0',
                boxSizing: 'border-box'
            }),
            multiValueLabel: (base, state) => ({
                color: `${state.data.isFixed ? 'white' : '#80808F'}`,
                padding: '2px .46875em!important',
                fontSize: '13px!important',
                fontWeight: 500
            }),
            multiValueRemove: (base, state) => {
                return state.data.isFixed ? { ...base, display: 'none' } : base;
            },
            control: () => ({
                alignItems: 'center',
                backgroundColor: `${bgcolor ? bgcolor : '#F3F6F9'}`,
                borderStyle: 'solid',
                borderWidth: '1px',
                cursor: 'default',
                borderRadius: '2px!important',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                minHeight: '38px',
                outline: '0 !important',
                position: 'relative',
                transition: 'all 100ms',
                boxSizing: 'border-box',
                borderColor: '#F3F6F9',
                paddingLeft: 'calc(1.5em + 1.3rem + 2px) !important'
            }),
            dropdownIndicator: () => ({
                color: '#686871',
                display: 'flex',
                padding: '8px',
                boxSizing: 'border-box',
            }),
            clearIndicator: () => ({
                color: '#686871',
                display: 'flex',
                padding: '8px',
                boxSizing: 'border-box'
            }),
            placeholder: () => ({
                color: '#B5B5C3 !important',
                marginLeft: '2px',
                marginRight: '2px',
                position: 'absolute',
                boxSizing: 'border-box'
            }),
            menu: (provided) => ({
                ...provided,
                top: "95%",
                zIndex: 3,
                borderRadius: '0px!important',
                width: "99.5%",
                left: "1px",
            }),
        };
        return (
            <div>
                <label className="col-form-label font-weight-bold text-dark-60">{placeholder}</label>
                <div className="input-icon">
                    <span className="input-icon input-icon-right">
                        <i className={iconclass + " m-0 kt-font-boldest text-dark-50"} style={{ zIndex: '2' }}></i>
                    </span>
                    <Select
                        isMulti
                        value={value}
                        styles={customStyles}
                        isClearable={value.some(v => !v.isFixed)}
                        name={name}
                        onChange={this.onChange}
                        options={options}
                        noOptionsMessage={() => "NO HAY MÁS OPCIONES"}
                    />
                </div>
                {
                    requirevalidation ? (defaultvalue.length > countFixed ? '' : <span className={"form-text text-danger is-invalid"}> {messageinc} </span>) : ''
                }
            </div>
        );
    }
}

export default FixedMultiOptionsGray