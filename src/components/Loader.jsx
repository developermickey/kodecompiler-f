
const Loader = () => (
   <div className="text-center py-16">
    <div className="relative inline-flex items-center justify-center">
      <div className="absolute w-12 h-12 bg-blue-100 rounded-full animate-ping"></div>
      <div className="relative w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
    <p className="mt-4 text-blue-800 font-medium">Loading page...</p>
  </div>
)
export default Loader;