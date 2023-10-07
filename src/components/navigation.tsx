'use client';

import Link from 'next/link';

import { LayoutDashboard, ListPlus, LogOut, User } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { PropsWithChildren, ReactElement } from 'react';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Separator } from './ui/separator';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';
import { cn } from '@/lib/utils';

interface SidebarItem {
  id: number;
  title: string;
  href: string;
  onClick?: () => void;
  icon: ReactElement;
}

function items(iconClasses: string): SidebarItem[] {
  return [
    {
      id: 1,
      title: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className={iconClasses} />,
    },
    {
      id: 2,
      title: 'Habits',
      href: '/habits',
      icon: <ListPlus className={iconClasses} />,
    },
    {
      id: 3,
      title: 'Profile',
      href: '/profile',
      icon: <User className={iconClasses} />,
    },
  ];
}

interface NavDropdownMenuProps extends PropsWithChildren {
  buttonContent: ReactElement;
}

export function NavDropdownMenu({
  buttonContent,
  children,
}: NavDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline'>{buttonContent}</Button>
      </DropdownMenuTrigger>
      {children}
    </DropdownMenu>
  );
}

interface SidebarLinkProps {
  link: SidebarItem;
  path: string;
  className?: string;
}

const SidebarLink = ({ link, path, className }: SidebarLinkProps) => (
  <Link
    key={link.id}
    href={link.href}
    onClick={link.onClick}
    className={clsx(
      className,
      link.href.split('/').pop() === path ? 'text-primary' : 'text-foreground',
      'hover:bg-secondary hover:text-foreground',
      'text-md cursor-pointer p-4',
      'h-15 flex flex-col justify-center ',
    )}
  >
    <span className='ml-3 flex items-center'>
      {link.icon}
      {link.title}
    </span>
  </Link>
);

function useRootPath() {
  return (
    usePathname()
      .split('/')
      .filter((path) => !!path)
      .shift() || ''
  );
}

function Sidebar() {
  const path = useRootPath();
  const logoutLink = {
    id: 0,
    title: 'Sign Out',
    href: '',
    onClick: () => signOut(),
    icon: <LogOut className='mr-2 h-5 w-5' />,
  };
  return (
    <aside className='bg-card border-primary fixed bottom-0 left-0 hidden h-[calc(100%-44px)] border-r-[1px] sm:block md:w-[200px]'>
      <div className='w-full'>
        {items('mr-2 h-5 w-5').map((link) => (
          <SidebarLink link={link} path={path} />
        ))}
      </div>
      <SidebarLink
        link={logoutLink}
        path={path}
        className='absolute bottom-0 w-full'
      />
    </aside>
  );
}

function Nav() {
  const linkClasses = cn(navigationMenuTriggerStyle(), 'bg-card');
  const path = useRootPath();
  return (
    <>
      <NavigationMenu className='bg-card fixed inset-x-0 top-0 h-[44px] max-w-full justify-start space-x-5'>
        <NavigationMenuList className='bg-card'>
          <NavigationMenuItem>
            <h1 className='ml-5 whitespace-nowrap text-center text-xl'>
              Habits
            </h1>
          </NavigationMenuItem>
          <NavigationMenuItem className='pl-4 sm:hidden'>
            <Link href='/dashboard' legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  linkClasses,
                  path === 'dashboard' ? 'text-primary' : 'text-foreground',
                )}
              >
                Dashboard
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className='sm:hidden'>
            <Link href='/habits' legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  linkClasses,
                  path === 'habits' ? 'text-primary' : 'text-foreground',
                )}
              >
                Habits
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className='sm:hidden'>
            <Link href='/profile' legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  linkClasses,
                  path === 'profile' ? 'text-primary' : 'text-foreground',
                )}
              >
                Profile
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Separator className='bg-primary fixed top-[44px]' />
    </>
  );
}

export default function Navigation() {
  return (
    <>
      <Nav />
      <Sidebar />
    </>
  );
}
