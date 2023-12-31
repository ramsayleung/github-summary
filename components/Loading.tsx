import Image from 'next/image'

export function LoadingPage(){
    return <div className='flex flex-col mt-8 justify-center items-center'>
        <p className='p-4'>Please wait, I'm visiting your Github profile</p>
        <Image src="/cat_waitting.gif"
              width={480}
              height={480}
              alt="The kitty is visting your profile"
        />
    </div>
}