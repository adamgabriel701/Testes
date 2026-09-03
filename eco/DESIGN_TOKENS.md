### 📄 `DESIGN_TOKENS.md`
*(Coloque na raiz do projeto)*

```markdown
# 🎨 Guia de Design Tokens e Sistema Visual

Para garantir consistência entre aplicações web, mobile e landing pages, utilize os tokens centrais de design listados abaixo.

---

## 🎨 Cores (Color Palette)

### **Marca & Primárias**
- `color-primary-50`: `#F0F5FF`
- `color-primary-500`: `#3B82F6` *(Cor de ação principal, botões, links)*
- `color-primary-700`: `#1D4ED8` *(Estado de Hover/Active)*

### **Neutras (Texto & Superfície)**
- `color-gray-50`: `#F9FAFB` *(Fundos de telas/cards)*
- `color-gray-200`: `#E5E7EB` *(Bordas e divisores)*
- `color-gray-700`: `#374151` *(Texto secundário)*
- `color-gray-900`: `#111827` *(Texto principal e títulos)*

### **Semânticas (Feedback)**
- `color-success`: `#10B981` *(Sucesso, confirmação)*
- `color-warning`: `#F59E0B` *(Alertas e avisos)*
- `color-danger`: `#EF4444` *(Erros e ações destrutivas)*

---

## 📐 Espaçamento (Spacing Grid)

Adotamos a escala de **base 8px** para componentes e **base 4px** para ajustes finos.

| Token | Valor em Pixel | Uso Recomendado |
| :--- | :--- | :--- |
| `spacing-1` | `4px` | Espaçamento interno de badges/tags |
| `spacing-2` | `8px` | Gap entre ícone e texto |
| `spacing-4` | `16px` | Padding interno de cards e botões |
| `spacing-6` | `24px` | Distância entre seções de um formulário |
| `spacing-8` | `32px` | Margem externa entre blocos da página |

---

## 🔤 Tipografia (Typography)

- **Família Tipográfica Principal:** `Inter`, `system-ui`, `-apple-system`, `sans-serif`
- **Código / Monospaced:** `JetBrains Mono`, `Fira Code`, `monospace`

### **Tamanhos de Fonte**
- `font-xs`: `12px` *(Legendas, captions)*
- `font-sm`: `14px` *(Labels, textos secundários)*
- `font-base`: `16px` *(Corpo do texto padrão)*
- `font-lg`: `18px` *(Subtítulos)*
- `font-xl`: `24px` *(Títulos de seções)*
- `font-2xl`: `32px` *(Títulos de páginas/H1)*

---

## 📱 Pontos de Quebra (Breakpoints)

- **`sm`**: `640px` *(Smartphones em modo paisagem)*
- **`md`**: `768px` *(Tablets)*
- **`lg`**: `1024px` *(Laptops e Desktops pequenos)*
- **`xl`**: `1280px` *(Monitores padrão)*
```
