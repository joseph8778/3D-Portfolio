'use client'
import React, { useState } from 'react';
import MagicButton from './ui/MagicButton';
import { socialMedia } from '@/data';
import { IoCopyOutline } from 'react-icons/io5';

const Footer = () => {
const [copied, setCopied] = useState(false);
const handleCopy = () => {
  navigator.clipboard.writeText('joseph8778@gmail.com');
  setCopied(true)
}
    return (
       <footer id='contact' className='w-full pb-10'>

        <div className="flex flex-col items-center">
            <h1 className='heading lg:max-w-[45vw]'>
                Ready to take <span className='text-purple'>your</span> digital presence to the next level?
            </h1>
            <p className='text-white-200 md:mt-10 my-5 text-center'>Reach out today and let&apos;s discuss how I can help you achieve your goals.</p>

            <MagicButton
                    title={copied ? 'Email copied' : 'Copy my email'}
                    icon={<IoCopyOutline/>}
                    position="left"
                    otherClasses="!bg-[#161a31]"
                    handleClick={handleCopy}
                    />
        </div>

        <div className='flex mt-16 md:flex-row flex-col justify-between items-center'> 
            <p className='md:text-base text-sm md:font-normal font-light'>Copyright © 2025 Joseph F. Torres</p>

            <div className='flex items-center md:gap-3 gap-6 mt-5 md:mt-0'>
                {socialMedia.map((profile) => (
                    <a href={profile.link}
                    target='_blank'
                    className='w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300' key={profile.id}>
                        <img src={profile.img} alt={profile.id} width={20} height={20} />
                    </a>
                ))}
            </div>
        </div>
       </footer>
    );
}

export default Footer;
