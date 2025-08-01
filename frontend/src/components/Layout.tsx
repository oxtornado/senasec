import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Lock, Cloud, Package, Calendar } from 'lucide-react';
import clsx from 'clsx';

const Layout = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Inventario', href: '/inventory', icon: Package },
    { name: 'Préstamos', href: '/loans', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <Link to="/" className="flex items-center gap-2">
                <div className="flex items-center text-blue-600">
                  <Lock className="h-6 w-6" />
                  <Cloud className="h-6 w-6 -ml-2" />
                </div>
                <span className="text-xl font-bold text-gray-900">SENASEC</span>
              </Link>
              <div className="ml-10 flex items-center space-x-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={clsx(
                        'inline-flex items-center px-3 py-2 text-sm font-medium rounded-md',
                        location.pathname === item.href
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      )}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <footer className="bg-white border-t">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 SENASEC. Todos los derechos reservados.</p>
            <p>Contacto: soporte@senasec.com | Tel: (123) 456-7890</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;