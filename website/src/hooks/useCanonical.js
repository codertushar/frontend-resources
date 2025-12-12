import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://codertushar.github.io/frontend-resources';

export function useCanonical() {
    const location = useLocation();

    useEffect(() => {
        const canonicalUrl = `${BASE_URL}${location.pathname}`;

        let link = document.querySelector('link[rel="canonical"]');
        if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', 'canonical');
            document.head.appendChild(link);
        }
        link.setAttribute('href', canonicalUrl);

        return () => {
            // Cleanup not needed as we update in place
        };
    }, [location.pathname]);
}
