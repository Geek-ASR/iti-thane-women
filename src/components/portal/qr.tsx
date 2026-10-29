'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Camera, CameraOff } from 'lucide-react';
import { Button } from './kit';

export function QrSvg({ text, className }: { text: string; className?: string }) {
  const [svg, setSvg] = useState('');
  useEffect(() => {
    let alive = true;
    QRCode.toString(text, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#120f3a', light: '#ffffff' } }).then((s) => alive && setSvg(s));
    return () => {
      alive = false;
    };
  }, [text]);
  return <div role="img" aria-label="Attendance QR code" className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}

type Detector = { detect: (src: CanvasImageSource) => Promise<{ rawValue: string }[]> };

/** Camera QR scanner: native BarcodeDetector where available, jsQR (lazy-loaded) elsewhere (e.g. iOS Safari). */
export function QrScanner({ onResult }: { onResult: (text: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState('');
  const stopRef = useRef<() => void>(() => {});

  useEffect(() => () => stopRef.current(), []);

  async function start() {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();
      setActive(true);
      let detector: Detector | null = null;
      const BD = (window as unknown as { BarcodeDetector?: new (o: { formats: string[] }) => Detector }).BarcodeDetector;
      if (BD) detector = new BD({ formats: ['qr_code'] });
      const jsQR = detector ? null : (await import('jsqr')).default;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
      let stopped = false;
      let timer = 0;
      stopRef.current = () => {
        stopped = true;
        clearTimeout(timer);
        stream.getTracks().forEach((t) => t.stop());
        setActive(false);
      };
      const tick = async () => {
        if (stopped) return;
        if (video.readyState >= 2) {
          try {
            let value: string | null = null;
            if (detector) value = (await detector.detect(video))[0]?.rawValue ?? null;
            else if (jsQR) {
              const w = Math.min(640, video.videoWidth);
              const h = Math.round((video.videoHeight / video.videoWidth) * w);
              canvas.width = w;
              canvas.height = h;
              ctx.drawImage(video, 0, 0, w, h);
              value = jsQR(ctx.getImageData(0, 0, w, h).data, w, h)?.data ?? null;
            }
            if (value) {
              stopRef.current();
              navigator.vibrate?.(60);
              onResult(value);
              return;
            }
          } catch {
            /* keep scanning */
          }
        }
        timer = window.setTimeout(tick, 140);
      };
      tick();
    } catch (e) {
      setError(e instanceof Error && e.name === 'NotAllowedError' ? 'Camera permission was denied. Allow camera access in your browser settings, or type the 6-digit code instead.' : 'Could not open the camera on this device. Type the 6-digit code instead.');
    }
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-brand-950">
        <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
        {active ? (
          <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="relative size-2/3 rounded-3xl ring-[999px] ring-brand-950/45">
              <span className="absolute -top-0.5 -left-0.5 size-8 rounded-tl-2xl border-t-4 border-l-4 border-marigold-400" />
              <span className="absolute -top-0.5 -right-0.5 size-8 rounded-tr-2xl border-t-4 border-r-4 border-marigold-400" />
              <span className="absolute -bottom-0.5 -left-0.5 size-8 rounded-bl-2xl border-b-4 border-l-4 border-marigold-400" />
              <span className="absolute -right-0.5 -bottom-0.5 size-8 rounded-br-2xl border-r-4 border-b-4 border-marigold-400" />
              <span className="absolute inset-x-4 top-1/2 h-0.5 animate-pulse bg-marigold-400/80" />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 grid place-items-center p-6 text-center text-white">
            <div>
              <Camera className="mx-auto size-10 text-marigold-300" aria-hidden />
              <p className="mt-3 text-sm text-white/80">Point your camera at the QR code on the classroom screen.</p>
              <Button variant="accent" className="mt-4" onClick={start}>
                Open camera
              </Button>
            </div>
          </div>
        )}
      </div>
      {active && (
        <Button variant="outline" size="sm" className="mt-3" onClick={() => stopRef.current()}>
          <CameraOff className="size-4" aria-hidden /> Stop camera
        </Button>
      )}
      {error && <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">{error}</p>}
    </div>
  );
}

/** Best-effort location (resolves null on denial/timeout — the server then flags instead of rejecting). */
export function getLocation(timeout = 7000): Promise<{ lat: number; lng: number } | null> {
  return new Promise((res) => {
    if (!('geolocation' in navigator)) return res(null);
    navigator.geolocation.getCurrentPosition(
      (p) => res({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => res(null),
      { enableHighAccuracy: true, timeout, maximumAge: 60_000 },
    );
  });
}
