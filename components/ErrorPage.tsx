import Image from 'next/image'

export function UserNotExist(){
    return <div className="flex flex-col mt-8 justify-center items-center">
        <p className="p-4">Your profile doesn&apos;t exist</p>
        <Image src="/cat_not_work.gif"
              width={480}
              height={480}
              alt="The kitty is visting your profile"
        />
    </div>
}