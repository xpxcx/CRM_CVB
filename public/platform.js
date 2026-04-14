function $(id) {
  return document.getElementById(id);
}

function nowMs() {
  return typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
}

function safeJsonParse(text, fallback) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

function setMsg(el, kind, text) {
  el.className = `msg ${kind}`;
  el.textContent = text;
}

function clearMsg(el) {
  el.className = 'msg';
  el.textContent = '';
}

async function callApi(method, path, body) {
  const t0 = nowMs();
  const res = await fetch(path, {
    method,
    headers: {
      accept: 'application/json',
      ...(body != null ? { 'content-type': 'application/json' } : {}),
    },
    body: body != null ? JSON.stringify(body) : undefined,
  });
  const t1 = nowMs();
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  return { status: res.status, ok: res.ok, ms: Math.round((t1 - t0) * 10) / 10, json };
}

function setPre(id, payload) {
  const el = $(id);
  el.textContent = typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2);
}

function setTable(el, headers, rows) {
  if (!headers.length) {
    el.innerHTML = '';
    return;
  }
  const thead = `<thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>`;
  const tbody = `<tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`)
    .join('')}</tbody>`;
  el.innerHTML = thead + tbody;
}

function escapeHtml(s) {
  const d = document.createElement('div');
  d.textContent = s == null ? '' : String(s);
  return d.innerHTML;
}

let catalogTab = 'flowers';

function pickPanel(panelId) {
  document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
  $(panelId).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach((b) => {
    b.classList.toggle('active', b.getAttribute('data-panel') === panelId);
  });
}

function collectLinesFromPicker() {
  const inputs = Array.from(document.querySelectorAll('input[data-flower-id]'));
  const lines = [];
  for (const el of inputs) {
    const flowerId = el.getAttribute('data-flower-id');
    const q = Number(el.value);
    if (Number.isFinite(q) && q > 0) {
      lines.push({ flowerId, quantity: Math.trunc(q) });
    }
  }
  return lines;
}

function renderFlowersPicker(flowers) {
  const tbl = $('tblFlowersPick');
  const headers = ['id', 'название', 'цена', 'остаток', 'кол-во'];
  const rows = (Array.isArray(flowers) ? flowers : []).map((f) => [
    String(f?.id ?? ''),
    String(f?.name ?? ''),
    String(f?.unitPrice ?? ''),
    String(f?.stockQuantity ?? ''),
    `<input type="number" min="0" step="1" value="0" data-flower-id="${String(
      f?.id ?? '',
    )}" style="width:90px;" />`,
  ]);
  setTable(tbl, headers, rows);
}

async function refreshOrders() {
  const r = await callApi('GET', '/api/orders');
  setPre('ordersOut', r);

  const list = Array.isArray(r.json) ? r.json : [];
  const headers = ['id', 'status', 'total', 'address', 'createdAt'];
  const rows = list.map((o) => [
    String(o?.id ?? ''),
    String(o?.status ?? ''),
    String(o?.total ?? ''),
    String(o?.deliveryAddress ?? ''),
    String(o?.createdAt ?? ''),
  ]);
  setTable($('tblOrders'), headers, rows);
}

async function loadFlowers() {
  const r = await callApi('GET', '/api/catalog/flowers');
  setPre('catalogOut', r);

  const list = Array.isArray(r.json) ? r.json : [];
  const headers = ['id', 'name', 'unitPrice', 'stockQuantity', 'categoryId', 'active', ''];
  const rows = list.map((f) => [
    String(f?.id ?? ''),
    String(f?.name ?? ''),
    String(f?.unitPrice ?? ''),
    String(f?.stockQuantity ?? ''),
    String(f?.categoryId ?? ''),
    String(!!f?.isActive),
    `<button type="button" class="catalog-refresh" data-del-flower="${escapeHtml(f?.id ?? '')}">Удалить</button>`,
  ]);
  setTable($('tblCatalogFlowers'), headers, rows);

  const sel = $('stockFlowerId');
  if (sel) {
    const prev = sel.value;
    sel.innerHTML = '';
    for (const f of list) {
      const opt = document.createElement('option');
      opt.value = String(f?.id ?? '');
      opt.textContent = `${String(f?.id ?? '')} — ${String(f?.name ?? '')}`;
      sel.appendChild(opt);
    }
    if (prev && Array.from(sel.options).some((o) => o.value === prev)) sel.value = prev;
  }
}

