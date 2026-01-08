import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Use primary domain for SEO
const BASE_URL = 'https://crackfrontend.in';

export function useCanonical(): void {
    const location = useLocation();

    useEffect(() => {
        const canonicalUrl = `${BASE_URL}${location.pathname}`;

        let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
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
