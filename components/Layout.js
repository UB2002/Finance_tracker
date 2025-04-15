import Navigation from "./Navigation";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="flex flex-col items-center justify-start p-4">
        {children}
      </div>
    </div>
  );
};

export default Layout;