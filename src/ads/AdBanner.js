import React, { useEffect, useRef } from 'react';

const AdBanner = ({ optionKey, height, width }) => {
    const adDivRef = useRef(null);

    useEffect(() => {
        const insertScript = (atOptions, ref) => {
            const conf = document.createElement('script');
            const s = document.createElement('script');

            conf.innerHTML = `window.atOptions = ${JSON.stringify(atOptions)}`;
            s.type = 'text/javascript';
            s.src = `//www.topcreativeformat.com/${atOptions.key}/invoke.js`;

            if (ref.current && !ref.current.firstChild) {
                ref.current.appendChild(conf);
                ref.current.appendChild(s);
            }
        };

        const atOptions = {
            key: optionKey,
            format: 'iframe',
            height: height,
            width: width,
            params: {}
        };

        const adBanner = adDivRef.current;

        setTimeout(insertScript(atOptions, adDivRef), 750);

        return () => {
            if (adBanner) {
                adBanner.innerHTML = '';
            }
        };
    }, [optionKey, height, width]);

    return <div className="ad-container" ref={adDivRef}></div>;
};

export default AdBanner;
