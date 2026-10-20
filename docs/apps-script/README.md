# Google 試算表與 Apps Script 設定

這份設定讓靜態網站把不含姓名、電子郵件或校名的觀展回饋寫入 Google 試算表。Apps Script 會在瀏覽器中建立與部署；本專案不使用 Clasp。

## 1. 建立試算表

1. 在 Google 試算表建立一份只供策展團隊管理的工作表。
2. 從網址複製試算表 ID。ID 是 `/d/` 和 `/edit` 之間的字串。
3. 不要把試算表設為公開，也不要把試算表網址填進網站。

## 2. 在 Apps Script 建立 Web App

1. 前往 [script.google.com](https://script.google.com/) 建立新專案。
2. 將預設 `Code.gs` 內容替換成同資料夾的 [`Code.gs`](Code.gs)。
3. 在 Apps Script 左側按「＋」新增 HTML 檔案，檔名輸入 `Feedback`，再貼上 [`Feedback.html`](Feedback.html) 的內容。
4. 在 `Code.gs` 的 `SPREADSHEET_ID` 填入剛才複製的試算表 ID。
5. 在編輯器選取 `setupFeedbackSheet` 並按「執行」。第一次執行時，依畫面授權 Apps Script 存取該試算表。這會建立「觀展回饋」工作表與欄位標題。
6. 按「部署」→「新增部署」→ 類型選「網頁應用程式」。執行身分選「我」，存取權限選「所有人」，然後部署。
7. 複製以 `/exec` 結尾的 Web App 網址。網站需要由部署者身分寫入試算表；請妥善保管工作表存取權限。

## 3. 連接本機網站

在專案根目錄建立未納入 Git 的 `.env` 檔案：

```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/你的部署識別碼/exec
```

重啟 `pnpm dev`。回饋表單連線成功後才會啟用送出按鈕；Apps Script 寫入試算表後才回報已記錄。逾時時畫面會提示先檢查試算表，避免重複送出。

## 4. 連接 GitHub Pages

在 GitHub repository 的 **Settings → Secrets and variables → Actions → Variables** 新增 repository variable：

- Name：`VITE_APPS_SCRIPT_URL`
- Value：Apps Script 的 `/exec` 網址

Pages workflow 會在建置時讀取這個公開 Web App URL。這不是試算表憑證；不要把試算表 ID、服務帳戶金鑰或其他秘密資料放入前端環境變數。

## 回饋欄位與資料處理

工作表只接收送出時間、理解程度（1–3）、觀察線索與選填短句。程式會限制回覆長度並處理可能被試算表視為公式的開頭字元。表單不要求姓名或電子郵件，也提醒參觀者不要填入可識別資訊。策展團隊仍需自行訂定資料檢視、保存期限與刪除方式。

更新 Apps Script 程式後，請在「部署 → 管理部署」編輯現有部署並選取新版本，網站才會使用更新後的程式。
