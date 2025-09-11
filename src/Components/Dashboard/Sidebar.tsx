"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    console.log(session)
    const menuItems = [

        { name: "Dashboard", path: "/dashboard" },
     

    ];


    if ((session?.user as any)?.role?.includes('admin')) {
        menuItems.push(
            { name: "Products", path: "/dashboard/products" },
            { name: "Add Products", path: "/dashboard/add-products" },
            { name: "Orders", path: "/dashboard/orders" },
            { name: "Reports", path: "/dashboard/reports" },
            { name: "Settings", path: "/dashboard/settings" },
            { name: "Notifications", path: "/dashboard/notifications" },
            { name: "Support", path: "/dashboard/support" },
        )
    }
    if ((session?.user as any)?.role?.includes('use')) {
        menuItems.push(
            { name: "My Order", path: "/dashboard/add-products" },
            { name: "Settings", path: "/dashboard/settings" },
            { name: "Wishlist", path: "/dashboard/Wishlist" },
            { name: "Support", path: "/dashboard/Support" },
            { name: "Notifications", path: "/dashboard/Notifications" }

        )
    }

    return (
        <aside className="w-64 h-screen bg-gradient shadow shadow-red-200 text-white flex flex-col p-4">
            <div className="flex justify-center my-5 ">
                <Image src={session?.user?.image || 'https://static.vecteezy.com/system/resources/previews/001/840/612/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg'} width={100} height={100} alt="Profile images" className="rounded-full" />
            </div>
            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`block px-4 py-2 rounded-md ${pathname === item.path ? "bg-gray-700" : "hover:bg-gray-800"
                            }`}
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
