import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "./SignUp";


const cookies = new Cookies();

interface LoginFormState {
    name: string;
    email: string;
    password: string;
}


const LoginForm = () => {
    const navigate = useNavigate()

    const [errorLogin, setErrorLogin] = useState("");

    const [formData, setFormData] = useState<LoginFormState>({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    }

    const handleSubmit = async (
        e: React.ChangeEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
            try {
                const response = axios.post(
                    `${SERVER_URL}/api/v1/login/`,
                    formData
                );
                console.log(await response)
                if ((await response).status === 200) {
                    console.log(response)
                    cookies.set("TOKEN", (await response).data.token, {
                        path: "/",
                      });
                    cookies.set("name", (await response).data.name, {
                        path: "/",
                    })
                    cookies.set("userId", (await response).data.userId, {
                        path: "/",
                    })
                    navigate("/users")
                } 
                else {
                    setErrorLogin((await response).data.message)
                }
                
            } catch (error) {
                console.error(error);
                
            }
        } 
    

    return (
        <>
            <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
                <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
                    <h1 className="text-3xl font-semibold text-center text-purple-700 underline">
                        Sign in
                    </h1>
                    <form className="mt-6" onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <label className="block text-sm font-semibold text-gray-800">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                onChange={handleChange}
                                value={formData.email}
                                className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm font-semibold text-gray-800">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                onChange={handleChange}
                                value={formData.password}
                                className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            />
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                            >
                                Login
                            </button>
                        </div>

                        <p className="mt-4 text-center text-red-500 font-semibold">{errorLogin}</p>
                    </form>

                    <p className="mt-8 text-xs font-light text-center text-gray-700">
                        {" "}
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="font-medium text-purple-600 hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default LoginForm;
