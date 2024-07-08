import React from 'react';
import '../styles/NotFoundPage.css';

/**
 * Element to display when a page is not found.
 * @return {JSX.Element} A 404: Page Not Found! Element
 */
export default function NotFoundPage() {
  return (
    <div className='error-page'>
        <h2 className='error-header'>404: Page Not Found!</h2>
    </div>
  );
}
