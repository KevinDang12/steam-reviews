import React, { useEffect, useRef } from 'react';

export default function AdComponent() {
  const adRef = useRef(null);

  useEffect(() => {
    if (adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("Ad push error:", e);
      }
    }
  }, []);

  return (
    <ins 
      className="adsbygoogle"
      ref={adRef}
      style={{ display: "block", backgroundColor: "white", width: "50%" }}
      data-ad-client={`${process.env.REACT_APP_AD_CLIENT}`}
      data-ad-slot={`${process.env.REACT_APP_AD_SLOT}`}
      data-ad-format="vertical"
      data-full-width-responsive="true"
    />
  );
};
