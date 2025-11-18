
'use client';

import { useEffect, useState } from 'react';
import { UploadButton } from '@/lib/uploadthing';

interface UploadUIProps {
  onUploadComplete: (urls: string[]) => void;
  setUploading?: (val: boolean) => void;
  clearTrigger?: boolean;
}

export default function UploadUI({ onUploadComplete, setUploading, clearTrigger }: UploadUIProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    if (clearTrigger) {
      setImageUrls([]);
    }
  }, [clearTrigger]);

  return (
    <div className="space-y-3">
      <UploadButton
        endpoint="imageUploader"
        onUploadBegin={() => setUploading?.(true)}
        onClientUploadComplete={(res) => {
          const urls = res.map((f) => f.url); // можно заменить на f.ufsUrl при обновлении
          const updated = [...imageUrls, ...urls];
          setImageUrls(updated);
          onUploadComplete(updated);
          setUploading?.(false);
        }}
        onUploadError={(err) => {
          alert('Ошибка: ' + err.message);
          setUploading?.(false);
        }}
        appearance={{
          button:
            'bg-sky-600 text-white font-semibold px-4 py-2 rounded hover:bg-sky-700 transition',
        }}
      />

      {imageUrls.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {imageUrls.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Фото ${idx + 1}`}
              className="w-24 h-24 object-cover rounded border"
            />
          ))}
        </div>
      )}
    </div>
  );
}
