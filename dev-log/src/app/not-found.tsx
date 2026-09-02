export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0c0b09] text-[#f0ead6] font-mono">
      <h1 className="text-6xl text-[#f59e0b] mb-4">404</h1>
      <p className="text-xl mb-2">NullPointerException</p>
      <p className="text-[#8a8275]">
        O recurso que você procura aponta para lugar nenhum. O dev foi tomar café.
      </p>
      <a href="/" className="mt-6 px-4 py-2 border border-[#f59e0b] text-[#f59e0b] rounded hover:bg-[#f59e0b] hover:text-black transition-all">
        cd ~
      </a>
    </div>
  );
}
