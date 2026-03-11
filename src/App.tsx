import { useState, useEffect, useCallback, useRef } from "react";

type Level = "初級" | "中級";
type QuizType = "穴埋め" | "構文" | "state" | "概念" | "まるばつ" | "4択" | "2択";
interface Riddle {
  level: Level;
  type: QuizType;
  q: string;
  a: string;
  hint: string;
  choices?: string[];
}

const RIDDLES: Riddle[] = [
  // ===== 初級 概念理解 まるばつ =====
  { level:"初級", type:"まるばつ", q:"TerraformはHashiCorpが開発したIaCツールである", a:"〇", hint:"2014年にHashiCorpがリリースしたオープンソースツール" },
  { level:"初級", type:"まるばつ", q:"TerraformはAWSにしか対応していない", a:"✗", hint:"AWS・GCP・Azure・Kubernetes など多数のプロバイダーに対応" },
  { level:"初級", type:"まるばつ", q:"Terraformは「あるべき状態」を宣言するツールである", a:"〇", hint:"手順を書くのではなく最終状態を定義する宣言的アプローチ" },
  { level:"初級", type:"まるばつ", q:"IaCとはインフラをコードで管理する考え方である", a:"〇", hint:"Infrastructure as Codeの略。再現性・自動化が利点" },
  { level:"初級", type:"まるばつ", q:"Terraformはインフラの変更手順を命令的に記述するツールである", a:"✗", hint:"Terraformは宣言的。手順ではなく最終状態を記述する" },
  { level:"初級", type:"まるばつ", q:"TerraformはGUIで操作するツールである", a:"✗", hint:"CLIツール。コマンドラインで操作する" },
  { level:"初級", type:"まるばつ", q:"Terraformを使うと同じ構成のインフラを何度でも再現できる", a:"〇", hint:"冪等性がIaCの大きなメリット" },
  // ===== 初級 概念理解 4択 =====
  { level:"初級", type:"4択", q:"Terraformとは何か？", a:"B", hint:"HashiCorpが開発したオープンソースのIaCツール", choices:["A: AWSが提供するデプロイツール","B: インフラをコードで管理するIaCツール","C: コンテナを管理するオーケストレーションツール","D: CI/CDパイプラインツール"] },
  { level:"初級", type:"4択", q:"IaC（Infrastructure as Code）の主なメリットはどれ？", a:"C", hint:"コードとして管理することで再現性・自動化・バージョン管理が可能になる", choices:["A: 手動作業が増える","B: クラウドコストが下がる","C: インフラの再現性・自動化が向上する","D: セキュリティが自動で強化される"] },
  { level:"初級", type:"4択", q:"Terraformが「宣言的」と言われる理由は？", a:"A", hint:"「どうやって作るか」ではなく「何を作るか」を記述する", choices:["A: 最終状態を定義するだけでよいから","B: コマンドを順番に実行するから","C: GUIで操作できるから","D: スクリプトを自動生成するから"] },
  { level:"初級", type:"4択", q:"Terraformが対応しているクラウドはどれ？", a:"D", hint:"プロバイダーを通じて多数のクラウドに対応している", choices:["A: AWSのみ","B: AWSとGCPのみ","C: AWSとAzureのみ","D: AWS・GCP・Azureなど多数"] },
  { level:"初級", type:"4択", q:"Terraformでインフラを管理するメリットとして最も適切なのは？", a:"B", hint:"コードなのでGitで差分・履歴が管理できる", choices:["A: インフラが自動的にスケールする","B: インフラの変更履歴をGitで管理できる","C: クラウドの料金が自動で最適化される","D: セキュリティ脆弱性を自動修正できる"] },
  { level:"初級", type:"4択", q:"Terraformのプロバイダーとは何か？", a:"C", hint:"AWSやGCPなど各クラウドのAPIと通信するプラグイン", choices:["A: インフラのコスト計算ツール","B: stateを保存するサービス","C: クラウドのAPIと通信するプラグイン","D: モジュールを配布するサービス"] },
  { level:"初級", type:"4択", q:"Terraformのモジュールとは何か？", a:"A", hint:"DRYを実現するための再利用可能なコードのまとまり", choices:["A: 再利用可能なTerraformコードのまとまり","B: stateファイルの別名","C: プロバイダーの設定ファイル","D: クラウドのリソースグループ"] },
  { level:"初級", type:"4択", q:"Terraformのstateファイルの主な役割は？", a:"B", hint:"このファイルとコードの差分からplanが計算される", choices:["A: プロバイダーのバージョンを固定する","B: 現在のインフラ状態を記録してコードとの差分計算に使う","C: 変数の値を保存する","D: モジュールの依存関係を管理する"] },
  { level:"初級", type:"4択", q:"冪等性（べき等性）とは何か？", a:"C", hint:"Terraformが目指す性質で、何度applyしても同じ状態になる", choices:["A: 実行速度が一定であること","B: コストが変わらないこと","C: 何度実行しても同じ結果になること","D: エラーが発生しないこと"] },

  // ===== 初級 まるばつ (25問) =====
  { level:"初級", type:"まるばつ", q:"terraform plan を実行するとインフラが変更される", a:"✗", hint:"planは差分確認のみ。実際の変更はapplyで行う" },
  { level:"初級", type:"まるばつ", q:"terraform destroy を実行すると .tf ファイルも削除される", a:"✗", hint:"destroyはインフラリソースを削除するだけ。ファイルは消えない" },
  { level:"初級", type:"まるばつ", q:"terraform fmt はコードの動作を変更することがある", a:"✗", hint:"fmtはあくまで見た目の整形のみ。ロジックは変わらない" },
  { level:"初級", type:"まるばつ", q:"terraform.tfvars というファイルは自動的に読み込まれる", a:"〇", hint:"このファイル名は特別扱いされ自動ロードされる" },
  { level:"初級", type:"まるばつ", q:"terraform init は毎回プロバイダーを再ダウンロードする", a:"✗", hint:"キャッシュがあれば再ダウンロードしない" },
  { level:"初級", type:"まるばつ", q:"outputブロックはモジュール間で値を受け渡すために使える", a:"〇", hint:"親モジュールがoutputを参照することで値を受け取れる" },
  { level:"初級", type:"まるばつ", q:"terraform validate は実際にクラウドへ接続して検証する", a:"✗", hint:"validateはローカルの構文チェックのみ。クラウド接続は不要" },
  { level:"初級", type:"まるばつ", q:"stateファイルにはリソースの現在状態が記録される", a:"〇", hint:"terraform.tfstate にインフラの状態が保存される" },
  { level:"初級", type:"まるばつ", q:"terraform apply を実行すると自動的に plan も実行される", a:"〇", hint:"applyは内部でplanを実行してから確認を求める" },
  { level:"初級", type:"まるばつ", q:"variableブロックにはdefault値を必ず指定しなければならない", a:"✗", hint:"defaultなしの変数は実行時に入力を求められる" },
  { level:"初級", type:"まるばつ", q:"Terraformの設定ファイルの拡張子は .tf である", a:"〇", hint:"main.tf や variables.tf など" },
  { level:"初級", type:"まるばつ", q:"dataブロックは新しいリソースを作成するために使う", a:"✗", hint:"dataブロックは既存リソースの情報を参照するためのもの" },
  { level:"初級", type:"まるばつ", q:"terraform state list でstateに記録されたリソース一覧を確認できる", a:"〇", hint:"管理下にあるリソースのアドレスが表示される" },
  { level:"初級", type:"まるばつ", q:"1つのTerraformディレクトリには1つのstateしか持てない", a:"〇", hint:"workspaceで切り替えは可能だが基本は1つ" },
  { level:"初級", type:"まるばつ", q:"terraform refresh はインフラを変更するコマンドである", a:"✗", hint:"refreshはstateを実際のクラウドに合わせて更新するだけ" },
  { level:"初級", type:"まるばつ", q:"stateファイルをGitリポジトリに含めることが推奨されている", a:"✗", hint:"stateには機密情報が含まれる可能性があるためGit管理は非推奨" },
  { level:"初級", type:"まるばつ", q:"moduleブロックのsourceキーは必須である", a:"〇", hint:"source = \"./modules/vpc\" のように必ず指定する" },
  { level:"初級", type:"まるばつ", q:"count = 0 と指定するとリソースは作成されない", a:"〇", hint:"countが0のリソースは存在しないものとして扱われる" },
  { level:"初級", type:"まるばつ", q:"terraform import を使うと既存リソースを .tf ファイルに自動生成できる", a:"✗", hint:"importはstateに取り込むだけ。tfコードは自分で書く必要がある" },
  { level:"初級", type:"まるばつ", q:".terraform.lock.hcl はGitにコミットすることが推奨される", a:"〇", hint:"チームでプロバイダーバージョンを固定するため" },
  { level:"初級", type:"まるばつ", q:"terraform plan の -out オプションでplan結果をファイルに保存できる", a:"〇", hint:"-out=tfplan のように使い、後でapplyに渡せる" },
  { level:"初級", type:"まるばつ", q:"remote backendを使うとstateをチームで共有できる", a:"〇", hint:"S3やGCSなどに保存することでチーム全員が同じstateを参照できる" },
  { level:"初級", type:"まるばつ", q:"terraform workspace はデフォルトで「default」という名前で作成される", a:"〇", hint:"terraform workspace show で確認できる" },
  { level:"初級", type:"まるばつ", q:"resourceブロックで定義した名前はクラウド上のリソース名に直接使われる", a:"✗", hint:"Terraform内部の識別子。クラウド上の名前はnameタグなどで別途指定する" },
  { level:"初級", type:"まるばつ", q:"terraform fmt は再帰的にサブディレクトリも整形する", a:"✗", hint:"-recursive オプションを付けると再帰的に整形できる" },

  // ===== 初級 4択 (25問) =====
  { level:"初級", type:"4択", q:"terraform init が主に行うことはどれ？", a:"B", hint:"バックエンド初期化とプロバイダープラグインの取得を行う", choices:["A: インフラの作成","B: プロバイダーのダウンロード","C: 差分の確認","D: リソースの削除"] },
  { level:"初級", type:"4択", q:"variableブロックで定義した変数を参照するときの書き方は？", a:"C", hint:"var というプレフィックスを使う", choices:["A: variable.変数名","B: input.変数名","C: var.変数名","D: param.変数名"] },
  { level:"初級", type:"4択", q:"terraform planで「~」が表示されたリソースはどうなる？", a:"A", hint:"既存リソースの属性が更新されることを示す", choices:["A: 変更される","B: 削除される","C: 新規作成される","D: 何もしない"] },
  { level:"初級", type:"4択", q:"Terraformのコードで使われる設定言語はどれ？", a:"D", hint:"HashiCorpが開発した独自言語", choices:["A: YAML","B: JSON","C: TOML","D: HCL"] },
  { level:"初級", type:"4択", q:"terraform.tfstate ファイルの役割は？", a:"B", hint:"Terraformはこのファイルを見て差分を計算する", choices:["A: 変数の定義","B: インフラの現在状態を記録","C: プロバイダーの設定","D: モジュールの管理"] },
  { level:"初級", type:"4択", q:"ローカル変数を参照するときのプレフィックスはどれ？", a:"C", hint:"localsブロックで定義した変数を参照する", choices:["A: var.","B: self.","C: local.","D: locals."] },
  { level:"初級", type:"4択", q:"既存のクラウドリソースをTerraform管理下に取り込むコマンドは？", a:"A", hint:"手動で作ったリソースをTF管理下に移行できる", choices:["A: terraform import","B: terraform init","C: terraform refresh","D: terraform state pull"] },
  { level:"初級", type:"4択", q:"データソースを参照するためのブロックはどれ？", a:"D", hint:"既存リソースの情報を読み取るためのブロック", choices:["A: resource","B: variable","C: output","D: data"] },
  { level:"初級", type:"4択", q:"同じリソースを複数作るための引数はどれ？", a:"B", hint:"count = 3 で3つ同じリソースを作れる", choices:["A: repeat","B: count","C: loop","D: each"] },
  { level:"初級", type:"4択", q:"変数の値を外部ファイルで定義するときの拡張子は？", a:"C", hint:"terraform.tfvars が自動読み込みされる", choices:["A: .tfconfig","B: .env","C: .tfvars","D: .hclvars"] },
  { level:"初級", type:"4択", q:"terraform applyで変更を適用する前に入力する確認文字列は？", a:"A", hint:"「yes」と入力しないと適用されない", choices:["A: yes","B: ok","C: apply","D: confirm"] },
  { level:"初級", type:"4択", q:"stateのバックエンドとしてよく使われるAWSのサービスはどれ？", a:"B", hint:"bucket名とキーを指定して設定する", choices:["A: RDS","B: S3","C: EC2","D: SQS"] },
  { level:"初級", type:"4択", q:"Terraformのプロバイダーを公開・配布しているサービスはどれ？", a:"D", hint:"registry.terraform.io でアクセスできる", choices:["A: HashiCorp Hub","B: Provider Store","C: TF Market","D: Terraform Registry"] },
  { level:"初級", type:"4択", q:"terraform planで「+」が表示されたリソースはどうなる？", a:"C", hint:"新しいリソースが作成されることを示す", choices:["A: 削除される","B: 変更される","C: 新規作成される","D: 何もしない"] },
  { level:"初級", type:"4択", q:"Terraformで環境（dev/stg/prod）を切り替える仕組みはどれ？", a:"A", hint:"terraform workspace new dev のように使う", choices:["A: workspace","B: environment","C: stage","D: namespace"] },
  { level:"初級", type:"4択", q:"プロバイダーのバージョン情報を固定するロックファイルはどれ？", a:"B", hint:"Gitにコミットすることが推奨される", choices:["A: .terraform.config","B: .terraform.lock.hcl","C: terraform.lock","D: .provider.lock"] },
  { level:"初級", type:"4択", q:"terraform state rm の動作として正しいのはどれ？", a:"D", hint:"stateから除外するだけで実際のリソースは残る", choices:["A: クラウドのリソースを削除する","B: stateファイルを削除する","C: resourceブロックを削除する","D: stateからリソースを除外する"] },
  { level:"初級", type:"4択", q:"outputブロックの主な用途はどれ？", a:"C", hint:"モジュール間の値受け渡しにも使う", choices:["A: 変数を定義する","B: リソースを作成する","C: 値を外部に出力する","D: データを取得する"] },
  { level:"初級", type:"4択", q:"terraform fmt が行うことはどれ？", a:"A", hint:"インデントやスペースを自動整形してくれる", choices:["A: コードの整形","B: 構文チェック","C: 差分確認","D: プロバイダーの更新"] },
  { level:"初級", type:"4択", q:"stateとクラウドの実態がズレた状態を何と呼ぶ？", a:"B", hint:"terraform refreshで検出できる", choices:["A: conflict","B: drift","C: mismatch","D: delta"] },
  { level:"初級", type:"4択", q:"terraform validate が行うことはどれ？", a:"D", hint:"applyする前に文法ミスを検出できる", choices:["A: インフラへの接続確認","B: stateの整合性チェック","C: プロバイダーの検証","D: 設定ファイルの構文チェック"] },
  { level:"初級", type:"4択", q:"チームでstateを安全に共有する方法はどれ？", a:"A", hint:"ローカルに置くと競合が起きるため推奨されない", choices:["A: remote backendを使う","B: GitにコミットするD: DropBoxに保存する","C: ローカルに保存する","D: メールで共有する"] },
  { level:"初級", type:"4択", q:"moduleブロックで必ず指定しなければならないキーはどれ？", a:"C", hint:"モジュールの場所を指定する", choices:["A: name","B: version","C: source","D: provider"] },
  { level:"初級", type:"4択", q:"terraform init -upgrade が行うことはどれ？", a:"B", hint:"ロックファイルも更新される", choices:["A: stateをリセットする","B: プロバイダーを最新版にアップグレードする","C: ワークスペースを切り替える","D: バックエンドを初期化する"] },
  { level:"初級", type:"4択", q:"terraform state mv の用途はどれ？", a:"D", hint:"リソースのリネームや別stateへの移動に使う", choices:["A: リソースを削除する","B: stateファイルを移動する","C: バックエンドを変更する","D: stateのリソース名を変更する"] },

  // ===== 中級 概念理解 まるばつ =====
  { level:"中級", type:"まるばつ", q:"TerraformはAnsibleと同じくサーバー内部の設定管理が得意なツールである", a:"✗", hint:"Terraformはインフラのプロビジョニングが得意。設定管理はAnsibleなどが担う" },
  { level:"中級", type:"まるばつ", q:"Terraformの冪等性とは、同じコードを何度applyしても同じ状態になることを指す", a:"〇", hint:"差分がなければapplyしても何も変わらない" },
  { level:"中級", type:"まるばつ", q:"Terraform CloudはHashiCorpが提供するTerraform専用のSaaSプラットフォームである", a:"〇", hint:"stateの管理・ロック・CI/CDなどが統合されている" },
  { level:"中級", type:"まるばつ", q:"Terraformのworkspaceを使えば完全に独立した本番環境と開発環境を安全に分離できる", a:"✗", hint:"workspaceはstateを分けるだけ。環境分離にはディレクトリ分割なども検討が必要" },
  { level:"中級", type:"まるばつ", q:"terraform destroyの前にterraform planで削除対象を確認することができる", a:"〇", hint:"terraform plan -destroy で削除対象のリソースを事前確認できる" },
  // ===== 中級 概念理解 4択 =====
  { level:"中級", type:"4択", q:"TerraformとAnsibleの主な違いとして最も適切なのは？", a:"B", hint:"Terraformはインフラ構築、Ansibleはサーバー設定管理が得意", choices:["A: TerraformはAWS専用でAnsibleはGCP専用","B: Terraformはインフラ構築、Ansibleは設定管理が得意","C: TerraformはGUIツールでAnsibleはCLIツール","D: TerraformはDockerのみ対応"] },
  { level:"中級", type:"4択", q:"Terraform Cloudの主なメリットはどれ？", a:"C", hint:"stateの管理・ロック・リモート実行が統合されたSaaS", choices:["A: プロバイダーを無料で使える","B: クラウド費用が削減される","C: stateの管理・ロック・リモート実行が統合されている","D: Terraformのコードを自動生成してくれる"] },
  { level:"中級", type:"4択", q:"「インフラのドリフト」とはどういう状態か？", a:"A", hint:"terraform refreshやplanで検出できる", choices:["A: stateとクラウドの実際のリソース状態がズレている状態","B: コードにバグがある状態","C: stateファイルが破損した状態","D: プロバイダーのバージョンが古い状態"] },
  { level:"中級", type:"4択", q:"Terraformでenv（環境）を分ける方法として最も安全なのはどれ？", a:"D", hint:"workspaceはstateを分けるだけで設定を分けにくい", choices:["A: 同一ディレクトリで変数を変える","B: workspace だけで分ける","C: .tfvars のみで管理する","D: 環境ごとにディレクトリを分けてstateも分ける"] },
  { level:"中級", type:"4択", q:"terraform plan -destroy を実行すると何が起きる？", a:"B", hint:"-destroy オプションで削除対象を事前確認できる", choices:["A: リソースが削除される","B: 削除対象のリソースが確認できる（実際には削除しない）","C: stateが初期化される","D: バックエンドが切り替わる"] },

  // ===== 中級 穴埋め =====
  { level:"中級", type:"穴埋め", q:"terraform ___ で特定リソースのみをターゲットにしてapplyする", a:"-target", hint:"-target=aws_instance.example のように指定" },
  { level:"中級", type:"穴埋め", q:"terraform apply ___ で変数を上書きする", a:"-var", hint:"-var=\"key=value\" の形式" },
  { level:"中級", type:"穴埋め", q:"terraform apply ___ でtfvarsファイルを指定する", a:"-var-file", hint:"-var-file=prod.tfvars のように使う" },
  { level:"中級", type:"穴埋め", q:"terraform workspace ___ で新しいワークスペースを作る", a:"new", hint:"new + ワークスペース名" },
  { level:"中級", type:"穴埋め", q:"terraform workspace ___ でワークスペースを切り替える", a:"select", hint:"select + ワークスペース名" },
  { level:"中級", type:"穴埋め", q:"terraform init ___ でバックエンドをデータ移行しながら再初期化する", a:"-migrate-state", hint:"バックエンド設定変更後に実行する" },
  { level:"中級", type:"穴埋め", q:"terraform ___ でグラフ形式のリソース依存関係を出力する", a:"graph", hint:"Graphvizと組み合わせて可視化できる" },
  { level:"中級", type:"穴埋め", q:"terraform ___ でstateに直接データを書き込む", a:"state push", hint:"state pullの逆操作" },
  // ===== 中級 構文 =====
  { level:"中級", type:"構文", q:"マップを使って複数リソースを作るための引数は？", a:"for_each", hint:"countより柔軟に複数リソースを制御できる" },
  { level:"中級", type:"構文", q:"リソースのライフサイクルを制御するブロックは？", a:"lifecycle", hint:"create_before_destroy などを設定できる" },
  { level:"中級", type:"構文", q:"リソース間の依存関係を明示的に指定する引数は？", a:"depends_on", hint:"暗黙的な参照では解決できない依存に使う" },
  { level:"中級", type:"構文", q:"計算済みのローカル値を定義するブロックは？", a:"locals", hint:"local.名前 で参照する" },
  { level:"中級", type:"構文", q:"count使用時、何番目かを示す組み込みインデックスは？", a:"count.index", hint:"0から始まる連番" },
  { level:"中級", type:"構文", q:"for_each使用時、現在のキーを参照するには？", a:"each.key", hint:"each.value でバリューも取得できる" },
  { level:"中級", type:"構文", q:"リソースを削除する前に新しいリソースを作るlifecycle設定は？", a:"create_before_destroy", hint:"ダウンタイムを防ぐために使う" },
  { level:"中級", type:"構文", q:"Terraformが変更しようとしても無視する属性を指定するlifecycle設定は？", a:"ignore_changes", hint:"外部で変更される属性に対して使う" },
  // ===== 中級 state =====
  { level:"中級", type:"state", q:"別のstateの出力値を参照するためのデータソースは？", a:"terraform_remote_state", hint:"data.terraform_remote_state.vpc.outputs.id のように使う" },
  { level:"中級", type:"state", q:"AWSバックエンドでstateロックに使われるAWSサービスは？", a:"DynamoDB", hint:"LockIDをキーにしたテーブルを使う" },
  { level:"中級", type:"state", q:"stateを環境やコンポーネントごとに分割して管理する手法は？", a:"state分割", hint:"モノリシックなstateを避けることでリスクを分散できる" },
  // ===== 中級 概念 =====
  { level:"中級", type:"概念", q:"プロバイダーのバージョン制約で「1.x系のみ許可」と書く記号は？", a:"~>", hint:"~> 1.0 のように使う（pessimistic constraint）" },
  { level:"中級", type:"概念", q:"Terraformで機密情報を扱うときに推奨される変数の設定は？", a:"sensitive = true", hint:"ログやplan出力に値が表示されなくなる" },
  { level:"中級", type:"概念", q:"ローカルマシン上でコマンドを実行するプロビジョナーは？", a:"local-exec", hint:"null_resourceやterraform_dataと組み合わせて使う" },
  { level:"中級", type:"概念", q:"モジュールを呼び出す際に必ず指定しなければならないキーは？", a:"source", hint:"source = \"./modules/vpc\" のように指定" },
  // ===== 中級 まるばつ =====
  { level:"中級", type:"まるばつ", q:"countとfor_eachは同じリソースブロックで同時に使える", a:"✗", hint:"countとfor_eachは排他的。どちらか一方しか使えない" },
  { level:"中級", type:"まるばつ", q:"outputブロックはmoduleの外から値を受け取るために使う", a:"✗", hint:"outputはモジュールの値を外に渡すため。受け取りはvariable" },
  { level:"中級", type:"まるばつ", q:"ignore_changesにallを指定するとすべての属性変更を無視できる", a:"〇", hint:"lifecycle { ignore_changes = all } と書く" },
  { level:"中級", type:"まるばつ", q:"terraform_remote_stateはdata sourceとして参照する", a:"〇", hint:"data.terraform_remote_state.名前.outputs.キー で参照できる" },
  { level:"中級", type:"まるばつ", q:"sensitiveな変数はterraform planの出力に値が表示される", a:"✗", hint:"sensitive = true にするとマスキングされて表示されない" },
  // ===== 中級 4択 =====
  { level:"中級", type:"4択", q:"for_eachで現在の値を参照するには？", a:"B", hint:"keyはeach.key、valueはeach.value", choices:["A: each.value のみ","B: each.key / each.value","C: count.index","D: self.value"] },
  { level:"中級", type:"4択", q:"stateロックにDynamoDBを使うとき、テーブルのキー名は？", a:"C", hint:"Terraformが固定で使うキー名", choices:["A: StateID","B: TerraformLock","C: LockID","D: ResourceKey"] },
  { level:"中級", type:"4択", q:"別stateのoutput値を参照するために使うdata sourceは？", a:"A", hint:"data.terraform_remote_state.名前.outputs.キー の形式で使う", choices:["A: terraform_remote_state","B: remote_output","C: state_output","D: backend_data"] },
  // ===== 中級 2択 =====
  { level:"中級", type:"2択", q:"複数のリソースをキーで管理したいとき適切なのはどちら？\nA: count\nB: for_each", a:"B", hint:"countはインデックスだがfor_eachはキーで管理できる", choices:["A","B"] },
  { level:"中級", type:"2択", q:"create_before_destroyの主な目的はどちら？\nA: コストの削減\nB: ダウンタイムの防止", a:"B", hint:"新リソースを先に作ってから旧リソースを削除する", choices:["A","B"] },
];

