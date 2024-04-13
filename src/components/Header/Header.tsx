import React, { useEffect, useState } from 'react';
import styles from './header.module.scss';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

let sidebarItems = [
  {
    name: 'Product',
    href: '/product',
    subMenu: [],
  },
  {
    name: 'Main Category',
    href: '/mainCategory',
    subMenu: [],
  },
  {
    name: 'Sub Category',
    href: '/subCategory',
    subMenu: [],
  },

  // {
  //   name: 'Admins',
  //   href: '/admins',
  //   subMenu: [],
  // },
  {
    name: 'Customers',
    href: '/customers',
    subMenu: [],
  },
  {
    name: 'Stores',
    href: '/stores',
    subMenu: [],
  },
  {
    name: 'Orders',
    href: '/orders',
    subMenu: [],
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
  }, [roleName]);

  return (
    <div className={styles.navbar}>
      <div className={styles.upperSection}>
        <div className={styles.logo}>The Advertisers</div>
        <div
          className={styles.loggedInUser}
          onClick={() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            localStorage.removeItem('date');
            router.push('/');
          }}
        >
          Logout
        </div>
      </div>
      <div className={styles.lowerSection}>
        {sidebarItems.map(({ name, href }) => {
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
          <Link href="/admins" className={`${styles.navLink} `}>
            Admins
          </Link>
        )}{' '}
      </div>
    </div>
  );
};

export default Header;
