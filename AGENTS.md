# 開発方針

## 環境とサイト設計

- 開発環境は基本的にWSLを使用する。
- DBは用意せず、イベント・出演バンド・FAQなどをリポジトリ内のファイルから読み込む設計を維持する。
- 基本構成・既存コンテンツ・イースターエッグを維持し、デザインや挙動を改善する。
- 一時的な画像や検証用ファイルはリポジトリにコミット・pushしない。
- 個人的なメモなどをObsidianに記述する際は、Obsidian側のディレクトリに存在するAGENTS.mdを参照する。

## GitHub Flow

[GitHub Flowの公式説明](https://docs.github.com/en/get-started/using-github/github-flow)に沿って、最新の `main` 起点の短命な作業ブランチ → `main` 向けPR → チェック・レビュー確認 → マージの順に進める。

- Codexが作成するブランチは既定で `codex/` を使用する。一般の作業ブランチには `feat/`・`fix/`・`docs/` も使用できる。
- `main` への直接pushやforce pushを通常の運用にしない。
- `develop`・`release`・`hotfix` を長期ブランチとして新設しない。
- 既存の `develop` は当面、過去の履歴を保持するために残す。新しい作業の起点やPRの統合先には使用しない。
- 緊急の修正も `main` 起点の作業ブランチから `main` 向けPRで対応する。
- マージ後の作業ブランチは削除を推奨する。削除前にマージ状態を確認する。
- 具体的なコマンドと検証手順は [CONTRIBUTING.md](CONTRIBUTING.md) を参照する。

## GitHubに日本語本文を送信する場合

- GitHubへ日本語本文を送る処理はWSL内でUTF-8のまま完結させる。Windows PowerShellのhere-stringやパイプを `gh --body-file -` へ渡さない。
- Windows側から送信する必要がある場合は、本文をUTF-8でBase64化し、WSL内で復号したJSONを `gh api --input -` へ渡す。
- 送信後はAPIで再取得し、先頭BOMと `???` がないことを確認する。

## 日本語文書の校閲

日本語の共有用文書を新規作成・大幅修正した際は、最終化前に `gemini-document-review` スキルで語法を一度確認し、指摘の妥当性をCodexが判断する。機密情報を外部送信できない文書には使用しない。