const VARIANTS: Record<string, string[]> = {
  "init":["terraform init"], "plan":["terraform plan"], "apply":["terraform apply"],
  "destroy":["terraform destroy"], "fmt":["terraform fmt"], "validate":["terraform validate"],
  "refresh":["terraform refresh"], "import":["terraform import"], "providers":["terraform providers"],
  "version":["terraform version"], "graph":["terraform graph"],
  "list":["terraform state list"], "show":["terraform state show"],
  "rm":["terraform state rm","remove"], "mv":["terraform state mv","move"],
  "state pull":["terraform state pull"], "state push":["terraform state push"],
  "-auto-approve":["auto-approve","--auto-approve"],
  "-upgrade":["upgrade","--upgrade"], "-out":["out","--out"],
  "-target":["target","--target"], "-var":["var","--var"],
  "-var-file":["var-file","--var-file"], "-migrate-state":["migrate-state","--migrate-state"],
  "new":["terraform workspace new"], "select":["terraform workspace select"],
  "remote backend":["リモートバックエンド","remotebackend"],
  "state lock":["statelock","ステートロック"],
  "tfstate":[".tfstate","terraform.tfstate"],
  "HCL":["hcl","HashiCorp Configuration Language"],
  ".tf":["tf"], ".tfvars":["tfvars"],
  ".terraform.lock.hcl":["terraform.lock.hcl","lock.hcl"],
  "Terraform Registry":["terraform registry","registry"],
  "sensitive = true":["sensitive"],
  "state分割":["stateの分割","state split"],
  "追加":["作成","create","add"], "削除":["delete","remove"], "変更":["update","modify"],
  "drift":["ドリフト"],
  "〇":["o","○","まる","yes","true"],
  "✗":["x","×","ばつ","no","false"],
  "A":["a"], "B":["b"], "C":["c"], "D":["d"],
};

