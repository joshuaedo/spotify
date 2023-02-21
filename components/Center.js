import Image from 'next/image';
import { useSession } from 'next-auth/react';

function Center() {
  const { data: session } = useSession();

  return (
    <div className='flex flex-grow text-white'>
      <header>
        <div className='relative'>
          <Image
            src={session?.user.image}
            // fill={true}
            // contain={true}
            width={78}
            height={78}
            alt='User'
          />
        </div>
      </header>
    </div>
  );
}

export default Center;
