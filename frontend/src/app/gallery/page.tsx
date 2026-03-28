import GalleryComponent from '@/components/gallery/GalleryComponent';

export const metadata = {
  title: 'Gallery — The Artist Factory',
  description: 'Events That Live Forever. From grand weddings to electrifying concerts — every frame tells the story of an unforgettable moment.',
};

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-[#0C0C0C] text-[#F2EDE8]">
      <GalleryComponent />
    </main>
  );
}
