
'use client'

import Link from 'next/link'

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
} from "lucide-react"
 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { PropsWithChildren, ReactElement } from 'react'
import { Button } from "@/components/ui/button"
import clsx from 'clsx'

import { signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { Separator } from './ui/separator'
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from './ui/menubar'

interface SidebarItem {
  id: number
  title: string
  href: string
  onClick?: () => void
  icon: ReactElement
}

function items(iconClasses: string): SidebarItem[] {
  return [
    { id: 1, title: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className={iconClasses} /> }, 
    { id: 2, title: 'Habits', href: '/habits', icon: <ListPlus className={iconClasses} /> },
    { id: 3, title: 'Profile', href: '/profile', icon: <User className={iconClasses} /> },
  ]
}

function SettingsContent() {
  const router = useRouter()
  return (
    <DropdownMenuContent className="w-56 ">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem className='cursor-pointer' onClick={() => router.push('/profile')}>
          <User className="mr-2 h-4 w-4" />
          <Link className='p-1 font-medium' href='/profile'>Profile</Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuGroup>
        <DropdownMenuItem className='cursor-pointer' onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <Link className='p-1 font-medium' href='/api/auth/signout'>Sign Out</Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  )
}

function MenuContent() {
  return (
    <DropdownMenuContent className="w-56 ">
      <DropdownMenuLabel>Main Menu</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        {
          items("mr-2 h-4 w-4").map((link)=> {
            return (
              <DropdownMenuItem key={link.id}>
                {link.icon}
                <Link className='p-4 font-medium' href={link.href}>{link.title}</Link>
              </DropdownMenuItem>
            )
          })
        }
        
      </DropdownMenuGroup>
    </DropdownMenuContent>
  )
}

interface NavDropdownMenuProps extends PropsWithChildren{
  buttonContent: ReactElement
}

export function NavDropdownMenu({ buttonContent, children, }: NavDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className='bg-foreground text-white'>
          {buttonContent}
        </Button>
      </DropdownMenuTrigger>
      {children}
    </DropdownMenu>
  )
}

interface SidebarLinkProps {
  link: SidebarItem
  path: string
  className?: string
}

const SidebarLink = ({ link, path, className }: SidebarLinkProps) => 
  <Link 
    key={link.id}
    href={link.href} 
    onClick={link.onClick}
    className={
      clsx(
        className, 
        link.href === path ? 'text-green-500' : 'text-white', 
        'text-md hover:bg-white hover:text-primary cursor-pointer p-4',
        'h-15 flex flex-col justify-center '
      )
    }>
    <span className='flex items-center ml-3'>
      {link.icon}
      {link.title}
    </span>
  </Link>

function Sidebar() {
  const path = usePathname()
  const logoutLink = {
    id: 0, title: "Sign Out", href: '', onClick: () => signOut(), icon: <LogOut className='mr-2 h-5 w-5'/>
  }
  return (
    <aside className='fixed top-[41px] left-0 md:bottom-0 h-screen hidden sm:block md:w-[200px] bg-primary border-r-2 border-emerald-500'>
      {/* <h1 className='p-3 text-2xl whitespace-nowrap text-center text-white font-bold'>
        Habits
      </h1> */}
      <div className='w-full'>
        {items("mr-2 h-5 w-5").map((link)=> <SidebarLink link={link} path={path} />)}
      </div>
      <SidebarLink link={logoutLink} path={path} className='w-full fixed bottom-0' />
    </aside>
  )
}

function Nav() {
  return (
    <>
      <nav className='sm:h-[40px] h-[50px] flex flex-row items-center transition-transform bg-primary'>
        <div className='sm:hidden inline-grid grid-cols-3 gap-4 w-full'>
          <div className='p-1 flex justify-start m-4'>
            <NavDropdownMenu buttonContent={<Menu/>}>
              <MenuContent />
            </NavDropdownMenu>
          </div>
          <div className='flex flex-col justify-center'>
            <h1 className='text-2xl whitespace-nowrap text-center text-white'>
              Habits
            </h1>
          </div>
          <div className='p-1 flex justify-end m-4'>
            <NavDropdownMenu buttonContent={<Settings/>}>
              <SettingsContent />
            </NavDropdownMenu>
          </div>
        </div>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                New Tab <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                New Window <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem disabled>New Incognito Window</MenubarItem>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger>Share</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>Email link</MenubarItem>
                  <MenubarItem>Messages</MenubarItem>
                  <MenubarItem>Notes</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSeparator />
              <MenubarItem>
                Print... <MenubarShortcut>⌘P</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </nav>
      <Separator className='bg-emerald-500'/>
    </>
  )
}

export default function Navigation() {
  return (
    <>
      <Nav />
      <Sidebar />
    </>
    
  )
}
