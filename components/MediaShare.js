// Share Buttons
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';

// Icons
import {
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  PinterestIcon,
  RedditIcon,
  TelegramIcon,
  TumblrIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share';

import { ChevronDownIcon } from '@heroicons/react/outline';

// Make sure to swap the values of these two consts after first deploy
const shareUrl = `https://www.joshuaedo.netlify.app`;
const testUrl = `https://www.joshuaedo-spotify.vercel.app`;

export default function MediaShare(props) {
  return (
    <>
      <div className='justify-center items-center space-x-3 space-y-3 inline lg:flex '>
        <div className='justify-center items-center text-center  pt-6 md:pt-2 text-white absolute bottom-0 transparent rounded-md'>
          <div>
            <ChevronDownIcon
              className='h-10 w-10 text-white p-1 m-3 md:m-5 animate-pulse cursor-pointer'
              onClick={props.toggleMediaShare}
            />
          </div>
          <div>
            <p className='text-2xl md:text-5xl mb-3 md:mb-12 font-semibold'>
              Share a song?
            </p>
            <EmailShareButton url={shareUrl}>
              <EmailIcon size={102} round className='' />
            </EmailShareButton>
            <TumblrShareButton url={shareUrl}>
              <TumblrIcon size={102} round className='' />
            </TumblrShareButton>
            <FacebookShareButton url={shareUrl}>
              <FacebookIcon size={102} round className='' />
            </FacebookShareButton>
            <LinkedinShareButton url={shareUrl}>
              <LinkedinIcon size={102} round className='' />
            </LinkedinShareButton>
            <TwitterShareButton url={shareUrl}>
              <TwitterIcon size={102} round className='animate-bounce' />
            </TwitterShareButton>
            <WhatsappShareButton url={shareUrl}>
              <WhatsappIcon size={102} round className='' />
            </WhatsappShareButton>
            <PinterestShareButton url={shareUrl}>
              <PinterestIcon size={102} round className='' />
            </PinterestShareButton>
            <RedditShareButton url={shareUrl}>
              <RedditIcon size={102} round className='' />
            </RedditShareButton>
            <TelegramShareButton url={shareUrl}>
              <TelegramIcon size={102} round className='' />
            </TelegramShareButton>
          </div>
        </div>
      </div>
    </>
  );
}
