import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link 
              href="/" 
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                pathname === "/" 
                  ? "border-blue-500 text-gray-900" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Add Transaction
            </Link>
            <Link 
              href="/dashboard" 
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                pathname === "/dashboard" 
                  ? "border-blue-500 text-gray-900" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/transactions" 
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                pathname === "/transactions" 
                  ? "border-blue-500 text-gray-900" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Transactions
            </Link>
            <Link 
              href="/charts" 
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                pathname === "/charts" 
                  ? "border-blue-500 text-gray-900" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Charts
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;