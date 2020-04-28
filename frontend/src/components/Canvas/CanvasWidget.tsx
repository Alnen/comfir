import React from "react";
import {createEditor} from "./Canvas";

interface CanvasWidgetProps {
    onNumberChanged: (num: number) => void
}

export default class CanvasWidget extends React.Component<CanvasWidgetProps> {

    shouldComponentUpdate(nextProps: Readonly<CanvasWidgetProps>, nextState: Readonly<{}>, nextContext: any): boolean {
        return false;
    }

    render(): React.ReactNode {
        return (
            <div
                style={{width: "100vw", height: "100vh"}}
                ref={ref => ref && createEditor(ref, this.props.onNumberChanged)}
            />
        );
    }
}
