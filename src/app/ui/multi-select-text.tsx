import React, { KeyboardEventHandler, useState } from 'react';
import CreatableSelect from 'react-select/creatable';

const components = {
  DropdownIndicator: null,
};

interface Option {
  readonly label: string;
  readonly value: string;
}

const createOption = (label: string) => ({
  label,
  value: label,
});

export default function MultiSelectTextInput({
  initialValues = [],
  isNumeric = false,
  onChange = () => {},
}: {
  initialValues?: string[];
  isNumeric?: boolean;
  onChange?: (values: string[]) => void;
}) {
  const [inputValue, setInputValue] = useState('');
  const [values, setValues] = useState<readonly Option[]>(
    initialValues.map((v) => createOption(v))
  );
  const [error, setError] = useState('');

  const handleKeyDown: KeyboardEventHandler = (event) => {
    setError('');

    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        const cleanedValue = inputValue.trim();

        if (isNumeric && isNaN(parseFloat(cleanedValue))) {
          setError('only numbers are allowed');
        } else {
          const iv = createOption(cleanedValue);

          const ok = values.some(
            (v) => v.label === iv.label && v.value === iv.value
          );
          if (!ok) {
            // no repeated values
            setValues((prev) => [...prev, iv]);
            onChange([...values.map((v) => v.value), cleanedValue]);
          }
        }

        setInputValue('');
        event.preventDefault();
    }
  };

  return (
    <div className='w-full'>
      <CreatableSelect
        components={components}
        inputValue={inputValue}
        isClearable
        isMulti
        menuIsOpen={false}
        onChange={(newValue) => setValues(newValue)}
        onInputChange={(newValue) => setInputValue(newValue)}
        onKeyDown={handleKeyDown}
        placeholder='Enter multiple values...'
        value={values}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: 'black',
          },
        })}
        styles={{
          control: (baseStyles, state) => {
            return {
              ...baseStyles,
              borderColor: state.isFocused ? 'black' : '#E4E7EB',
              borderWidth: state.isFocused ? '1.5px' : '2px',
              outlineColor: 'red',
              padding: '4px',
              borderRadius: '12px',
            };
          },
        }}
      />
      {error !== '' && <p className='mt-1 text-tiny text-danger'>{error}</p>}
    </div>
  );
}
