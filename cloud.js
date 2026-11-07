/* cloud.js – prihlásenie a synchronizácia progresu cez Supabase (rovnaký projekt ako Project management, vlastná tabuľka). */
'use strict';
const CLOUD = { url: 'https://whdrarypezuptwdjdcdp.supabase.co', key: 'sb_publishable_YfBi-d7c4xwtVjZ1uNswLw_u3RNj01a', table: 'de_docs' };
const CL = { sb: null, user: null, busy: false, again: false, timer: null, last: null, lastSeen: '', err: '', noTable: false };
window.CL = CL;
const CL_SQL = `-- Nemčina – tabuľka pre progres (spusti raz v Supabase → SQL Editor)
create table if not exists public.de_docs (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  key text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);
alter table public.de_docs enable row level security;
drop policy if exists "de_docs own select" on public.de_docs;
drop policy if exists "de_docs own insert" on public.de_docs;
drop policy if exists "de_docs own update" on public.de_docs;
drop policy if exists "de_docs own delete" on public.de_docs;
create policy "de_docs own select" on public.de_docs for select to authenticated using (auth.uid() = user_id);
create policy "de_docs own insert" on public.de_docs for insert to authenticated with check (auth.uid() = user_id);
create policy "de_docs own update" on public.de_docs for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "de_docs own delete" on public.de_docs for delete to authenticated using (auth.uid() = user_id);
grant select, insert, update, delete on public.de_docs to authenticated;
revoke all on public.de_docs from anon;`;

