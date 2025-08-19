import { Link } from "react-router";

export default function Sidebar() {
    return (
        <aside className="w-64 bg-gray-800 text-white">
            <div className="p-4">
                <h2 className="text-lg font-semibold">Dashboard</h2>
                <nav className="mt-4">
                    <ul>
                        <li>
                            <Link to="/dashboard" className="block py-2 px-4 hover:bg-gray-700">
                                Overview
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard/settings" className="block py-2 px-4 hover:bg-gray-700">
                                Settings
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard/profile" className="block py-2 px-4 hover:bg-gray-700">
                                Profile
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
}
