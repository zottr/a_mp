import React from 'react';
import MainAppBar from './common/MainAppBar';

const Layout = ({ children }) => {
  return (
    <>
      {/* <MainAppBar /> */}
      <main>{children}</main>
      {/* <Footer /> */}
    </>
  );
};

export default Layout;
