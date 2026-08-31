'use client'; // Componentes 3D só funcionam no cliente

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// Componente interno que carrega o modelo
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} />;
}

interface Product3DViewerProps {
  modelUrl?: string; // O .glb ou .gltf
  imageUrl: string;  // A imagem de fallback (WebP/PNG)
}

export default function Product3DViewer({ modelUrl, imageUrl }: Product3DViewerProps) {
  const [canRender3D, setCanRender3D] = useState(false);

  useEffect(() => {
    if (!modelUrl) return; // Se não tem modelo 3D, nem tenta
    
    // Verificação simples de performance: menos de 4 núcleos de CPU ou dispositivo móvel
    const isLowPerfDevice = navigator.hardwareConcurrency <= 4 || /Mobi|Android/i.test(navigator.userAgent);
    
    if (!isLowPerfDevice) {
      setCanRender3D(true);
    }
  }, [modelUrl]);

  // Fallback para imagem
  if (!canRender3D) {
    return (
      <div className="h-64 w-full relative">
        <Image 
          src={imageUrl} 
          alt="Produto" 
          fill 
          className="object-contain drop-shadow-2xl" 
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    );
  }

  // Renderiza o Canvas 3D
  return (
    <div className="h-64 w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <Model url={modelUrl} />
        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={2}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
