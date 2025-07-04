import Navbar from '../components/Navbar';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">{children}</div>
    </>
  );
};

export default Layout;
