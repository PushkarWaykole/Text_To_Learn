import React, { useState } from 'react';

function HeadingBlock({ block }) {
    const Tag = `h${block.level || 2}`;
    return (
        <Tag className={`font-bold text-slate-100 mb-4 mt-8 ${block.level === 1 ? 'text-3xl font-extrabold' : 'text-2xl'}`}>
            {block.text}
        </Tag>
    );
}

function ParagraphBlock({ block }) {
    return <p className="text-slate-300 text-lg leading-relaxed mb-6">{block.text}</p>;
}

function CodeBlock({ block }) {
    return (
        <div className="mb-6 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shadow-lg">
            <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{block.language || 'code'}</span>
                <button className="text-xs text-slate-400 hover:text-white transition-colors"
                    onClick={() => navigator.clipboard.writeText(block.code)}>
                    Copy
                </button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm font-mono text-slate-300 leading-snug">
                <code>{block.code}</code>
            </pre>
        </div>
    );
}

function VideoBlock({ block }) {
    return (
        <div className="mb-8 rounded-xl overflow-hidden shadow-xl border border-slate-800 bg-black aspect-video relative">
            <iframe
                className="w-full h-full absolute top-0 left-0"
                src={block.url}
                title="Video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
}

function MCQBlock({ block }) {
    const [selected, setSelected] = useState(null);

    return (
        <div className="my-8 p-6 rounded-xl border border-indigo-500/30 bg-indigo-500/5 shadow-lg relative">
            <div className="absolute -top-3 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Quiz Question
            </div>
            <h3 className="text-lg font-semibold text-white mb-4 mt-2">{block.question}</h3>
            <div className="flex flex-col gap-3">
                {block.options.map((opt, i) => {
                    const isCorrect = opt === block.answer;
                    const isSelected = selected === opt;

                    let btnClass = "text-left px-4 py-3 rounded-lg border transition-all duration-200 ";

                    if (!selected) {
                        btnClass += "border-slate-700 bg-slate-800/50 hover:bg-slate-700 hover:border-slate-500 text-slate-300";
                    } else if (isCorrect) {
                        btnClass += "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-medium";
                    } else if (isSelected && !isCorrect) {
                        btnClass += "border-rose-500/50 bg-rose-500/10 text-rose-400 font-medium";
                    } else {
                        btnClass += "border-slate-800 bg-slate-900/50 text-slate-500 opacity-50";
                    }

                    return (
                        <button key={i} className={btnClass} onClick={() => !selected && setSelected(opt)} disabled={!!selected}>
                            <div className="flex justify-between items-center">
                                <span>{opt}</span>
                                {selected && isCorrect && <span>✅</span>}
                                {isSelected && !isCorrect && <span>❌</span>}
                            </div>
                        </button>
                    );
                })}
            </div>
            {selected && (
                <div className={`mt-4 p-3 rounded-lg text-sm ${selected === block.answer ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {selected === block.answer ? '🎉 Correct! Great job.' : `Incorrect. The correct answer was "${block.answer}".`}
                </div>
            )}
        </div>
    );
}

export default function LessonRenderer({ content }) {
    if (!content || !Array.isArray(content)) {
        return <div className="text-slate-400 italic">No content available for this module.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto pb-24">
            {content.map((block, index) => {
                switch (block.type) {
                    case 'heading': return <HeadingBlock key={index} block={block} />;
                    case 'paragraph': return <ParagraphBlock key={index} block={block} />;
                    case 'code': return <CodeBlock key={index} block={block} />;
                    case 'video': return <VideoBlock key={index} block={block} />;
                    case 'mcq': return <MCQBlock key={index} block={block} />;
                    default:
                        console.warn('Unknown block type:', block.type);
                        return null;
                }
            })}
        </div>
    );
}
