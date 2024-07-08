import React from 'react';
import { ThreeDots } from 'react-loader-spinner';
import '../styles/LoadingBar.css';

/**
 * The Loading Page Component
 * @returns The React Loading Component
 */
export default function LoadingBar() {
    return (
        <div className='LoadPage'>
            <ThreeDots
                visible={true}
                height={50}
                width={100}
                color="#fff"
                radius="6"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
                />
        </div>
    );
}
