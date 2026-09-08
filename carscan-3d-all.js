// carscan-3d-all.js — single self-contained module: geometry + both custom elements.
// Bundled so there are no relative imports left to resolve (survives inlining/export).
// three.js still comes from the page's import map.

// CarScan AI — OBD2 scanner + phone running the app.
// Modelled in metres, y-up, centred on origin, resting on y = 0.

function makeScreenCanvas() {
  const W = 660, H = 1360;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const x = c.getContext('2d');
  const navy = '#0a1728', teal = '#2ec5c0', amber = '#f5a524', red = '#ef4444';

  x.fillStyle = navy; x.fillRect(0, 0, W, H);

  // status bar
  x.fillStyle = 'rgba(255,255,255,.55)';
  x.font = '600 26px Barlow, sans-serif';
  x.fillText('9:41', 46, 62);
  x.textAlign = 'right';
  x.fillText('OBD2  ·  100%', W - 46, 62);
  x.textAlign = 'left';

  // header
  x.fillStyle = teal; x.fillRect(46, 108, 20, 20);
  x.fillStyle = '#fff';
  x.font = '600 34px "Barlow Condensed", sans-serif';
  x.fillText('CARSCAN AI', 82, 128);
  x.strokeStyle = 'rgba(255,255,255,.14)'; x.lineWidth = 2;
  x.beginPath(); x.moveTo(46, 162); x.lineTo(W - 46, 162); x.stroke();

  // score ring
  const cx = W / 2, cy = 348, r = 118;
  x.lineWidth = 26;
  x.strokeStyle = 'rgba(255,255,255,.12)';
  x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.stroke();
  x.strokeStyle = amber;
  x.lineCap = 'butt';
  x.beginPath(); x.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 0.62); x.stroke();
  x.textAlign = 'center';
  x.fillStyle = '#fff';
  x.font = '600 108px "Barlow Condensed", sans-serif';
  x.fillText('62', cx, cy + 22);
  x.fillStyle = 'rgba(255,255,255,.5)';
  x.font = '500 24px Barlow, sans-serif';
  x.fillText('/ 100', cx, cy + 62);

  x.fillStyle = '#fff';
  x.font = '600 42px "Barlow Condensed", sans-serif';
  x.fillText('2008 SUBARU LIBERTY', cx, 548);
  x.fillStyle = 'rgba(255,255,255,.5)';
  x.font = '400 24px Barlow, sans-serif';
  x.fillText('187,400 km  ·  asking $7,900', cx, 588);
  x.fillStyle = amber;
  x.font = '600 26px Barlow, sans-serif';
  x.fillText('Needs attention before purchase', cx, 636);
  x.textAlign = 'left';

  // fault rows
  const rows = [
    ['P0420', 'Catalytic converter worn out', '$900–1,800', red],
    ['P0301', 'Cylinder 1 misfiring', '$380–1,100', amber],
    ['P0442', 'Small fuel vapour leak', '$120–450', teal]
  ];
  let y = 700;
  for (const [code, label, cost, colour] of rows) {
    x.strokeStyle = 'rgba(255,255,255,.16)'; x.lineWidth = 2;
    x.strokeRect(46, y, W - 92, 122);
    x.fillStyle = colour; x.fillRect(46, y, 6, 122);
    x.fillStyle = '#fff';
    x.font = '600 34px "Barlow Condensed", sans-serif';
    x.fillText(code, 78, y + 48);
    x.fillStyle = 'rgba(255,255,255,.62)';
    x.font = '400 24px Barlow, sans-serif';
    x.fillText(label, 78, y + 88);
    x.fillStyle = '#fff';
    x.font = '600 30px "Barlow Condensed", sans-serif';
    x.textAlign = 'right';
    x.fillText(cost, W - 78, y + 48);
    x.textAlign = 'left';
    y += 146;
  }

  // tab bar
  x.fillStyle = 'rgba(255,255,255,.05)';
  x.fillRect(0, H - 132, W, 132);
  x.strokeStyle = 'rgba(255,255,255,.14)'; x.lineWidth = 2;
  x.beginPath(); x.moveTo(0, H - 132); x.lineTo(W, H - 132); x.stroke();
  const tabs = ['FAULTS', 'HONESTY', 'LIVE', 'OFFER'];
  x.textAlign = 'center';
  tabs.forEach((t, i) => {
    const tx = (W / 4) * i + W / 8;
    const on = i === 0;
    x.fillStyle = on ? teal : 'rgba(255,255,255,.42)';
    x.font = '600 26px "Barlow Condensed", sans-serif';
    x.fillText(t, tx, H - 74);
    if (on) x.fillRect(tx - 34, H - 54, 68, 4);
  });
  x.fillStyle = 'rgba(255,255,255,.3)';
  x.fillRect(W / 2 - 70, H - 24, 140, 6);

  return c;
}

