
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


function items(iconClasses: string) {
  return [
    { title: 'Home', to: '/', icon: <Home className={iconClasses} /> }, 
    { title: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard className={iconClasses} /> }, 
    { title: 'Habits', to: '/habit-tracker', icon: <ListPlus className={iconClasses} /> }, 
    { title: 'Books', to: '/book-tracker', icon: <Library className={iconClasses}/> }, 
    { title: 'ToDo', to: '/todo', icon: <Brackets className={iconClasses}/> }, 
  ]
}

function SettingsContent() {
  return (
    <DropdownMenuContent className="w-56 ">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
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
              <DropdownMenuItem>
                {link.icon}
                <Link className='p-4 font-medium' href={link.to}>{link.title}</Link>
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

interface ShowsActive {
  active: string
}

function Aside({ active }: ShowsActive) {
  return (
    <aside className='hidden-small fixed left-0 md:bottom-0 h-screen sm:hidden md:block md:w-[200px] bg-primary'>
      <h1 className='p-3 text-2xl whitespace-nowrap text-center text-white font-bold'>
        Habits
      </h1>
      <div className=''>
        <ul className='inline-grid grid-cols-1 w-full'>
          {
            items("ml-2 h-5 w-5").map((link)=> {
              return (
              <li className={clsx(link.title === active ? 'text-green-500' : 'text-white', 'text-md hover:bg-white hover:text-primary h-15 flex flex-col justify-center cursor-pointer')}>
                <span className='flex items-center ml-3'>
                  {link.icon}
                  <Link className='p-4 font-medium' href={link.to}>{link.title}</Link>
                </span>
              </li>
              )
            })
          }
        </ul>
      </div>
    </aside>
  )
}

function Nav() {
  return (
    <nav className='md:hidden h-[50px] transition-transform flex flex-row items-center bg-primary'>
      <div className='inline-grid grid-cols-3 gap-4 w-full'>
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
    </nav>
  )
}


export default function Sidebar({ active }: { active: string | undefined }) {
  return (
    <>
      <Aside active={active} />
      <Nav />
    </>
    
  )
}
