'use client';

import { usePathname, useRouter } from 'next/navigation';
import styles from './sidebar.module.scss';
import { composeClasses } from '../../libs/utils';
import React, { useEffect, useState } from 'react';
import ToggleSwitch from '../../components/ToggleSwitch/ToggleSwitch';

const Sidebar: React.FC<{}> = () => {
  let sidebarItems = [
    {
      name: 'Product',
      href: '/dashboard',
      subMenu: [],
    },
  ];

  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <ul className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div>
              <div className="dropdownCollection"></div>
            </div>
            <div className={styles.statusAndToggle}>
              <div>
                <p className={styles.collectionId}>Collection ID - </p>
                <div>
                  <div>
                    <span
                      className={styles.publishedBadge}
                      style={{
                        textAlign: 'left',
                      }}
                    >
                      {'Published'}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <div className={styles.toggleSwitchWrapper}>
                  <div>
                    <span className={styles.toggleText}>{'Test'}</span>
                  </div>
                  <div className={styles.toggleSwitchContainer}>
                    <ToggleSwitch toggle={false} handler={() => {}} />
                  </div>
                  <div>
                    <span className={styles.toggleText}>{'Live'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <>
            <div className="mainMenu">
              {sidebarItems.map(({ name, href, subMenu }, key) => {
                const isActiveLink = href === pathname;

                return (
                  <div
                    key={`sidebarItems_${key}`}
                    onClick={(e) => {
                      router.push(href);
                    }}
                    className={styles.itemContainer}
                  >
                    <li
                      className={composeClasses(
                        styles.sidebarItem,
                        isActiveLink && styles.activeLinkSideBar,
                        href === '' && styles.textAndIconPane,
                      )}
                    >
                      <div className={styles.listItem} title={name}>
                        <p>
                          {name
                            ? name?.length > 20
                              ? `${name?.substring(0, 17)}...`
                              : name
                            : ''}
                        </p>
                      </div>
                    </li>
                  </div>
                );
              })}
            </div>
          </>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
