'use client';

import clsx from 'clsx';
import { Button } from '@nextui-org/react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const NumberCircle = ({
  step,
  isActive,
  isCompleted,
  onClick = () => {},
}: {
  step: number;
  isActive: boolean;
  isCompleted: boolean;
  onClick?: (step: number) => void;
}) => {
  return (
    <Button
      onClick={() => onClick(step)}
      className={clsx(`h-10 w-10 rounded-full border-2`, {
        'border-green-300 bg-success text-white': isCompleted,
        'border-blue-300 bg-primary text-white': isActive,
        'border-gray-300 bg-default text-gray-500': !isActive && !isCompleted,
      })}
    >
      {isCompleted ? '✓' : step}
    </Button>
  );
};

export default function NumberCircles({
  totalSteps,
  currentStep,
  onClick = () => {},
}: {
  totalSteps: number;
  currentStep: number;
  onClick?: (step: number) => void;
}) {
  const steps: number[] = [];
  for (let i = 0; i < totalSteps; i++) {
    steps.push(i + 1);
  }

  return (
    <div className='flex items-center gap-4'>
      {steps.map((step, index) => (
        <>
          <NumberCircle
            key={`circle_${index}`}
            step={step}
            isActive={step === currentStep}
            isCompleted={step < currentStep}
            onClick={onClick}
          />
          {index < steps.length - 1 && (
            <ChevronRightIcon
              key={`arrow_${index}`}
              className='w-6 text-gray-500'
            />
          )}
        </>
      ))}
    </div>
  );
}
