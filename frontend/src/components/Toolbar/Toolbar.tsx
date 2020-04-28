import React from 'react';
import './Toolbar.css';

interface ToolbarProps {
    value: string
}

export default class Toolbar extends React.Component<ToolbarProps> {

    render() {
        let displayedValue = this.transformData(this.props.value);

        return (
            <div className="Toolbar">
                <header className="Toolbar-header">
                    <p>
                        Hello, Toolbar! Greeting message: '{displayedValue}'
                    </p>
                </header>
            </div>
        )
    }

    transformData(value: string): string {
        return value + " | " + value
    }
}
