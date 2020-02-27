import * as React from 'react'
import classnames from 'classnames'

interface Props {
    label?: string
    name?: string
    type?: string
    value: string
    placeholder?: string
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
    onBlur?: () => void
    validation?: string
    className?: string
}

export const TextAreaInput: React.FunctionComponent<Props> = (props: Props) => (
	<div className={classnames('input-wrapper', {'input-wrapper-validation': props.validation})}>
		<label htmlFor={ props.name }>
            { props.label && <span>{ props.label }</span> }
			<textarea
				id={ props.name }
				name={ props.name }
				placeholder={ props.placeholder }
				onChange={ props.onChange }
				onBlur={ props.onBlur }
				autoComplete="off"
                className={ props.className }
                value={ props.value }
            />
		</label>
		{ props.validation && <span className="field-validation-text"><span className="lnr lnr-warning"/> { props.validation }</span> }
	</div>
)