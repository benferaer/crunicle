import NewRun from "./new-run";

export default function Page() {
  return (
    <main className="flex justify-center items-center h-screen bg-stone-900">
      <div className="text-center">
        <h1 className="font-bold text-4xl">New Run</h1>
        <NewRun />
      </div>
    </main>
  );
}