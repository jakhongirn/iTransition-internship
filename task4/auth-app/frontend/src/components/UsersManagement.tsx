import { useEffect, useState } from "react"; // Import useState
import axios from "axios";
import Cookies from "universal-cookie";
import { Navigate, useNavigate } from "react-router";
import moment from "moment";
import { SERVER_URL } from "./SignUp";

const cookies = new Cookies();

type User = {
    _id: string;
    name: string;
    email: string;
    lastLoginTime: string;
    registeredAt: string;
    status: boolean;
};

const UsersManagement = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]); // Create a state to store users data
    const [authenticated, setAuthenticated] = useState(true);
    const [invalidToken, setInvalidToken] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    // Function to fetch the user list
    const fetchUsers = async () => {
        const token = cookies.get("TOKEN");
        const configuration = {
            method: "get",
            url: `${SERVER_URL}/api/v1/users/`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const result = await axios(configuration);
        return result.data;
    };

    const formatDateTime = (dateString: string) => {
        const date = moment(dateString);
        return date.format("HH:mm:ss, D MMM, YYYY");
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedUserIds([]);
        } else {
            const allUserIds = users.map((user) => user._id);
            setSelectedUserIds(allUserIds);
        }
        setSelectAll(!selectAll);
    };

    useEffect(() => {
        const token = cookies.get("TOKEN"); // Retrieve the token inside useEffect
        if (!token) {
            setAuthenticated(false);
            return;
        }
        // Set configurations for the API call
        const configuration = {
            method: "get",
            url: `${SERVER_URL}/api/v1/users/`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        // Make the API call
        axios(configuration)
            .then((result) => {
                // Get user data from the API response
                const userData = result.data;
                setUsers(userData); // Update the state with user data
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    setAuthenticated(false);
                    setInvalidToken(true);
                } else {
                    console.error(err);
                }
            });
    }, []);

    if (invalidToken) {
        // Handle invalid token here, e.g., display an error message
        return <div>Invalid token. Please log in again.</div>;
    }

    if (!authenticated) {
        return <Navigate to="/login" />;
    }

    //handle logout
    const handleLogout = () => {
        cookies.remove("TOKEN");
        navigate("/login");
    };

    //handle checkbox changes

    const handleCheckboxChange = (userId: string) => {
        if (selectedUserIds.includes(userId)) {
            setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
        } else {
            setSelectedUserIds([...selectedUserIds, userId]);
        }
    };

    // Update the users status (blocks or unblocks depending on the argument)
    const updateUsersStatus = async (statusUser: boolean) => {
        if (selectedUserIds.length === 0) {
            return;
        }

        try {
            const token = cookies.get("TOKEN");

            const configuration = {
                method: "post", // Use Post request
                url: `${SERVER_URL}/api/v1/users/updateMany/`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    arrayIds: selectedUserIds,
                    status: statusUser,
                },
            };

            await axios(configuration);

            // Fetch the updated user list after successful block
            const updatedUserList = await fetchUsers();

            // Update the UI by setting the user list state with the updated list
            setUsers(updatedUserList);

            // Clear the selectedUserIds

            // You can also display a success message if needed
        } catch (error) {
            // Handle error
            console.error("Error: ", error);
        }
        
        
    };

    const handleBlockUsers = async () => {
        updateUsersStatus(false);

        //Checks whether in selected users has logged user itself and if it is it clears the token
        const userId = cookies.get("userId");
        if (selectedUserIds.includes(userId)) {
            handleLogout();
        }

        setSelectedUserIds([]);
        setSelectAll(false);
    };

    const handleUnblockUsers = () => {
        updateUsersStatus(true);
        setSelectedUserIds([]);
        setSelectAll(false);
        
    };
    const handleDeleteUsers = async () => {
        // Check if there are selected users

        if (selectedUserIds.length === 0) {
            // No users selected for deletion
            return;
        }

        try {
            const token = cookies.get("TOKEN");

            const configuration = {
                method: "delete",
                url: `${SERVER_URL}/api/v1/users/delete/`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    arrayIds: selectedUserIds, // Pass the selected user IDs as data
                },
            };

            await axios(configuration);

            // Fetch the updated user list after successful block
            const updatedUserList = await fetchUsers();

            // Update the UI by setting the user list state with the updated list
            setUsers(updatedUserList);

            //Checks whether in selected users has logged user itself and if it is it clears the token
            const userId = cookies.get("userId");
            if (selectedUserIds.includes(userId)) {
                handleLogout();
            }

            // Clear the selectedUserIds
            setSelectedUserIds([]);
            
            
        } catch (err) {
            console.error("Error ", err);
        }
    };

    //get login name from the cookie
    const userName = cookies.get("name");

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">
                User Management
            </h2>
            <div className="flex justify-end gap-x-4 my-4 items-center">
                <h1 className="text-lg">
                    Welcome, <span className="text-purple-600">{userName}</span>
                </h1>
                |
                <button
                    onClick={handleLogout}
                    className="text-lg underline text-blue-500 hover:text-blue-400"
                >
                    Logout
                </button>
            </div>
            <div className="flex my-2">
                <button
                    onClick={handleBlockUsers}
                    className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900"
                >
                    Block
                </button>
                <button
                    onClick={handleUnblockUsers}
                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 "
                >
                    Unblock
                </button>
                <button
                    onClick={handleDeleteUsers}
                    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                    Delete
                </button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="pr-4 py-4 whitespace-nowrap">
                                <input
                                    type="checkbox"
                                    onChange={toggleSelectAll}
                                    checked={selectAll}
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Last Login Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Registered At
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="checkbox"
                                        value={user._id}
                                        checked={selectedUserIds.includes(
                                            user._id
                                        )}
                                        // You can store the selected user IDs in a state
                                        onChange={(e) =>
                                            handleCheckboxChange(e.target.value)
                                        }
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {formatDateTime(user.lastLoginTime)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {formatDateTime(user.registeredAt)}
                                </td>
                                <td
                                    className={`${
                                        user.status
                                            ? "text-green-500"
                                            : "text-red-500"
                                    } px-6 py-4 whitespace-nowrap`}
                                >
                                    {user.status ? "Active" : "Blocked"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersManagement;
