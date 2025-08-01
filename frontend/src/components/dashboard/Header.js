export default function Header({ onToggleMenu }) {
    return (
        <button
            className="md:hidden fixed z-30 left-4 top-4 bg-white shadow-xl p-2 rounded-xl"
            onClick={onToggleMenu}
        >
            <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
    );
}