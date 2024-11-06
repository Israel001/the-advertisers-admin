'use client';

import React, { useEffect, useState } from 'react';
import styles from './header.module.scss';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

let sidebarItems = [
  {
    name: 'Product',
    href: '/product',
  },
  {
    name: 'Main Category',
    href: '/mainCategory',
  },
  {
    name: 'Sub Category',
    href: '/subCategory',
  },
  {
    name: 'Customers',
    href: '/customers',
  },
  {
    name: 'Stores',
    href: '/stores',
  },
  {
    name: 'Orders',
    href: '/orders',
  },
  {
    name: 'Delivery',
    href: '/delivery',
  },
];

const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [roleName, setRolename] = useState('');

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      const roleName = user.role.name;
      setRolename(roleName);
    } else {
      console.error('User data not found in local storage');
    }
  }, []);

  // Filter sidebar items based on role
  const filteredSidebarItems = sidebarItems.filter((item) => {
    if (roleName === 'Delivery Agent') {
      // Customize items visible to Delivery Agent
      return item.name === 'Delivery';
    }
    return (
      item.name === 'Product' ||
      item.name === 'Main Category' ||
      item.name === 'Sub Category' ||
      item.name === 'Customers' ||
      item.name === 'Stores' ||
      item.name === 'Orders'
    );
  });

  return (
    <div className={styles.navbar}>
      <div className={styles.upperSection}>
        <div className={styles.logo}>The Advertisers</div>
        <div className={styles.loggedInUser}>
          <span
            onClick={() => {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('user');
              localStorage.removeItem('date');
              router.push('/');
            }}
          >
            Logout
          </span>{' '}
          | {roleName}
        </div>
      </div>
      <div className={styles.lowerSection}>
        {filteredSidebarItems.map(({ name, href }) => {
          const parts = pathname.split('/').filter(Boolean);
          const firstPart = parts[0];
          const isActiveLink = `/${firstPart}` === href;

          return (
            <Link
              href={href}
              key={`${name}-key`}
              className={`${styles.navLink} ${
                isActiveLink ? styles.active : ''
              }`}
            >
              {name}
            </Link>
          );
        })}
        {roleName === 'Super Admin' && (
          <Link href="/admins" className={`${styles.navLink}`}>
            Admins
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
