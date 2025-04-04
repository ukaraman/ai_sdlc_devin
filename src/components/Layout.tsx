import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CreditCard, History, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  
  const routes = [
    {
      href: '/',
      label: 'Dashboard',
      icon: Home,
      active: location.pathname === '/',
    },
    {
      href: '/payment',
      label: 'Pay Invoice',
      icon: CreditCard,
      active: location.pathname === '/payment',
    },
    {
      href: '/history',
      label: 'Payment History',
      icon: History,
      active: location.pathname === '/history',
    },
  ];

  return (
    <div className="h-full">
      {/* Mobile Navigation */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 right-4 z-40">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b">
              <h1 className="text-xl font-bold">Invoice Payment App</h1>
            </div>
            <div className="flex-1 overflow-auto">
              <nav className="flex flex-col gap-2 p-4">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    to={route.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 text-sm rounded-md hover:bg-gray-100 transition-colors",
                      route.active && "bg-gray-100 font-medium"
                    )}
                  >
                    <route.icon size={20} />
                    {route.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-50 border-r bg-white">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold">Invoice Payment App</h1>
        </div>
        <div className="flex-1 overflow-auto">
          <nav className="flex flex-col gap-2 p-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                to={route.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm rounded-md hover:bg-gray-100 transition-colors",
                  route.active && "bg-gray-100 font-medium"
                )}
              >
                <route.icon size={20} />
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="md:pl-64 pt-16 md:pt-0 min-h-screen bg-gray-50">
        <div className="container p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
