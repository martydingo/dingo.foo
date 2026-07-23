import { Block } from "payload";

const MermaidBlock: Block = {
    slug: 'Mermaid',
    labels: {
        singular: 'Mermaid Diagram',
        plural: 'Mermaid Diagrams'
    },
    fields: [
        {
            name: 'diagramCode',
            label: 'Diagram Code',
            type: 'code'
        }
    ]
}

export default MermaidBlock