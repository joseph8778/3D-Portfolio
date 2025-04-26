import { workExperience } from '@/data';
import React from 'react';
import { Button } from './ui/MovingBorders';

const Experience = () => {
    return (
    <div id='experience' className='py-20'>
        <h1 className="heading">
            My
            <span className='text-purple'> work experience.</span>
        </h1>

        <div className="w-full mt-12 grid lg:grid-cols-4 grid-cols-1 gap-10">
            {workExperience.map((card) => (
                <Button key={card.id} border='1.75rem' className='flex-1 text-white border-neutral-200 dark:border-slate-800' duration={Math.floor(Math.random() * 10000) + 10000}>
                    <div className='flex'>
                        <img className='lg:w-32 md:w-20 w-16' src={card.thumbnail} alt={card.thumbnail} />
                    </div>
                </Button>
            ))}
        </div>
    </div>
    );
}

export default Experience;
