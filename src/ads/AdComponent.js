import React, { useEffect } from 'react';

const AdComponent = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//pl23707920.highrevenuenetwork.com/299300832f0c2d60bd546f6d7151ef75/invoke.js';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    document.body.appendChild(script);
  }, []);

  return (
    <div id="container-299300832f0c2d60bd546f6d7151ef75"></div>
  );
};

export default AdComponent;

