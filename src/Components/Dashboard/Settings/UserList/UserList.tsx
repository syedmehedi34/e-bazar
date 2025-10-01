"use client";

import { FolderSync, Trash } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

interface IUserList {
    _id: string;
    name: string;
    email: string;
    role: string[];
    createdAt: Date;
}

type UserListProps = {
    users: IUserList[];
    onGetUserFn: () => void
};

const UserList: React.FC<UserListProps> = ({ users, onGetUserFn }) => {
    const [selectedUser, setSelectedUser] = useState<IUserList | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // handle update button click
    const handleUpdateClick = (user: IUserList) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    // handle form submit
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedUser) return;

        const formData = new FormData(e.currentTarget);
        const updatedUser = {
            name: formData.get("name"),
            email: formData.get("email"),
            role: formData.getAll("role"),
        };
        try {
            const res = await axios.patch(`http://localhost:5000/admin/user-update/${selectedUser._id}`, updatedUser);
            if (res.status === 200) {
                toast.success(res.data.message);
                onGetUserFn()
                setIsModalOpen(false);
            }
            if (res.status === 404) {
                toast.success(res.data.message);

            }

        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Error updating user:");
        }
    };

    

    const handleDeleteUser = async (id: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won’t be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                const res = await axios.delete(`http://localhost:5000/admin/user-delete/${id}`);
                if (res.status === 200) {
                    toast.success(res?.data?.message || "User deleted successfully");
                    onGetUserFn();
                }
            } catch (error) {
                console.error(error);
                toast.error("Something went wrong");
            }
        }
    };


    return (
        <div className="overflow-x-auto w-full p-4 relative">
            {/* Heading */}
            <h2 className="text-2xl font-bold mb-2 dark:text-white">User List</h2>

            {/* Paragraph */}
            <p className="mb-4 text-gray-600 dark:text-gray-300">
                This table displays the list of all registered users, including their names, emails, roles, and registration dates.
            </p>

            {/* Table */}
            <table className="table w-full dark:bg-gray-800 dark:text-white">
                <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="dark:text-white">Name</th>
                        <th className="dark:text-white">Email</th>
                        <th className="dark:text-white">Role</th>
                        <th className="dark:text-white">Created At</th>
                        <th className="dark:text-white">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users?.map((user, index) => (
                        <tr key={index} className="dark:hover:bg-gray-700">
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role.join(", ")}</td>
                            <td>{new Date(user.createdAt).toLocaleString()}</td>
                            <td className="flex gap-2">
                                <button
                                    title="Update"
                                    onClick={() => handleUpdateClick(user)}
                                    className="p-2 bg-gray-100 dark:bg-gray-600 cursor-pointer rounded-full"
                                >
                                    <FolderSync />
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(user._id)}
                                    title="Delete"
                                    className=" p-2 bg-gray-100 dark:bg-gray-600 cursor-pointer rounded-full"
                                >
                                    <Trash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal */}
            {isModalOpen && selectedUser && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-[400px]">
                        <h3 className="text-xl font-bold mb-4 dark:text-white">Update User</h3>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            {/* Name */}
                            <label className="text-sm font-medium dark:text-white">
                                Name
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={selectedUser.name}
                                    className="input w-full dark:bg-gray-600"
                                />
                            </label>

                            {/* Email */}
                            <label className="text-sm font-medium dark:text-white">
                                Email
                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={selectedUser.email}
                                    className="input w-full dark:bg-gray-600"
                                />
                            </label>


                            {/* Role (Single Select) */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text text-sm font-medium dark:text-white">
                                        Select Role
                                    </span>
                                </label>

                                <select
                                    name="role"
                                    defaultValue={selectedUser.role}
                                    className="select w-full dark:bg-gray-600 dark:text-white"
                                >
                                    <option disabled value="">-- Choose a role --</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>

                                </select>
                            </div>




                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-2 py-2 bg-gray-200 text-black rounded cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-black hover:bg-gray-900 cursor-pointer text-white rounded-box"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;
