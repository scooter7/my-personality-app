import Image from 'next/image';

interface QuestionProps {
  question: {
    key: string;
    title: string;
    type: string;
    options?: string[];
    max?: number;
  };
  value: any;
  onCheckboxChange: (value: string) => void;
  onRadioChange: (value: string) => void;
  onTextChange: (value: string) => void;
  onSelectChange: (value: string) => void;
}

export default function Question({
  question,
  value,
  onCheckboxChange,
  onRadioChange,
  onTextChange,
  onSelectChange,
}: QuestionProps) {
  
  const renderInput = () => {
    switch (question.type) {
      case 'checkbox':
      case 'image-checkbox':
        const isImage = question.type === 'image-checkbox';
        const selectionCount = Array.isArray(value) ? value.length : 0;
        const maxReached = question.max ? selectionCount >= question.max : false;

        return (
            <>
              {question.max && <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Select exactly {question.max}. ({selectionCount}/{question.max})</p>}
              <div className={`grid ${isImage ? 'grid-cols-2 md:grid-cols-3 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-3'}`}>
                {question.options?.map(option => {
                  const isSelected = Array.isArray(value) && value.includes(option);
                  const isDisabled = !isSelected && maxReached;
                  return (
                    <label
                      key={option}
                      className={`block p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50' : 'border-gray-300 dark:border-gray-600'
                      } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400'}`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => onCheckboxChange(option)}
                      />
                      {isImage ? (
                        <Image src={`/images/${option}`} alt={option} width={200} height={200} className="w-full h-auto rounded-md" />
                      ) : (
                        <span className="text-lg font-medium">{option}</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </>
        );

      case 'radio':
      case 'image-radio':
        const isImageRadio = question.type === 'image-radio';
        return (
            <div className={`grid ${isImageRadio ? 'grid-cols-2 md:grid-cols-3 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-3'}`}>
              {question.options?.map(option => {
                  const isSelected = value === option;
                  return (
                    <label
                      key={option}
                      className={`block p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.key}
                        className="hidden"
                        checked={isSelected}
                        onChange={() => onRadioChange(option)}
                      />
                      {isImageRadio ? (
                         <Image src={`/images/${option}`} alt={option} width={200} height={200} className="w-full h-auto rounded-md" />
                      ) : (
                        <span className="text-lg font-medium">{option}</span>
                      )}
                    </label>
                  );
                })}
            </div>
        );

      case 'text':
      case 'email':
        return (
          <input
            type={question.type}
            className="w-full max-w-md p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={value || ''}
            onChange={e => onTextChange(e.target.value)}
          />
        );

      case 'select':
        return (
          <select
            className="w-full max-w-md p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={value || ''}
            onChange={e => onSelectChange(e.target.value)}
          >
            <option value="" disabled>Select an option</option>
            {question.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">{question.title}</h2>
      {renderInput()}
    </div>
  );
}