// aura/js/hero-worker.js
import init, { ParticleSystem } from '../../wasm-particles/pkg/wasm_particles.js';

let wasmSystem;
let isInitialized = false;

self.onmessage = async function(e) {
    const { type, data } = e.data;

    if (type === 'init' && !isInitialized) {
        await init();
        wasmSystem = new ParticleSystem(data.width, data.height, data.count);
        isInitialized = true;
        self.postMessage({ type: 'ready' });
    }

    if (type === 'update' && isInitialized) {
        // 1. O Rust calcula a física (pesado)
        wasmSystem.update(data.mouseX, data.mouseY);

        // 2. Pega os arrays de volta
        const xs = wasmSystem.get_x();
        const ys = wasmSystem.get_y();
        const zs = wasmSystem.get_z();
        const sizes = wasmSystem.get_sizes();
        const colors = wasmSystem.get_colors();

        // 3. Envia de volta para a thread principal (Leve, usa memória compartilhada)
        self.postMessage({
            type: 'frame',
            xs: xs,
            ys: ys,
            zs: zs,
            sizes: sizes,
            colors: colors
        }, [xs.buffer, ys.buffer, zs.buffer, sizes.buffer, colors.buffer]); 
        // O segundo parâmetro (transfer list) transfere a memória sem copiar! Zero gargalo!
    }
};