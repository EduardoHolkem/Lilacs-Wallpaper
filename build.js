// Monta as duas versões do wallpaper e a demo a partir de src/.
//   node build.js        copia os arquivos
//   node build.js zip    copia e gera os .zip em dist/
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = __dirname;
const src = path.join(root, 'src');
const preview = path.join(root, 'assets', 'preview.jpg');
const copy = (from, to) => fs.copyFileSync(from, to);

// Wallpaper Engine
const we = path.join(root, 'wallpaper-engine');
copy(path.join(src, 'index.html'), path.join(we, 'index.html'));
copy(path.join(src, 'Lilacs.png'), path.join(we, 'Lilacs.png'));
copy(preview, path.join(we, 'preview.jpg'));

// Lively Wallpaper
const lv = path.join(root, 'lively');
copy(path.join(src, 'index.html'), path.join(lv, 'index.html'));
copy(path.join(src, 'Lilacs.png'), path.join(lv, 'Lilacs.png'));
copy(preview, path.join(lv, 'preview.jpg'));
copy(preview, path.join(lv, 'thumbnail.jpg'));

// Demo do GitHub Pages (mesmo wallpaper + música de demonstração)
const docs = path.join(root, 'docs');
let html = fs.readFileSync(path.join(src, 'index.html'), 'utf8');
html = html
  .replace('<title>Wallpaper-Lilacs</title>', '<title>Lilacs Wallpaper (demo)</title>')
  .replace('</body>', '  <a class="demo-link" href="https://github.com/EduardoHolkem/Lilacs-Wallpaper">baixar no GitHub</a>\n' +
    '  <style>.demo-link{position:fixed;top:18px;right:18px;z-index:20;color:#fff;font:600 12px "Segoe UI",Arial,sans-serif;' +
    'letter-spacing:2px;text-transform:lowercase;text-decoration:none;padding:8px 14px;border-radius:999px;' +
    'background:rgba(20,10,40,.45);border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(10px);' +
    'text-shadow:-1px 0 rgba(255,60,170,.7),1px 0 rgba(60,230,255,.7)}.demo-link:hover{background:rgba(155,92,255,.35)}</style>\n' +
    '  <script src="demo.js"></script>\n</body>');
fs.writeFileSync(path.join(docs, 'index.html'), html);
copy(path.join(src, 'Lilacs.png'), path.join(docs, 'Lilacs.png'));
copy(preview, path.join(docs, 'preview.jpg'));

console.log('arquivos copiados');

if (process.argv[2] === 'zip') {
  const dist = path.join(root, 'dist');
  fs.mkdirSync(dist, { recursive: true });
  // tar do Windows (bsdtar) gera .zip com -a
  const tar = process.platform === 'win32' ? 'C:\\Windows\\System32\\tar.exe' : 'zip';
  const zip = (out, cwd, items) => {
    const file = path.join(dist, out);
    if (fs.existsSync(file)) fs.unlinkSync(file);
    execFileSync(tar, ['-a', '-c', '-f', file, ...items], { cwd });
    console.log('gerado', path.relative(root, file));
  };
  // Wallpaper Engine: pasta pronta para jogar em myprojects
  zip('Lilacs-WallpaperEngine.zip', root, ['wallpaper-engine']);
  // Lively: o LivelyInfo.json precisa ficar na raiz do zip
  zip('Lilacs-Lively.zip', lv, fs.readdirSync(lv));
}
