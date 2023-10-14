import { useState } from "react";
import axios from "axios";

interface SignUpFormState{
    name: string;
    email: string;
    password: string;
}

const SignUpForm = () => {

    const [formData, setFormData] = useState<SignUpFormState>({
        name: '',
        email: '',
        password: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prevData => ({...prevData, [name]: value}))
    }

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);
        
        
        try {
            const response = axios.post('http://localhost:3000/signup', formData)
            console.log(response);
            
        } catch (error){
            console.error(error)
        }
        
    }

  return (
    <>
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" onChange={handleChange} value={formData.name} required maxLength={30}/>

            <input type="email" name="email" onChange={handleChange} value={formData.email} required maxLength={50}/>

            <input type="password" name="password" onChange={handleChange} value={formData.password} required maxLength={50}/>
            <button type="submit" >Submit</button>
        </form>
    </>
  )
}

export default SignUpForm