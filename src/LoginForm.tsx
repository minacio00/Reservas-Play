import { useState } from "react";
// import { firebaseApp } from "../firebaseConfig";
// import { getAuth } from "firebase/auth";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseApp } from "../firebaseConfig";

const LoginForm = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
//    const auth = getAuth(firebaseApp)
  const auth = getAuth(firebaseApp)
   signInWithEmailAndPassword(auth, user, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-indigo-900 mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Usuario
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 p-2 w-full border text-black rounded-md focus:ring focus:ring-indigo-400"
              placeholder="Usuário"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 text-black p-2 w-full border rounded-md focus:ring focus:ring-indigo-400"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-indigo-900 text-white py-2 px-4 rounded-md hover:bg-indigo-800 focus:outline-none focus:ring focus:ring-indigo-400"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;