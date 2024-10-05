export default function Modal({
  title,
  subTitle,
  Buttons,
}: {
  title: string;
  subTitle: string;
  Buttons?: React.ReactNode[];
}) {
  return (
    <div className='fixed inset-0 flex h-full w-full items-center justify-center overflow-y-auto bg-gray-600 bg-opacity-50'>
      <div className='w-96 rounded-md border bg-white p-8 shadow-lg'>
        <div className='text-center'>
          <h3 className='text-2xl font-bold text-gray-900'>{title}</h3>
          <div className='mt-2 px-7 py-3'>
            <p className='text-lg text-gray-500'>{subTitle}</p>
          </div>
          <div className='mt-4 flex justify-center gap-4'>{Buttons}</div>
        </div>
      </div>
    </div>
  );
}
