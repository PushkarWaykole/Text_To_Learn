import React, { useState, useRef, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

function HeadingBlock({ block }) {
    const Tag = `h${block.level || 2}`;
    return (
        <Tag style={{ color: 'var(--text-color)' }} className={`font-bold mb-4 mt-8 ${block.level === 1 ? 'text-3xl font-extrabold' : 'text-2xl'}`}>
            {block.text}
        </Tag>
    );
}

const ParagraphBlock = ({ text }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [voices, setVoices] = useState([]);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    const playAudio = () => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);

        // Prioritize natural sounding voices
        const preferred = voices.find(v =>
            v.lang.startsWith('en') &&
            (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium'))
        ) || voices.find(v => v.lang.startsWith('en'));

        if (preferred) utterance.voice = preferred;

        utterance.rate = 0.92; // Natural human cadence
        utterance.pitch = 1.0;

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        window.speechSynthesis.speak(utterance);
    };

    const stopAudio = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
    };

    return (
        <div className={`group relative transition-all duration-500 p-6 rounded-2xl mb-8 -mx-4 border-2 ${isPlaying
            ? 'bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.1)]'
            : 'border-transparent hover:bg-[var(--glass-bg)]'
            }`}>
            <button
                onClick={isPlaying ? stopAudio : playAudio}
                className={`tts-button absolute -top-4 right-6 p-2.5 rounded-xl border transition-all duration-300 shadow-2xl z-10 ${isPlaying
                    ? 'bg-indigo-600 border-indigo-400 text-white scale-110 opacity-100 pulse'
                    : 'bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-indigo-400 hover:border-indigo-500/50 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
                    }`}
                title={isPlaying ? "Stop Audio" : "Listen to explanation"}
            >
                {isPlaying ? (
                    <div className="flex items-center gap-2 px-1">
                        <div className="flex gap-0.5 items-end h-3 mb-1">
                            <div className="w-0.5 bg-white animate-[pulse_0.6s_infinite]"></div>
                            <div className="w-0.5 bg-white animate-[pulse_1.0s_infinite]"></div>
                            <div className="w-0.5 bg-white animate-[pulse_0.8s_infinite]"></div>
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-widest">Listening</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 px-1">
                        <span className="text-lg">🔊</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest hidden sm:inline">Listen</span>
                    </div>
                )}
            </button>
            <p className={`leading-relaxed text-lg transition-colors duration-500`} style={{ color: isPlaying ? 'var(--text-color)' : 'var(--text-secondary)' }}>
                {text}
            </p>
        </div>
    );
};

