import React, { useEffect, useRef } from 'react';

const LeftAdBanner = () => {
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
            key: '9a24fe8117a1638c942110c0d4f4c2b0',
            format: 'iframe',
            height: 300,
            width: 160,
            params: {}
        };

        const adBanner = adDivRef.current;

        setTimeout(insertScript(atOptions, adDivRef), 750);

        return () => {
            if (adBanner) {
                adBanner.innerHTML = '';
            }
        };
    }, []);

    return <div className="ad-container" ref={adDivRef}></div>;
};

export default LeftAdBanner;
