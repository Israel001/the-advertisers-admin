'use client';

import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import styles from './product/product.module.scss';
import { ContextProvider as AppContextProvider } from '@/app-context';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.fullPage}>
      <AppContextProvider>
        <Header />
        <>
          <main className={styles.main}>{children}</main>
        </>
      </AppContextProvider>
    </div>
  );
};

export default DashboardLayout;