const TYPE_CONFIG: Record<string, { emoji: string; color: string[] }> = {
  "穴埋め":  { emoji:"🔲", color:["#4FACFE","#00F2FE"] },
  "構文":    { emoji:"📝", color:["#A18CD1","#FBC2EB"] },
  "state":   { emoji:"💾", color:["#F7971E","#FFD200"] },
  "概念":    { emoji:"💡", color:["#f953c6","#b91d73"] },
  "まるばつ":{ emoji:"⭕", color:["#43E97B","#38F9D7"] },
  "2択":     { emoji:"🔀", color:["#FF6B9D","#FFB347"] },
  "4択":     { emoji:"🎯", color:["#667eea","#764ba2"] },
};

const LEVEL_COLOR: Record<string, string> = { "初級":"#43E97B", "中級":"#FFB347" };
const TOTAL_SEC = 3 * 60;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function fmt(s: number): string {
  return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
}
function normalize(s: string): string {
  return s.trim().toLowerCase()
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (c: string) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
    .replace(/[\u30A1-\u30F6]/g, (c: string) => String.fromCharCode(c.charCodeAt(0) - 0x60))
    .replace(/\s+/g, " ").trim();
}
function judge(input: string, correct: string): boolean {
  const i = normalize(input), c = normalize(correct);
  if (i === c) return true;
  const variants = (VARIANTS as Record<string, string[]>)[correct] || [];
  return variants.some((v: string) => normalize(v) === i);
}

