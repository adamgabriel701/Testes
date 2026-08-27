use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct ParticleSystem {
    particles: Vec<Particle>,
    width: f32,
    height: f32,
}

#[derive(Clone, Copy)]
struct Particle {
    x: f32,
    y: f32,
    z: f32,
    vx: f32,
    vy: f32,
    vz: f32,
    size: f32,
    color: u8, // 0 = Amarelo, 1 = Verde Água, 2 = Branco
}

#[wasm_bindgen]
impl ParticleSystem {
    #[wasm_bindgen(constructor)]
    pub fn new(width: f32, height: f32, count: usize) -> ParticleSystem {
        let mut particles = Vec::with_capacity(count);
        for _ in 0..count {
            let color_rand = rand::random::<f32>();
            let color = if color_rand > 0.7 { 0 } else if color_rand > 0.4 { 1 } else { 2 };
            
            particles.push(Particle {
                x: rand::random::<f32>() * width,
                y: rand::random::<f32>() * height,
                z: rand::random::<f32>() * 600.0 - 300.0,
                vx: (rand::random::<f32>() - 0.5) * 0.3,
                vy: (rand::random::<f32>() - 0.5) * 0.3,
                vz: (rand::random::<f32>() - 0.5) * 0.5,
                size: rand::random::<f32>() * 2.0 + 0.5,
                color,
            });
        }
        ParticleSystem { particles, width, height }
    }

    // Função chamada a cada frame
    pub fn update(&mut self, mouse_x: f32, mouse_y: f32) {
        for p in self.particles.iter_mut() {
            p.x += p.vx;
            p.y += p.vy;
            p.z += p.vz;

            // Interação com o mouse (Feito em Rust, super rápido)
            let dx = p.x - mouse_x;
            let dy = p.y - mouse_y;
            let dist_sq = dx * dx + dy * dy; // Mais barato que sqrt
            
            if dist_sq < 22500.0 && dist_sq > 0.0 { // 150^2 = 22500
                let dist = dist_sq.sqrt();
                let force = (150.0 - dist) / 150.0 * 0.08;
                p.vx += (dx / dist) * force;
                p.vy += (dy / dist) * force;
            }

            p.vx *= 0.995;
            p.vy *= 0.995;

            // Limites de tela
            if p.x < -300.0 { p.x = 300.0; }
            if p.x > 300.0 { p.x = -300.0; }
            if p.y < -300.0 { p.y = 300.0; }
            if p.y > 300.0 { p.y = -300.0; }
            if p.z < -400.0 { p.z = 400.0; }
            if p.z > 400.0 { p.z = -400.0; }
        }
    }

    // Retorna as posições X em um array nativo para o JS desenhar
    pub fn get_x(&self) -> Vec<f32> { self.particles.iter().map(|p| p.x).collect() }
    pub fn get_y(&self) -> Vec<f32> { self.particles.iter().map(|p| p.y).collect() }
    pub fn get_z(&self) -> Vec<f32> { self.particles.iter().map(|p| p.z).collect() }
    pub fn get_sizes(&self) -> Vec<f32> { self.particles.iter().map(|p| p.size).collect() }
    pub fn get_colors(&self) -> Vec<u8> { self.particles.iter().map(|p| p.color).collect() }
}