function clLib() { return new Promise((res, rej) => { if (window.supabase?.createClient) return res(); const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js'; s.onload = () => res(); s.onerror = () => rej(new Error('Nepodarilo sa načítať cloud knižnicu (offline?)')); document.head.appendChild(s); }); }
function clErr(e) { const m = e?.message || String(e); if (/de_docs|relation|schema cache|PGRST205|42P01/i.test(m)) { CL.noTable = true; return 'Tabuľka v cloude ešte neexistuje – spusti jednorazové SQL (tlačidlo nižšie).'; } return m; }
function clRefresh() { const c = $('#cloudcard'); if (c) c.innerHTML = cloudCard(); const l = $('#cloudline'); if (l) l.innerHTML = cloudLine(); }

async function cloudInit() {
  if (!/^https?:/.test(location.protocol)) return;
  try { await clLib(); } catch (e) { CL.err = e.message; clRefresh(); return; }
  CL.sb = supabase.createClient(CLOUD.url, CLOUD.key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: 'nemcina-auth' } });
  const { data: { session } } = await CL.sb.auth.getSession(); CL.user = session?.user || null;
  CL.sb.auth.onAuthStateChange((ev, s) => {
    const was = CL.user?.id; CL.user = s?.user || null;
    if (ev === 'SIGNED_IN' && CL.user && was !== CL.user.id) cloudPull();
    if (ev === 'PASSWORD_RECOVERY') setTimeout(newPassModal, 300);
    clRefresh();
  });
  clRefresh(); if (CL.user) await cloudPull();
}
window.cloudToken = async () => { if (!CL.sb) return null; const { data: { session } } = await CL.sb.auth.getSession(); return session?.access_token || null; };

/* newest wins: cloud vs. this browser */
async function cloudPull(force) {
  if (!CL.user) return; CL.busy = true; CL.err = ''; clRefresh();
  try {
    const { data, error } = await CL.sb.from(CLOUD.table).select('data,updated_at').eq('key', 'state').maybeSingle();
    if (error) throw error; CL.noTable = false;
    if (!data) { CL.busy = false; await cloudPush(); toast('Progres nahraný do cloudu ☁'); return; }
    CL.lastSeen = data.updated_at;
    const remote = data.data;
    if (force === 'down' || !S.updated || (remote.updated || '') > S.updated) { replaceState(remote); toast('Progres načítaný z cloudu ☁'); }
    else if ((remote.updated || '') < S.updated) { CL.busy = false; await cloudPush(); return; }
    CL.last = new Date();
  } catch (e) { CL.err = clErr(e); }
  CL.busy = false; clRefresh();
}
async function cloudPush() {
  if (!CL.user || !CL.sb) return; if (CL.busy) { CL.again = true; return; }
  CL.busy = true; CL.err = '';
  try {
    const now = new Date().toISOString();
    const { error } = await CL.sb.from(CLOUD.table).upsert({ user_id: CL.user.id, key: 'state', data: S, updated_at: now }, { onConflict: 'user_id,key' });
    if (error) throw error;
    CL.lastSeen = now; CL.last = new Date(); CL.noTable = false;
  } catch (e) { CL.err = clErr(e); }
  CL.busy = false; clRefresh();
  if (CL.again) { CL.again = false; cloudQueue(); }
}
window.cloudQueue = () => { if (!CL.user) return; clearTimeout(CL.timer); CL.timer = setTimeout(() => { CL.timer = null; cloudPush(); }, 2000); };
async function cloudCheck() {
  if (!CL.user || CL.busy || CL.timer) return;
  try { const { data, error } = await CL.sb.from(CLOUD.table).select('updated_at').eq('key', 'state').maybeSingle(); if (error) throw error; if (data?.updated_at && data.updated_at > CL.lastSeen) await cloudPull(); }
  catch (e) { CL.err = clErr(e); clRefresh(); }
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') cloudCheck(); else if (CL.timer) { clearTimeout(CL.timer); CL.timer = null; cloudPush(); } });
setInterval(() => { if (document.visibilityState === 'visible') cloudCheck(); }, 60000);

window.cloudLine = () => {
  if (!CL.user) return /^https?:/.test(location.protocol) ? '<a href="#/settings" style="color:var(--mut)">☁ Prihlásiť sa (sync + AI)</a>' : '';
  return CL.err ? '<span style="color:var(--red)">☁ problém so synchronizáciou</span>' : `☁ ${esc(CL.user.email)}${CL.busy || CL.timer ? ' · ukladám…' : ''}`;
};
window.cloudCard = () => {
  if (!/^https?:/.test(location.protocol)) return `<h3>☁ Účet a cloud</h3><p class="mut small">Prihlásenie funguje na online verzii (Vercel) alebo cez <code>npm run dev</code>.</p>`;
  const u = CL.user;
  const state = !CL.sb ? (CL.err || 'Pripájam…') : !u ? 'Nie si prihlásený – progres je len v tomto prehliadači. Na Verceli je prihlásenie potrebné aj pre AI.' : CL.err ? `<span style="color:var(--red)">● ${esc(CL.err)}</span>` : `<span style="color:var(--green)">●</span> Prihlásený ako <b>${esc(u.email)}</b>${CL.busy ? ' · synchronizujem…' : CL.last ? ' · synchronizované ' + CL.last.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' }) : ''}`;
  return `<h3>☁ Účet a cloud</h3><p class="mut small">Rovnaký účet ako v aplikácii Project management (ten istý Supabase projekt). Progres sa ukladá do tvojej vlastnej tabuľky, vidíš ho len ty.</p>
  <p class="small">${state}</p>
  ${!u ? `<div class="field"><input id="clEmail" type="email" placeholder="E-mail" autocomplete="username"></div><div class="field"><input id="clPass" type="password" placeholder="Heslo" autocomplete="current-password"></div>
    <div class="row wrap"><button class="btn pri sm" data-act="cl-in">Prihlásiť</button><button class="btn sm" data-act="cl-up">Vytvoriť účet</button><button class="btn sm ghost" data-act="cl-forgot">Zabudnuté heslo</button></div>`
  : `<div class="row wrap"><button class="btn sm" data-act="cl-sync">↻ Synchronizovať</button><button class="btn sm" data-act="cl-down" title="Nahradiť progres v tomto prehliadači verziou z cloudu">⬇ Stiahnuť z cloudu</button><button class="btn sm danger" data-act="cl-out">Odhlásiť</button></div>`}
  <div class="row" style="margin-top:10px"><button class="btn sm ghost" data-act="cl-setup">${CL.noTable ? '⚠️ ' : ''}Jednorazové nastavenie (SQL)</button></div>`;
};
function newPassModal() { modal(`<h3>Nové heslo</h3><div class="field"><input id="clNew" type="password" placeholder="Nové heslo (min. 6 znakov)"></div><div class="row" style="justify-content:flex-end"><button class="btn" data-act="close-modal">Zrušiť</button><button class="btn pri" data-act="cl-newpass">Uložiť</button></div>`); }

const prevTalk = window.talkAction;
window.talkAction = async (a, b, e) => {
  const email = () => $('#clEmail')?.value.trim(), pass = () => $('#clPass')?.value;
  try {
    switch (a) {
      case 'cl-in': { const { error } = await CL.sb.auth.signInWithPassword({ email: email(), password: pass() }); if (error) throw error; toast('Prihlásený ✓'); break; }
      case 'cl-up': { const { error } = await CL.sb.auth.signUp({ email: email(), password: pass(), options: { emailRedirectTo: location.origin } }); if (error) throw error; toast('Skontroluj e-mail a potvrď účet', 5000); break; }
      case 'cl-forgot': { if (!email()) return toast('Najprv zadaj e-mail'); const { error } = await CL.sb.auth.resetPasswordForEmail(email(), { redirectTo: location.origin }); if (error) throw error; toast('Poslal som e-mail na zmenu hesla'); break; }
      case 'cl-newpass': { const { error } = await CL.sb.auth.updateUser({ password: $('#clNew').value }); if (error) throw error; closeModal(); toast('Heslo zmenené ✓'); break; }
      case 'cl-out': await CL.sb.auth.signOut(); CL.user = null; clRefresh(); break;
      case 'cl-sync': await cloudPull(); break;
      case 'cl-down': await cloudPull('down'); break;
      case 'cl-setup': modal(`<h3>☁ Jednorazové nastavenie v Supabase</h3>
        <p><b>1.</b> Supabase → projekt (ten istý ako Project management) → <b>SQL Editor</b> → <b>New query</b> → vlož a <b>Run</b>:</p>
        <textarea class="sql" rows="10" readonly>${esc(CL_SQL)}</textarea><div class="row" style="margin:6px 0 12px"><button class="btn sm" data-act="cl-copy">Kopírovať SQL</button></div>
        <p><b>2.</b> Authentication → URL Configuration → do <b>Redirect URLs</b> pridaj <code>${esc(location.origin)}</code> (aby fungovali odkazy z e-mailov).</p>
        <p><b>3.</b> Prihlás sa rovnakým e-mailom a heslom ako v Project management.</p>
        <div class="row" style="justify-content:flex-end"><button class="btn pri" data-act="close-modal">OK</button></div>`); break;
      case 'cl-copy': await navigator.clipboard.writeText(CL_SQL); toast('SQL skopírované'); break;
      default: prevTalk?.(a, b, e);
    }
  } catch (err) { toast(err.message || String(err), 4500); }
};
cloudInit();
