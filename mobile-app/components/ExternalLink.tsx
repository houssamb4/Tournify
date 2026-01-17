import { Link } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Platform } from 'react-native';

type ExternalLinkProps = ComponentProps<typeof Link>;

// Helper function to get URL string from href regardless of its type
const getUrlString = (href: ExternalLinkProps['href']): string => {
  if (typeof href === 'string') {
    return href;
  } else if (typeof href === 'object' && href !== null) {
    // Handle object format (pathname + params)
    if ('pathname' in href) {
      return href.pathname as string;
    }
  }
  // Fallback
  return String(href);
};

export function ExternalLink({ href, children, className, ...rest }: ExternalLinkProps) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      className={className}
      onPress={async (event) => {
        if (Platform.OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          const urlString = getUrlString(href);
          await openBrowserAsync(urlString);
        }
      }}
    >
      {children}
    </Link>
  );
}
