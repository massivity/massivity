'use client';
import { WrenchIcon } from '@heroicons/react/24/outline';

export default function UnderConstruction() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center bg-purple-50 rounded-xl shadow-md p-8">
            <div className="bg-purple-100 p-4 rounded-full mb-4">
                <WrenchIcon className="h-12 w-12 text-purple-600 animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold text-purple-700 mb-2">
                🚧 En cours de construction 🚧
            </h1>
            <p className="text-gray-600 text-sm max-w-md">
                Cette fonctionnalité est en chantier… mais ne t’inquiète pas, nos développeurs sont déjà sur le coup !
                Reviens un peu plus tard pour voir la magie opérer ✨
            </p>
        </div>
    );
}
