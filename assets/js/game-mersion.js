// Mersion Game
let selectedStation = null;
let mersionLane = 'center';

function getMersionLaneShiftPx(overlay) {
    const width = overlay && overlay.clientWidth ? overlay.clientWidth : window.innerWidth;
    return Math.round(Math.max(70, Math.min(210, width * 0.2)));
}

function applyMersionLane(lane, overlay = document.getElementById('mersionDiveOverlay')) {
    if (!overlay) return;
    const normalizedLane = lane === 'left' || lane === 'right' || lane === 'center' ? lane : 'center';
    const laneShift = getMersionLaneShiftPx(overlay);
    const shiftPx = normalizedLane === 'left' ? -laneShift : normalizedLane === 'right' ? laneShift : 0;
    mersionLane = normalizedLane;
    overlay.dataset.lane = normalizedLane;
    overlay.style.setProperty('--sub-lane-shift', `${shiftPx}px`);
}

function initMersionLaneControls() {
    const overlay = document.getElementById('mersionDiveOverlay');
    const controls = document.getElementById('mersionLaneControls');
    if (!overlay || !controls) return;

    if (controls.dataset.bound !== '1') {
        controls.dataset.bound = '1';
        controls.querySelectorAll('.mersion-lane-zone').forEach(zone => {
            zone.addEventListener('pointerdown', (event) => {
                event.preventDefault();
                if (!overlay.classList.contains('active')) return;
                applyMersionLane(zone.dataset.lane || 'center', overlay);
            });
        });
    }

    if (overlay.dataset.resizeBound !== '1') {
        overlay.dataset.resizeBound = '1';
        window.addEventListener('resize', () => {
            applyMersionLane(mersionLane, overlay);
        });
    }
}

const mersionStations = [
    {
        name: 'Shallow Reef', depth: 50, icon: '🏝️',
        fish: [
            { emoji: '🐟', name: 'Clownfish', mult: 0.5, class: 'risky' },
            { emoji: '🦀', name: 'Crab', mult: 0.8, class: 'neutral' },
            { emoji: '🐚', name: 'Pearl Shell', mult: 1.0, class: 'safe' },
            { emoji: '🦐', name: 'Shrimp', mult: 1.2, class: 'safe' },
            { emoji: '🐡', name: 'Pufferfish', mult: 1.5, class: 'great' }
        ]
    },
    {
        name: 'Coral Gardens', depth: 200, icon: '🐠',
        fish: [
            { emoji: '🪼', name: 'Jellyfish', mult: 0.3, class: 'danger' },
            { emoji: '🐠', name: 'Angelfish', mult: 0.6, class: 'risky' },
            { emoji: '🦑', name: 'Squid', mult: 1.0, class: 'safe' },
            { emoji: '🐢', name: 'Sea Turtle', mult: 1.5, class: 'great' },
            { emoji: '🦞', name: 'Lobster', mult: 2.0, class: 'great' }
        ]
    },
    {
        name: 'Open Ocean', depth: 500, icon: '🦈',
        fish: [
            { emoji: '🪸', name: 'Poison Coral', mult: 0.2, class: 'danger' },
            { emoji: '🦈', name: 'Shark', mult: 0.5, class: 'risky' },
            { emoji: '🐬', name: 'Dolphin', mult: 1.2, class: 'safe' },
            { emoji: '🐳', name: 'Whale', mult: 2.0, class: 'great' },
            { emoji: '🧜', name: 'Mermaid', mult: 2.5, class: 'great' }
        ]
    },
    {
        name: 'Deep Trench', depth: 1000, icon: '🐙',
        fish: [
            { emoji: '🦠', name: 'Toxic Blob', mult: 0.2, class: 'danger' },
            { emoji: '🐙', name: 'Giant Octopus', mult: 0.4, class: 'danger' },
            { emoji: '🫧', name: 'Deep Bubble', mult: 0.8, class: 'neutral' },
            { emoji: '💎', name: 'Deep Gem', mult: 2.0, class: 'great' },
            { emoji: '🧿', name: 'Abyssal Eye', mult: 3.0, class: 'great' }
        ]
    },
    {
        name: 'The Abyss', depth: 2000, icon: '🌋',
        fish: [
            { emoji: '☠️', name: 'Death Eel', mult: 0.2, class: 'danger' },
            { emoji: '🕳️', name: 'Void Fish', mult: 0.2, class: 'danger' },
            { emoji: '🔮', name: 'Crystal Angler', mult: 0.5, class: 'risky' },
            { emoji: '🐉', name: 'Sea Dragon', mult: 3.0, class: 'great' },
            { emoji: '👑', name: 'Leviathan', mult: 4.0, class: 'great' }
        ]
    }
];

