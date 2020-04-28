import React, {ChangeEvent} from 'react';

interface PropsType {
    greetingMessage: string
    onChange: (value: string) => void
}

export default class Editor extends React.Component<PropsType> {

    constructor(props: Readonly<PropsType>) {
        super(props);
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event: ChangeEvent<HTMLInputElement>) {
        this.props.onChange(event.target.value)
    }

    render() {
        return (
            <div className="Editor">
                <p>
                    Hello, Editor!
                </p>
                <input type="text" defaultValue={this.props.greetingMessage} onChange={this.handleChange}/>
            </div>
        )
    }
}


