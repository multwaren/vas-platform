"use client";

import { useState } from "react";
import { subscriberLogin } from "../lib/api";

export default function LoginPage() {
  const [msisdn, setMsisdn] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const result = await subscriberLogin(msisdn, password);

    if (result.SUBSCRIBER_ID) {
      localStorage.setItem("subscriber", JSON.stringify(result));
      window.location.href = "/dashboard";
    } else {
      setMessage("Invalid phone number or password");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-700 via-red-600 to-red-900">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-2xl w-[390px] border border-red-100"
      >
        <h1 className="text-3xl font-bold text-red-600 mb-8 text-center">
          Vodafone Telsim
        </h1>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          className="w-full border border-gray-400 bg-gray-50 text-gray-900 p-3 rounded-lg mb-5 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200 placeholder:text-gray-500"
          value={msisdn}
          onChange={(e) => setMsisdn(e.target.value)}
          placeholder="Enter phone number"
        />

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Password
        </label>
        <input
          className="w-full border border-gray-400 bg-gray-50 text-gray-900 p-3 rounded-lg mb-6 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200 placeholder:text-gray-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          type="password"
        />

        <button className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg font-semibold transition">
          Login
        </button>

        {message && (
          <p className="mt-4 text-center text-sm font-medium text-red-600">
            {message}
          </p>
        )}
      </form>
    </main>
  );
}