'use client'

import { SerializedEditorState, SerializedLexicalNode } from "@payloadcms/richtext-lexical/lexical";
import { Timeline } from "../ui/timeline";
import { ContentRenderer } from "../Content";

export interface TimelineHistory {
    year?: number | null | undefined;
    content?: SerializedEditorState<SerializedLexicalNode>;
}

export default function HistoryTimeline({ history, summary }: { history?: TimelineHistory[], summary?: string }) {
    const timelineData = history!.map((historyEntry) => {
        return {
            title: historyEntry.year!.toString(),
            content: <div className="text-sm md:text-base">
                <ContentRenderer content={historyEntry.content!} />
            </div>
        }
    })
    return <Timeline data={timelineData} summary={summary!} />
}