function CodeBlock({ block }) {
    return (
        <div className="mb-6 rounded-lg overflow-hidden border shadow-lg" style={{ borderColor: 'var(--glass-border)', background: 'var(--input-bg)' }}>
            <div style={{ background: 'var(--glass-bg)', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{block.language || 'code'}</span>
                <button style={{ fontSize: 10, background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    onMouseEnter={e => e.target.style.color = 'var(--text-color)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                    onClick={() => navigator.clipboard.writeText(block.code)}>
                    Copy
                </button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm font-mono leading-snug" style={{ color: 'var(--text-color)' }}>
                <code>{block.code}</code>
            </pre>
        </div>
    );
}

function VideoBlock({ block }) {
    return (
        <div className="mb-8">
            {block.description && (
                <div className="mb-3 px-4 py-2 rounded-r-lg" style={{ background: 'var(--glass-bg)', borderLeft: '4px solid #6366f1' }}>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        <span style={{ color: '#6366f1', fontWeight: 800, fontStyle: 'normal', marginRight: 8 }}>Video Context:</span>
                        {block.description}
                    </p>
                </div>
            )}
            <div className="rounded-xl overflow-hidden shadow-xl border bg-black aspect-video relative" style={{ borderColor: 'var(--glass-border)' }}>
                <iframe
                    className="w-full h-full absolute top-0 left-0"
                    src={block.url}
                    title="Video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
}

function MCQBlock({ block, selectedAnswer, onSaveAnswer, onResetAnswer }) {
    return (
        <div className="my-8 p-8 rounded-xl border shadow-lg relative" style={{ borderColor: 'rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.03)' }}>
            <div className="absolute -top-3 left-6 bg-indigo-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
                Quiz Question
            </div>

            <div className="flex justify-between items-start mb-6 mt-2">
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-color)', paddingRight: 32 }}>{block.question}</h3>
                {selectedAnswer && (
                    <button
                        onClick={onResetAnswer}
                        style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--text-secondary)', background: 'var(--glass-bg)', padding: '4px 10px', borderRadius: 4, border: 'none', cursor: 'pointer' }}
                        onMouseEnter={e => e.target.style.color = '#ef4444'}
                        onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                    >
                        Reset
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-3">
                {block.options.map((opt, i) => {
                    const isCorrect = opt === block.answer;
                    const isSelected = selectedAnswer === opt;

                    let btnStyle = {
                        textAlign: 'left', padding: '12px 16px', borderRadius: 8, border: '1px solid',
                        transition: '0.2s', width: '100%', cursor: selectedAnswer ? 'default' : 'pointer'
                    };

                    if (!selectedAnswer) {
                        btnStyle.borderColor = 'var(--input-border)';
                        btnStyle.backgroundColor = 'var(--input-bg)';
                        btnStyle.color = 'var(--text-color)';
                    } else if (isCorrect) {
                        btnStyle.borderColor = 'rgba(16,185,129,0.5)';
                        btnStyle.backgroundColor = 'rgba(16,185,129,0.1)';
                        btnStyle.color = '#10b981';
                        btnStyle.fontWeight = 700;
                    } else if (isSelected && !isCorrect) {
                        btnStyle.borderColor = 'rgba(239,68,68,0.5)';
                        btnStyle.backgroundColor = 'rgba(239,68,68,0.1)';
                        btnStyle.color = '#ef4444';
                        btnStyle.fontWeight = 700;
                    } else {
                        btnStyle.borderColor = 'var(--glass-border)';
                        btnStyle.backgroundColor = 'var(--glass-bg)';
                        btnStyle.color = 'var(--text-secondary)';
                        btnStyle.opacity = 0.5;
                    }

                    return (
                        <button
                            key={i}
                            style={btnStyle}
                            className={!selectedAnswer ? "glass-hover" : ""}
                            onClick={() => !selectedAnswer && onSaveAnswer(opt)}
                            disabled={!!selectedAnswer}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{opt}</span>
                                {selectedAnswer && isCorrect && <span style={{ fontSize: 14 }}>✅</span>}
                                {isSelected && !isCorrect && <span style={{ fontSize: 14 }}>❌</span>}
                            </div>
                        </button>
                    );
                })}
            </div>
            {selectedAnswer && (
                <div className={`mt-4 p-3 rounded-lg text-sm ${selectedAnswer === block.answer ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {selectedAnswer === block.answer ? '🎉 Correct! Great job.' : `Incorrect. The correct answer was "${block.answer}".`}
                </div>
            )}
        </div>
    );
}

export default function LessonRenderer({ content, quizChoices, onSaveQuiz, onResetQuiz }) {
    if (!content || !Array.isArray(content)) return null;

    return (
        <div className="space-y-8">
            {content.map((block, index) => {
                switch (block.type) {
                    case 'heading':
                        return <HeadingBlock key={index} block={block} />;
                    case 'paragraph':
                        return <ParagraphBlock key={index} text={block.text} />;
                    case 'code':
                        return <CodeBlock key={index} block={block} />;
                    case 'mcq':
                        const savedChoice = quizChoices?.find(c => c.questionIndex === index);
                        return (
                            <MCQBlock
                                key={index}
                                block={block}
                                selectedAnswer={savedChoice?.selectedOption}
                                onSaveAnswer={(opt) => onSaveQuiz(index, opt)}
                                onResetAnswer={() => onResetQuiz(index)}
                            />
                        );
                    case 'video':
                        return <VideoBlock key={index} block={block} />;
                    default:
                        return null;
                }
            })}
        </div>
    );
}
