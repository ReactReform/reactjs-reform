import * as React from 'react'
import validator from 'validator'

import { createEventLikeObject } from './utils/eventLikeObject' 

import { TextInput } from './components/TextInput'
import { SelectInput } from './components/SelectInput'
import { TextAreaInput } from './components/TextAreaInput'
import { Button } from './components/Button'

interface EventLikeObject {
    target: {
        value: string
    }
}

interface Option {
    value: string
    option: string
}

interface InputPrototype {
    type: string
    name: string
    displayName: string
    value: string
    error: string
    options: Array<string> | Array<Option>
    placeholder: string
}

interface OwnProps {
    className: string
    fields: Array<InputPrototype>
    handleSubmit: (fields) => void
    requestProcessing: boolean
    requestError: string | undefined
    loadingIndicator: any
}

type Props = OwnProps

interface State {
    fields: Array<InputPrototype>
}

export class Reform extends React.Component<Props, State> {
    constructor(props: OwnProps) {
        super(props)

        this.state = {
            fields: props.fields,
        }

        this.initSelectValues = this.initSelectValues.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.validate = this.validate.bind(this)
    }

    componentDidMount() {
        this.initSelectValues()
    }

    private initSelectValues() {
        const { fields } = this.props
        fields.forEach((field, id) => {
            if (field.type === 'SelectInput') {
                if (validator.isEmpty(String(field.value))) {
                    const value = typeof field.options[0] === 'object' ? field.options[0].value : field.options[0]
                    this.handleInputChange(createEventLikeObject(value), id)
                }
            }
        })
    }

	private handleInputChange(event: EventLikeObject, inputId: number) {
        const updateValue = (value: string) => {
            this.state.fields[inputId].value = value
            this.setState({ fields: this.state.fields })
        }
        switch (this.state.fields[inputId].type) {
            default:
                updateValue(event.target.value)
            break;
        }
	}

	private handleInputBlur(inputId: number) {
        this.validate(inputId)
	}

    private validate(inputId?: number) {
        let isValid = true

        const validateField = (field) => {
            if (field.validation) {
                switch (field.validation) {
                    case 'notEmpty':
                        switch (field.type) {
                            default:
                                if (!field.value || (field.value && validator.isEmpty(String(field.value)))) {
                                    field.error = `${field.displayName} can't be empty`
                                    isValid = false
                                } else {
                                    delete field.error
                                }
                        }
                    break
                }
            }
            return field
        }

        let validated
        if (inputId && inputId >= 0) {
            validated = this.state.fields.map((field, id) => {
                if (inputId === id) {
                    return validateField(field)
                }
                return field
            })
        } else {
            validated = this.state.fields.map((field) => validateField(field))
        }

        this.setState({
            fields: validated
        })

        return isValid
    }

    private handleSubmit(event) {
        event.preventDefault()

        if (this.validate()) {
            this.props.handleSubmit(this.state.fields.reduce((acc, field) => {
                if (field.name) {
                    switch(field.type) {
                        default:
                            acc[field.name] = field.value
                        break
                    }  
                }
                return acc
            }, {}))
        }
    }

    public render() {
        const { fields } = this.state
        const { className, requestProcessing, loadingIndicator } = this.props
        return (
            <form className={className} onSubmit={this.handleSubmit}>
            {fields.map((field, inputId: number) => {
                switch(field.type) {
                    case 'TextInput':
                        return (
                            <TextInput 
                                key={inputId}
                                placeholder={field.placeholder}
                                label={field.displayName}
                                value={field.value || ''} 
                                name={field.name}
                                onChange={(e) => this.handleInputChange(e, inputId)}
                                onBlur={() => this.handleInputBlur(inputId)}
                                validation={field.error}/>
                        )
                    case 'SelectInput':
                        return (
                            <SelectInput 
                                key={inputId} 
                                label={field.displayName}
                                options={field.options} 
                                name={field.name}
                                value={field.value}
                                onChange={(e) => this.handleInputChange(e, inputId)}
                                onBlur={() => this.handleInputBlur(inputId)}
                                validation={field.error}/>
                            )
                    case 'TextAreaInput':
                        return (
                            <TextAreaInput 
                                key={inputId} 
                                label={field.displayName}
                                value={field.value || ''} 
                                name={field.name}
                                onChange={(e) => this.handleInputChange(e, inputId)}
                                onBlur={() => this.handleInputBlur(inputId)}
                                validation={field.error}/>
                        )
                    case 'Button':
                        return (
                            <Button 
                                key={inputId}
                                label={field.text}
                                disabled={requestProcessing}/>
                        )
                    default:
                        return (
                            <div>{field.type} not supported</div>
                        )
                }
            })}
            { requestProcessing && (loadingIndicator || <div>Processing...</div>) }
            </form>
        )
    }
}
