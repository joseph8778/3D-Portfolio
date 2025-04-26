import React from 'react';

const Footer = () => {
    return (
       <footer id='contact' className='w-full pt-20 pb-10'>
        <div className='w-full absolute left-0 -bottom-72 min-h-96'>
            <img src='/footer-grid.svg' alt="grid" className='w-full h-full opacity-75' />
        </div>

        <div className="flex flex-col items-center"></div>
       </footer>
    );
}

export default Footer;
