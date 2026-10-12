import Link from 'next/link';

export default function PrimaryButton({ href, children, className = '', ...props }) {
  const classes = `inline-flex min-h-11 items-center justify-center rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-forest-900 ${className}`;
  return href ? <Link className={classes} href={href} {...props}>{children}</Link> : <button className={classes} {...props}>{children}</button>;
}
