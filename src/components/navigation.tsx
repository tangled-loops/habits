/* eslint-disable tailwindcss/classnames-order */
'use client';

import clsx from 'clsx';
import { LayoutDashboard, ListPlus, LogOut, Settings } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PropsWithChildren, ReactElement } from 'react';

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
    <aside className='fixed inset-y-0 left-0 hidden h-[100%] border-r-[1px] border-primary bg-card sm:block md:w-[200px]'>
      <h1 className='text-semibold mx-1 p-4 text-xl'>Habits</h1>
      <div className='mt-1'>
        <div className='w-full'>
          {items('mr-2 h-5 w-5').map((link) => (
            <SidebarLink key={link.id} link={link} path={path} />
          ))}
        </div>
        <SidebarLink
          link={logoutLink}
          path={path}
          className='absolute bottom-0 w-full'
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
      <Separator className='absolute bg-primary' />
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
