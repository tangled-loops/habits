/* eslint-disable tailwindcss/classnames-order */
'use client';

import { CaretLeftIcon, CaretRightIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import { LayoutDashboard, ListPlus, LogOut, Settings } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { PropsWithChildren, ReactElement, useContext } from 'react';

import { UIContext } from './providers/ui';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';
import { Separator } from './ui/separator';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
      title: 'Tracker',
      href: '/habits',
      icon: <ListPlus className={iconClasses} />,
    },
    {
      id: 3,
      title: 'Settings',
      href: '/settings',
      icon: <Settings className={iconClasses} />,
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
  iconOnly?: boolean;
}

const SidebarLink = ({ iconOnly, link, path, className }: SidebarLinkProps) => (
  <Link
    key={link.id}
    href={link.href}
    onClick={link.onClick}
    className={clsx(
      className,
      link.href.split('/').pop() === path ? 'text-primary' : 'text-foreground',
      'flex flex-col justify-center',
      'h-[15] cursor-pointer border-b p-4 text-lg',
      'hover:bg-secondary hover:text-foreground',
    )}
  >
    <span className='ml-3 flex items-center'>
      {link.icon}
      {!iconOnly && <>{link.title}</>}
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
  const { sidebarSize, setSidebarSize } = useContext(UIContext);
  const isSmall = sidebarSize === 'sm';
  const path = useRootPath();
  if (sidebarSize === 'na') return;
  const logoutLink = {
    id: 0,
    title: 'Sign Out',
    href: '',
    onClick: () => signOut(),
    icon: (
      <LogOut
        className={cn(isSmall ? 'h-[1.5rem] w-[1.5rem]' : 'mr-2 h-6 w-6')}
      />
    ),
  };
  return (
    <aside
      className={cn(
        'fixed left-0 top-[44px] z-50 hidden h-[calc(100%-44px)] border-r border-t border-primary',
        'bg-card sm:block',
        isSmall && 'w-[85px]',
        !isSmall && 'w-[200px]',
      )}
    >
      <div
        className={cn(
          'fixed bottom-[100px] z-50',
          isSmall && 'left-[69px]',
          !isSmall && 'left-[184px]',
        )}
      >
        <button
          className='rounded-[50px] bg-primary p-1 text-white'
          onClick={() => setSidebarSize(isSmall ? 'lg' : 'sm')}
        >
          {isSmall ? (
            <CaretRightIcon className='h-6 w-6' />
          ) : (
            <CaretLeftIcon className='h-6 w-6' />
          )}
        </button>
      </div>
      <div className='relative h-full'>
        <div className='w-full'>
          {items(isSmall ? 'h-7 w-7' : 'mr-2 h-7 w-7').map((link, i) => (
            <SidebarLink
              key={link.id}
              link={link}
              path={path}
              iconOnly={isSmall}
              className={cn(i === 0 && 'border-t')}
            />
          ))}
        </div>
        <SidebarLink
          link={logoutLink}
          path={path}
          className='absolute bottom-0 w-full border-t'
          iconOnly={isSmall}
        />
      </div>
    </aside>
  );
}

function Nav() {
  const linkClasses = cn(navigationMenuTriggerStyle(), 'bg-card');
  const path = useRootPath();
  return (
    <>
      <NavigationMenu className='fixed inset-0 h-[44px] max-w-full justify-start space-x-5 bg-card'>
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
                Tracker
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className='sm:hidden'>
            <Link href='/settings' legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  linkClasses,
                  path === 'settings' ? 'text-primary' : 'text-foreground',
                )}
              >
                Settings
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Separator className='fixed top-[44px] bg-primary' />
    </>
  );
}

export function Navigation() {
  return (
    <>
      <Nav />
      <Sidebar />
    </>
  );
}
