function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-[#F3F7FE] gap-12">
        <h1 className="font-black text-6xl m-4">LogIn</h1>
        <div className="flex flex-col gap-12 mt-4">
            <div className="flex flex-col gap-2 font-[quicksand] text-xl">
                <input className="p-5 pt-3 pb-3 border-2 rounded-2xl border-neutral-800 focus:outline-0 focus:border-blue-600" type="text" placeholder="Username" />
                <input className="p-5 pt-3 pb-3 border-2 rounded-2xl border-neutral-800 focus:outline-0 focus:border-blue-600" type="password" placeholder="Password" />
            </div>
            <button className="p-4 bg-amber-300 text-[#0B0E11] font-bold text-2xl rounded-2xl hover:cursor-pointer hover:bg-amber-400 transition-colors">Login</button>
        </div>
    </div>
  )
}

export default Login