function selectStation(index) {
    selectedStation = index;
    const stations = document.querySelectorAll('.mersion-station');
    stations.forEach((s, i) => {
        s.classList.toggle('selected', i === index);
    });
}

function toggleMersionMap() {
    const overlay = document.getElementById('mersionFullMap');
    const isActive = overlay.classList.contains('active');

    if (!isActive) {
        // Build full map content
        const content = document.getElementById('mersionFullMapContent');
        content.innerHTML = '';

        mersionStations.forEach((station, si) => {
            const card = document.createElement('div');
            card.className = 'mersion-fullmap-station';

            let fishHTML = '';
            station.fish.forEach(f => {
                fishHTML += `
                    <div class="mersion-fish-item">
                        <div class="mersion-fish-emoji">${f.emoji}</div>
                        <div class="mersion-fish-info">
                            <div class="mersion-fish-name">${f.name}</div>
                            <div class="mersion-fish-mult ${f.class}">x${f.mult.toFixed(1)}</div>
                        </div>
                    </div>
                `;
            });

            card.innerHTML = `
                <div class="mersion-fullmap-station-header">
                    <div class="mersion-fullmap-station-icon" aria-hidden="true"></div>
                    <div>
                        <div class="mersion-fullmap-station-title">${station.name}</div>
                        <div class="mersion-fullmap-station-depth-tag">${station.depth}m depth · Risk Level ${si + 1}/5</div>
                    </div>
                </div>
                <div class="mersion-fish-list">${fishHTML}</div>
            `;
            content.appendChild(card);
        });
    }

    overlay.classList.toggle('active');
}

