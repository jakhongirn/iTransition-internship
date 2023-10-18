import { useEffect, useState } from 'react'; // Import useState
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Navigate } from 'react-router';

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
  const [users, setUsers] = useState<User[]>([]); // Create a state to store users data
  const [authenticated, setAuthenticated] = useState(true);
  const [invalidToken, setInvalidToken] = useState(false);

  useEffect(() => {
    const token = cookies.get('TOKEN'); // Retrieve the token inside useEffect
    if (!token) {
        setAuthenticated(false);
        return
    }
    // Set configurations for the API call
    const configuration = {
      method: 'get',
      url: 'http://localhost:3000/api/v1/users',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Make the API call
    axios(configuration)
      .then((result) => {
        // Get user data from the API response
        const userData = result.data;
        console.log(userData)
        setUsers(userData); // Update the state with user data
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
            setAuthenticated(false);
            setInvalidToken(true);
        } else {
            console.error(err)
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

  return (
    <div className="container mx-auto p-4">
    <h2 className="text-2xl font-bold mb-4">User Management</h2>
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            
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
              <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.lastLoginTime}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.registeredAt}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.status ? "Active" : "Blocked"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default UsersManagement;
