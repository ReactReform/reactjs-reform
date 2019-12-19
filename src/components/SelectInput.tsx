import * as React from 'react'
import classnames from 'classnames'

interface SelectObject {
    value: string
    option: string
}

interface Props {
    label?: string
    name: string
    value: string
    options: Array<string | SelectObject>
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
    onBlur?: () => void
    validation?: string
}

export const SelectInput: React.FunctionComponent<Props> = (props: Props) => (
	<div className={classnames('input-wrapper', {'input-wrapper-validation': props.validation})}>
		<label htmlFor={ props.name }>
            { props.label && <span>{ props.label }</span> }
			<select
				id={ props.name }
				name={ props.name }
				value={ props.value }
				onChange={ props.onChange }
				onBlur={ props.onBlur }
			>
            { 
                props.options.map((option, id) => 
                    typeof option === 'string' ?
                    <option key={id}>{option}</option> :
                    <option key={id} value={option.value}>{option.option}</option>
                )
            } 
            </select>
		</label>
		{ props.validation && <span className="field-validation-text"><span className="lnr lnr-warning"/> { props.validation }</span> }
	</div>
)