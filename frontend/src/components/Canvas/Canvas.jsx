import React from "react";
import Rete from "rete";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import AreaPlugin from "rete-area-plugin";

var numSocket = new Rete.Socket("Number value");

class NumControl extends Rete.Control {
    static component = ({value, onChange}) => (
        <input
            type="number"
            value={value}
            ref={ref => {
                ref && ref.addEventListener("pointerdown", e => e.stopPropagation());
            }}
            onChange={e => onChange(+e.target.value)}
        />
    );

    constructor(emitter, key, node, readonly = false) {
        super(key);
        this.emitter = emitter;
        this.key = key;
        this.component = NumControl.component;

        const initial = node.data[key] || 0;

        node.data[key] = initial;
        this.props = {
            readonly,
            value: initial,
            onChange: v => {
                this.setValue(v);
                this.emitter.trigger("process");
            }
        };
    }

    setValue(val) {
        this.props.value = val;
        this.putData(this.key, val);
        this.update();
    }
}

class NumComponent extends Rete.Component {
    constructor() {
        super("Number");
    }

    builder(node) {
        var out1 = new Rete.Output("num", "Number", numSocket);
        var ctrl = new NumControl(this.editor, "num", node);

        return node.addControl(ctrl).addOutput(out1);
    }

    worker(node, inputs, outputs) {
        outputs["num"] = node.data.num;
    }
}

class AddComponent extends Rete.Component {

    createNode(data) {
        console.log(`|> CreateNode is called ${JSON.stringify(data)}`)
        return super.createNode(data);
    }

    constructor() {
        super("Add");
        // this.data.component = MyNode; // optional
    }

    builder(node) {
        console.log(`CreateNode is called ${JSON.stringify(node)}`)
        var inp1 = new Rete.Input("num1", "Number", numSocket);
        var inp2 = new Rete.Input("num2", "Number2", numSocket);
        var out = new Rete.Output("num", "Number", numSocket);

        inp1.addControl(new NumControl(this.editor, "num1", node));
        inp2.addControl(new NumControl(this.editor, "num2", node));

        return node
            .addInput(inp1)
            .addInput(inp2)
            .addControl(new NumControl(this.editor, "preview", node, true))
            .addOutput(out);
    }

    worker(node, inputs, outputs) {
        var n1 = inputs["num1"].length ? inputs["num1"][0] : node.data.num1;
        var n2 = inputs["num2"].length ? inputs["num2"][0] : node.data.num2;
        var sum = n1 + n2;

        this.editor.nodes
            .find(n => n.id === node.id)
            .controls.get("preview")
            .setValue(sum);
        outputs["num"] = sum;

        console.log("Pre ready to fire callback")
        console.log(JSON.stringify(node.data))
        if (node.data.onNumberChanged) {
            console.log("Ready to fire callback")
            node.data.onNumberChanged(sum)
        }
    }
}

export async function createEditor(container, onNumberChanged) {
    var editor = new Rete.NodeEditor("demo@0.1.0", container);
    editor.use(ConnectionPlugin);
    editor.use(ReactRenderPlugin);
    editor.use(ContextMenuPlugin, {
        searchBar: true, // true by default
        searchKeep: title => {
            console.log(`Title '${title}' '${!['Click me'].includes(title)}'`)
            return !['Click me'].includes(title)
        },
        delay: 100,
        allocate(component) {
            return ['Submenu'];
        },
        rename(component) {
            return component.name;
        },
        items: {
            'Click me'() {
                console.log('Works!')
            }
        },
        nodeItems: {
            'Click me'() {
                console.log('Works for node!')
            },
            'Delete': true, // don't show Delete item
            'Clone': true // or Clone item
        }
    });

    var engine = new Rete.Engine("demo@0.1.0");

    var components = [new NumComponent(), new AddComponent()];
    components.forEach(c => {
        editor.register(c);
        engine.register(c);
    });

    var n1 = await components[0].createNode({num: 2});
    var n2 = await components[0].createNode({num: 3});
    var add = await components[1].createNode({});
    var n3 = await components[0].createNode({num: 5});
    var add2 = await components[1].createNode({onNumberChanged: onNumberChanged, callbackId: 5});

    n1.position = [80, 200];
    n2.position = [80, 400];
    n3.position = [80, 600];
    add.position = [500, 240];
    add2.position = [920, 240];

    editor.addNode(n1);
    editor.addNode(n2);
    editor.addNode(n3);
    editor.addNode(add);
    editor.addNode(add2);

    editor.connect(n1.outputs.get("num"), add.inputs.get("num1"));
    editor.connect(n2.outputs.get("num"), add.inputs.get("num2"));
    editor.connect(add.outputs.get("num"), add2.inputs.get("num1"));
    editor.connect(n3.outputs.get("num"), add2.inputs.get("num2"));

    editor.on(
        "process nodecreated noderemoved connectioncreated connectionremoved",
        async () => {
            console.log("process");
            await engine.abort();
            await engine.process(editor.toJSON());
        }
    );

    editor.view.resize();
    editor.trigger("process");
    AreaPlugin.zoomAt(editor, editor.nodes);
}
