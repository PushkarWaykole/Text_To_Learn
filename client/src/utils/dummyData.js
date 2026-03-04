export const dummyCourse = {
    _id: 'dummy-course-123',
    title: 'Introduction to React Hooks',
    topic: 'React Hooks',
    language: 'en',
    modules: [
        {
            _id: 'module-1',
            title: 'What are React Hooks?',
            order: 0,
            content: [
                { type: 'heading', level: 1, text: 'Introduction to Hooks' },
                { type: 'paragraph', text: 'Hooks were added to React in version 16.8. They let you use state and other React features without writing a class.' },
                { type: 'heading', level: 2, text: 'Why Hooks?' },
                { type: 'paragraph', text: 'Before Hooks, components that required state had to be implemented as class components. Hooks allow you to write complex functional components.' },
                { type: 'code', language: 'javascript', code: 'import React, { useState } from "react";\n\nfunction Example() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}' },
                { type: 'video', url: 'https://www.youtube.com/embed/dpw9EHDh2bM' },
                { type: 'mcq', question: 'Which React Hook is used to manage local state?', options: ['useEffect', 'useState', 'useReducer', 'useContext'], answer: 'useState' }
            ]
        },
        {
            _id: 'module-2',
            title: 'The useEffect Hook',
            order: 1,
            content: [
                { type: 'heading', level: 1, text: 'Side Effects in React' },
                { type: 'paragraph', text: 'The useEffect Hook lets you perform side effects in functional components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in React classes.' },
                { type: 'code', language: 'javascript', code: 'useEffect(() => {\n  document.title = `You clicked ${count} times`;\n}, [count]);' },
                { type: 'mcq', question: 'When does the useEffect hook run by default?', options: ['Only on mount', 'Only on unmount', 'After every render', 'Never'], answer: 'After every render' }
            ]
        }
    ]
};