function playMersion() {
    if (selectedStation === null) {
        alert(currentLanguage === 'en' ? 'Select a station on the map!' : 'Выберите станцию на карте!');
        return;
    }

    const betAmount = parseFloat(document.getElementById('mersionBet').value);
    if (betAmount > balance) {
        alert(currentLanguage === 'en' ? 'Insufficient balance!' : 'Недостаточно средств!');
        return;
    }

    balance -= betAmount;
    updateBalance();

    const station = mersionStations[selectedStation];
    const diveBtn = document.getElementById('mersionDiveBtn');
    diveBtn.disabled = true;

    // Show dive animation
    const overlay = document.getElementById('mersionDiveOverlay');
    const depthEl = document.getElementById('mersionDiveDepth');
    const progressEl = document.getElementById('mersionDiveProgress');
    const dockingLink = document.getElementById('mersionDockingLink');
    const subEl = document.getElementById('mersionSub');
    initMersionLaneControls();
    applyMersionLane('center', overlay);

    const subBetEl = document.getElementById('mersionSubBet');
    const coinFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
    let subBetAmount = betAmount;
    const renderSubBetAmount = () => {
        subBetEl.textContent = `${coinFormatter.format(subBetAmount)} 🪙`;
    };
    renderSubBetAmount();

    overlay.classList.add('active');
    const diveDurationMs = 8500;
    const diveDurationSec = (diveDurationMs / 1000).toFixed(1) + 's';
    overlay.style.setProperty('--dive-duration', diveDurationSec);

    const progressPrefix = currentLanguage === 'en' ? 'Checkpoints' : 'Станции';
    const dockingPrefix = currentLanguage === 'en' ? 'Docking' : 'Стыковка';

    // --- Water surface splash animation ---
    const waterSurface = document.getElementById('mersionWaterSurface');
    waterSurface.style.animation = 'none';
    void waterSurface.offsetWidth;
    waterSurface.style.animation = `waterSurfaceRise ${diveDurationSec} cubic-bezier(0.22, 1, 0.36, 1) forwards`;

    // Create splash drops
    const existingSplash = waterSurface.querySelectorAll('.mersion-splash-drop, .mersion-splash-ring');
    existingSplash.forEach(el => el.remove());
    for (let i = 0; i < 8; i++) {
        const drop = document.createElement('div');
        drop.className = 'mersion-splash-drop';
        drop.style.top = '30%';
        drop.style.left = (40 + Math.random() * 20) + '%';
        drop.style.width = (3 + Math.random() * 6) + 'px';
        drop.style.height = drop.style.width;
        drop.style.animationDelay = (Math.random() * 0.3) + 's';
        waterSurface.appendChild(drop);
    }
    // Splash rings
    for (let i = 0; i < 3; i++) {
        const ring = document.createElement('div');
        ring.className = 'mersion-splash-ring';
        ring.style.animationDelay = (i * 0.2) + 's';
        waterSurface.appendChild(ring);
    }

    // --- Generate solid rock walls ---
    function generateWall(container, side) {
        container.innerHTML = '';

        // Create SVG for jagged cliff-face edge
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('preserveAspectRatio', 'none');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

        // Create gradient that darkens with depth
        const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        grad.setAttribute('id', 'wallGrad_' + side);
        grad.setAttribute('x1', '0');
        grad.setAttribute('y1', '0');
        grad.setAttribute('x2', '0');
        grad.setAttribute('y2', '1');
        const stops = [
            { offset: '0%', color: '#1a3545' },
            { offset: '20%', color: '#142a38' },
            { offset: '40%', color: '#0f2230' },
            { offset: '60%', color: '#0a1a25' },
            { offset: '80%', color: '#06111a' },
            { offset: '100%', color: '#030a10' }
        ];
        stops.forEach(s => {
            const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop.setAttribute('offset', s.offset);
            stop.setAttribute('stop-color', s.color);
            grad.appendChild(stop);
        });
        defs.appendChild(grad);
        svg.appendChild(defs);

        // Build trench-like cliff contour (wide shelf -> narrow abyss)
        const trenchProfile = [
            { y: 0, edge: 34 },
            { y: 14, edge: 35 },
            { y: 28, edge: 37 },
            { y: 42, edge: 39 },
            { y: 56, edge: 42 },
            { y: 70, edge: 45 },
            { y: 84, edge: 48 },
            { y: 100, edge: 50 }
        ];
        const edgeAtDepth = (y) => {
            for (let i = 1; i < trenchProfile.length; i++) {
                const prev = trenchProfile[i - 1];
                const next = trenchProfile[i];
                if (y <= next.y) {
                    const t = (y - prev.y) / (next.y - prev.y);
                    return prev.edge + (next.edge - prev.edge) * t;
                }
            }
            return trenchProfile[trenchProfile.length - 1].edge;
        };

        const segments = 56;
        let points = '';
        const jitterSeed = Math.random() * Math.PI * 2;

        if (side === 'left') {
            points += '0,0 ';
            for (let i = 0; i <= segments; i++) {
                const y = (i / segments) * 100;
                const baseEdge = edgeAtDepth(y);
                const roughness = Math.sin(jitterSeed + i * 1.12) * 2.6 + Math.cos(i * 0.46) * 1.1 + (Math.random() - 0.5) * 1.8;
                const edge = Math.max(18, Math.min(92, baseEdge + roughness));
                points += `${edge.toFixed(2)},${y.toFixed(2)} `;
            }
            points += '0,84';
        } else {
            points += '100,0 ';
            for (let i = 0; i <= segments; i++) {
                const y = (i / segments) * 100;
                const baseEdge = edgeAtDepth(y);
                const roughness = Math.sin(jitterSeed + i * 1.12) * 2.6 + Math.cos(i * 0.46) * 1.1 + (Math.random() - 0.5) * 1.8;
                const edge = Math.max(18, Math.min(92, baseEdge + roughness));
                points += `${(100 - edge).toFixed(2)},${y.toFixed(2)} `;
            }
            points += '100,84';
        }

        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', points);
        polygon.setAttribute('fill', `url(#wallGrad_${side})`);
        polygon.setAttribute('stroke', 'rgba(0, 150, 200, 0.08)');
        polygon.setAttribute('stroke-width', '0.3');
        svg.appendChild(polygon);

        // Add edge highlight line
        const edgeLine = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        const edgePoints = points.split(' ').filter(p => p).slice(1, -1).join(' ');
        edgeLine.setAttribute('points', edgePoints);
        edgeLine.setAttribute('fill', 'none');
        edgeLine.setAttribute('stroke', 'rgba(0, 180, 220, 0.1)');
        edgeLine.setAttribute('stroke-width', '0.5');
        svg.appendChild(edgeLine);

        container.appendChild(svg);

        // Add slanted ledges so the underwater rock surface reads as rising outward
        for (let i = 0; i < 26; i++) {
            const ledge = document.createElement('div');
            ledge.className = 'mersion-rock-ledge ' + side + '-ledge';
            const depthT = i / 25;
            ledge.style.top = (8 + depthT * 82 + Math.random() * 1.4) + '%';
            ledge.style.width = (24 + depthT * 42 + Math.random() * 18) + '%';
            const tilt = (2 + depthT * 4 + Math.random() * 1.4) * (side === 'left' ? 1 : -1);
            ledge.style.transformOrigin = side === 'left' ? 'left center' : 'right center';
            ledge.style.transform = `rotate(${tilt}deg)`;
            if (side === 'left') { ledge.style.left = '0'; }
            else { ledge.style.right = '0'; ledge.style.left = 'auto'; }
            container.appendChild(ledge);
        }

        // Add vertical cracks
        for (let i = 0; i < 8; i++) {
            const crack = document.createElement('div');
            crack.className = 'mersion-rock-crack';
            crack.style.height = (20 + Math.random() * 60) + 'px';
            crack.style.top = (Math.random() * 90) + '%';
            if (side === 'left') {
                crack.style.left = (Math.random() * 50) + '%';
            } else {
                crack.style.right = (Math.random() * 50) + '%';
            }
            container.appendChild(crack);
        }

        // Add subtle bioluminescent glows
        for (let i = 0; i < 5; i++) {
            const glow = document.createElement('div');
            glow.className = 'mersion-rock-glow';
            glow.style.width = (8 + Math.random() * 16) + 'px';
            glow.style.height = glow.style.width;
            glow.style.top = (20 + Math.random() * 70) + '%';
            if (side === 'left') {
                glow.style.left = (Math.random() * 40) + '%';
            } else {
                glow.style.right = (Math.random() * 40) + '%';
            }
            container.appendChild(glow);
        }
    }

    const rockLeftInner = document.getElementById('mersionRockLeftInner');
    const rockRightInner = document.getElementById('mersionRockRightInner');
    const rockLeft = document.getElementById('mersionRockLeft');
    const rockRight = document.getElementById('mersionRockRight');
    generateWall(rockLeftInner, 'left');
    generateWall(rockRightInner, 'right');

    // Reset rock scroll animation
    rockLeftInner.style.animation = 'none';
    rockRightInner.style.animation = 'none';
    void rockLeftInner.offsetWidth;
    rockLeftInner.style.animation = 'rockScroll 8.5s linear';
    rockRightInner.style.animation = 'rockScroll 8.5s linear';

    // --- Place station markers on rock walls ---
    // Remove old wall stations
    document.querySelectorAll('.mersion-wall-station').forEach(el => el.remove());

    const targetStationIndex = selectedStation;
    const maxDepth = mersionStations[mersionStations.length - 1].depth;
    const targetDepth = station.depth;
    const checkpointMarkers = [];
    const stationMarkers = [];
    let targetStationMarker = null;
    let currentDepth = 0;

    const updateStationDepthPositions = () => {
        const depthToPx = (overlay.clientHeight * 1.12) / Math.max(1, maxDepth);
        const zeroDepthY = overlay.clientHeight * 0.72;
        for (const markerEl of stationMarkers) {
            const markerDepth = parseFloat(markerEl.dataset.depth || '0');
            const stationY = zeroDepthY + (markerDepth - currentDepth) * depthToPx;
            markerEl.style.top = `${stationY.toFixed(2)}px`;
        }
    };

    mersionStations.forEach((st, idx) => {
        const isLeft = idx % 2 === 0;
        const marker = document.createElement('div');
        marker.className = 'mersion-wall-station ' + (isLeft ? 'left-side' : 'right-side');
        marker.dataset.stationIndex = String(idx);
        marker.dataset.depth = String(st.depth);

        if (idx === targetStationIndex) {
            marker.classList.add('selected-station', 'checkpoint-target');
            targetStationMarker = marker;
        } else if (idx < targetStationIndex) {
            marker.classList.add('checkpoint-pending');
        } else {
            marker.classList.add('checkpoint-locked');
        }

        marker.style.setProperty('--station-appear-delay', (0.15 + idx * 0.18) + 's');

        marker.innerHTML = `
            <div class="mersion-wall-station-body">
                <div class="mersion-wall-station-dot"></div>
                <div class="mersion-wall-station-line"></div>
                <div class="mersion-wall-station-icon" aria-hidden="true"></div>
                <div class="mersion-wall-station-label">${st.name}<br>${st.depth}m</div>
            </div>
        `;

        const wall = isLeft ? rockLeft : rockRight;
        wall.appendChild(marker);
        stationMarkers.push(marker);
        if (idx <= targetStationIndex) checkpointMarkers.push(marker);
    });
    updateStationDepthPositions();

    const totalCheckpoints = checkpointMarkers.length;
    const passedMarkers = checkpointMarkers.slice(0, Math.max(0, checkpointMarkers.length - 1));
    let passedCheckpointCount = 0;
    const renderCheckpointProgress = (passed) => {
        if (!progressEl) return;
        progressEl.textContent = `${progressPrefix} ${Math.max(0, Math.min(totalCheckpoints, passed))}/${totalCheckpoints}`;
    };
    renderCheckpointProgress(0);

    // --- Submarine animation ---
    subEl.style.transform = '';
    subEl.style.animation = 'none';
    void subEl.offsetWidth;
    subEl.style.animation = `submarineDive ${diveDurationSec} ease-in-out`;

    // Station-based completion and docking flow
    if (dockingLink) dockingLink.style.opacity = '0';
    let stationReachCheckFrame = 0;
    let checkpointTrackFrame = 0;
    let dockingTrackFrame = 0;
    let dockingApproachFrame = 0;
    let autoDiveFrame = 0;
    let autoDiveTimer = 0;
    const dockingDurationMs = 3200;
    let hasFinishedDive = false;
    let autoDiveActive = false;
    let dockingActive = false;
    const getElementTranslate = (element) => {
        const transform = window.getComputedStyle(element).transform;
        if (!transform || transform === 'none') return { x: 0, y: 0 };

        try {
            if (window.DOMMatrixReadOnly) {
                const matrix = new DOMMatrixReadOnly(transform);
                return { x: matrix.m41, y: matrix.m42 };
            }
            if (window.DOMMatrix) {
                const matrix = new DOMMatrix(transform);
                return { x: matrix.m41, y: matrix.m42 };
            }
        } catch (_) {
            // Fallback below handles matrix parsing for older environments.
        }

        const matrixMatch = transform.match(/matrix(3d)?\(([^)]+)\)/);
        if (!matrixMatch) return { x: 0, y: 0 };
        const values = matrixMatch[2].split(',').map(v => parseFloat(v.trim()));
        if (matrixMatch[1] === '3d') {
            return {
                x: values[12] || 0,
                y: values[13] || 0
            };
        }
        return {
            x: values[4] || 0,
            y: values[5] || 0
        };
    };
    const getTargetStationContainer = () => {
        if (targetStationMarker && document.body.contains(targetStationMarker)) return targetStationMarker;
        targetStationMarker = document.querySelector('.mersion-wall-station.selected-station');
        return targetStationMarker;
    };
    const getTargetStationAnchor = () => {
        const container = getTargetStationContainer();
        if (!container) return null;
        return container.querySelector('.mersion-wall-station-dot') || container;
    };

    const trackCheckpointProgress = () => {
        if (!overlay.classList.contains('active') || hasFinishedDive) return;
        if (!dockingActive) {
            while (passedCheckpointCount < passedMarkers.length) {
                const nextMarker = passedMarkers[passedCheckpointCount];
                const markerDepth = parseFloat(nextMarker.dataset.depth || '0');
                if (currentDepth < markerDepth) break;
                nextMarker.classList.remove('checkpoint-pending');
                nextMarker.classList.add('checkpoint-passed');
                passedCheckpointCount += 1;
                renderCheckpointProgress(passedCheckpointCount);
            }
        }
        checkpointTrackFrame = requestAnimationFrame(trackCheckpointProgress);
    };
    if (totalCheckpoints > 0) checkpointTrackFrame = requestAnimationFrame(trackCheckpointProgress);

    const trackDockingLink = () => {
        if (!dockingActive || !overlay.classList.contains('active') || !dockingLink) return;
        const targetAnchor = getTargetStationAnchor();
        if (!targetAnchor) {
            dockingTrackFrame = requestAnimationFrame(trackDockingLink);
            return;
        }

        const subRect = subEl.getBoundingClientRect();
        const targetRect = targetAnchor.getBoundingClientRect();
        const targetX = targetRect.left + targetRect.width / 2;
        const targetY = targetRect.top + targetRect.height / 2;
        const subCenterX = subRect.left + subRect.width / 2;
        const startX = targetX >= subCenterX ? subRect.left + subRect.width * 0.78 : subRect.left + subRect.width * 0.22;
        const startY = subRect.top + subRect.height * 0.56;
        const deltaX = targetX - startX;
        const deltaY = targetY - startY;
        const distance = Math.max(8, Math.hypot(deltaX, deltaY));
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

        dockingLink.style.left = `${startX}px`;
        dockingLink.style.top = `${startY}px`;
        dockingLink.style.width = `${distance}px`;
        dockingLink.style.transform = `translateY(-50%) rotate(${angle}deg)`;
        dockingTrackFrame = requestAnimationFrame(trackDockingLink);
    };

    const startSubDockingApproach = () => {
        if (!dockingActive || hasFinishedDive || !overlay.classList.contains('active')) return;
        const startTranslate = getElementTranslate(subEl);
        let dockTranslateX = startTranslate.x;
        let dockTranslateY = startTranslate.y;
        const dockApproachMs = Math.max(2600, Math.round(dockingDurationMs * 1.1));
        const dockGapPx = 10;
        let dockApproachStart = 0;

        subEl.style.animation = 'none';
        subEl.style.transition = 'none';
        subEl.style.transform = `translate(${dockTranslateX.toFixed(2)}px, ${dockTranslateY.toFixed(2)}px)`;

        const approachStep = (timestamp) => {
            if (!dockingActive || hasFinishedDive || !overlay.classList.contains('active')) return;
            if (!dockApproachStart) dockApproachStart = timestamp;

            const elapsed = timestamp - dockApproachStart;
            const progress = Math.min(1, elapsed / dockApproachMs);
            const targetAnchor = getTargetStationAnchor();
            if (targetAnchor) {
                const subRect = subEl.getBoundingClientRect();
                const targetRect = targetAnchor.getBoundingClientRect();
                const targetX = targetRect.left + targetRect.width / 2;
                const targetY = targetRect.top + targetRect.height / 2;
                const subCenterX = subRect.left + subRect.width / 2;
                const approachFromRight = targetX >= subCenterX;
                const attachX = subRect.left + (approachFromRight ? subRect.width * 0.78 : subRect.width * 0.22);
                const attachY = subRect.top + subRect.height * 0.56;
                const desiredAttachX = targetX + (approachFromRight ? -dockGapPx : dockGapPx);
                const desiredAttachY = targetY;
                const errorX = desiredAttachX - attachX;
                const errorY = desiredAttachY - attachY;
                const gainX = 0.1 - progress * 0.05;
                const gainY = 0.08 - progress * 0.04;
                // Keep immersion feel: never move submarine upward during docking approach.
                const downOnlyErrorY = errorY > 0 ? errorY : 0;
                const maxStepX = 2.2;
                const maxStepY = 1.15;
                const stepX = Math.max(-maxStepX, Math.min(maxStepX, errorX * gainX));
                const stepY = Math.max(0, Math.min(maxStepY, downOnlyErrorY * gainY));
                dockTranslateX += stepX;
                dockTranslateY += stepY;
                subEl.style.transform = `translate(${dockTranslateX.toFixed(2)}px, ${dockTranslateY.toFixed(2)}px)`;

                const connectedHorizontally = Math.abs(errorX) <= 2;
                const connectedVertically = Math.abs(errorY) <= 8;
                if (connectedHorizontally && connectedVertically) {
                    if (dockingTrackFrame) cancelAnimationFrame(dockingTrackFrame);
                    if (dockingApproachFrame) cancelAnimationFrame(dockingApproachFrame);
                    if (dockingLink) dockingLink.style.opacity = '0';
                    dockingActive = false;
                    finishDive();
                    return;
                }
            }

            dockingApproachFrame = requestAnimationFrame(approachStep);
        };

        dockingApproachFrame = requestAnimationFrame(approachStep);
    };

    const startAutoDiveToFinish = () => {
        if (autoDiveActive || dockingActive || hasFinishedDive || !overlay.classList.contains('active')) return;
        autoDiveActive = true;
        const currentTranslate = getElementTranslate(subEl);
        let currentTranslateX = currentTranslate.x;
        let currentTranslateY = currentTranslate.y;
        subEl.style.animation = 'none';
        subEl.style.transition = 'none';

        const driftDown = () => {
            if (hasFinishedDive || dockingActive || !overlay.classList.contains('active')) {
                autoDiveActive = false;
                return;
            }
            currentTranslateY += Math.max(1.4, overlay.clientHeight * 0.0045);
            subEl.style.transform = `translate(${currentTranslateX.toFixed(2)}px, ${currentTranslateY.toFixed(2)}px)`;
            autoDiveFrame = requestAnimationFrame(driftDown);
        };

        autoDiveFrame = requestAnimationFrame(driftDown);
    };

    const startDockingSequence = () => {
        if (dockingActive || hasFinishedDive) return;
        dockingActive = true;
        autoDiveActive = false;
        if (autoDiveFrame) cancelAnimationFrame(autoDiveFrame);
        if (stationReachCheckFrame) cancelAnimationFrame(stationReachCheckFrame);
        if (dockingApproachFrame) cancelAnimationFrame(dockingApproachFrame);

        if (depthAnimationFrame) cancelAnimationFrame(depthAnimationFrame);
        currentDepth = targetDepth;
        depthEl.textContent = currentDepth + 'm';
        updateStationDepthPositions();

        const targetContainer = getTargetStationContainer();
        if (targetContainer) {
            targetContainer.classList.remove('checkpoint-target', 'checkpoint-pending');
            targetContainer.classList.add('checkpoint-passed', 'docking-target');
            const targetLane = targetContainer.classList.contains('left-side') ? 'left' : 'right';
            applyMersionLane(targetLane, overlay);
        }

        renderCheckpointProgress(totalCheckpoints);
        if (progressEl) progressEl.textContent = `${dockingPrefix} ${station.name}`;

        if (dockingLink) {
            dockingLink.style.opacity = '1';
            dockingTrackFrame = requestAnimationFrame(trackDockingLink);
        }
        startSubDockingApproach();
    };

    // Create bubbles
    const bubblesContainer = document.getElementById('mersionBubbles');
    bubblesContainer.innerHTML = '';
    for (let i = 0; i < 20; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'mersion-bubble';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.bottom = Math.random() * 40 + '%';
        bubble.style.animationDelay = Math.random() * 3 + 's';
        bubble.style.width = (4 + Math.random() * 8) + 'px';
        bubble.style.height = bubble.style.width;
        bubblesContainer.appendChild(bubble);
    }

    // Add lots of fish swimming side-to-side during immersion
    const fishSwarm = document.getElementById('mersionFishSwarm');
    fishSwarm.innerHTML = '';
    fishSwarm.style.animation = 'none';
    void fishSwarm.offsetWidth;
    fishSwarm.style.animation = `fishLayerRise ${diveDurationSec} cubic-bezier(0.22, 1, 0.36, 1) forwards`;
    const swimFishEmojis = ['🐟', '🐠', '🐡', '🦈', '🦑', '🪼', '🐙', '🦐', '🐬'];
    const swimFishMultipliers = [0.55, 0.7, 0.8, 0.95, 1.1, 1.25, 1.4, 1.7, 2, 2.3];
    const fishCount = 36;
    const fishElements = [];
    for (let i = 0; i < fishCount; i++) {
        const fishEl = document.createElement('div');
        const isLTR = Math.random() > 0.5;
        const fishMult = swimFishMultipliers[Math.floor(Math.random() * swimFishMultipliers.length)];
        fishEl.className = 'mersion-swim-fish ' + (isLTR ? 'ltr' : 'rtl');
        fishEl.dataset.mult = String(fishMult);
        fishEl.dataset.hit = '0';
        fishEl.innerHTML = `
            <span class="mersion-swim-fish-emoji">${swimFishEmojis[Math.floor(Math.random() * swimFishEmojis.length)]}</span>
            <span class="mersion-swim-fish-mult">x${fishMult.toFixed(2)}</span>
        `;
        fishEl.style.top = (6 + Math.random() * 88) + '%';
        fishEl.style.fontSize = (13 + Math.random() * 17) + 'px';
        fishEl.style.opacity = (0.3 + Math.random() * 0.45).toFixed(2);
        fishEl.style.setProperty('--swim-duration', (3.6 + Math.random() * 4.6).toFixed(2) + 's');
        fishEl.style.setProperty('--swim-delay', (-Math.random() * 7).toFixed(2) + 's');
        fishSwarm.appendChild(fishEl);
        fishElements.push(fishEl);
    }

    // Apply fish multiplier when fish touches the submarine
    let fishCollisionFrame = 0;
    const checkFishHits = () => {
        if (!overlay.classList.contains('active')) return;
        const subRect = subEl.getBoundingClientRect();
        for (const fishEl of fishElements) {
            if (fishEl.dataset.hit === '1') continue;
            const fishRect = fishEl.getBoundingClientRect();
            const touching = fishRect.right > subRect.left + 6 &&
                fishRect.left < subRect.right - 6 &&
                fishRect.bottom > subRect.top + 4 &&
                fishRect.top < subRect.bottom - 4;
            if (!touching) continue;

            fishEl.dataset.hit = '1';
            fishEl.classList.add('caught-sub');
            const fishMult = parseFloat(fishEl.dataset.mult || '1');
            subBetAmount = Math.max(0.01, Math.round((subBetAmount * fishMult) * 100) / 100);
            renderSubBetAmount();
            subBetEl.classList.remove('bet-hit');
            void subBetEl.offsetWidth;
            subBetEl.classList.add('bet-hit');
        }
        fishCollisionFrame = requestAnimationFrame(checkFishHits);
    };
    fishCollisionFrame = requestAnimationFrame(checkFishHits);

    // Add depth particles
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'mersion-depth-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.width = (1 + Math.random() * 3) + 'px';
        particle.style.height = particle.style.width;
        bubblesContainer.appendChild(particle);
    }

    // Animate depth counter and station movement by real depth.
    let depthAnimationFrame = 0;
    let depthAnimationStart = 0;
    const animateDepth = (timestamp) => {
        if (!overlay.classList.contains('active') || hasFinishedDive || dockingActive) return;
        if (!depthAnimationStart) depthAnimationStart = timestamp;

        const elapsed = timestamp - depthAnimationStart;
        const progress = Math.min(1, elapsed / diveDurationMs);
        currentDepth = Math.round(targetDepth * progress);
        depthEl.textContent = currentDepth + 'm';
        updateStationDepthPositions();

        if (progress < 1) {
            depthAnimationFrame = requestAnimationFrame(animateDepth);
        }
    };
    depthAnimationFrame = requestAnimationFrame(animateDepth);

    const finishDive = () => {
        if (hasFinishedDive) return;
        hasFinishedDive = true;

        // Clear particles and running trackers
        document.querySelectorAll('.mersion-depth-particle').forEach(p => p.remove());
        if (stationReachCheckFrame) cancelAnimationFrame(stationReachCheckFrame);
        if (checkpointTrackFrame) cancelAnimationFrame(checkpointTrackFrame);
        if (dockingTrackFrame) cancelAnimationFrame(dockingTrackFrame);
        if (dockingApproachFrame) cancelAnimationFrame(dockingApproachFrame);
        if (autoDiveFrame) cancelAnimationFrame(autoDiveFrame);
        if (autoDiveTimer) clearTimeout(autoDiveTimer);
        if (fishCollisionFrame) cancelAnimationFrame(fishCollisionFrame);
        if (depthAnimationFrame) cancelAnimationFrame(depthAnimationFrame);
        currentDepth = targetDepth;
        depthEl.textContent = currentDepth + 'm';
        updateStationDepthPositions();
        if (dockingLink) dockingLink.style.opacity = '0';
        fishSwarm.innerHTML = '';
        document.querySelectorAll('.mersion-wall-station.docking-target').forEach(el => el.classList.remove('docking-target'));
        overlay.classList.remove('active');
        subEl.style.transform = '';
        subEl.style.transition = '';
        autoDiveActive = false;
        dockingActive = false;
        renderCheckpointProgress(totalCheckpoints);

        // Rigged: Shift probability toward lower multiplier fish
        // Weight: first fish (lowest) gets highest weight
        const weights = [35, 25, 20, 12, 8]; // heavier on low mult
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let rand = Math.random() * totalWeight;
        let fishIndex = 0;
        for (let i = 0; i < weights.length; i++) {
            rand -= weights[i];
            if (rand <= 0) {
                fishIndex = i;
                break;
            }
        }

        const fish = station.fish[fishIndex];
        const winAmount = subBetAmount * fish.mult;
        balance += winAmount;
        updateBalance();

        const profit = winAmount - betAmount;
        const isWin = profit > 0;

        // Show custom result with fish info
        const modal = document.getElementById('resultModal');
        const emoji = document.getElementById('resultEmoji');
        const title = document.getElementById('resultTitle');
        const amountEl = document.getElementById('resultAmount');

        emoji.textContent = fish.emoji;

        if (isWin) {
            title.textContent = (currentLanguage === 'en' ? 'Caught: ' : 'Поймано: ') + fish.name + ' (x' + fish.mult.toFixed(1) + ')';
            amountEl.textContent = '+' + Math.ceil(profit) + ' 🪙';
            amountEl.className = 'result-amount win';
            addTransaction('Mersion', profit, 'win');
        } else if (profit === 0) {
            title.textContent = (currentLanguage === 'en' ? 'Caught: ' : 'Поймано: ') + fish.name + ' (x' + fish.mult.toFixed(1) + ')';
            amountEl.textContent = '0 🪙';
            amountEl.className = 'result-amount';
            addTransaction('Mersion', 0, 'draw');
        } else {
            title.textContent = (currentLanguage === 'en' ? 'Caught: ' : 'Поймано: ') + fish.name + ' (x' + fish.mult.toFixed(1) + ')';
            amountEl.textContent = Math.ceil(profit) + ' 🪙';
            amountEl.className = 'result-amount lose';
            addTransaction('Mersion', profit, 'loss');
        }

        modal.classList.add('active');
        diveBtn.disabled = false;
    };

    // Start ending only when depth is reached and boat is level with the station.
    const checkTargetStationReached = () => {
        if (!overlay.classList.contains('active') || hasFinishedDive || dockingActive) return;
        const targetAnchor = getTargetStationAnchor();
        if (!targetAnchor) {
            stationReachCheckFrame = requestAnimationFrame(checkTargetStationReached);
            return;
        }

        const subRect = subEl.getBoundingClientRect();
        const targetRect = targetAnchor.getBoundingClientRect();
        const targetY = targetRect.top + targetRect.height / 2;
        const subCoreTop = subRect.top + subRect.height * 0.28;
        const subCoreBottom = subRect.top + subRect.height * 0.84;
        const alignedWithStation = subCoreTop <= targetY && subCoreBottom >= targetY;
        const reachedStationDepth = currentDepth >= targetDepth;

        if (reachedStationDepth && alignedWithStation) {
            startDockingSequence();
            return;
        }

        stationReachCheckFrame = requestAnimationFrame(checkTargetStationReached);
    };

    stationReachCheckFrame = requestAnimationFrame(checkTargetStationReached);
    autoDiveTimer = setTimeout(startAutoDiveToFinish, diveDurationMs + 80);
}
