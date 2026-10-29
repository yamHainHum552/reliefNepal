import Link from 'next/link';

export default function PrimaryButton({ href, children, className = '', variant = 'primary', ...props }) {
  const variants = {
    primary: 'inline-flex min-h-11 items-center justify-center rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-forest-900',
    outline: 'inline-flex min-h-11 items-center justify-center rounded-full border-2 border-white px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10',
  };
  const classes = `${variants[variant] || variants.primary} ${className}`;
  return href ? <Link className={classes} href={href} {...props}>{children}</Link> : <button className={classes} {...props}>{children}</button>;
}
