import React from 'react';
import logo from './logo.svg';
import './App.css';
import Toolbar from "./components/Toolbar/Toolbar";
import Editor from "./components/Editor/Editor";
import CanvasWidget from "./components/Canvas/CanvasWidget";

interface AppState {
    greetingMessage: string
}

export default class App extends React.Component<any, AppState> {

    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            greetingMessage: "default greeting message"
        }
        this.handleOnChange = this.handleOnChange.bind(this)
        this.handleOnNumberChanged = this.handleOnNumberChanged.bind(this)
    }

    render(): React.ReactNode {
        return (
            <div id="App" className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <p>
                        Edit <code>src/App.tsx</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                    <Toolbar value={this.state.greetingMessage}/>
                </div>
                <Editor greetingMessage={this.state.greetingMessage} onChange={this.handleOnChange}/>
                <CanvasWidget onNumberChanged={this.handleOnNumberChanged}/>
            </div>
        )
    }

    private handleOnChange(newValue: string): void {
        this.setState({greetingMessage: newValue})
    }

    private handleOnNumberChanged(num: number): void {
        console.log(`Result is num ${num}`)
        this.handleOnChange(num.toString())
    }
}
