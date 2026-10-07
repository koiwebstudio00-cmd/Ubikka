import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowLeft, ArrowRight, Images, X } from 'lucide-react';
export function PropertyGallery({ photos, title }: { photos: { id: string; url: string }[]; title: string }) {
  const [open, setOpen] = useState(false), [index, setIndex] = useState(0);
  const show = (value: number) => { setIndex(value); setOpen(true); };
  const move = (delta: number) => setIndex(value => (value + delta + photos.length) % photos.length);
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <section aria-label="Fotos de la propiedad" className={`property-gallery ${photos.length === 1 ? 'property-gallery-single' : ''}`}>
      {photos.slice(0,5).map((photo, i) => <Dialog.Trigger asChild key={photo.id}><button onClick={() => show(i)} className={`gallery-tile gallery-tile-${i}`} aria-label={`Ver foto ${i + 1} de ${photos.length}`}><img src={photo.url} alt={`${title} — foto ${i + 1}`} loading={i === 0 ? 'eager' : 'lazy'} />{(i === Math.min(photos.length,5)-1 || (i === 2 && photos.length > 3)) && <span className={`gallery-count ${i === 2 && photos.length > 3 ? 'md:hidden' : ''}`}><Images size={16} /> Ver {photos.length} {photos.length === 1 ? 'foto' : 'fotos'}</span>}</button></Dialog.Trigger>)}
    </section>
    <Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-[100] bg-black/90" /><Dialog.Content aria-describedby={undefined} onKeyDown={e => { if(e.key === 'ArrowRight') { e.preventDefault(); move(1); } if(e.key === 'ArrowLeft') { e.preventDefault(); move(-1); } }} className="fixed inset-3 md:inset-10 z-[101] flex flex-col outline-none">
      <div className="flex items-center justify-between gap-4 p-3 text-[#E6E0D6]"><Dialog.Title className="text-sm">{title} · {index+1} / {photos.length}</Dialog.Title><Dialog.Close className="p-3 rounded-full bg-white/10" aria-label="Cerrar galería"><X /></Dialog.Close></div>
      <div className="relative flex-1 min-h-0 flex items-center justify-center"><img src={photos[index].url} alt={`${title} — foto ${index+1}`} className="max-w-full max-h-full object-contain" />{photos.length > 1 && <><button onClick={() => move(-1)} aria-label="Foto anterior" className="absolute left-0 p-3 bg-black/60 rounded-full"><ArrowLeft /></button><button onClick={() => move(1)} aria-label="Foto siguiente" className="absolute right-0 p-3 bg-black/60 rounded-full"><ArrowRight /></button></>}</div>
    </Dialog.Content></Dialog.Portal>
  </Dialog.Root>;
}
