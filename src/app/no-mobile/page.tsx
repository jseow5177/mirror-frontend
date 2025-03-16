export default async function Page() {
  return (
    <main className='flex h-screen items-center justify-center p-4 text-center'>
      <div>
        <h1 className='text-2xl font-bold'>
          Oops... This App is for Desktop Only 🤔
        </h1>
        <p className='mt-2 text-gray-600'>
          It looks like you're on a mobile device.
        </p>
        <p className='text-gray-600'>
          For the best experience, please switch to a desktop or laptop.
        </p>
      </div>
    </main>
  );
}
