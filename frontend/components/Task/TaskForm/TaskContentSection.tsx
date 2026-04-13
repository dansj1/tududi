import React from 'react';
import { useTranslation } from 'react-i18next';
import TiptapEditor from '../../Shared/TiptapEditor';

interface TaskContentSectionProps {
    taskId: number | undefined;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TaskContentSection: React.FC<TaskContentSectionProps> = ({
    taskId,
    value,
    onChange,
}) => {
    const { t } = useTranslation();

    return (
        <div className="sm:px-4 py-4 border-b border-gray-200 dark:border-gray-700 flex-1 flex flex-col mb-2">
            <TiptapEditor
                content={value}
                onChange={(newContent) => {
                    const syntheticEvent = {
                        target: {
                            name: 'note',
                            value: newContent,
                        },
                    } as React.ChangeEvent<HTMLTextAreaElement>;
                    onChange(syntheticEvent);
                }}
                placeholder={t(
                    'forms.noteContentPlaceholder',
                    'Enter content'
                )}
                className="flex-1 min-h-0"
            />
        </div>
    );
};

export default TaskContentSection;
