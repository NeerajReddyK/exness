import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import useUserStore from "../store/userStore";

const beUrl = import.meta.env.VITE_BE_URL;

export const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const addUser = useUserStore((state) => state.addUser);
  const user = useUserStore.getState();

  useEffect(() => {
    if (user.token) {
      navigate("/home");
    }
  });

  const submitUser = async () => {
    try {
      const user = await axios.post(`${beUrl}/auth/signup`, {
        name,
        email,
        password,
      });

      const { token } = await user.data.data;
      console.log("useUserStore before adding: ", useUserStore.getState());
      addUser({ name, email, token });
      console.log("useUserStore after adding: ", useUserStore.getState());
      navigate("/home");
    } catch (error) {
      console.error("error: ", error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen gap-6">
      <h1 className="text-3xl font-bold">SignUp</h1>
      <div>
        <div>
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            id="name"
            placeholder="Enter name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
