import React from 'react';
import styles from './header.module.scss';
import { ChevronDownIcon } from '@radix-ui/react-icons';
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
];

const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

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
      </div>
    </div>
  );
};

export default Header;
