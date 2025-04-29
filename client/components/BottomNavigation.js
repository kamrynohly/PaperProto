'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

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
    // {
    //   name: 'Multiplayer',
    //   href: '/multiplayer',
    //   icon: (
    //     <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    //       <path d="M17 6H7a5 5 0 0 0-5 5v3a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5v-3a5 5 0 0 0-5-5Z"></path>
    //       <circle cx="12" cy="14" r="1"></circle>
    //       <path d="M9 14h.01"></path>
    //       <path d="M15 14h.01"></path>
    //       <path d="M9 10h.01"></path>
    //       <path d="M15 10h.01"></path>
    //       <path d="m12 6-2-2h4l-2 2Z"></path>
    //     </svg>
    //   ),
    //   alt: 'Multiplayer Icon',
    //   isImage: false
    // },
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