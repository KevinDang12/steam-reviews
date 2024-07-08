import React, { useEffect, useRef } from 'react';

const AdBanner = () => {

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
            key: 'b60371fabf2b5c5d6242d20d7f155218',
            format: 'iframe',
            height: 250,
            width: 300,
            params: {}
        };

        const adBanner = adDivRef.current;

        insertScript(atOptions, adDivRef);

        return () => {
            if (adBanner) {
                adBanner.innerHTML = '';
            }
        };
    }, []);

    return <div style={{ margin: '20px auto 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }} ref={adDivRef}></div>;
};

export default AdBanner;
