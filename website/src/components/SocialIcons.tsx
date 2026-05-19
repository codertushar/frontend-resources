
import React from 'react';

interface IconProps {
    size?: number;
    className?: string;
}

export const XIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        stroke="none"
    >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

export const LinkedInIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        stroke="none"
    >
        <path d="M4.983 3.5C4.983 4.88 3.887 6 2.5 6S0 4.88 0 3.5 1.113 1 2.5 1 4.983 2.12 4.983 3.5zM.5 8h4V23h-4zM8.5 8h3.836v2.045h.054c.534-1.012 1.839-2.08 3.786-2.08 4.048 0 4.795 2.66 4.795 6.12V23h-4v-7.86c0-1.875-.034-4.286-2.614-4.286-2.617 0-3.017 2.045-3.017 4.153V23h-4z" />
    </svg>
);

export const GitHubIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        stroke="none"
    >
        <path d="M12 .297a12 12 0 0 0-3.793 23.39c.6.111.82-.258.82-.577 0-.285-.011-1.041-.017-2.043-3.338.726-4.042-1.61-4.042-1.61-.547-1.387-1.335-1.756-1.335-1.756-1.091-.746.082-.731.082-.731 1.206.084 1.84 1.238 1.84 1.238 1.072 1.834 2.811 1.304 3.495.997.108-.776.42-1.304.763-1.603-2.665-.303-5.467-1.334-5.467-5.932 0-1.311.469-2.383 1.236-3.222-.124-.303-.536-1.524.117-3.176 0 0 1.008-.323 3.301 1.23a11.44 11.44 0 0 1 6.002 0c2.292-1.553 3.298-1.23 3.298-1.23.655 1.652.243 2.873.12 3.176.77.839 1.234 1.911 1.234 3.222 0 4.61-2.807 5.625-5.479 5.921.432.372.816 1.103.816 2.222 0 1.604-.014 2.896-.014 3.289 0 .321.216.694.825.576A12 12 0 0 0 12 .297z" />
    </svg>
);
