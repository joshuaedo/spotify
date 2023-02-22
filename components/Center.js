import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { ChevronDownIcon } from '@heroicons/react/outline';

function Center() {
  const { data: session } = useSession();

  return (
    <div className='flex flex-grow'>
      <header>
        <div className='flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2'>
          <Image
            src={session?.user.image}
            // fill={true}
            // contain={true}
            width={40}
            height={40}
            alt='User'
            className='rounded-full'
          />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className='h-5 w-5' />
        </div>
      </header>
      <section
        className={`flex items-end space-k-7 bg-gradient-to-b to-black from-red-500 h-80 text-white padding-8`}
      >
        {/* <Image /> */}
        <h2>Hey bitch</h2>
      </section>
    </div>
  );
}

export default Center;
