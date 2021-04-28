import React from 'react';

const Button = ({ children, ...props }) => {
    return (
        <div className='btn-wrapper'>
            <button className='btn' {...props}>
                { children }
            </button>
        </div>
    )
}

export default Button;