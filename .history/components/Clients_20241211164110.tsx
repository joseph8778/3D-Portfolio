import React from 'react';
import { InfiniteMovingCards } from './ui/InifiniteMovingCards';
import { companies, testimonials } from '@/data';

const Clients = () => {
    return (
        <div id='projects' className='py-20'>
        <h1 className="heading">
            Kind words from
            <span className='text-purple'> satisfied clients.</span>
        </h1>

        <div className="flex flex-col items-center max-lg:mt-10">
         
                <InfiniteMovingCards
                items={testimonials}
                direction='right'
                speed='slow'
                />

            <div>
                {companies.map(({id, img, name, nameImg}) => (
                    <div key={id} className='flex md:max-w-60 max-w-32 gap-2'>
                        <img src={img} alt={nameImg} className='md:w-10 w-5' />
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
}

export default Clients;
