export default function LoadingScreen() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600" />
        </div>
    );
}