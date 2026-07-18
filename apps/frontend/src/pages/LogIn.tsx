import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import useUserStore from "../store/userStore";

const beUrl = import.meta.env.VITE_BE_URL;

export const LogIn = () => {
  const navigate = useNavigate();
  const user = useUserStore.getState();
  useEffect(() => {
    const token = user.token;
    if (token) {
      navigate("/home");
    }
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const addUser = useUserStore((state) => state.addUser);

  const submitUser = async () => {
    console.log("inside login submit user");
    try {
      const user = await axios.post(`${beUrl}/auth/login`, {
        email,
        password,
      });
      console.log("user.data.data: ", user.data.data);
      const { token, name } = user.data.data;
      addUser({ name, email, token });
      console.log("state: ", useUserStore.getState());
      navigate("/home");
    } catch (error) {
      console.error("error: ", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen gap-6">
      <h1 className="text-3xl font-bold">Login</h1>
      <div>
        <div>
          <label htmlFor="email">Email: </label>
          <input
            type="text"
            id="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div>
        <button
          className="bg-blue-500 rounded-lg py-2 px-6 cursor-pointer"
          onClick={submitUser}
        >
          Submit
        </button>
      </div>
    </div>
  );
};
