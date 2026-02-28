type ChevronProps = {
  className?: string;
};

export function ChevronIcon({ className }: ChevronProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 69 69"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={true}
    >
      <g clipPath="url(#clip0_48_6)">
        <path d="M69.001 23.1055L46.6045 45.5L46.6055 45.501L34.5 57.6055L0 23.1055L12.1055 11L34.5 33.3945L56.8955 11L69.001 23.1055Z" fill="currentColor"/>
      </g>
      <defs>
        <clipPath id="clip0_48_6">
          <rect width="69" height="69" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}
