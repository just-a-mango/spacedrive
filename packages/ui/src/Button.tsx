import { VariantProps, cva, cx } from 'class-variance-authority';
import { forwardRef } from 'react';
import { Link, LinkProps } from 'react-router-dom';

export interface ButtonBaseProps extends VariantProps<typeof styles> {}

export type ButtonProps = ButtonBaseProps &
	React.ButtonHTMLAttributes<HTMLButtonElement> & {
		href?: undefined;
	};

export type LinkButtonProps = ButtonBaseProps &
	React.AnchorHTMLAttributes<HTMLAnchorElement> & {
		href?: string;
	};

type Button = {
	(props: ButtonProps): JSX.Element;
	(props: LinkButtonProps): JSX.Element;
};

const hasHref = (props: ButtonProps | LinkButtonProps): props is LinkButtonProps => 'href' in props;

const styles = cva(
	[
		'cursor-default items-center rounded-md border outline-none transition-colors duration-100',
		'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-70',
		'ring-offset-app-box focus:ring-2 focus:ring-accent focus:ring-offset-2'
	],
	{
		variants: {
			size: {
				icon: '!p-1',
				lg: 'text-md py-1.5 px-3 font-medium',
				md: 'py-1.5 px-2.5 text-sm font-medium',
				sm: 'py-1 px-2 text-sm font-medium'
			},
			variant: {
				default: [
					'bg-transparent hover:bg-app-hover active:bg-app-selected',
					'border-transparent hover:border-app-line active:border-app-line'
				],
				subtle: [
					'border-transparent hover:border-app-line/50 active:border-app-line active:bg-app-box/30'
				],
				outline: [
					'border-sidebar-line/60 hover:border-sidebar-line active:border-sidebar-line/30'
				],
				dotted: [
					`rounded border border-dashed border-sidebar-line/70 text-center text-xs font-medium text-ink-faint transition hover:border-sidebar-line hover:bg-sidebar-selected/5`
				],
				gray: [
					'bg-app-button hover:bg-app-hover active:bg-app-selected',
					'border-app-line hover:border-app-line active:border-app-active'
				],
				accent: [
					'border-accent-deep bg-accent text-white shadow-md shadow-app-shade/10 hover:border-accent hover:bg-accent-faint active:border-accent-deep active:bg-accent'
				],
				colored: ['text-white shadow-sm hover:bg-opacity-90 active:bg-opacity-100'],
				bare: ''
			}
		},
		defaultVariants: {
			size: 'sm',
			variant: 'default'
		}
	}
);

export const Button = forwardRef<
	HTMLButtonElement | HTMLAnchorElement,
	ButtonProps | LinkButtonProps
>(({ className, ...props }, ref) => {
	className = cx(styles(props), className);
	return hasHref(props) ? (
		<a {...props} ref={ref as any} className={cx(className, 'inline-block no-underline')} />
	) : (
		<button type="button" {...(props as ButtonProps)} ref={ref as any} className={className} />
	);
});

export const ButtonLink = forwardRef<
	HTMLLinkElement,
	ButtonBaseProps & LinkProps & React.RefAttributes<HTMLAnchorElement>
>(({ className, to, ...props }, ref) => {
	className = cx(
		styles(props),
		'no-underline disabled:opacity-50 disabled:cursor-not-allowed',
		className
	);

	return (
		<Link to={to} ref={ref as any} className={className}>
			{props.children}
		</Link>
	);
});