function roundedBoxGeometry(THREE, w, h, d, r, curve = 4) {
  const s = new THREE.Shape();
  const x0 = -w / 2, y0 = -h / 2;
  s.moveTo(x0 + r, y0);
  s.lineTo(x0 + w - r, y0);
  s.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + r);
  s.lineTo(x0 + w, y0 + h - r);
  s.quadraticCurveTo(x0 + w, y0 + h, x0 + w - r, y0 + h);
  s.lineTo(x0 + r, y0 + h);
  s.quadraticCurveTo(x0, y0 + h, x0, y0 + h - r);
  s.lineTo(x0, y0 + r);
  s.quadraticCurveTo(x0, y0, x0 + r, y0);
  const bevel = Math.min(d / 6, r / 3);
  const g = new THREE.ExtrudeGeometry(s, {
    depth: d - bevel * 2, bevelEnabled: true, bevelThickness: bevel,
    bevelSize: bevel, bevelSegments: 3, curveSegments: curve
  });
  g.translate(0, 0, -(d - bevel * 2) / 2);
  return g;
}

/* ---------- exploded-view build: same scanner, grouped into removable parts ---------- */
function buildScannerParts(THREE) {
  const M = {
    shell: new THREE.MeshStandardMaterial({ name: 'shell', color: '#1b2836', roughness: 0.52, metalness: 0.18 }),
    shellTop: new THREE.MeshStandardMaterial({ name: 'shell-top', color: '#2b3a4b', roughness: 0.42, metalness: 0.2 }),
    accent: new THREE.MeshStandardMaterial({ name: 'accent', color: '#2ec5c0', roughness: 0.35, metalness: 0.1, emissive: '#0d4b49', emissiveIntensity: 0.6 }),
    contact: new THREE.MeshStandardMaterial({ name: 'contact', color: '#d8b24a', roughness: 0.32, metalness: 0.38 }),
    connector: new THREE.MeshStandardMaterial({ name: 'connector', color: '#3d4b5b', roughness: 0.62, metalness: 0.12 }),
    board: new THREE.MeshStandardMaterial({ name: 'board', color: '#1d4f3f', roughness: 0.68, metalness: 0.08 }),
    chip: new THREE.MeshStandardMaterial({ name: 'chip', color: '#16202b', roughness: 0.45, metalness: 0.25 }),
    solder: new THREE.MeshStandardMaterial({ name: 'solder', color: '#9fa8b2', roughness: 0.36, metalness: 0.5 })
  };

  const group = new THREE.Group();
  group.name = 'obd2-scanner-exploded';
  const parts = {};
  const mk = (id) => {
    const g = new THREE.Group();
    g.name = id;
    g.userData.partId = id;
    parts[id] = g;
    group.add(g);
    return g;
  };

  const W = 0.048, H = 0.022, D = 0.026;

  /* top shell — hollow lid: four walls + a roof, so the inside is visible when lifted */
  // seam where the two shells meet; roof top and floor bottom land exactly on ±H/2
  const wallT = 0.0016, seam = -0.0018;
  const lid = mk('lid');
  const lidH = (H / 2 - wallT) - seam;   // wall run, seam -> roof underside
  const roof = new THREE.Mesh(roundedBoxGeometry(THREE, W, wallT, D, 0.0032, 5), M.shell);
  roof.name = 'lid-roof';
  roof.position.y = lidH / 2 + wallT / 2;
  lid.add(roof);
  [[0, (D - wallT) / 2], [0, -(D - wallT) / 2]].forEach((p, i) => {
    const w = new THREE.Mesh(new THREE.BoxGeometry(W, lidH, wallT), M.shell);
    w.name = 'lid-wall-z' + (i + 1);
    w.position.set(p[0], 0, p[1]);
    lid.add(w);
  });
  [[(W - wallT) / 2, 0], [-(W - wallT) / 2, 0]].forEach((p, i) => {
    const w = new THREE.Mesh(new THREE.BoxGeometry(wallT, lidH, D - wallT * 2), M.shell);
    w.name = 'lid-wall-x' + (i + 1);
    w.position.set(p[0], 0, p[1]);
    lid.add(w);
  });
  const plate = new THREE.Mesh(roundedBoxGeometry(THREE, 0.020, 0.0014, 0.017, 0.0006, 3), M.shellTop);
  plate.name = 'lid-badge-plate';
  plate.position.set(-0.004, lidH / 2 + wallT + 0.0007, 0);
  lid.add(plate);
  const mark = new THREE.Mesh(new THREE.BoxGeometry(0.0058, 0.0009, 0.0058), M.accent);
  mark.name = 'lid-brand-mark';
  mark.position.set(-0.011, lidH / 2 + wallT + 0.0018, 0);
  lid.add(mark);
  lid.position.y = seam + lidH / 2;

  /* vent slots — lift away from the lid on their own */
  const vent = mk('vent');
  for (let i = 0; i < 3; i++) {
    const slot = new THREE.Mesh(new THREE.BoxGeometry(0.0016, 0.0010, 0.013), M.connector);
    slot.name = 'vent-slot-' + (i + 1);
    slot.position.set(0.012 + i * 0.0038, 0, 0);
    vent.add(slot);
  }
  vent.position.set(0, H / 2 + 0.0005, 0);

  /* circuit board with components */
  const board = mk('board');
  const pcb = new THREE.Mesh(new THREE.BoxGeometry(W - 0.006, 0.0012, D - 0.005), M.board);
  pcb.name = 'pcb';
  board.add(pcb);
  const mcu = new THREE.Mesh(new THREE.BoxGeometry(0.0092, 0.0016, 0.0092), M.chip);
  mcu.name = 'pcb-microcontroller';
  mcu.position.set(-0.004, 0.0014, 0.001);
  board.add(mcu);
  [[0.010, 0.006, 0.0052, 0.0034], [0.012, -0.006, 0.0038, 0.0026]].forEach((c, i) => {
    const ic = new THREE.Mesh(new THREE.BoxGeometry(c[2], 0.0012, c[3]), M.chip);
    ic.name = 'pcb-ic-' + (i + 1);
    ic.position.set(c[0], 0.0012, c[1]);
    board.add(ic);
  });
  for (let i = 0; i < 8; i++) {
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.0022, 0.0006, 0.0011), M.solder);
    pad.name = 'pcb-pad-' + (i + 1);
    pad.position.set(-0.017, 0.0009, (i - 3.5) * 0.0026);
    board.add(pad);
  }
  board.position.y = -0.0082;   // resting just above the tray floor

  /* bluetooth radio + aerial */
  const radio = mk('radio');
  const can = new THREE.Mesh(new THREE.BoxGeometry(0.0086, 0.0022, 0.0062), M.solder);
  can.name = 'radio-shield';
  radio.add(can);
  const aerial = new THREE.Mesh(new THREE.BoxGeometry(0.0104, 0.0008, 0.0022), M.accent);
  aerial.name = 'radio-aerial';
  aerial.position.set(0.0086, 0.0004, 0);
  radio.add(aerial);
  radio.position.set(0.0064, -0.0065, -0.0072);

  /* status light */
  const led = mk('led');
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.0021, 0.0021, 0.0016, 24), M.accent);
  lens.name = 'led-lens';
  lens.rotation.x = Math.PI / 2;
  led.add(lens);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.0028, 0.0028, 0.0009, 24), M.connector);
  collar.name = 'led-collar';
  collar.rotation.x = Math.PI / 2;
  collar.position.z = -0.0009;
  led.add(collar);
  led.position.set(0.0205, -0.0045, D / 2 - 0.0004);

  /* bottom shell — tray */
  const base = mk('base');
  const floor = new THREE.Mesh(roundedBoxGeometry(THREE, W, wallT, D, 0.0032, 5), M.shell);
  floor.name = 'base-floor';
  base.add(floor);
  const baseH = seam - (-H / 2);   // floor bottom up to the seam
  [[0, (D - wallT) / 2], [0, -(D - wallT) / 2]].forEach((p, i) => {
    const w = new THREE.Mesh(new THREE.BoxGeometry(W, baseH, wallT), M.shell);
    w.name = 'base-wall-z' + (i + 1);
    w.position.set(p[0], baseH / 2, p[1]);
    base.add(w);
  });
  [[(W - wallT) / 2, 0], [-(W - wallT) / 2, 0]].forEach((p, i) => {
    const w = new THREE.Mesh(new THREE.BoxGeometry(wallT, baseH, D - wallT * 2), M.shell);
    w.name = 'base-wall-x' + (i + 1);
    w.position.set(p[0], baseH / 2, p[1]);
    base.add(w);
  });
  base.position.y = -H / 2 + wallT / 2;

  /* 16-pin OBD2 plug */
  const plug = mk('plug');
  const shroud = new THREE.Shape();
  shroud.moveTo(-0.0128, -0.0056);
  shroud.lineTo(0.0128, -0.0056);
  shroud.lineTo(0.0110, 0.0056);
  shroud.lineTo(-0.0110, 0.0056);
  shroud.closePath();
  const hole = new THREE.Path();
  hole.moveTo(-0.0104, -0.0034);
  hole.lineTo(0.0104, -0.0034);
  hole.lineTo(0.0090, 0.0034);
  hole.lineTo(-0.0090, 0.0034);
  hole.closePath();
  shroud.holes.push(hole);
  const shroudMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shroud, { depth: 0.012, bevelEnabled: false }), M.connector);
  shroudMesh.name = 'obd2-shroud';
  shroudMesh.rotation.y = -Math.PI / 2;
  shroudMesh.position.x = 0.006;
  plug.add(shroudMesh);
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.0016, 0.020), M.connector);
  spine.name = 'obd2-key';
  spine.position.x = -0.006;
  plug.add(spine);
  for (let i = 0; i < 16; i++) {
    const row = i < 8 ? 1 : -1;
    const col = i % 8;
    const pin = new THREE.Mesh(new THREE.BoxGeometry(0.009, 0.0011, 0.0012), M.contact);
    pin.name = 'obd2-pin-' + (i + 1);
    pin.position.set(-0.006, row * 0.0022, (col - 3.5) * 0.0026);
    plug.add(pin);
  }
  plug.position.set(-W / 2 - 0.006, 0, 0);

  group.userData.materials = M;
  return { group, parts };
}

