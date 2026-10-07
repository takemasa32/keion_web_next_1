# 開発・変更の手順

このリポジトリでは [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow) を採用します。`main` を変更の統合先とし、作業ごとに短命のブランチを作ります。開発は基本的にWSL上で行います。

## 1. 最新のmainから作業を始める

未コミットの変更がある場合は、先に内容を確認し、必要に応じてコミットするか別の作業ツリーで作業してください。

```bash
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c feat/update-events
```

ブランチ名には変更内容が分かる名前を付けます。Codexは既定で `codex/` を使用します。通常の開発では `feat/`・`fix/`・`docs/` も使用できます。関連のない変更は別のブランチ・PRに分けてください。

`develop`・`release`・`hotfix` を長期ブランチとして新設しません。既存の `develop` は当面、過去の履歴を保持するために残します。新しい作業の起点やPRの統合先には使用しません。緊急の修正も、最新の `main` から作業ブランチを作り、`main` 向けのPRで対応します。

## 2. 変更して検証する

```bash
npm ci
npm test
npx tsc --noEmit
npm run lint
npm run build
```

Node.jsのバージョンはCIとデプロイ環境の設定に合わせます。画面を変更した場合は、PCとスマートフォンの幅で主要な操作も確認してください。DBは追加せず、イベント・出演バンド・FAQなどをリポジトリ内のファイルから読み込む設計を維持します。基本構成・既存コンテンツ・イースターエッグも維持してください。

一時的な画像や検証用ファイルはコミット・pushしません。スクリーンショットをPRに載せる場合は、GitHubの添付機能を使用します。

## 3. main向けのPRを作成する

必要なファイルだけをステージし、変更内容が分かるメッセージでコミットします。

```bash
git add path/to/changed-file
git commit -m "Update event information"
git push -u origin HEAD
gh pr create --base main --title "イベント情報を更新" --body-file /tmp/pr-body.md
```

PR本文には解決する問題、変更後の挙動、検証結果、未確認事項を記載します。画面変更にはスクリーンショットを添えると確認しやすくなります。作業中の変更はDraft PRとして共有できます。

日本語の本文はWSL内でUTF-8のファイルとして作成し、`--body-file` で送信します。Windows PowerShellのhere-stringやパイプを `gh --body-file -` に渡さないでください。Windowsから送信する必要がある場合の手順は [AGENTS.md](AGENTS.md) に従います。

共有する日本語文書を新規作成・大幅修正した場合は、最終化前に `gemini-document-review` スキルで一度校閲し、妥当な指摘だけを反映します。外部送信できない機密文書は対象外です。

## 4. チェック・レビューを確認してマージする

PRの必須チェックが成功していることとレビュー結果を確認し、必要な修正を同じ作業ブランチへ追加します。競合がある場合は最新の `origin/main` を取り込み、解消後に検証をやり直します。`main` への直接pushやforce pushは通常の運用にしません。

チェックが失敗している場合は、原因と影響を確認し、必須チェックの失敗を解消してからマージします。ローカル検証の成功とホスティング側の検証結果は区別して記載してください。マージはGitHubのPR画面またはGitHub CLIから行い、リポジトリに設定された保護ルールに従います。

### リポジトリの保護設定

`main` はPR経由の変更とレビューコメントの解決を必須とし、管理者にも保護設定を適用します。force pushとブランチ削除は許可しません。個人リポジトリでの自己PRを扱えるよう、必須承認人数は0人です。承認人数の設定にかかわらず、差分と検証結果はマージ前に確認してください。

`PR base` チェックはPRの統合先が `main` であることを検証します。Vercelのチェックは、既存のNode.js 20.x設定による停止があるため必須チェックにはしていません。ローカルのビルド成功とVercelの結果は区別して扱います。

## 5. 完了したブランチを整理する

リモートの作業ブランチはPRのマージ後に自動削除されます。ローカルの作業ブランチも整理することを推奨します。

```bash
git switch main
git pull --ff-only origin main
git fetch --prune origin
git branch -d feat/update-events
```

削除前にマージ済みであることを確認します。Squashなどで `git branch -d` が拒否された場合は、PRのマージ状態とブランチの差分を確認してください。確認せずに強制削除しないでください。
