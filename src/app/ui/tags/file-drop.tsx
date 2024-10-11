'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@nextui-org/react';
import { toast } from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Tag } from '../../lib/model';
import { redirect } from 'next/navigation';

const FILE_SIZE_LIMIT = 3_000_000;

export default function DragAndDrop({ tag }: { tag: Tag }) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [canRedirect, setCanRedirect] = useState(false);

  const handleDragLeave = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (!['text/plain', 'text/csv'].includes(file.type)) {
      toast.error('File type not supported');
    } else if (file.size > FILE_SIZE_LIMIT) {
      toast.error('File too large!');
    } else {
      setFile(file);
    }
  };

  const openFileExplorer = () => {
    if (inputRef.current) {
      inputRef.current.value = ''; // clear
      inputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    const res = await fetch(
      `/api/file?tagId=${tag.tag_id}&fileName=${file.name}`,
      {
        method: 'POST',
        body: file,
      }
    );

    setIsLoading(false);

    const body = await res.json();

    if (body.error) {
      toast.error('File upload fail');
    } else {
      toast.success('File upload success');
      setCanRedirect(true);
    }
  };

  useEffect(() => {
    if (canRedirect) {
      redirect('/dashboard');
    }
  }, [canRedirect]);

  return (
    <div>
      <form
        className={`${
          dragActive ? 'bg-gray-300' : 'bg-gray-100'
        } flex h-[10rem] w-[20rem] flex-col items-center justify-center rounded-lg p-4 text-center`}
        onDragEnter={handleDragEnter}
        onSubmit={handleSubmit}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
      >
        <input
          id='inputFile'
          name='inputFile'
          className='hidden'
          ref={inputRef}
          type='file'
          multiple={false}
          accept='.csv,.txt'
          onChange={handleChange}
        />
        {file ? (
          <div>
            <div className='flex flex-row items-center justify-center'>
              <p>{file.name}</p>
              <Button
                isIconOnly
                color='danger'
                aria-label='Like'
                variant='light'
                size='sm'
                onClick={() => setFile(null)}
              >
                <XMarkIcon className='w-5' />
              </Button>
            </div>
            <Button
              type='submit'
              color='primary'
              className='mt-3'
              disabled={file === null}
              isLoading={isLoading}
            >
              Submit
            </Button>
          </div>
        ) : (
          <div className='flex flex-col gap-2'>
            <p>Drag & Drop file</p>
            <p>or</p>
            <Button color='primary' onClick={openFileExplorer}>
              Select file
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
