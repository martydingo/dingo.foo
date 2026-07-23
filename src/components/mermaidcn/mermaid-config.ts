import { MermaidConfig } from "mermaid";

const mermaidConfig: MermaidConfig = {
    theme: "base",
    themeVariables: {
        lineColor: "#c3a6ff",
        arrowColor: "#c3a6ff",
        primaryColor: "#2f3b54",
        primaryBorderColor: "#ffcc66",
        primaryTextColor: "#d7dce2",
        secondaryColor: "#475569",
        secondaryTextColor: "#d7dce2",
        secondaryBorderColor: "#94a3b8",
        tertiaryColor: "#1d2433",
        tertiaryTextColor: "#d7dce2",
        tertiaryBorderColor: "#bae67e",
        darkMode: "true"
    },
    fontSize: 24,
    htmlLabels: true,
    logLevel: "error",
    flowchart: {
        curve: "stepAfter",
        useMaxWidth: true,
        defaultRenderer: "dagre-wrapper"
    },
    look: "classic"

}

export default mermaidConfig