async function loadPackaging() {
  const r = await callApi('GET', '/api/catalog/packaging');
  setPre('catalogOut', r);

  const list = Array.isArray(r.json) ? r.json : [];
  const headers = ['id', 'name', 'price', 'active', ''];
  const rows = list.map((p) => [
    String(p?.id ?? ''),
    String(p?.name ?? ''),
    String(p?.price ?? ''),
    String(!!p?.isActive),
    `<button type="button" class="catalog-refresh" data-del-packaging="${escapeHtml(p?.id ?? '')}">Удалить</button>`,
  ]);
  setTable($('tblCatalogPackaging'), headers, rows);
}

function pickCatalogTab(which) {
  catalogTab = which === 'packaging' ? 'packaging' : 'flowers';
  document.querySelectorAll('.catalog-sub-btn').forEach((b) => {
    const on = b.getAttribute('data-catalog') === catalogTab;
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  document.querySelectorAll('.catalog-pane').forEach((p) => {
    p.classList.toggle('active', p.getAttribute('data-catalog-pane') === catalogTab);
  });
  if (catalogTab === 'flowers') loadFlowers();
  else loadPackaging();
}

async function addFlower() {
  const msg = $('flowerMsg');
  msg.style.display = 'block';

  const payload = {
    id: $('newFlowerId').value.trim() || undefined,
    name: $('newFlowerName').value.trim(),
    unitPrice: Number($('newFlowerPrice').value),
    stockQuantity: Number($('newFlowerStock').value),
    categoryId: $('newFlowerCategoryId').value.trim(),
    isActive: !!$('newFlowerActive').checked,
  };

  if (!payload.name || !payload.categoryId || Number.isNaN(payload.unitPrice) || Number.isNaN(payload.stockQuantity)) {
    msg.textContent = 'Заполните название/категорию; цена и остаток должны быть числами.';
    return;
  }

  const r = await callApi('POST', '/api/catalog/flowers', payload);
  setPre('catalogOut', r);
  if (!r.ok) {
    msg.textContent = (r.json && (r.json.message || r.json.error)) || 'Ошибка добавления';
    return;
  }
  msg.textContent = `Добавлено: ${r.json?.id ?? ''}`;
  $('newFlowerId').value = '';
  $('newFlowerName').value = '';
  $('newFlowerPrice').value = '';
  $('newFlowerStock').value = '';
  await loadFlowers();
  await initOrderData();
}

async function setFlowerStock() {
  const msg = $('flowerMsg');
  msg.style.display = 'block';

  const id = $('stockFlowerId').value;
  const stockQuantity = Number($('stockFlowerQty').value);
  if (!id || Number.isNaN(stockQuantity)) {
    msg.textContent = 'Выберите цветок и укажите число для остатка.';
    return;
  }

  const r = await callApi('PATCH', `/api/catalog/flowers/${encodeURIComponent(id)}/stock`, { stockQuantity });
  setPre('catalogOut', r);
  if (!r.ok) {
    msg.textContent = (r.json && (r.json.message || r.json.error)) || 'Ошибка обновления';
    return;
  }
  msg.textContent = `Остаток обновлён: ${id} → ${stockQuantity}`;
  $('stockFlowerQty').value = '';
  await loadFlowers();
}

async function addPackaging() {
  const msg = $('packagingMsg');
  msg.style.display = 'block';

  const payload = {
    id: $('newPackId').value.trim() || undefined,
    name: $('newPackName').value.trim(),
    price: Number($('newPackPrice').value),
    isActive: !!$('newPackActive').checked,
  };

  if (!payload.name || Number.isNaN(payload.price)) {
    msg.textContent = 'Заполните название; цена должна быть числом.';
    return;
  }

  const r = await callApi('POST', '/api/catalog/packaging', payload);
  setPre('catalogOut', r);
  if (!r.ok) {
    msg.textContent = (r.json && (r.json.message || r.json.error)) || 'Ошибка добавления';
    return;
  }
  msg.textContent = `Добавлено: ${r.json?.id ?? ''}`;
  $('newPackId').value = '';
  $('newPackName').value = '';
  $('newPackPrice').value = '';
  await loadPackaging();
  await initOrderData();
}

async function deleteFlower(id) {
  if (!id) return;
  const r = await callApi('DELETE', `/api/catalog/flowers/${encodeURIComponent(id)}`);
  setPre('catalogOut', r);
  await loadFlowers();
  await initOrderData();
}

async function deletePackaging(id) {
  if (!id) return;
  const r = await callApi('DELETE', `/api/catalog/packaging/${encodeURIComponent(id)}`);
  setPre('catalogOut', r);
  await loadPackaging();
  await initOrderData();
}

async function initOrderData() {
  const flowersRes = await callApi('GET', '/api/catalog/flowers');
  if (Array.isArray(flowersRes.json)) {
    renderFlowersPicker(flowersRes.json);
  }

  const packRes = await callApi('GET', '/api/catalog/packaging');
  const sel = $('orderPackagingId');
  sel.innerHTML = '';
  if (Array.isArray(packRes.json)) {
    for (const p of packRes.json) {
      const opt = document.createElement('option');
      opt.value = String(p.id);
      opt.textContent = `${p.name} — ${p.price}₽`;
      sel.appendChild(opt);
    }
  }
}

function prefillOrder() {
  $('orderEmployeeName').value = 'Иван Петров';
  $('packagingEnabled').checked = false;
  $('orderAddress').value = 'Геленджик, ул. Примерная, 10';
  $('deliveryEnabled').checked = false;
  $('addressBlock').style.display = 'none';

  const inputs = Array.from(document.querySelectorAll('input[data-flower-id]'));
  for (const el of inputs) {
    const id = el.getAttribute('data-flower-id');
    if (id === 'f1') el.value = '7';
    else if (id === 'f2') el.value = '5';
    else el.value = '0';
  }
}

async function createOrder() {
  const msgEl = $('orderMsg');
  clearMsg(msgEl);

  const employeeName = $('orderEmployeeName').value.trim();
  const packagingEnabled = !!$('packagingEnabled').checked;
  const packagingId = $('orderPackagingId').value;
  const deliveryEnabled = !!$('deliveryEnabled').checked;
  const deliveryAddress = $('orderAddress').value.trim();
  const lines = collectLinesFromPicker();

  const body = {
    employeeName,
    packagingEnabled,
    ...(packagingEnabled ? { packagingId } : {}),
    deliveryEnabled,
    ...(deliveryEnabled ? { deliveryAddress } : {}),
    lines,
  };

  const r = await callApi('POST', '/api/orders', body);
  setPre('orderOut', r);
  if (r.ok) {
    setMsg(msgEl, 'ok', `Заказ создан. HTTP ${r.status}. Время ответа: ${r.ms}ms`);
  } else {
    setMsg(msgEl, 'err', `Ошибка. HTTP ${r.status}. Время ответа: ${r.ms}ms`);
  }
}

function renderProductsTable(list) {
  const tbl = $('tblClassmateProducts');
  const wrap = $('prodWrap');
  const empty = $('prodEmpty');

  const rows = Array.isArray(list) ? list : [];
  if (!rows.length) {
    wrap.style.display = 'none';
    empty.textContent = 'Нет данных.';
    return;
  }

  empty.textContent = '';
  wrap.style.display = 'block';

  const headers = ['ID', 'Название', 'Цена, ₽', 'На складе', 'Категория'];
  const tableRows = rows.map((p) => [
    escapeHtml(p?.id ?? ''),
    escapeHtml(p?.name ?? ''),
    escapeHtml(p?.price ?? ''),
    escapeHtml(p?.inStock ?? p?.stock ?? p?.quantity ?? ''),
    escapeHtml(p?.category ?? ''),
  ]);
  setTable(tbl, headers, tableRows);
}

async function loadProductsPanel() {
  const empty = $('prodEmpty');
  empty.textContent = 'Загрузка…';
  $('prodWrap').style.display = 'none';
  $('classmateOut').style.display = 'none';

  const r = await callApi('GET', '/api/classmate/products');
  $('classmateOut').style.display = 'block';
  setPre('classmateOut', r);

  if (!r.ok) {
    empty.textContent = (r.json && (r.json.error || r.json.message)) || 'Ошибка загрузки';
    return;
  }

  const list = Array.isArray(r.json?.data) ? r.json.data : [];
  renderProductsTable(list);
}

async function addProduct() {
  const name = $('prodName').value.trim();
  const description = $('prodDesc').value.trim();
  const price = Number($('prodPrice').value);
  const inStock = Number($('prodStock').value);
  const category = $('prodCategory').value.trim();

  const el = $('prodAddMsg');
  el.style.display = 'block';

  if (!name || !description || !category || Number.isNaN(price) || Number.isNaN(inStock)) {
    el.textContent = 'Заполните все поля; цена и остаток — числа.';
    return;
  }

  const payload = { name, description, price, category, inStock };
  const r = await callApi('POST', '/api/classmate/products', payload);
  $('classmateOut').style.display = 'block';
  setPre('classmateOut', r);

  if (!r.ok) {
    el.textContent =
      (r.json && (r.json.error || (r.json.detail != null ? String(r.json.detail) : null))) || 'Ошибка';
    return;
  }

  const inner = r.json?.data ?? r.json;
  el.textContent =
    (inner && inner.message) ||
    (inner && inner.productId != null ? `Создан товар id=${inner.productId}` : 'Готово');
  loadProductsPanel();
}

function wire() {
  document.querySelectorAll('.nav-btn').forEach((b) => {
    b.addEventListener('click', () => {
      const id = b.getAttribute('data-panel');
      pickPanel(id);
      if (id === 'p-classmate') loadProductsPanel();
      if (id === 'p-catalog') pickCatalogTab(catalogTab);
      if (id === 'p-orders') refreshOrders();
    });
  });

  document.querySelectorAll('.catalog-sub-btn').forEach((b) => {
    b.addEventListener('click', () => pickCatalogTab(b.getAttribute('data-catalog')));
  });

  $('btnPrefillOrder').addEventListener('click', prefillOrder);
  $('btnOpenOrders').addEventListener('click', () => {
    pickPanel('p-orders');
    refreshOrders();
  });
  $('btnCreateOrder').addEventListener('click', () => createOrder());

  $('btnRefreshFlowers').addEventListener('click', () => loadFlowers());
  $('btnRefreshPackaging').addEventListener('click', () => loadPackaging());
  $('btnAddFlower').addEventListener('click', () => addFlower());
  $('btnSetFlowerStock').addEventListener('click', () => setFlowerStock());
  $('btnAddPackaging').addEventListener('click', () => addPackaging());

  $('tblCatalogFlowers').addEventListener('click', (e) => {
    const t = e.target;
    const id = t && t.getAttribute ? t.getAttribute('data-del-flower') : null;
    if (id) deleteFlower(id);
  });
  $('tblCatalogPackaging').addEventListener('click', (e) => {
    const t = e.target;
    const id = t && t.getAttribute ? t.getAttribute('data-del-packaging') : null;
    if (id) deletePackaging(id);
  });

  $('btnRefreshOrders').addEventListener('click', () => refreshOrders());

  $('btnRefreshProducts').addEventListener('click', () => loadProductsPanel());
  $('btnAddProduct').addEventListener('click', () => addProduct());

  $('packagingEnabled').addEventListener('change', () => {
    $('orderPackagingId').disabled = !$('packagingEnabled').checked;
  });
  $('deliveryEnabled').addEventListener('change', () => {
    $('addressBlock').style.display = $('deliveryEnabled').checked ? '' : 'none';
  });

  initOrderData().then(() => {
    $('orderPackagingId').disabled = !$('packagingEnabled').checked;
    $('addressBlock').style.display = $('deliveryEnabled').checked ? '' : 'none';
    prefillOrder();
  });

  setPre('orderOut', '');
  setPre('catalogOut', '');
  setPre('ordersOut', '');
  setPre('classmateOut', '');
}

wire();

