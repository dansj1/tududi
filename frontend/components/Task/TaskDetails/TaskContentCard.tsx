import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import MarkdownRenderer from '../../Shared/MarkdownRenderer';
import TiptapEditor from '../../Shared/TiptapEditor';

interface TaskContentCardProps {
    content: string;
    onUpdate: (newContent: string) => Promise<void>;
}

const TaskContentCard: React.FC<TaskContentCardProps> = ({
    content,
    onUpdate,
}) => {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);

    useEffect(() => {
        setEditedContent(content);
    }, [content]);

    const handleStartEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (editedContent !== content) {
            await onUpdate(editedContent);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedContent(content);
        setIsEditing(false);
    };

    return (
        <div className="space-y-2">
            {isEditing ? (
                <div className="rounded-lg shadow-sm bg-white dark:bg-gray-900 border-2 border-blue-500 dark:border-blue-400 p-6">
                    <TiptapEditor
                        content={editedContent}
                        onChange={setEditedContent}
                        placeholder={t(
                            'task.contentPlaceholder',
                            'Add content here...'
                        )}
                        autoFocus
                        onKeyDown={(e) => {
                            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                                handleSave();
                            } else if (e.key === 'Escape') {
                                handleCancel();
                            }
                        }}
                    />
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {t(
                                'task.contentEditHint',
                                'Press Cmd/Ctrl+Enter to save, Esc to cancel'
                            )}
                        </span>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 text-sm bg-green-600 dark:bg-green-500 text-white rounded hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                            >
                                {t('common.save', 'Save')}
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                            >
                                {t('common.cancel', 'Cancel')}
                            </button>
                        </div>
                    </div>
                </div>
            ) : content ? (
                <div
                    onClick={handleStartEdit}
                    className="rounded-lg shadow-sm bg-white dark:bg-gray-900 border-2 border-gray-50 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 p-6 cursor-pointer transition-colors"
                    title={t(
                        'task.clickToEditContent',
                        'Click to edit content'
                    )}
                >
                    <MarkdownRenderer
                        content={content}
                        className="prose dark:prose-invert max-w-none"
                    />
                </div>
            ) : (
                <div
                    onClick={handleStartEdit}
                    className="rounded-lg shadow-sm bg-white dark:bg-gray-900 border-2 border-gray-50 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 p-6 cursor-pointer transition-colors"
                    title={t('task.clickToAddContent', 'Click to add content')}
                >
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                        <PencilSquareIcon className="h-12 w-12 mb-3 opacity-50" />
                        <span className="text-sm text-center">
                            {t('task.noNotes', 'Add some content')}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskContentCard;
