import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-zinc-50 p-8">
      <Image
        src="/images/alnabawy.jpg"
        alt="Al Nabawy logo"
        width={320}
        height={320}
        className="rounded-lg object-contain shadow-md"
        priority
      />
    </main>
  );
}
