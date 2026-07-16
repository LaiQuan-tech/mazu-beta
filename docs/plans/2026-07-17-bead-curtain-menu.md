# 垂珠選單 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 將 beta 的垂珠選單整合進原官網，同時保留既有 Supabase 後台與使用者流程，並部署為獨立 Vercel 專案。

**Architecture:** 新增可重用的 `BeadCurtainMenu` 元件，將原有導覽區段和 callback 作為 props 傳入。`App.tsx` 繼續擁有導覽、登入與 Supabase 狀態，只替換桌面導覽的呈現方式；行動版保留既有可操作的清單。

**Tech Stack:** React 19、TypeScript、Vite、Tailwind CDN、Motion、Vitest、Testing Library、Supabase、Vercel。

---

### Task 1: 建立垂珠選單的測試基礎

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `components/BeadCurtainMenu.test.tsx`

**Step 1: Write the failing test**

新增測試，驗證選單輸出既有的導覽標籤、目前區段可辨識、點擊一個垂珠時以正確 section id 呼叫 callback。

**Step 2: Run test to verify it fails**

Run: `npm test -- --run components/BeadCurtainMenu.test.tsx`

Expected: FAIL，因為元件與測試設定尚未存在。

**Step 3: Write minimal implementation**

安裝 `motion` 與測試依賴，加入最小 Vitest 設定與測試檔。

**Step 4: Run test to verify it passes**

Run: `npm test -- --run components/BeadCurtainMenu.test.tsx`

Expected: PASS。

### Task 2: 實作可及的垂珠選單

**Files:**
- Create: `components/BeadCurtainMenu.tsx`
- Modify: `components/BeadCurtainMenu.test.tsx`

**Step 1: Write the failing test**

補上目前區段的 `aria-current` 與每個選單項的可存取名稱測試。

**Step 2: Run test to verify it fails**

Run: `npm test -- --run components/BeadCurtainMenu.test.tsx`

Expected: FAIL，因為元件尚未支援該語意。

**Step 3: Write minimal implementation**

以 beta 的串珠排列、懸吊效果與點擊互動為基礎實作，加入 `prefers-reduced-motion` 的降級行為。不得變更 Supabase client 或後台元件。

**Step 4: Run test to verify it passes**

Run: `npm test -- --run components/BeadCurtainMenu.test.tsx`

Expected: PASS。

### Task 3: 接回原網站導覽

**Files:**
- Modify: `App.tsx`
- Modify: `components/BeadCurtainMenu.test.tsx`

**Step 1: Write the failing test**

新增整合測試或可測試 helper，驗證垂珠項目 id 與原站 section id 的對應為 `home`、`about`、`deities`、`booking`、`lamps`、`blessing`、`donation`。

**Step 2: Run test to verify it fails**

Run: `npm test -- --run components/BeadCurtainMenu.test.tsx`

Expected: FAIL，因為選單項目仍使用 beta 的舊 section 名稱。

**Step 3: Write minimal implementation**

在 `App.tsx` 導入元件，使用既有 `scrollToSection`；保留經文與會員入口，且行動版漢堡選單不改動。

**Step 4: Run test to verify it passes**

Run: `npm test -- --run components/BeadCurtainMenu.test.tsx`

Expected: PASS。

### Task 4: 驗證與部署

**Files:**
- Modify: `.env.local` (untracked only)

**Step 1: Run automated verification**

Run: `npm test -- --run && npm run build`

Expected: tests and production build pass.

**Step 2: Run local verification**

Run: `npm run dev -- --host 0.0.0.0 --port 3001`

Expected: `http://localhost:3001/` renders the original data-powered site and the new desktop/menu behavior works at desktop and mobile viewports.

**Step 3: Configure deployment secrets**

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` only in the new Vercel project environment. Do not commit access tokens or `.env.local`.

**Step 4: Deploy isolated project**

Create and deploy a new Vercel project named `mazu-beta`, confirm it is not linked to the existing `mazu` Vercel project, and smoke-test the deployment URL.
