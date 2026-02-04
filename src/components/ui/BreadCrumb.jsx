
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

const BreadCrumb = ({ label, parentLink = '/doc', parentLabel = 'Doc' }) => (
    <div className="mb-8 flex items-center gap-2 text-sm text-gray-500">
       <Link to={parentLink} className="hover:text-indigo-500 cursor-pointer transition">{parentLabel}</Link>
       <ChevronRight size={14} />
       <span className="text-gray-600 font-medium truncate max-w-md">{label}</span>
    </div>
)


export default BreadCrumb