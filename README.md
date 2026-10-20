# 成為教師之路

SDG 4《成為教師之路》是一場關於教師決策處境的互動式數位策展。展覽聚焦在：行為反覆出現時，教師如何持續協調與調整支持。

網站以匿名化情境呈現教師回看變化、對齊角色、調整支持與持續追蹤的工作線索。情境來自單一敘述，公開前仍需完成當事人權益檢視及教育工作者審閱；網站不提供個別教育或輔導指引。

## 本機預覽

需求：Node.js 與 pnpm。

```sh
pnpm install
pnpm dev
```

## 觀展回饋

表單透過 Google Apps Script Web App 寫入 Google 試算表。請依照 [Apps Script 設定說明](docs/apps-script/README.md)，在瀏覽器建立並部署 Apps Script，再把 Web App 網址填入本機 `.env`：

```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/你的部署識別碼/exec
```

`.env` 已列入 Git 忽略清單。GitHub Pages 建置時，請在 repository 的 Actions variables 設定 `VITE_APPS_SCRIPT_URL`。表單只會在收到 Apps Script 寫入成功確認後顯示已記錄。

## 部署狀態

網站尚未部署到 GitHub Pages。部署完成後，請將實際 Pages 網址補在此處。
