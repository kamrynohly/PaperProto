'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

// This component creates the navigation bar at the bottom of each page.

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
      iconSrc: '/arcade.png',
      alt: 'Community Icon',
      isImage: true
    },
    {
      name: 'Create',
      href: '/create',
      iconSrc: '/console.png',
      alt: 'Create Icon',
      isImage: true
    },
    {
      name: 'Profile',
      href: '/profile',
      iconSrc: '/profile.png',
      alt: 'Profile Icon',
      isImage: true
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-gray-900 border-t-4 border-indigo-600 flex items-center justify-around z-50 shadow-lg">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);

        return (
          <Link 
            key={tab.name}
            href={tab.href}
            className={`flex flex-col items-center justify-center w-full h-full transition-transform duration-200 hover:scale-110 ${
              isActive 
                ? 'text-pink-500 relative after:content-[""] after:absolute after:bottom-0 after:left-1/4 after:right-1/4 after:h-1' 
                : 'text-gray-400 hover:text-indigo-400'
            }`}
            style={{
              textShadow: isActive ? '0px 0px 6px rgba(236, 72, 153, 0.6)' : 'none',
            }}
          >
            <div className={`p-1 ${isActive ? 'bg-gray-700 rounded-md border-2 border-indigo-500' : ''}`}>
              {tab.isImage ? (
                <Image
                  src={tab.iconSrc}
                  alt={tab.alt}
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              ) : (
                tab.icon
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNavigation;