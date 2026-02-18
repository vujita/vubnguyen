import Signature from "@vujita/vubnguyen/src/components/signature";

export default function HomePage() {
  return (
    <div className="flex h-screen flex-col items-center">
      <div className="container mt-12 flex flex-col items-center justify-center gap-4 px-4 py-8">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">{"Hi, I'm"}</h1>
        <Signature />
      </div>
      <div className="p-4 text-center text-3xl text-blue-500 md:text-7xl">{"Coming soon!"}</div>
    </div>
  );
}
