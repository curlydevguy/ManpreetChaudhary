/* ==========================================================================
   INTERACTIVE 3D AUTONOMOUS DRONE TELEMETRY & LIDAR SPATIAL HOLOGRAM
   IIT Roorkee Autonomous Robotics Autonomy • Carbon Quadrotor Airframe
   Spinning Rotor Velocity Discs • 3D LiDAR Spatial Sweep • Cursor Reactive
   ========================================================================== */

export function initHeroCenterpiece() {
  const canvas = document.getElementById('hero-centerpiece-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = 1;
  let rafId = null;

  // --------------------------------------------------------------------------
  // 3D Quadrotor Geometry Definition (Model Space, Centered at [0,0,0])
  // --------------------------------------------------------------------------
  const ARM_LEN = 1.25;
  const MOTOR_RADIUS = 0.52;

  // 4 Motor Positions (X, Y, Z) - Quad-X configuration
  const motors = [
    { id: 'FL', x: -ARM_LEN * 0.72, y: -0.08, z:  ARM_LEN * 0.72, dir:  1, color: '56, 189, 248' }, // Front-Left
    { id: 'FR', x:  ARM_LEN * 0.72, y: -0.08, z:  ARM_LEN * 0.72, dir: -1, color: '56, 189, 248' }, // Front-Right
    { id: 'RR', x:  ARM_LEN * 0.72, y: -0.08, z: -ARM_LEN * 0.72, dir:  1, color: '37, 99, 235' }, // Rear-Right
    { id: 'RL', x: -ARM_LEN * 0.72, y: -0.08, z: -ARM_LEN * 0.72, dir: -1, color: '37, 99, 235' }  // Rear-Left
  ];

  // Structural Airframe Points
  const HUB_RADIUS = 0.38;
  const hubVertices = [];
  const HUB_SIDES = 6;
  for (let i = 0; i < HUB_SIDES; i++) {
    const angle = (i / HUB_SIDES) * Math.PI * 2 + Math.PI / 6;
    hubVertices.push({
      top:    [Math.cos(angle) * HUB_RADIUS, -0.16, Math.sin(angle) * HUB_RADIUS],
      bottom: [Math.cos(angle) * HUB_RADIUS,  0.12, Math.sin(angle) * HUB_RADIUS]
    });
  }

  // Landing Gear Struts & Skids
  const SKID_LEN = 1.05;
  const SKID_DROP = 0.42;
  const SKID_WIDTH = 0.65;
  const skids = [
    // Left Skid
    { x1: -SKID_WIDTH, y1: SKID_DROP, z1: -SKID_LEN, x2: -SKID_WIDTH, y2: SKID_DROP, z2: SKID_LEN },
    // Right Skid
    { x1:  SKID_WIDTH, y1: SKID_DROP, z1: -SKID_LEN, x2:  SKID_WIDTH, y2: SKID_DROP, z2: SKID_LEN }
  ];

  // 3D Spatial Waypoints & LiDAR Point Cloud Field
  const WAYPOINT_COUNT = 18;
  const waypoints = [];
  for (let i = 0; i < WAYPOINT_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const elev = (Math.random() - 0.5) * 1.6;
    const dist = 1.8 + Math.random() * 1.4;
    waypoints.push({
      x: Math.cos(angle) * dist,
      y: elev,
      z: Math.sin(angle) * dist,
      baseDist: dist,
      orbitSpeed: (0.0015 + Math.random() * 0.002) * (Math.random() > 0.5 ? 1 : -1),
      angle: angle,
      elev: elev,
      tag: `WP-${String(i + 1).padStart(2, '0')}`,
      intensity: 0.4 + Math.random() * 0.6
    });
  }

  // --------------------------------------------------------------------------
  // Interactive Physical State
  // --------------------------------------------------------------------------
  let rotX = 0.38; // Initial slight downward pitch to show 3D depth
  let rotY = 0.45; // Gentle oblique yaw
  let rotZ = 0.0;
  let vx = 0;
  let vy = 0;

  // Aerodynamic Hover & Reactive Attitude Tilt
  let tiltX = 0;
  let tiltZ = 0;
  let targetTiltX = 0;
  let targetTiltZ = 0;

  let isDragging = false;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let mouseCanvasX = -1000;
  let mouseCanvasY = -1000;
  let isHovered = false;

  // --------------------------------------------------------------------------
  // Canvas Sizing & DPR Configuration
  // --------------------------------------------------------------------------
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  };

  window.addEventListener('resize', resize, { passive: true });
  resize();

  // --------------------------------------------------------------------------
  // Pointer Event Listeners (Mouse & Touch)
  // --------------------------------------------------------------------------
  const onPointerDown = (e) => {
    isDragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    lastPointerX = clientX;
    lastPointerY = clientY;
    vx = 0;
    vy = 0;
    canvas.style.cursor = 'grabbing';
  };

  const onPointerMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    mouseCanvasX = clientX - rect.left;
    mouseCanvasY = clientY - rect.top;
    isHovered = true;

    // Reactive Aerodynamic Banking (aiming toward cursor)
    const normX = (mouseCanvasX - width / 2) / (width / 2);
    const normY = (mouseCanvasY - height / 2) / (height / 2);
    targetTiltZ = -normX * 0.18; // Roll
    targetTiltX =  normY * 0.16; // Pitch

    if (!isDragging) return;

    const dx = clientX - lastPointerX;
    const dy = clientY - lastPointerY;

    rotY += dx * 0.008;
    rotX -= dy * 0.008;

    vx = dx * 0.008;
    vy = -dy * 0.008;

    lastPointerX = clientX;
    lastPointerY = clientY;
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    isDragging = false;
    canvas.style.cursor = 'grab';
  };

  const onPointerLeave = () => {
    isHovered = false;
    mouseCanvasX = -1000;
    mouseCanvasY = -1000;
    targetTiltX = 0;
    targetTiltZ = 0;
    if (isDragging) {
      isDragging = false;
      canvas.style.cursor = 'grab';
    }
  };

  canvas.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);
  canvas.addEventListener('mouseleave', onPointerLeave);

  canvas.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp, { passive: true });

  // --------------------------------------------------------------------------
  // 3D Matrix Math: Rotation with Euler Attitude Offset
  // --------------------------------------------------------------------------
  const rotatePoint = (x, y, z, rx, ry, rz) => {
    // 1. Rotate around X
    const cosX = Math.cos(rx);
    const sinX = Math.sin(rx);
    const y1 = y * cosX - z * sinX;
    const z1 = y * sinX + z * cosX;
    const x1 = x;

    // 2. Rotate around Y
    const cosY = Math.cos(ry);
    const sinY = Math.sin(ry);
    const x2 = x1 * cosY + z1 * sinY;
    const z2 = -x1 * sinY + z1 * cosY;
    const y2 = y1;

    // 3. Rotate around Z
    const cosZ = Math.cos(rz);
    const sinZ = Math.sin(rz);
    const x3 = x2 * cosZ - y2 * sinZ;
    const y3 = x2 * sinZ + y2 * cosZ;
    const z3 = z2;

    return [x3, y3, z3];
  };

  // --------------------------------------------------------------------------
  // Main Holographic Animation Render Loop
  // --------------------------------------------------------------------------
  let time = 0;

  const render = () => {
    time += 0.016;

    // Clear frame completely — zero background box or tint
    ctx.clearRect(0, 0, width, height);

    // Aerodynamic spring attitude interpolation
    tiltX += (targetTiltX - tiltX) * 0.08;
    tiltZ += (targetTiltZ - tiltZ) * 0.08;

    // Physics Damping & Ambient Flight Rotation
    if (!isDragging) {
      if (Math.hypot(vx, vy) > 0.0004) {
        rotY += vx;
        rotX += vy;
        vx *= 0.93;
        vy *= 0.93;
      } else {
        // Smooth continuous ambient orbit & realistic aerodynamic yaw
        rotY += 0.0052;
        rotX = 0.36 + Math.sin(time * 0.9) * 0.05; // Gentle pitch breathing
      }
    }

    // Aerodynamic hovering vertical bobbing (simulated flight controller PID)
    const hoverBobY = Math.sin(time * 2.4) * 0.045;

    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(width, height) * 0.29;
    const focalLength = 540;

    // Projection Helper
    const project = (x, y, z) => {
      // Apply flight attitude bank to the drone local coords
      const [ax, ay, az] = rotatePoint(x, y + hoverBobY, z, tiltX, 0, tiltZ);
      // Apply scene global yaw/pitch orbit
      const [rx, ry, rz] = rotatePoint(ax, ay, az, rotX, rotY, rotZ);
      const scale = focalLength / (focalLength + rz * baseRadius);
      const px = centerX + rx * baseRadius * scale;
      const py = centerY + ry * baseRadius * scale;
      return { x: px, y: py, z: rz, scale };
    };

    // ------------------------------------------------------------------------
    // 1. Concentric Attitude Horizon & Euler Gimbal Rings
    // ------------------------------------------------------------------------
    const drawGimbalRings = () => {
      // Outer Gimbal: Yaw Compass Reticle (Horizontal Plane)
      const RING_SEGMENTS = 48;
      const RING_R = 1.95;

      ctx.beginPath();
      for (let i = 0; i <= RING_SEGMENTS; i++) {
        const theta = (i / RING_SEGMENTS) * Math.PI * 2;
        const pt = project(Math.cos(theta) * RING_R, 0.08, Math.sin(theta) * RING_R);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.16)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Cardinal Tick Marks on the Outer Ring
      for (let i = 0; i < 12; i++) {
        const theta = (i / 12) * Math.PI * 2;
        const p1 = project(Math.cos(theta) * (RING_R - 0.08), 0.08, Math.sin(theta) * (RING_R - 0.08));
        const p2 = project(Math.cos(theta) * (RING_R + 0.08), 0.08, Math.sin(theta) * (RING_R + 0.08));
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = i % 3 === 0 ? 'rgba(56, 189, 248, 0.45)' : 'rgba(37, 99, 235, 0.22)';
        ctx.lineWidth = i % 3 === 0 ? 1.5 : 0.8;
        ctx.stroke();
      }

      // Dynamic 3D Attitude Horizon Reticle Ring (Tilts with airframe)
      const PITCH_R = 1.55;
      ctx.beginPath();
      for (let i = 0; i <= 36; i++) {
        const theta = (i / 36) * Math.PI * 2;
        const pt = project(Math.cos(theta) * PITCH_R, 0, Math.sin(theta) * PITCH_R);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    };
    drawGimbalRings();

    // ------------------------------------------------------------------------
    // 2. 3D LiDAR Spatial Scan Wave & Laser Rangefinder Sweep
    // ------------------------------------------------------------------------
    const scanAngle = (time * 2.8) % (Math.PI * 2);
    const lidarRange = 2.1;
    const lidarBeamOrigin = project(0, 0.15, 0); // Bottom optical LiDAR dome
    const lidarBeamTip = project(Math.cos(scanAngle) * lidarRange, 0.35, Math.sin(scanAngle) * lidarRange);

    // Ground LiDAR sweep wave gradient
    const sweepGrad = ctx.createLinearGradient(lidarBeamOrigin.x, lidarBeamOrigin.y, lidarBeamTip.x, lidarBeamTip.y);
    sweepGrad.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
    sweepGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');

    ctx.beginPath();
    ctx.moveTo(lidarBeamOrigin.x, lidarBeamOrigin.y);
    ctx.lineTo(lidarBeamTip.x, lidarBeamTip.y);
    ctx.strokeStyle = sweepGrad;
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Concentric expanding range radar ripples below drone
    for (let ring = 1; ring <= 3; ring++) {
      const pulsePhase = ((time * 0.6 + ring * 0.33) % 1);
      const r = pulsePhase * 2.2;
      const alpha = (1 - pulsePhase) * 0.24;

      ctx.beginPath();
      for (let i = 0; i <= 24; i++) {
        const th = (i / 24) * Math.PI * 2;
        const pt = project(Math.cos(th) * r, 0.38, Math.sin(th) * r);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = `rgba(56, 189, 248, ${alpha.toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // ------------------------------------------------------------------------
    // 3. Drone Carbon-Fiber Airframe Geometry
    // ------------------------------------------------------------------------
    // Draw 4 Main Symmetrical Tubular Arms from Hub to Motors
    const centerTop = project(0, -0.16, 0);
    const centerBot = project(0,  0.12, 0);

    motors.forEach(m => {
      const motorPt = project(m.x, m.y, m.z);

      // Dual Spar Arms (Top & Bottom for 3D truss appearance)
      ctx.beginPath();
      ctx.moveTo(centerTop.x, centerTop.y);
      ctx.lineTo(motorPt.x, motorPt.y);
      ctx.strokeStyle = `rgba(37, 99, 235, ${Math.max(0.2, (motorPt.z + 1.2) * 0.5).toFixed(3)})`;
      ctx.lineWidth = Math.max(1.2, (motorPt.z + 1.4) * 1.5);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerBot.x, centerBot.y);
      ctx.lineTo(motorPt.x, motorPt.y);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Brushless Motor Mount Cylinder
      ctx.beginPath();
      ctx.arc(motorPt.x, motorPt.y, Math.max(3, 5 * motorPt.scale), 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = `rgba(${m.color}, 0.8)`;
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();
    });

    // Cross-braced structural diagonals between adjacent arms
    for (let i = 0; i < motors.length; i++) {
      const m1 = motors[i];
      const m2 = motors[(i + 1) % motors.length];
      const p1 = project(m1.x * 0.55, 0, m1.z * 0.55);
      const p2 = project(m2.x * 0.55, 0, m2.z * 0.55);

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.22)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw Landing Gear Skids
    skids.forEach(skid => {
      const pFront = project(skid.x1, skid.y1, skid.z1);
      const pRear  = project(skid.x2, skid.y2, skid.z2);
      const sFront = project(skid.x1 * 0.85, 0.1, skid.z1 * 0.5);
      const sRear  = project(skid.x2 * 0.85, 0.1, skid.z2 * 0.5);

      // Skid Rail
      ctx.beginPath();
      ctx.moveTo(pFront.x, pFront.y);
      ctx.lineTo(pRear.x, pRear.y);
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.45)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Vertical Support Struts
      ctx.beginPath();
      ctx.moveTo(sFront.x, sFront.y);
      ctx.lineTo(pFront.x, pFront.y);
      ctx.moveTo(sRear.x, sRear.y);
      ctx.lineTo(pRear.x, pRear.y);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    });

    // Central Hexagonal Flight Controller Avionics Deck
    ctx.beginPath();
    hubVertices.forEach((v, idx) => {
      const pt = project(v.top[0], v.top[1], v.top[2]);
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Central Avionics Horizon Gyro Indicator
    const gyroGrad = ctx.createRadialGradient(centerTop.x, centerTop.y, 0, centerTop.x, centerTop.y, 14);
    gyroGrad.addColorStop(0, 'rgba(56, 189, 248, 0.9)');
    gyroGrad.addColorStop(0.5, 'rgba(37, 99, 235, 0.4)');
    gyroGrad.addColorStop(1, 'rgba(37, 99, 235, 0)');
    ctx.beginPath();
    ctx.arc(centerTop.x, centerTop.y, 14, 0, Math.PI * 2);
    ctx.fillStyle = gyroGrad;
    ctx.fill();

    // Specular Core LED
    ctx.beginPath();
    ctx.arc(centerTop.x, centerTop.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(56, 189, 248, 1)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    // ------------------------------------------------------------------------
    // 4. 4 Counter-Rotating Rotor Velocity Holograms
    // ------------------------------------------------------------------------
    const ROTOR_SPEED = 24.0; // High speed propeller rotation
    motors.forEach((m, idx) => {
      const bladeAngle = time * ROTOR_SPEED * m.dir + idx * (Math.PI / 2);
      const DISC_STEPS = 20;

      // 1. Semi-transparent Swept Rotor Disc
      ctx.beginPath();
      for (let i = 0; i <= DISC_STEPS; i++) {
        const th = (i / DISC_STEPS) * Math.PI * 2;
        const pt = project(m.x + Math.cos(th) * MOTOR_RADIUS, m.y - 0.04, m.z + Math.sin(th) * MOTOR_RADIUS);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.fillStyle = idx < 2 ? 'rgba(56, 189, 248, 0.09)' : 'rgba(37, 99, 235, 0.09)';
      ctx.fill();
      ctx.strokeStyle = idx < 2 ? 'rgba(56, 189, 248, 0.4)' : 'rgba(37, 99, 235, 0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 2. High-Speed Spinning Carbon Propeller Blades (2-Blade Aerodynamic)
      const b1 = project(
        m.x + Math.cos(bladeAngle) * MOTOR_RADIUS * 0.95,
        m.y - 0.04,
        m.z + Math.sin(bladeAngle) * MOTOR_RADIUS * 0.95
      );
      const b2 = project(
        m.x - Math.cos(bladeAngle) * MOTOR_RADIUS * 0.95,
        m.y - 0.04,
        m.z - Math.sin(bladeAngle) * MOTOR_RADIUS * 0.95
      );

      ctx.beginPath();
      ctx.moveTo(b1.x, b1.y);
      ctx.lineTo(b2.x, b2.y);
      ctx.strokeStyle = idx < 2 ? 'rgba(56, 189, 248, 0.85)' : 'rgba(37, 99, 235, 0.85)';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Rotor Tip Navigation Strobe LEDs
      const tipLED = project(m.x + Math.cos(bladeAngle) * MOTOR_RADIUS, m.y - 0.04, m.z + Math.sin(bladeAngle) * MOTOR_RADIUS);
      const strobePulse = 0.5 + Math.sin(time * 12 + idx) * 0.5;
      ctx.beginPath();
      ctx.arc(tipLED.x, tipLED.y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = idx === 0 ? `rgba(16, 185, 129, ${strobePulse.toFixed(2)})` : // Port Green
                      idx === 1 ? `rgba(37, 99, 235, ${strobePulse.toFixed(2)})` :  // Starboard Blue
                      `rgba(56, 189, 248, ${strobePulse.toFixed(2)})`;               // Aft Cyan
      ctx.fill();
    });

    // ------------------------------------------------------------------------
    // 5. 3D Spatial Waypoints Constellation & Interactive Rangefinder Beams
    // ------------------------------------------------------------------------
    const projectedWps = [];
    waypoints.forEach(wp => {
      wp.angle += wp.orbitSpeed;
      const wx = Math.cos(wp.angle) * wp.baseDist;
      const wz = Math.sin(wp.angle) * wp.baseDist;
      const [rx, ry, rz] = rotatePoint(wx, wp.elev, wz, rotX, rotY, rotZ);
      const scale = focalLength / (focalLength + rz * baseRadius);
      const px = centerX + rx * baseRadius * scale;
      const py = centerY + ry * baseRadius * scale;

      projectedWps.push({
        x: px,
        y: py,
        z: rz,
        scale: scale,
        tag: wp.tag,
        intensity: wp.intensity
      });
    });

    // Dynamic interconnecting spatial links between proximate waypoints
    for (let i = 0; i < projectedWps.length; i++) {
      for (let j = i + 1; j < projectedWps.length; j++) {
        const wp1 = projectedWps[i];
        const wp2 = projectedWps[j];
        const d = Math.hypot(wp1.x - wp2.x, wp1.y - wp2.y);
        if (d < 95) {
          const alpha = (1 - d / 95) * 0.28;
          ctx.beginPath();
          ctx.moveTo(wp1.x, wp1.y);
          ctx.lineTo(wp2.x, wp2.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha.toFixed(3)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Render Waypoints with HUD Coordinate Rings
    projectedWps.forEach(wp => {
      const alpha = Math.max(0.18, (wp.z + 1.2) * 0.45);
      const r = Math.max(2, 3.8 * wp.scale);

      // Outer Halo Ring
      ctx.beginPath();
      ctx.arc(wp.x, wp.y, r * 2.2, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(56, 189, 248, ${(alpha * 0.35).toFixed(3)})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Waypoint Core Node
      ctx.beginPath();
      ctx.arc(wp.x, wp.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(37, 99, 235, ${alpha.toFixed(3)})`;
      ctx.fill();

      // Specular Pip
      ctx.beginPath();
      ctx.arc(wp.x - 0.5, wp.y - 0.5, r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    });

    // ------------------------------------------------------------------------
    // 6. Interactive Cursor Laser Rangefinder Target Lock
    // ------------------------------------------------------------------------
    if (isHovered && mouseCanvasX > 0 && mouseCanvasY > 0) {
      // Find closest waypoint to cursor
      let closestWp = null;
      let minDist = 140;
      projectedWps.forEach(wp => {
        const d = Math.hypot(mouseCanvasX - wp.x, mouseCanvasY - wp.y);
        if (d < minDist) {
          minDist = d;
          closestWp = wp;
        }
      });

      // Forward Nose Sensor Point on Drone
      const droneNose = project(0, -0.12, ARM_LEN * 0.75);

      // Active Laser Target Lock to Closest Waypoint or Cursor
      const targetX = closestWp ? closestWp.x : mouseCanvasX;
      const targetY = closestWp ? closestWp.y : mouseCanvasY;

      ctx.beginPath();
      ctx.moveTo(droneNose.x, droneNose.y);
      ctx.lineTo(targetX, targetY);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)';
      ctx.lineWidth = 1.3;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Tactical Target Reticle at Lock Point
      const reticleR = 12;
      ctx.beginPath();
      ctx.arc(targetX, targetY, reticleR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.85)';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Crosshair Ticks
      ctx.beginPath();
      ctx.moveTo(targetX - reticleR - 4, targetY);
      ctx.lineTo(targetX - reticleR + 3, targetY);
      ctx.moveTo(targetX + reticleR - 3, targetY);
      ctx.lineTo(targetX + reticleR + 4, targetY);
      ctx.moveTo(targetX, targetY - reticleR - 4);
      ctx.lineTo(targetX, targetY - reticleR + 3);
      ctx.moveTo(targetX, targetY + reticleR - 3);
      ctx.lineTo(targetX, targetY + reticleR + 4);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.9)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Micro Telemetry Readout Box near reticle
      const distSim = (Math.hypot(droneNose.x - targetX, droneNose.y - targetY) * 0.08).toFixed(1);
      ctx.font = '9px monospace';
      ctx.fillStyle = 'rgba(16, 185, 129, 0.95)';
      ctx.fillText(`LIDAR: ${distSim}m`, targetX + 16, targetY + 4);
    }

    rafId = requestAnimationFrame(render);
  };

  if (rafId) cancelAnimationFrame(rafId);
  render();

  // Teardown listener on page swap
  window.addEventListener('page:swapped', () => {
    if (rafId) cancelAnimationFrame(rafId);
  }, { once: true });
}
