import React from 'react';
import { InfiniteMovingCards } from './ui/InifiniteMovingCards';
import { testimonials } from '@/data';

const Clients = () => {
    return (
        <div id='projects' className='py-20'>
        <h1 className="heading">
            Kind words from
            <span className='text-purple'> satisfied clients.</span>
        </h1>

        <div className="flex flex-col items-center">
            <InfiniteMovingCards
            items={testimonials}
            />
        </div>
        </div>
    );
}

export default Clients;
