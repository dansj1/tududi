import React, { useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import TurndownService from 'turndown';
import { marked } from 'marked';

const lowlight = createLowlight(common);

// Configure turndown for MD output
const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '*',
});

// Task list support for turndown
turndownService.addRule('taskListItem', {
    filter: (node) => {
        return (
            node.nodeName === 'LI' &&
            node.getAttribute('data-type') === 'taskItem'
        );
    },
    replacement: (content, node) => {
        const checked =
            (node as HTMLElement).getAttribute('data-checked') === 'true';
        const cleanContent = content.replace(/^\n+/, '').replace(/\n+$/, '');
        return `- [${checked ? 'x' : ' '}] ${cleanContent}\n`;
    },
});

// Handle task list wrapper
turndownService.addRule('taskList', {
    filter: (node) => {
        return (
            node.nodeName === 'UL' &&
            node.getAttribute('data-type') === 'taskList'
        );
    },
    replacement: (content) => {
        return '\n' + content + '\n';
    },
});

function htmlToMarkdown(html: string): string {
    if (!html || html === '<p></p>') return '';
    return turndownService.turndown(html).trim();
}

function markdownToHtml(md: string): string {
    if (!md) return '';
    return marked.parse(md, { async: false }) as string;
}

interface TiptapEditorProps {
    content: string; // Markdown string
    onChange: (markdown: string) => void;
    placeholder?: string;
    className?: string;
    autoFocus?: boolean;
    editable?: boolean;
    onKeyDown?: (e: KeyboardEvent) => void;
}

const TiptapToolbar: React.FC<{ editor: ReturnType<typeof useEditor> }> = ({
    editor,
}) => {
    if (!editor) return null;

    const btnClass = (active: boolean) =>
        `p-1.5 rounded transition-colors text-xs font-medium ${
            active
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`;

    const setLink = useCallback(() => {
        if (editor.isActive('link')) {
            editor.chain().focus().unsetLink().run();
            return;
        }
        const url = window.prompt('URL:');
        if (url) {
            editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: url })
                .run();
        }
    }, [editor]);

    return (
        <div className="tiptap-toolbar flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-t-md">
            {/* Text formatting */}
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={btnClass(editor.isActive('bold'))}
                title="Bold"
            >
                <strong>B</strong>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={btnClass(editor.isActive('italic'))}
                title="Italic"
            >
                <em>I</em>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={btnClass(editor.isActive('underline'))}
                title="Underline"
            >
                <span className="underline">U</span>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={btnClass(editor.isActive('strike'))}
                title="Strikethrough"
            >
                <span className="line-through">S</span>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={btnClass(editor.isActive('code'))}
                title="Inline code"
            >
                <span className="font-mono">&lt;/&gt;</span>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                className={btnClass(editor.isActive('highlight'))}
                title="Highlight"
            >
                <span className="bg-yellow-200 dark:bg-yellow-500/30 px-0.5">
                    H
                </span>
            </button>

            <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />

            {/* Headings */}
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={btnClass(
                    editor.isActive('heading', { level: 1 })
                )}
                title="Heading 1"
            >
                H1
            </button>
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={btnClass(
                    editor.isActive('heading', { level: 2 })
                )}
                title="Heading 2"
            >
                H2
            </button>
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={btnClass(
                    editor.isActive('heading', { level: 3 })
                )}
                title="Heading 3"
            >
                H3
            </button>

            <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />

            {/* Lists */}
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                }
                className={btnClass(editor.isActive('bulletList'))}
                title="Bullet list"
            >
                •&thinsp;List
            </button>
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                }
                className={btnClass(editor.isActive('orderedList'))}
                title="Numbered list"
            >
                1.&thinsp;List
            </button>
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().toggleTaskList().run()
                }
                className={btnClass(editor.isActive('taskList'))}
                title="Task list"
            >
                ☑ Tasks
            </button>

            <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />

            {/* Block elements */}
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().toggleBlockquote().run()
                }
                className={btnClass(editor.isActive('blockquote'))}
                title="Blockquote"
            >
                &ldquo;&thinsp;Quote
            </button>
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().toggleCodeBlock().run()
                }
                className={btnClass(editor.isActive('codeBlock'))}
                title="Code block"
            >
                {'{ }'}
            </button>
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().setHorizontalRule().run()
                }
                className={btnClass(false)}
                title="Horizontal rule"
            >
                ―
            </button>

            <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />

            {/* Link */}
            <button
                type="button"
                onClick={setLink}
                className={btnClass(editor.isActive('link'))}
                title="Link"
            >
                🔗
            </button>
        </div>
    );
};

const TiptapEditor: React.FC<TiptapEditorProps> = ({
    content,
    onChange,
    placeholder = 'Start writing...',
    className = '',
    autoFocus = false,
    editable = true,
    onKeyDown,
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false, // We use CodeBlockLowlight instead
            }),
            Placeholder.configure({
                placeholder,
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            Highlight,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 dark:text-blue-400 hover:underline cursor-pointer',
                },
            }),
            Underline,
            CodeBlockLowlight.configure({
                lowlight,
            }),
        ],
        content: markdownToHtml(content),
        editable,
        autofocus: autoFocus,
        editorProps: {
            attributes: {
                class: 'tiptap-editor-content prose dark:prose-invert max-w-none focus:outline-none',
            },
            handleKeyDown: onKeyDown
                ? (_view, event) => {
                      onKeyDown(event);
                      return false;
                  }
                : undefined,
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            const md = htmlToMarkdown(html);
            onChange(md);
        },
    });

    // Update content from external changes (but only if editor isn't focused)
    useEffect(() => {
        if (!editor || editor.isFocused) return;

        const currentMd = htmlToMarkdown(editor.getHTML());
        if (currentMd !== content) {
            editor.commands.setContent(markdownToHtml(content));
        }
    }, [content, editor]);

    // Update editable state
    useEffect(() => {
        if (editor) {
            editor.setEditable(editable);
        }
    }, [editable, editor]);

    if (!editor) return null;

    return (
        <div
            className={`tiptap-wrapper rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 overflow-hidden ${className}`}
        >
            {editable && <TiptapToolbar editor={editor} />}
            <EditorContent editor={editor} />
        </div>
    );
};

export default TiptapEditor;
