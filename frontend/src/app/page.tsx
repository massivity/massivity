'use client';
import Link from 'next/link';
import { SparklesIcon, ArrowRightIcon, StarIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import ServerStatus from '@/components/serverStatus/api'; // ton composant "invisible" version refaite plus haut

const features = [
  {
    title: 'Gestion sécurisée',
    desc: 'Comptes utilisateurs, tokens JWT, sécurité au top, données protégées.',
    icon: <StarIcon className="h-7 w-7 text-purple-600" />,
  },
  {
    title: 'API moderne',
    desc: 'API RESTful, documentation Swagger intégrée et facilement extensible.',
    icon: <SparklesIcon className="h-7 w-7 text-pink-500" />,
  },
  {
    title: 'Dashboard puissant',
    desc: 'Interface d’administration, suivi du changelog, gestion dynamique.',
    icon: <ArrowRightIcon className="h-7 w-7 text-indigo-500" />,
  },
];

export default function LandingPage() {
  const [serverOnline, setServerOnline] = useState(true);

  return (
      <div className="min-h-screen flex flex-col bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        {/* Header Hero */}
        <header className="w-full pt-14 pb-16 px-4 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-6">
            <SparklesIcon className="h-10 w-10 text-white drop-shadow-lg animate-pulse" />
            <span className="text-2xl font-bold text-white drop-shadow">Massivity</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4 drop-shadow-lg">
            Gérez vos utilisateurs, <span className="text-purple-200">protégez votre API</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-purple-100 mb-8 drop-shadow">
            La plateforme idéale pour une gestion fluide des accès, un tableau de bord simple et toutes les fonctionnalités modernes dont vous avez besoin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
                href={serverOnline ? "/login" : "#"}
                aria-disabled={!serverOnline}
                tabIndex={serverOnline ? 0 : -1}
                className={`${
                    serverOnline
                        ? 'bg-purple-700 hover:bg-purple-800 text-white cursor-pointer'
                        : 'bg-gray-300 text-gray-400 cursor-not-allowed'
                } font-semibold py-3 px-8 rounded-2xl shadow-xl text-lg transition flex items-center gap-2`}
            >
              🔐 Connexion <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link
                href={serverOnline ? "/register" : "#"}
                aria-disabled={!serverOnline}
                tabIndex={serverOnline ? 0 : -1}
                className={`${
                    serverOnline
                        ? 'border-2 border-purple-700 text-purple-700 hover:bg-purple-50'
                        : 'border-2 border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
                } font-semibold py-3 px-8 rounded-2xl shadow-xl text-lg transition flex items-center gap-2`}
            >
              ✍️ Inscription <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
          {/* Affichage du message serveur hors ligne */}
          {!serverOnline && (
              <div className="mt-6 text-red-500 text-sm font-semibold animate-pulse">
                Serveur hors ligne : impossible de se connecter ou de s’inscrire pour le moment.
              </div>
          )}
          {/* Ne rien afficher, juste notifier via onStatusChange */}
          <ServerStatus onStatusChange={setServerOnline} />
        </header>

        {/* Features */}
        <section className="max-w-4xl w-full mx-auto grid md:grid-cols-3 gap-8 bg-white/80 backdrop-blur-2xl rounded-3xl px-8 py-12 mb-10 shadow-xl">
          {features.map((f, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="mb-3">{f.icon}</div>
                <div className="text-xl font-bold text-purple-700 mb-2">{f.title}</div>
                <div className="text-gray-700 text-base">{f.desc}</div>
              </div>
          ))}
        </section>

        {/* Call To Action */}
        <section className="flex flex-col items-center justify-center text-center pb-16 mt-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Prêt à booster ton projet ?</h2>
          <p className="text-purple-100 mb-6">Inscris-toi gratuitement, tu pourras tout gérer depuis ton dashboard personnalisé.</p>
        </section>

        {/* Footer minimal */}
        <footer className="w-full text-center text-sm text-purple-100 py-8">
          <span>&copy; {new Date().getFullYear()} Massivity. Tous droits réservés.</span>
        </footer>
      </div>
  );
}