export default function App() {
  const [filterLevel, setFilterLevel] = useState<string>("全部");
  const [deck, setDeck] = useState<Riddle[]>(() => shuffle(RIDDLES));
  const [idx, setIdx] = useState<number>(0);
  const [phase, setPhase] = useState<string>("idle");
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_SEC);
  const [correct, setCorrect] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<"correct"|"wrong"|null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cur = deck[idx % deck.length];
  const cfg = TYPE_CONFIG[cur.type];
  const [c1, c2] = cfg.color;
  const pct = timeLeft / TOTAL_SEC;
  const timerColor = timeLeft > 90 ? "#43E97B" : timeLeft > 30 ? "#FFB347" : "#FF6B9D";
  const R = 28, CIRC = 2 * Math.PI * R;

  useEffect(() => {
    if (phase !== "running") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current ?? undefined); setPhase("finished"); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current ?? undefined);
  }, [phase]);

  const start = () => {
    const filtered = filterLevel === "全部" ? RIDDLES : RIDDLES.filter(r => r.level === filterLevel);
    setDeck(shuffle(filtered));
    setPhase("running"); setTimeLeft(TOTAL_SEC);
    setIdx(0); setInput(""); setResult(null);
    setCorrect(0); setTotal(0);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const submitAnswer = useCallback((ans: string) => {
    if (!ans.trim()) return;
    const ok = judge(ans, cur.a);
    setInput(ans);
    setResult(ok ? "correct" : "wrong");
    setTotal(t => t + 1);
    if (ok) setCorrect(c => c + 1);
  }, [cur]);

  const submit = useCallback(() => {
    submitAnswer(input);
  }, [input, submitAnswer]);

  const next = useCallback(() => {
    setIdx(i => i + 1); setInput(""); setResult(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const resultRef = useRef<"correct"|"wrong"|null>(null);
  useEffect(() => { resultRef.current = result; }, [result]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      if (resultRef.current === null) submit(); else next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [submit, next]);

  const getAnswerLabel = (a: string) => {
    if (a === "〇") return "〇（正しい）";
    if (a === "✗") return "✗（誤り）";
    return a;
  };

  const getPlaceholder = () => {
    if (cur.type === "まるばつ") return "〇 または ✗ を入力（o / x でも可）";
    if (cur.type === "4択") return "A / B / C / D を入力";
    if (cur.type === "2択") return "A または B を入力";
    return "答えを入力…";
  };

  const scoreMsg = correct >= 15 ? "Terraform マスター🔥" : correct >= 8 ? "なかなかやりますね💪" : "もっと練習だ😊";

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0F2027,#203A43,#2C5364)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI',monospace", padding:"20px", boxSizing:"border-box" }}>
      <div style={{ textAlign:"center", marginBottom:14 }}>
        <div style={{ fontSize:34 }}>🏗️</div>
        <h1 style={{ fontSize:18, fontWeight:900, margin:"4px 0 2px", background:"linear-gradient(90deg,#4FACFE,#A18CD1,#43E97B,#FFB347)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Terraform クイズ</h1>
        <p style={{ fontSize:11, color:"#6B8899", margin:0 }}>初級：まるばつ・4択　中級：全形式　3分タイマー制</p>
        <p id="question-count" style={{ fontSize:10, color:"#4FACFE", margin:"2px 0 0" }}>全{RIDDLES.length}問（初級{RIDDLES.filter(r=>r.level==="初級").length}・中級{RIDDLES.filter(r=>r.level==="中級").length}）</p>
      </div>

      {phase !== "idle" && (
        <div style={{ position:"relative", width:68, height:68, marginBottom:10 }}>
          <svg width="68" height="68" style={{ transform:"rotate(-90deg)" }}>
            <circle cx="34" cy="34" r={R} fill="none" stroke="#1a3344" strokeWidth="6"/>
            <circle cx="34" cy="34" r={R} fill="none" stroke={timerColor} strokeWidth="6"
              strokeDasharray={CIRC} strokeDashoffset={CIRC*(1-pct)} strokeLinecap="round"
              style={{ transition:"stroke-dashoffset 1s linear,stroke 0.5s" }}/>
          </svg>
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:14, fontWeight:900, color:timerColor, lineHeight:1 }}>{fmt(timeLeft)}</span>
            <span style={{ fontSize:9, color:"#6B8899" }}>残り</span>
          </div>
        </div>
      )}

      {phase === "running" && (
        <div style={{ display:"flex", gap:16, marginBottom:10, background:"#162533", borderRadius:50, padding:"6px 20px", fontSize:13 }}>
          <span style={{ color:"#ccc" }}>✅ <strong style={{ color:"#43E97B" }}>{correct}</strong> 正解</span>
          <span style={{ color:"#2a4a5a" }}>|</span>
          <span style={{ color:"#ccc" }}>❌ <strong style={{ color:"#FF6B9D" }}>{total-correct}</strong> 不正解</span>
          <span style={{ color:"#2a4a5a" }}>|</span>
          <span style={{ color:"#ccc" }}>📝 <strong style={{ color:"#fff" }}>{total}</strong> 問</span>
        </div>
      )}

      <div style={{ width:"100%", maxWidth:460, background:"#162533", borderRadius:24, boxShadow:"0 8px 40px rgba(0,0,0,0.4)", overflow:"hidden" }}>
        <div style={{ background:`linear-gradient(90deg,${c1},${c2})`, height:5 }}/>
        <div style={{ padding:"20px 22px 18px" }}>

          {phase === "idle" && (
            <div style={{ textAlign:"center", padding:"14px 0" }}>
              <div style={{ fontSize:46, marginBottom:8 }}>⏱️</div>
              <p style={{ color:"#E0EAF0", fontSize:15, fontWeight:700 }}>3分間チャレンジ！</p>
              <p style={{ color:"#6B8899", fontSize:12, marginTop:4, marginBottom:14 }}>レベルを選んでスタート</p>
              <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:14 }}>
                {["全部","初級","中級"].map(lv => (
                  <button key={lv} onClick={() => setFilterLevel(lv)} style={{ padding:"6px 18px", borderRadius:20, border:"none", fontWeight:700, fontSize:13, cursor:"pointer", background: filterLevel===lv ? (lv==="初級"?"#43E97B":lv==="中級"?"#FFB347":"#4FACFE") : "#1e3a4a", color: filterLevel===lv?"#fff":"#6B8899" }}>{lv}</button>
                ))}
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5, justifyContent:"center", marginBottom:12 }}>
              </div>
              <div style={{ background:"#0F1E2A", borderRadius:12, padding:"10px 14px", fontSize:11, color:"#6B8899", textAlign:"left", lineHeight:1.8 }}>
                <div>🟢 <strong style={{ color:"#43E97B" }}>初級</strong>：まるばつ・4択のみ（入力不要）</div>
                <div>🟡 <strong style={{ color:"#FFB347" }}>中級</strong>：穴埋め・構文・state・概念・まるばつ・2択・4択</div>
              </div>
            </div>
          )}

          {phase === "running" && (
            <>
              <div style={{ marginBottom:10, display:"flex", gap:6, alignItems:"center" }}>
                <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:LEVEL_COLOR[cur.level]+"33", color:LEVEL_COLOR[cur.level], border:`1px solid ${LEVEL_COLOR[cur.level]}55` }}>{cur.level}</span>
              </div>
              <div style={{ background:"#0F1E2A", borderRadius:14, padding:"14px 16px", marginBottom:12, fontSize:15, fontWeight:700, color:"#E0EAF0", lineHeight:1.8, borderLeft:`4px solid ${c1}`, whiteSpace:"pre-wrap", fontFamily:"'Segoe UI',sans-serif" }}>
                {cur.q}
              </div>

              {result === null && (cur.type === "4択" || cur.type === "2択") && cur.choices && (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {cur.choices.map((choice, i) => {
                    const key = ["A","B","C","D"][i];
                    return (
                      <button key={key} onClick={() => submitAnswer(key)}
                        style={{ padding:"10px 16px", borderRadius:12, border:`2px solid ${c1}44`, background:"#0F1E2A", color:"#E0EAF0", fontWeight:700, fontSize:13, cursor:"pointer", textAlign:"left", fontFamily:"'Segoe UI',sans-serif", transition:"background 0.15s" }}
                        onMouseEnter={e => (e.currentTarget.style.background="#1a3a4a")}
                        onMouseLeave={e => (e.currentTarget.style.background="#0F1E2A")}>
                        <span style={{ color:c1, fontFamily:"monospace", marginRight:8 }}>{key}.</span>{choice.replace(/^[A-D]: /,"")}
                      </button>
                    );
                  })}
                </div>
              )}

              {result === null && cur.type === "まるばつ" && (
                <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                  {["〇","✗"].map(ch => (
                    <button key={ch} onClick={() => submitAnswer(ch)}
                      style={{ flex:1, padding:"14px", borderRadius:12, border:`2px solid ${ch==="〇"?"#43E97B44":"#FF6B9D44"}`, background:"#0F1E2A", color: ch==="〇"?"#43E97B":"#FF6B9D", fontWeight:900, fontSize:26, cursor:"pointer", transition:"background 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.background="#1a3a4a")}
                      onMouseLeave={e => (e.currentTarget.style.background="#0F1E2A")}>
                      {ch}
                    </button>
                  ))}
                </div>
              )}

              {result === null && cur.type !== "4択" && cur.type !== "2択" && cur.type !== "まるばつ" && (
                <div style={{ display:"flex", gap:8 }}>
                  <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                    placeholder={getPlaceholder()}
                    style={{ flex:1, padding:"10px 14px", borderRadius:12, border:`2px solid ${c1}55`, outline:"none", fontSize:13, fontWeight:700, color:"#E0EAF0", background:"#0F1E2A", fontFamily:"monospace" }}/>
                  <button onClick={submit} style={{ padding:"10px 18px", borderRadius:12, border:"none", background:`linear-gradient(90deg,${c1},${c2})`, color:"#fff", fontWeight:800, fontSize:14, cursor:"pointer" }}>送信</button>
                </div>
              )}

              {result === "correct" && (
                <div style={{ background:"#0A2A1A", borderRadius:14, padding:"12px 16px", border:"2px solid #43E97B" }}>
                  <div style={{ fontSize:18, fontWeight:900, color:"#43E97B" }}>⭕ 正解！</div>
                  <div style={{ fontSize:13, color:"#A0BFC0", marginTop:4 }}>答え：<strong style={{ color:"#fff", fontFamily:"monospace" }}>{getAnswerLabel(cur.a)}</strong></div>
                  {cur.hint && <div style={{ fontSize:12, color:"#6B8899", marginTop:6 }}>💡 {cur.hint}</div>}
                </div>
              )}
              {result === "wrong" && (
                <div style={{ background:"#2A0A1A", borderRadius:14, padding:"12px 16px", border:"2px solid #FF6B9D" }}>
                  <div style={{ fontSize:18, fontWeight:900, color:"#FF6B9D" }}>❌ 不正解…</div>
                  <div style={{ fontSize:13, color:"#A0BFC0", marginTop:4 }}>あなたの答え：<strong style={{ color:"#FF6B9D", fontFamily:"monospace" }}>{input}</strong></div>
                  <div style={{ fontSize:13, color:"#A0BFC0", marginTop:2 }}>正解は：<strong style={{ color:"#FFB347", fontFamily:"monospace" }}>{getAnswerLabel(cur.a)}</strong></div>
                  {cur.hint && <div style={{ fontSize:12, color:"#6B8899", marginTop:6 }}>💡 {cur.hint}</div>}
                </div>
              )}
            </>
          )}

          {phase === "finished" && (
            <div style={{ textAlign:"center", padding:"14px 0" }}>
              <div style={{ fontSize:48 }}>🎉</div>
              <p style={{ fontSize:15, fontWeight:900, color:"#4FACFE", margin:"6px 0 10px" }}>タイムアップ！</p>
              <div style={{ background:"linear-gradient(135deg,#0F2A1A,#1A2A0F)", borderRadius:16, padding:"14px", marginBottom:10, border:"1px solid #2a4a3a" }}>
                <div style={{ display:"flex", justifyContent:"space-around" }}>
                  <div><div style={{ fontSize:11, color:"#6B8899" }}>正解</div><div style={{ fontSize:38, fontWeight:900, color:"#43E97B" }}>{correct}</div></div>
                  <div style={{ fontSize:28, color:"#2a4a5a", alignSelf:"center" }}>/</div>
                  <div><div style={{ fontSize:11, color:"#6B8899" }}>挑戦</div><div style={{ fontSize:38, fontWeight:900, color:"#E0EAF0" }}>{total}</div></div>
                  <div style={{ fontSize:28, color:"#2a4a5a", alignSelf:"center" }}>=</div>
                  <div><div style={{ fontSize:11, color:"#6B8899" }}>正答率</div><div style={{ fontSize:38, fontWeight:900, color:"#4FACFE" }}>{total>0?Math.round(correct/total*100):0}<span style={{ fontSize:14 }}>%</span></div></div>
                </div>
              </div>
              <p style={{ color:"#6B8899", fontSize:12 }}>{scoreMsg}</p>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop:16 }}>
        {phase==="idle" && <button onClick={start} style={{ padding:"12px 44px", borderRadius:50, border:"none", background:"linear-gradient(135deg,#4FACFE,#00F2FE)", color:"#fff", fontWeight:900, fontSize:15, cursor:"pointer", boxShadow:"0 4px 18px rgba(79,172,254,0.4)" }}>▶ スタート！</button>}
        {phase==="running" && result!==null && <button onClick={next} style={{ padding:"12px 44px", borderRadius:50, border:"none", background:`linear-gradient(135deg,${c1},${c2})`, color:"#fff", fontWeight:900, fontSize:15, cursor:"pointer" }}>次の問題 → (Enter)</button>}
        {phase==="finished" && <button onClick={start} style={{ padding:"12px 44px", borderRadius:50, border:"none", background:"linear-gradient(135deg,#FF6B9D,#FFB347)", color:"#fff", fontWeight:900, fontSize:15, cursor:"pointer" }}>🔁 もう一度！</button>}
      </div>
      {phase==="running" && result===null && <p style={{ color:"#2a4a5a", fontSize:10, marginTop:10 }}>Enterキーでも送信できます</p>}
    </div>
  );
}
