import React, { ReactNode } from 'react';
import { Header } from '../components';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Header />

      <main>{children}</main>
    </div>
  );
};

export default Layout;