/* ---------- hero build: scanner beside a phone ---------- */
function buildCarScan(THREE, opts = {}) {

  const M = {
    shell: new THREE.MeshStandardMaterial({ name: 'shell', color: '#1b2836', roughness: 0.52, metalness: 0.18 }),
    shellTop: new THREE.MeshStandardMaterial({ name: 'shell-top', color: '#2b3a4b', roughness: 0.42, metalness: 0.2 }),
    accent: new THREE.MeshStandardMaterial({ name: 'accent', color: '#2ec5c0', roughness: 0.35, metalness: 0.1, emissive: '#0d4b49', emissiveIntensity: 0.6 }),
    contact: new THREE.MeshStandardMaterial({ name: 'contact', color: '#d8b24a', roughness: 0.32, metalness: 0.38 }),
    connector: new THREE.MeshStandardMaterial({ name: 'connector', color: '#3d4b5b', roughness: 0.62, metalness: 0.12 })
  };

  const root = new THREE.Group();
  root.name = 'carscan-ai';

  /* ---------- scanner ---------- */
  const scanner = new THREE.Group();
  scanner.name = 'obd2-scanner';

  const body = new THREE.Mesh(roundedBoxGeometry(THREE, 0.048, 0.022, 0.026, 0.005, 6), M.shell);
  body.name = 'scanner-body';
  scanner.add(body);

  const plate = new THREE.Mesh(roundedBoxGeometry(THREE, 0.036, 0.0016, 0.017, 0.0006, 3), M.shellTop);
  plate.name = 'scanner-top-plate';
  plate.position.set(0.002, 0.0112, 0);
  scanner.add(plate);

  const mark = new THREE.Mesh(new THREE.BoxGeometry(0.0058, 0.0009, 0.0058), M.accent);
  mark.name = 'scanner-brand-mark';
  mark.position.set(-0.011, 0.0122, 0);
  scanner.add(mark);

  for (let i = 0; i < 3; i++) {
    const groove = new THREE.Mesh(new THREE.BoxGeometry(0.0014, 0.0008, 0.013), M.connector);
    groove.name = 'scanner-vent-' + (i + 1);
    groove.position.set(0.011 + i * 0.0035, 0.0119, 0);
    scanner.add(groove);
  }

  const led = new THREE.Mesh(new THREE.CylinderGeometry(0.0019, 0.0019, 0.0014, 24), M.accent);
  led.name = 'scanner-led';
  led.position.set(0.0205, 0.0072, 0.0118);
  led.rotation.x = Math.PI / 2;
  scanner.add(led);

  // J1962 connector: trapezoid shroud with two rows of pins
  const shroud = new THREE.Shape();
  shroud.moveTo(-0.0128, -0.0056);
  shroud.lineTo(0.0128, -0.0056);
  shroud.lineTo(0.0110, 0.0056);
  shroud.lineTo(-0.0110, 0.0056);
  shroud.closePath();
  const hole = new THREE.Path();
  hole.moveTo(-0.0104, -0.0034);
  hole.lineTo(0.0104, -0.0034);
  hole.lineTo(0.0090, 0.0034);
  hole.lineTo(-0.0090, 0.0034);
  hole.closePath();
  shroud.holes.push(hole);
  const shroudMesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(shroud, { depth: 0.012, bevelEnabled: false }), M.connector);
  shroudMesh.name = 'obd2-shroud';
  shroudMesh.rotation.y = -Math.PI / 2;
  shroudMesh.position.set(-0.024, 0, 0);
  scanner.add(shroudMesh);

  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.0016, 0.020), M.connector);
  spine.name = 'obd2-key';
  spine.position.set(-0.030, 0, 0);
  scanner.add(spine);

  for (let i = 0; i < 16; i++) {
    const row = i < 8 ? 1 : -1;
    const col = i % 8;
    const pin = new THREE.Mesh(new THREE.BoxGeometry(0.009, 0.0011, 0.0012), M.contact);
    pin.name = 'obd2-pin-' + (i + 1);
    pin.position.set(-0.030, row * 0.0022, (col - 3.5) * 0.0026);
    scanner.add(pin);
  }

  scanner.position.set(0.042, 0.011, 0.030);
  scanner.rotation.y = -0.42;
  root.add(scanner);

  /* ---------- phone ---------- */
  const phone = new THREE.Group();
  phone.name = 'phone';

  const shellMat = new THREE.MeshStandardMaterial({ name: 'phone-shell', color: '#141c26', roughness: 0.38, metalness: 0.32 });
  const chassis = new THREE.Mesh(roundedBoxGeometry(THREE, 0.0715, 0.1465, 0.0082, 0.0115, 8), shellMat);
  chassis.name = 'phone-body';
  phone.add(chassis);

  const canvas = opts.screenCanvas || makeScreenCanvas();
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const screenMat = new THREE.MeshStandardMaterial({
    name: 'screen', color: '#05080d', roughness: 0.16, metalness: 0,
    emissive: '#ffffff', emissiveMap: tex, emissiveIntensity: 1, map: tex
  });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.0645, 0.1372), screenMat);
  screen.name = 'phone-screen';
  screen.position.z = 0.00425;
  phone.add(screen);

  const bump = new THREE.Mesh(roundedBoxGeometry(THREE, 0.026, 0.026, 0.0022, 0.007, 6), shellMat);
  bump.name = 'camera-bump';
  bump.position.set(-0.018, 0.052, -0.0048);
  phone.add(bump);

  const lensMat = new THREE.MeshStandardMaterial({ name: 'lens', color: '#0a0e14', roughness: 0.1, metalness: 0.35 });
  [[-0.0055, 0.0055], [0.0055, -0.0055]].forEach((p, i) => {
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.0048, 0.0048, 0.0016, 28), lensMat);
    lens.name = 'camera-lens-' + (i + 1);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(-0.018 + p[0], 0.052 + p[1], -0.0058);
    phone.add(lens);
  });

  const btn = new THREE.Mesh(new THREE.BoxGeometry(0.0016, 0.017, 0.0042), shellMat);
  btn.name = 'phone-button';
  btn.position.set(0.0362, 0.020, 0);
  phone.add(btn);

  phone.position.set(-0.026, 0.0735, -0.006);
  phone.rotation.set(-0.06, 0.30, 0.02);
  root.add(phone);

  root.userData.materials = M;
  return root;
}


