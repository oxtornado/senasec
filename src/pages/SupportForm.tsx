import React, { useState } from "react";

const SupportForm: React.FC = () => {
  const [user, setUser] = useState("");
  const [issue, setIssue] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!user.trim() || !issue.trim()) {
      setError("Por favor completa todos los campos.");
      return;
    }
    // Aquí podrías enviar los datos a un backend si lo deseas
    setSuccess(true);
    setUser("");
    setIssue("");
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="user" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Usuario (nombre o correo)
        </label>
        <input
          type="text"
          id="user"
          value={user}
          onChange={e => setUser(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      <div>
        <label htmlFor="issue" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Descripción de la novedad o problema
        </label>
        <textarea
          id="issue"
          rows={4}
          value={issue}
          onChange={e => setIssue(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        ></textarea>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">¡Novedad registrada correctamente!</p>}
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Enviar
      </button>
    </form>
  );
};

export default SupportForm;
