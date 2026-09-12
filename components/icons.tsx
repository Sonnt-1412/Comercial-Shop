type IconProps = { size?: number; strokeWidth?: number };

export function ArrowUpRight({ size = 16, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d="M5 19 19 5M8 5h11v11"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

export function ArrowRight({ size = 16, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d="M4 12h15m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

export function SearchIcon({ size = 17, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <circle
        cx="10.8"
        cy="10.8"
        r="6.3"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <path
        d="m16 16 4.2 4.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

export function MenuIcon({ size = 20, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

export function PlusIcon({ size = 16, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

export function BoxIcon({ size = 18, strokeWidth = 1.35 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d="m4.5 7.5 7.5 4 7.5-4M12 11.5v8M5 7.9v8.2L12 20l7-3.9V7.9L12 4 5 7.9Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

export function CartIcon({ size = 18, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <circle cx="10" cy="20" r="1" fill="currentColor" />
      <circle cx="18" cy="20" r="1" fill="currentColor" />
    </svg>
  );
}

export function UserIcon({ size = 18, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <circle
        cx="12"
        cy="8"
        r="3.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <path
        d="M5 20c.7-4 3-6 7-6s6.3 2 7 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

export function MinusIcon({ size = 16, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d="M5 12h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

export function TrashIcon({ size = 16, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