// <carscan-hero-3d> — the scanner + phone, gently turning, for the hero.
// Loads three.js through the page's pinned import map.

class CarScanHero3D extends HTMLElement {
  connectedCallback() {
    if (this._booted) return;
    this._booted = true;
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>
      :host{display:block;position:relative;width:100%;height:100%;min-height:260px}
      canvas{display:block;width:100%;height:100%;touch-action:pan-y}
    </style>`;
    this._boot(root).catch(() => { this.dispatchEvent(new CustomEvent('scene-error')); });
  }

  disconnectedCallback() {
    cancelAnimationFrame(this._raf);
    this._io && this._io.disconnect();
    this._ro && this._ro.disconnect();
    this._renderer && this._renderer.dispose();
  }

  async _boot(root) {
    const THREE = await import('three');
    // buildCarScan defined above in this bundle

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    this._renderer = renderer;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    root.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 10);

    scene.add(new THREE.HemisphereLight(0xdfe8f2, 0x6b7480, 1.5));
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(0.28, 0.42, 0.34);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xcddaea, 0.9);
    fill.position.set(-0.34, 0.16, 0.22);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x9fd8d6, 1.1);
    rim.position.set(-0.16, 0.22, -0.38);
    scene.add(rim);

    // soft contact shadow
    const sc = document.createElement('canvas');
    sc.width = sc.height = 256;
    const sx = sc.getContext('2d');
    const grad = sx.createRadialGradient(128, 128, 8, 128, 128, 124);
    grad.addColorStop(0, 'rgba(10,23,40,.42)');
    grad.addColorStop(0.55, 'rgba(10,23,40,.16)');
    grad.addColorStop(1, 'rgba(10,23,40,0)');
    sx.fillStyle = grad; sx.fillRect(0, 0, 256, 256);
    const shadowTex = new THREE.CanvasTexture(sc);
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.26, 0.20),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(0.004, 0.0006, 0.012);
    scene.add(shadow);

    const model = buildCarScan(THREE);
    const pivot = new THREE.Group();
    pivot.add(model);
    scene.add(pivot);

    // Raising the gaze pushes the model into the lower part of the frame, leaving the
    // upper band clear for the hero copy. Overridable per instance via frame-shift.
    const shift = parseFloat(this.getAttribute('frame-shift') || this.getAttribute('frameshift') || '0') || 0;
    const target = new THREE.Vector3(0.006, 0.064 + shift, 0.004);
    camera.position.set(0.150, 0.198, 0.395);

    const resize = () => {
      const w = this.clientWidth || 480, h = this.clientHeight || 380;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const narrow = w < 420;
      camera.fov = narrow ? 34 : 29;
      // fitshrink > 1 pulls the camera back, so the model occupies less of the frame
      const shrink = parseFloat(this.getAttribute('fit-shrink') || this.getAttribute('fitshrink') || '1') || 1;
      camera.position.setLength((narrow ? 0.50 : 0.455) * shrink);
      camera.updateProjectionMatrix();
    };
    resize();
    this._ro = new ResizeObserver(resize);
    this._ro.observe(this);

    let px = 0, py = 0, tx = 0, ty = 0;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.addEventListener('pointermove', (e) => {
      const r = this.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    });
    this.addEventListener('pointerleave', () => { tx = 0; ty = 0; });

    let visible = true;
    this._io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.01 });
    this._io.observe(this);

    const t0 = performance.now();
    const frame = () => {
      this._raf = requestAnimationFrame(frame);
      if (!visible) return;
      const t = (performance.now() - t0) / 1000;
      px += (tx - px) * 0.06;
      py += (ty - py) * 0.06;
      const drift = still ? 0 : Math.sin(t * 0.34) * 0.20;
      pivot.rotation.y = drift + px * 0.34;
      pivot.rotation.x = (still ? 0 : Math.sin(t * 0.23) * 0.028) - py * 0.10;
      camera.lookAt(target);
      renderer.render(scene, camera);
    };
    frame();
    this.dispatchEvent(new CustomEvent('scene-ready'));
  }
}

if (!customElements.get('carscan-hero-3d')) customElements.define('carscan-hero-3d', CarScanHero3D);


// <carscan-anatomy-3d> — exploded 3D view of the scanner with disassemble controls.
// Renders ON DEMAND (no animation loop): every handler mutates state then calls redraw().

const PARTS = [
  { id: 'vent',  label: 'Vent slots',      sub: 'Keeps it cool left plugged in',   axis: [0.30, 1, 0],    dist: 0.050 },
  { id: 'lid',   label: 'Top shell',       sub: 'Single moulding, no fasteners',   axis: [0, 1, 0],       dist: 0.030 },
  { id: 'radio', label: 'Bluetooth radio', sub: 'Talks to your phone',             axis: [0.15, 0.5, 1],  dist: 0.034 },
  { id: 'board', label: 'Circuit board',   sub: 'Reads all nine OBD2 modes',       axis: [0, 0.35, 0.9],  dist: 0.026 },
  { id: 'led',   label: 'Status light',    sub: 'Teal when paired',                axis: [0.6, -0.15, 1], dist: 0.030 },
  { id: 'base',  label: 'Bottom shell',    sub: 'No battery, no buttons',          axis: [0, -1, 0],      dist: 0.022 },
  { id: 'plug',  label: '16-pin OBD2 plug',sub: 'Power and data from the car',     axis: [-1, 0, 0],      dist: 0.046 }
];

const VIEWS = {
  angle: { yaw: -0.52, pitch: 0.42, label: 'Angle' },
  top:   { yaw: -0.15, pitch: 1.30, label: 'Top' },
  side:  { yaw: 0,     pitch: 0.05, label: 'Side' }
};

class CarScanAnatomy3D extends HTMLElement {
  connectedCallback() {
    if (this._booted) return;
    this._booted = true;
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>
      :host{display:block;position:relative;width:100%;height:100%;min-height:420px;font-family:'Barlow',sans-serif}
      .stage{position:absolute;inset:0}
      canvas{display:block;width:100%;height:100%;touch-action:pan-y;cursor:grab}
      canvas.drag{cursor:grabbing}
      .bar{position:absolute;left:0;right:0;bottom:0;display:flex;flex-wrap:nowrap;overflow-x:auto;gap:8px;align-items:center;
        padding:10px 14px;background:rgba(242,242,243,.94);border-top:1px solid #c9cbcd;
        scrollbar-width:thin;-webkit-overflow-scrolling:touch}
      .bar>*{flex:0 0 auto}
      button{font-family:'Barlow',sans-serif;font-size:12px;font-weight:600;letter-spacing:.14em;
        text-transform:uppercase;padding:9px 15px;border:1px solid #b9bcc0;background:transparent;
        color:#0a1728;cursor:pointer;min-height:36px;white-space:nowrap}
      button:hover{border-color:#22a6a2;color:#0a5f5c}
      button:focus-visible{outline:2px solid #22a6a2;outline-offset:2px}
      button[aria-pressed="true"]{background:#0a1728;border-color:#0a1728;color:#fff}
      .views{display:flex;gap:1px;flex:0 0 auto}
      .views button{letter-spacing:.1em;padding:9px 13px}
      .spread{flex:0 0 auto;width:168px;display:flex;align-items:center;gap:10px;min-width:0;
        font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#5a6773}
      input[type=range]{flex:1 1 60px;min-width:60px;accent-color:#22a6a2;height:36px}
      .parts{position:absolute;top:0;left:0;right:0;display:flex;flex-wrap:nowrap;overflow-x:auto;gap:6px;
        padding:10px 14px;scrollbar-width:thin;-webkit-overflow-scrolling:touch}
      .parts button{flex:0 0 auto;white-space:nowrap;font-size:11px;padding:7px 12px;min-height:34px;background:rgba(242,242,243,.9)}
      .read{position:absolute;left:14px;top:50%;transform:translateY(-50%);max-width:210px;
        pointer-events:none;opacity:0;transition:opacity .18s}
      .read.on{opacity:1}
      .read b{display:block;font-family:'Barlow Condensed',sans-serif;font-size:21px;font-weight:600;
        letter-spacing:.02em;color:#0a1728;line-height:1.15}
      .read span{display:block;font-size:13px;line-height:1.45;color:#5a6773;margin-top:4px}
      @media (max-width:600px){ .read{display:none} .views{margin-left:0} }
    </style>
    <div class="stage"></div>
    <div class="parts" role="group" aria-label="Isolate a part"></div>
    <div class="read" aria-live="polite"><b></b><span></span></div>
    <div class="bar">
      <button data-act="toggle" aria-pressed="false">Disassemble</button>
      <label class="spread">Spread
        <input type="range" min="0" max="100" value="0" aria-label="How far the parts are separated">
      </label>
      <div class="views" role="group" aria-label="Camera view"></div>
    </div>`;
    this._boot(root).catch((e) => { console.warn('anatomy scene failed', e); this.dispatchEvent(new CustomEvent('scene-error')); });
  }

