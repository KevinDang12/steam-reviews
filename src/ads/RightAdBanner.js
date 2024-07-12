import React, { useEffect, useRef } from 'react';

function RightAdBanner() {
    const adDivRef = useRef(null);

    useEffect(() => {
        function insertScript(atOptions, ref) {
            const conf = document.createElement('script');
            const s = document.createElement('script');

            conf.innerHTML = `window.atOptions = ${JSON.stringify(atOptions)}`;
            s.dataset.cfasync = 'false';
            s.type = 'text/javascript';
            s.src = `//www.topcreativeformat.com/${atOptions.key}/invoke.js`;

            if (ref.current && !ref.current.firstChild) {
                ref.current.appendChild(conf);
                ref.current.appendChild(s);
            }
        };

        const atOptions = {
            key: '987c31b0d0867252ba14295f3ad07915',
            format: 'iframe',
            height: 600,
            width: 160,
            params: {}
        };

        const adBanner = adDivRef.current;

        if (adBanner) {
            setTimeout(() => {
                insertScript(atOptions, adDivRef);
            }, 500);
        }

        return () => {
            if (adBanner) {
                adBanner.innerHTML = '';
            }
        };
    }, []);

    return <div className="ad-container" ref={adDivRef}></div>;
};

export default RightAdBanner;
