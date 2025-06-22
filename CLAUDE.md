# ルール

- コメント、ログ、受け答えは日本語で記述
- タスクは`manage/tasks/{name}.txt`に記述される
  - 完了したら`manage/tasks-done/{yyyy-mm-dd}/`に移動
    - `{name}.concerns.txt`にやり残したことや、懸念事項を記述して残す
    - 少しでも気になったところはそのままにしない
    - やりのこしがあればコード中にもTODOコメントを記載
- ドキュメントも応答も、「です」「ます」を付けない。関係に記述
- 外部ドキュメントの情報は適切に参照し、`manage/external-docs/{対象パッケージ名など}/{わかりやすい名前}.txt`に追記する
  - 基本的にひとつのファイルに集める
  - また、 @manage/external-docs/index.txt にまとめて参照すべきファイルの情報を追記する。このとき、 `@` による参照は利用しない
  - 参照するときはgrepやrgを利用し、周辺の情報を部分的に参照せよ。
- 特定の作業中に、ルールに則っていないものが見付かれば、同時にリファクタリングを適切に行う
- タスクを依頼されたときは、まずその内容を分析し、そのままの順番でやるのではなく、適切に再構成してTODOリストを作成して進める
- npm run typecheck / npm run lint-fix で必ず最後に確認する
- eslint ignoreをなるべく利用しない。どうしても必要ならかならず `/* eslint-ignore-next-line @foo/bar -- ... */` のように必ず理由をコメントで書くこと。
  - なるべくファイル単位のignoreを利用し、かつそのファイルを小さく分離してignoreする領域を小さくすること。
  - ignoreやanyを利用する対象は必ず `_unsafe_/` というのが間に入るようなディレクトリ配下に入れること。
- Promiseを握り潰さない。 .catchもなるべく利用しない。
  - webならuseMutationを検討せよ。loadingのステートの明示的なハンドリングをせよ。
  - それでも難しければ `consumerPromise(Promise<T>)` のような関数をutil等として作成し、.catch+console.warnなどで処理せよ

# TypeScript

- Effect.tsのベストプラクティスに則り開発せよ
- 関数型の手法を全面的に利用
- 参照等価性、テスタビリティ、構造化、レイヤリングを意識
- イミュータブルな方法を取る。`readonly`を付ける。`ReadonlyArray<...>`を利用する。
  - effectの`Data.struct`や`Schema`なども活用
- interfaceを利用しない。type objectを利用
- asをとにかく利用しない。
  - type guardの利用を検討する
  - const isSomething = () => ...のような関数を作る
- anyをとにかく利用しない

