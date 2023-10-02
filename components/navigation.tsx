'use client';

import Link from 'next/link';

import {
  Brackets,
  Home,
  LayoutDashboard,
  Library,
  ListPlus,
  LogOut,
  Menu,
  Settings,
  User,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { PropsWithChildren, ReactElement } from 'react';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Separator } from './ui/separator';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from './ui/menubar';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
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

function SettingsContent() {
  const router = useRouter();
  return (
    <DropdownMenuContent className='w-56 '>
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem
          className='cursor-pointer'
          onClick={() => router.push('/profile')}
        >
          <User className='mr-2 h-4 w-4' />
          <Link className='p-1 font-medium' href='/profile'>
            Profile
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuGroup>
        <DropdownMenuItem className='cursor-pointer' onClick={() => signOut()}>
          <LogOut className='mr-2 h-4 w-4' />
          <Link className='p-1 font-medium' href='/api/auth/signout'>
            Sign Out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
}

function MenuContent() {
  return (
    <DropdownMenuContent className='w-56'>
      <DropdownMenuLabel>Main Menu</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        {items('mr-2 h-4 w-4').map((link) => {
          return (
            <DropdownMenuItem key={link.id}>
              {link.icon}
              <Link className='p-4 font-medium' href={link.href}>
                {link.title}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
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
      link.href === path ? 'text-primary' : 'text-foreground',
      'hover:bg-secondary hover:text-foreground',
      'text-md cursor-pointer p-4',
      'h-15 flex flex-col justify-center ',
    )}
  >
    <span className='flex items-center ml-3'>
      {link.icon}
      {link.title}
    </span>
  </Link>
);

function Sidebar() {
  const path = usePathname();
  const logoutLink = {
    id: 0,
    title: 'Sign Out',
    href: '',
    onClick: () => signOut(),
    icon: <LogOut className='mr-2 h-5 w-5' />,
  };
  return (
    <aside className='fixed left-0 bottom-0 hidden h-[calc(100%-44px)] sm:block md:w-[200px] bg-card border-r-[1px] border-primary'>
      <div className='w-full'>
        {items('mr-2 h-5 w-5').map((link) => (
          <SidebarLink link={link} path={path} />
        ))}
      </div>
      <SidebarLink
        link={logoutLink}
        path={path}
        className='w-full absolute bottom-0'
      />
    </aside>
  );
}

function Nav() {
  const linkClasses = cn(navigationMenuTriggerStyle(), 'bg-card');
  const pathRoot = usePathname()
    .split('/')
    .filter((path) => path && path !== '')
    .shift();
  console.log(pathRoot)
  return (
    <>
      <NavigationMenu className='fixed top-0 right-0 left-0 max-w-full h-[44px] space-x-5 bg-card justify-start'>
        <NavigationMenuList className='bg-card'>
          <NavigationMenuItem>
            <h1 className='text-xl ml-5 whitespace-nowrap text-center'>
              Habits
            </h1>
          </NavigationMenuItem>
          <NavigationMenuItem className='sm:hidden pl-4'>
            <Link href='/dashboard' legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  linkClasses,
                  pathRoot === 'dashboard' ? 'text-primary' : 'text-foreground',
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
                  pathRoot !== 'habits' ? 'text-primary' : 'text-foreground',
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
                  pathRoot === 'profile' ? 'text-primary' : 'text-foreground',
                )}
              >
                Profile
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Separator className='bg-primary top-[44px] fixed' />
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

{
  /* <nav className='transition-transform bg-card'>
  <div className='sm:hidden h-[50px] flex flex-row items-center justify-center'>
    <div className='inline-grid grid-cols-3 gap-4 w-full'>
      <div className='p-1 flex justify-start m-4'>
        <NavDropdownMenu buttonContent={<Menu/>}>
          <MenuContent />
        </NavDropdownMenu>
      </div>
      <div className='flex flex-col justify-center'>
        <h1 className='text-2xl whitespace-nowrap text-center'>
          Habits
        </h1>
      </div>
      <div className='p-1 flex justify-end m-4'>
        <NavDropdownMenu buttonContent={<Settings/>}>
          <SettingsContent />
        </NavDropdownMenu>
      </div>
    </div>
  </div>
</nav>
<div className='hidden bg-card sm:flex h-[40px] flex-row items-center px-2 py-1'>
  <h1 className='ml-5 text-2xl whitespace-nowrap text-center'>
    Habits
  </h1>
</div>  */
}
/* 
<NavigationMenu className='w-full h-[40px] ml-[100px] space-x-10 bg-primary'>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Profile</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
          <li className="row-span-3">
            <NavigationMenuLink asChild>
              <a
                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                href="/"
              >
                <Icons.logo className="h-6 w-6" />
                <div className="mb-2 mt-4 text-lg font-medium">
                  shadcn/ui
                </div>
                <p className="text-sm leading-tight text-muted-foreground">
                  Beautifully designed components built with Radix UI and
                  Tailwind CSS.
                </p>
              </a>
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
*/
