// components/BottomNavigation.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, PlusCircle, User } from 'lucide-react';

const BottomNavigation = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const tabs = [
    {
      name: 'Community',
      href: '/community',
      icon: <Users size={24} />,
    },
    {
      name: 'Create',
      href: '/create',
      icon: <PlusCircle size={24} />,
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: <User size={24} />,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around z-50">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        
        return (
          <Link 
            key={tab.name}
            href={tab.href}
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab.icon}
            <span className="text-xs mt-1">{tab.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNavigation;