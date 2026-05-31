import {
  OVERLAY_GROUPS,
  OVERLAY_LAYERS,
  setBuildingsEnabled,
  setCadastralEnabled,
  setTerrainEnabled,
  switchVWorldBaseMap,
  VWORLD_LAYER_OPTIONS,
} from '../layers/layerManager.js';

const ICONS = {
  layers: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 3 7l9 5 9-5-9-5Zm0 7L3 14l9 5 9-5-9-5Zm0 7-9-5v2l9 5 9-5v-2l-9 5-9-5Z"/></svg>`,
  map: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6-2-6 2v13l6-2 6 2 6-2V4l-6 2Zm-6 11-4 1.3V5.3L9 4v13Zm2 0V4l4 1.3v12.7l-4-1.3Zm8 0-4 1.3V5.3L19 4v13Z"/></svg>`,
  chevron: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>`,
};

function createElement(tag, className, html) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (html !== undefined) {
    element.innerHTML = html;
  }
  return element;
}

function createCollapsibleSection(title, icon, options = {}) {
  const { open = true, compact = false } = options;
  const section = createElement('details', 'layer-panel__section');
  section.open = open;
  if (compact) {
    section.classList.add('layer-panel__section--compact');
  }

  const summary = createElement('summary', 'layer-panel__section-summary');
  summary.innerHTML = `
    <span class="layer-panel__section-icon">${icon}</span>
    <span class="layer-panel__section-title">${title}</span>
    <span class="layer-panel__section-chevron" aria-hidden="true"></span>
  `;

  const body = createElement('div', 'layer-panel__section-body');
  section.append(summary, body);
  return { section, body };
}

function groupOverlayLayers(layers) {
  return layers.reduce((groups, layer) => {
    const groupId = layer.group ?? 'default';
    if (!groups[groupId]) {
      groups[groupId] = [];
    }
    groups[groupId].push(layer);
    return groups;
  }, {});
}

export function createLayerPanel(viewer, options = {}) {
  const {
    initialBaseMap = 'Base',
    onBaseMapChange,
    onOverlayChange,
    mount = document.body,
  } = options;

  let activeBaseMap = initialBaseMap;
  const overlayState = new Map(
    OVERLAY_LAYERS.map((layer) => [layer.id, layer.defaultEnabled ?? false]),
  );

  const panel = createElement('aside', 'layer-panel');
  const toggleButton = createElement('button', 'layer-panel__toggle', ICONS.chevron);
  toggleButton.type = 'button';
  toggleButton.setAttribute('aria-label', '레이어 패널 접기');
  toggleButton.setAttribute('aria-expanded', 'true');

  const content = createElement('div', 'layer-panel__content');
  const header = createElement('div', 'layer-panel__header');
  header.innerHTML = `
    <div class="layer-panel__title-group">
      <span class="layer-panel__icon">${ICONS.layers}</span>
      <div>
        <h2 class="layer-panel__title">레이어</h2>
      </div>
    </div>
  `;

  const { section: mapSection, body: mapSectionBody } = createCollapsibleSection(
    '지도 변경',
    ICONS.map,
    { open: true, compact: true },
  );

  const mapGrid = createElement('div', 'layer-panel__map-grid');
  const mapButtons = new Map();

  VWORLD_LAYER_OPTIONS.forEach((layer) => {
    const button = createElement('button', 'layer-panel__map-option');
    button.type = 'button';
    button.dataset.layerId = layer.id;
    button.setAttribute('aria-pressed', String(layer.id === activeBaseMap));
    button.innerHTML = `
      <span class="layer-panel__map-swatch" style="background:${layer.preview}"></span>
      <span class="layer-panel__map-label">${layer.label}</span>
    `;

    button.addEventListener('click', () => {
      if (layer.id === activeBaseMap) {
        return;
      }

      activeBaseMap = layer.id;
      switchVWorldBaseMap(viewer, layer.id);
      updateBaseMapSelection();
      onBaseMapChange?.(layer.id);
    });

    mapButtons.set(layer.id, button);
    mapGrid.appendChild(button);
  });

  mapSectionBody.appendChild(mapGrid);

  const { section: overlaySection, body: overlaySectionBody } = createCollapsibleSection(
    '오버레이',
    ICONS.layers,
    { open: true },
  );

  const overlayList = createElement('div', 'layer-panel__overlay-list');
  const overlayInputs = new Map();
  const groupedLayers = groupOverlayLayers(OVERLAY_LAYERS);

  Object.entries(groupedLayers).forEach(([groupId, layers]) => {
    const groupMeta = OVERLAY_GROUPS[groupId];
    if (groupMeta?.label) {
      overlayList.appendChild(
        createElement('p', 'layer-panel__group-label', groupMeta.label),
      );
    }

    layers.forEach((layer) => {
      const row = createElement('label', 'layer-panel__overlay-item');
      if (layer.disabled) {
        row.classList.add('layer-panel__overlay-item--disabled');
      }

      const input = createElement('input');
      input.type = 'checkbox';
      input.name = `overlay-${layer.id}`;
      input.checked = overlayState.get(layer.id) ?? false;
      input.disabled = Boolean(layer.disabled);

      row.appendChild(input);
      row.appendChild(createElement('span', 'layer-panel__overlay-copy', `
        <strong>${layer.label}</strong>
        <small>${layer.description}</small>
      `));

      input.addEventListener('change', async () => {
        overlayState.set(layer.id, input.checked);
        input.disabled = true;

        try {
          await applyOverlayLayer(viewer, layer.id, input.checked);
          onOverlayChange?.(layer.id, input.checked);
        } catch (error) {
          input.checked = !input.checked;
          overlayState.set(layer.id, input.checked);
          console.error(error);
        } finally {
          input.disabled = Boolean(layer.disabled);
        }
      });

      overlayInputs.set(layer.id, input);
      overlayList.appendChild(row);
    });
  });

  overlaySectionBody.appendChild(overlayList);

  const statusBar = createElement('div', 'layer-panel__status');
  statusBar.innerHTML = `
    <span class="layer-panel__status-label">현재</span>
    <strong class="layer-panel__status-value"></strong>
  `;
  const statusValue = statusBar.querySelector('.layer-panel__status-value');

  content.append(header, mapSection, overlaySection, statusBar);
  panel.append(toggleButton, content);
  mount.appendChild(panel);

  const mapFab = createElement('button', 'layer-panel__fab', ICONS.map);
  mapFab.type = 'button';
  mapFab.setAttribute('aria-label', '레이어 패널 열기');
  mount.appendChild(mapFab);

  function updateBaseMapSelection() {
    const selectedLayer = VWORLD_LAYER_OPTIONS.find((layer) => layer.id === activeBaseMap);

    mapButtons.forEach((button, layerId) => {
      button.setAttribute('aria-pressed', String(layerId === activeBaseMap));
      button.classList.toggle('layer-panel__map-option--active', layerId === activeBaseMap);
    });

    statusValue.textContent = selectedLayer?.label ?? activeBaseMap;
  }

  function setCollapsed(collapsed) {
    panel.classList.toggle('layer-panel--collapsed', collapsed);
    toggleButton.setAttribute('aria-expanded', String(!collapsed));
    toggleButton.setAttribute(
      'aria-label',
      collapsed ? '레이어 패널 펼치기' : '레이어 패널 접기',
    );
    mapFab.classList.toggle('layer-panel__fab--visible', collapsed);
  }

  toggleButton.addEventListener('click', () => {
    setCollapsed(!panel.classList.contains('layer-panel--collapsed'));
  });

  mapFab.addEventListener('click', () => {
    setCollapsed(false);
  });

  updateBaseMapSelection();

  return {
    element: panel,
    setBaseMap(layerId) {
      activeBaseMap = layerId;
      switchVWorldBaseMap(viewer, layerId);
      updateBaseMapSelection();
    },
    getBaseMap() {
      return activeBaseMap;
    },
    setOverlayEnabled(layerId, enabled) {
      const input = overlayInputs.get(layerId);
      if (!input || input.disabled) {
        return;
      }
      input.checked = enabled;
      overlayState.set(layerId, enabled);
    },
    open() {
      setCollapsed(false);
    },
    close() {
      setCollapsed(true);
    },
  };
}

async function applyOverlayLayer(viewer, layerId, enabled) {
  switch (layerId) {
    case 'terrain':
      await setTerrainEnabled(viewer, enabled);
      break;
    case 'buildings':
      await setBuildingsEnabled(viewer, enabled);
      break;
    case 'cadastral':
      setCadastralEnabled(viewer, enabled);
      break;
    default:
      break;
  }
}
