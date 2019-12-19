import * as React from 'react'

interface Props {
    label?: string
    className?: string
    disabled?: boolean
}

export const Button: React.FunctionComponent<Props> = (props: Props) => (
	<div className="input-wrapper">
        <button 
            className={props.className}
            disabled={props.disabled}>    
            {props.label}
        </button>
	</div>
)