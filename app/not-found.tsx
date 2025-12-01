import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Halaman Tidak Ditemukan</h1>
            <p className="text-lg text-gray-600 mb-8">Maaf, sepertinya halaman yang anda tuju tidak tersedia.</p>
            <Link href="/" className="px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-500 transition font-semibold">
                <ArrowLeft className="inline-block w-5 h-5" /> Kembali ke Home
            </Link>
        </div>
    )
}

export default NotFound;