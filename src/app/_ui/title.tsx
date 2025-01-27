export default function Title({ title }: { title: string }) {
  return (
    <div className='mb-6'>
      <h1 className='text-left text-2xl font-semibold'>{title}</h1>
    </div>
  );
}