  disconnectedCallback() {
    this._ro && this._ro.disconnect();
    this._renderer && this._renderer.dispose();
  }

  async _boot(root) {
    const THREE = await import('three');
    // buildScannerParts defined above in this bundle

    const stage = root.querySelector('.stage');
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    this._renderer = renderer;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    stage.appendChild(renderer.domElement);
    const canvas = renderer.domElement;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.005, 10);

    scene.add(new THREE.HemisphereLight(0xdfe8f2, 0x707a86, 1.5));
    const key = new THREE.DirectionalLight(0xffffff, 2.5);
    key.position.set(0.06, 0.10, 0.08);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xcddaea, 0.95);
    fill.position.set(-0.09, 0.04, 0.05);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x9fd8d6, 1.15);
    rim.position.set(-0.04, 0.05, -0.09);
    scene.add(rim);

    const { group, parts } = buildScannerParts(THREE);
    const pivot = new THREE.Group();
    pivot.add(group);
    scene.add(pivot);

    const meta = [];
    for (const def of PARTS) {
      const g = parts[def.id];
      if (!g) continue;
      meta.push({ def, g, rest: g.position.clone(), vec: new THREE.Vector3(...def.axis).normalize().multiplyScalar(def.dist) });
    }

    const el = {
      bar: root.querySelector('.bar'),
      range: root.querySelector('input[type=range]'),
      toggle: root.querySelector('[data-act="toggle"]'),
      partsBar: root.querySelector('.parts'),
      views: root.querySelector('.views'),
      read: root.querySelector('.read')
    };
    const readTitle = el.read.querySelector('b');
    const readSub = el.read.querySelector('span');

    const st = { spread: 0, isolated: null, yaw: VIEWS.angle.yaw, pitch: VIEWS.angle.pitch, view: 'angle', margin: 1.06 };
    const tmp = new THREE.Vector3();
    const box = new THREE.Box3();
    const centre = new THREE.Vector3();
    const look = new THREE.Vector3();
    const dir = new THREE.Vector3();
    const right = new THREE.Vector3(1, 0, 0);
    const up = new THREE.Vector3();
    const corner = new THREE.Vector3();

    // the one place anything is drawn. The camera is fitted to the PROJECTED BOX each time
    // (not a bounding sphere — the object is long and flat, so a sphere reserves height it
    // never uses). The toolbars are full-width bars, so they cost vertical fov only.
    const redraw = () => {
      for (const { def, g, rest, vec } of meta) {
        g.position.copy(rest).add(tmp.copy(vec).multiplyScalar(st.spread));
        const dim = st.isolated && st.isolated !== def.id;
        g.traverse((o) => {
          if (!o.isMesh) return;
          o.material.transparent = dim;
          o.material.opacity = dim ? 0.14 : 1;
          o.material.depthWrite = !dim;
        });
      }

      pivot.rotation.set(0, st.yaw, 0);
      pivot.updateMatrixWorld(true);
      box.setFromObject(group);
      box.getCenter(centre);

      const elev = st.pitch;
      dir.set(0, Math.sin(elev), Math.cos(elev)).normalize();
      up.set(0, Math.cos(elev), -Math.sin(elev)).normalize();

      // half-extents of the box as seen down the camera axes
      let hw = 0, hh = 0, hd = 0;
      for (let i = 0; i < 8; i++) {
        corner.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z).sub(centre);
        hw = Math.max(hw, Math.abs(corner.dot(right)));
        hh = Math.max(hh, Math.abs(corner.dot(up)));
        hd = Math.max(hd, Math.abs(corner.dot(dir)));
      }

      const h = this.clientHeight || 460;
      const topPx = el.partsBar.offsetHeight || 0;
      const botPx = el.bar.offsetHeight || 0;
      const usable = Math.max(0.4, (h - topPx - botPx) / h);

      const vFov = camera.fov * Math.PI / 180;
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
      const dV = hh / Math.tan((vFov * usable) / 2);
      const dH = hw / Math.tan(hFov / 2);
      const d = Math.max(dV, dH) * st.margin + hd;

      camera.position.copy(centre).addScaledVector(dir, d);

      // aim above centre by the toolbar imbalance, so nothing hides under the chrome
      const shift = 2 * d * Math.tan(vFov / 2) * ((topPx - botPx) / 2 / h);
      look.copy(centre).addScaledVector(up, shift);
      camera.lookAt(look);
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };

    const syncSpreadUI = () => {
      const on = st.spread > 0.02;
      el.range.value = String(Math.round(st.spread * 100));
      el.toggle.setAttribute('aria-pressed', String(on));
      el.toggle.textContent = on ? 'Reassemble' : 'Disassemble';
    };

    const setIsolated = (id) => {
      st.isolated = id;
      const i = PARTS.findIndex(p => p.id === id);
      [...el.partsBar.children].forEach((b, n) => b.setAttribute('aria-pressed', String(n === i)));
      if (id && i >= 0) {
        readTitle.textContent = PARTS[i].label;
        readSub.textContent = PARTS[i].sub;
        el.read.classList.add('on');
      } else el.read.classList.remove('on');
    };

    const setSpread = (v) => {
      st.spread = Math.max(0, Math.min(1, v));
      if (st.spread <= 0.02) setIsolated(null);
      syncSpreadUI();
      redraw();
    };

    for (const def of PARTS) {
      if (!parts[def.id]) continue;
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = def.label;
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-label', 'Isolate the ' + def.label.toLowerCase());
      b.addEventListener('click', () => {
        const next = st.isolated === def.id ? null : def.id;
        if (next && st.spread < 0.98) st.spread = 1;
        setIsolated(next);
        syncSpreadUI();
        redraw();
      });
      el.partsBar.appendChild(b);
    }

    for (const [k, v] of Object.entries(VIEWS)) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = v.label;
      b.setAttribute('aria-pressed', String(k === st.view));
      b.setAttribute('aria-label', v.label + ' view');
      b.addEventListener('click', () => {
        st.view = k; st.yaw = v.yaw; st.pitch = v.pitch;
        [...el.views.children].forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        redraw();
      });
      el.views.appendChild(b);
    }

    el.toggle.addEventListener('click', () => setSpread(st.spread > 0.02 ? 0 : 1));
    el.range.addEventListener('input', () => setSpread(Number(el.range.value) / 100));

    // drag to orbit — repaints per pointer event, no clock needed
    let dragging = false, moved = 0, lx = 0, ly = 0;
    const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    canvas.addEventListener('pointerdown', (e) => {
      dragging = true; moved = 0; lx = e.clientX; ly = e.clientY;
      canvas.classList.add('drag');
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - lx, dy = e.clientY - ly;
      lx = e.clientX; ly = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      st.yaw -= dx * 0.008;
      st.pitch = Math.max(0.02, Math.min(1.42, st.pitch + dy * 0.006));
      [...el.views.children].forEach(x => x.setAttribute('aria-pressed', 'false'));
      redraw();
    });
    canvas.addEventListener('pointerup', (e) => {
      dragging = false;
      canvas.classList.remove('drag');
      if (moved > 6) return;
      const r = canvas.getBoundingClientRect();
      ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects(group.children, true)[0];
      if (!hit) { setIsolated(null); redraw(); return; }
      let o = hit.object, id = null;
      while (o && o !== group) { if (o.userData.partId) { id = o.userData.partId; break; } o = o.parent; }
      if (!id) return;
      const next = st.isolated === id ? null : id;
      if (next && st.spread < 0.98) st.spread = 1;
      setIsolated(next);
      syncSpreadUI();
      redraw();
    });

    const resize = () => {
      const w = this.clientWidth || 640, h = this.clientHeight || 460;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = w < 520 ? 37 : 30;
      camera.updateProjectionMatrix();
      redraw();
    };
    resize();
    this._ro = new ResizeObserver(resize);
    this._ro.observe(this);

    redraw();
    this.dispatchEvent(new CustomEvent('scene-ready'));
  }
}

if (!customElements.get('carscan-anatomy-3d')) customElements.define('carscan-anatomy-3d', CarScanAnatomy3D);

