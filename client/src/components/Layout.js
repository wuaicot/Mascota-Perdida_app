// client/src/components/Layout.js
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pb-8">{children}</main>
    </div>
  );
};

export default Layout;