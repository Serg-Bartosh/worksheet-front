export default function Header({ onLogout, isLoggedIn }: { onLogout: () => void, isLoggedIn: boolean }) {
    return (
        <header className="bg-[#50c878] shadow-md w-full py-4 px-8">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="text-white text-2xl font-bold tracking-tight">
                    Worksheet<span className="text-[#99e999]">App</span>
                </div>
                {isLoggedIn && (
                    <button
                        onClick={onLogout}
                        className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
                    >
                        Logout
                    </button>
                )}
            </div>
        </header>
    );
}