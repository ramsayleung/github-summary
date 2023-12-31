import { OutBoundSvgIcon } from "./OutboundSvgIcon";

export interface ProfileProps{
    avatarUrl: string
    username: string
    profileUrl: string
}
export function Profile({avatarUrl, username, profileUrl}: ProfileProps) {
    return (
      <div className="flex  items-start">
        <div className="flex flex-row w-3/4">
          <div className="px-2">
            <img src={avatarUrl} className="h-10 w-10 sm:h-20 sm:w-20" />
          </div>
          <div className="flex flex-col">
            <p className="font-bold pb-1 text-xs sm:text-lg">{username}</p>
            <a
              href={profileUrl}
              target="_blank"
              className="inline-flex items-center font-medium text-gray-600 hover:underline"
            >
              {profileUrl}
  
              <OutBoundSvgIcon />
            </a>
          </div>
        </div>
        <div className="flex flex-col justify-end text-gray-500 text-xs">
          <div className="pb-1">
              Get your summary <br />
          </div>
          <span className="text-foreground">github-worth.vercel.app</span>
        </div>
      </div>
    );
  }
  