export default function Footer() {
    return(
       <footer className= "mt-16 border-t">
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-500 flex flex-wrap gap-4 items-center justify-between">
            <p>© {new Date().getFullYear()} LifeLens. All rights reserved.</p>
            <div className="flex gap-4">
                <a href = "malito:contact@lifelens.app" className="hover:text-gray-700">Contact</a>
                <a href = "https://lifelens-backend.onrender.com/docs" className="hover:text-gray-700" rel="noreferrer">API Docs</a>
            </div>
        </div>
       </footer>
    )
}