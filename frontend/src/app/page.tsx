'use client';
import Link from 'next/link';
import { SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import ServerStatus from '@/components/serverStatus/api';

export default function HomePage() {
  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-10">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <SparklesIcon className="h-10 w-10 text-purple-600 animate-pulse" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">
            Bienvenue sur <span className="text-purple-600">Massivity</span>
          </h1>

          <p className="text-gray-600 text-lg mb-6">
            Ton tableau de bord pour gérer tes utilisateurs, ton API, et suivre les dernières évolutions.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <Link
                href="/login"
                className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-xl text-lg font-semibold shadow-md transition duration-300 flex items-center justify-center gap-2"
            >
              🔐 Connexion <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link
                href="/register"
                className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 py-3 px-6 rounded-xl text-lg font-semibold shadow-md transition duration-300 flex items-center justify-center gap-2"
            >
              ✍️ Inscription <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>

          <Link
              href="/changelog"
              className="mt-8 inline-block text-sm text-gray-500 hover:text-purple-600 transition duration-200"
          >
            📘 Voir le changelog
          </Link>
          <ServerStatus />
        </div>
      </div>
  );
}
