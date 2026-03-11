import { useState, useEffect, useCallback, useRef } from "react";

const RIDDLES = [
  // ===== 初級 =====
  // 穴埋め・コマンド（初級）
  {
    level: "初級",
    type: "穴埋め",
    q: "terraform ___ でプロバイダーを初期化する",
    a: "init",
    hint: "一番最初に打つコマンド",
  },
  {
    level: "初級",
    type: "穴埋め",
    q: "terraform ___ で変更の差分を確認する",
    a: "plan",
    hint: "実際には何も変更しない",
  },
  {
    level: "初級",
    type: "穴埋め",
    q: "terraform ___ でインフラに変更を適用する",
    a: "apply",
    hint: "planの次に打つコマンド",
  },
  {
    level: "初級",
    type: "穴埋め",
    q: "terraform ___ でインフラをすべて削除する",
    a: "destroy",
    hint: "本番環境では慎重に！",
  },
  {
    level: "初級",
    type: "穴埋め",
    q: "terraform ___ でコードを整形する",
    a: "fmt",
    hint: "formatの略",
  },
  {
    level: "初級",
    type: "穴埋め",
    q: "terraform ___ で構文チェックする",
    a: "validate",
    hint: "applyの前に確認",
  },
  {
    level: "初級",
    type: "穴埋め",
    q: "terraform ___ で既存リソースを取り込む",
    a: "import",
    hint: "手動で作ったリソースをTF管理下に",
  },
  {
    level: "初級",
    type: "穴埋め",
    q: "terraform ___ でstateの内容を取得して標準出力に出す",
    a: "state pull",
    hint: "バックアップ取得にも使える",
  },
  {
    level: "初級",
    type: "穴埋め",
    q: "terraform state ___ でリソース一覧を見る",
    a: "list",
    hint: "stateに何があるか確認",
  },
  {
    level: "初級",
    type: "穴埋め",
    q: "terraform state ___ でリソースの詳細を見る",
    a: "show",
    hint: "state listで確認したリソース名を引数に渡す",
  },
  {
    level: "初級",
    type: "穴埋め",
    q: "terraform state ___ でリソースをstateから除外する（削除はしない）",
    a: "rm",
    hint: "remove の略",
  },
  {
    level: "初級",
    type: "穴埋め",
    q: "terraform state ___ でリソース名をリネームする",
    a: "mv",
    hint: "move の略",
  },
  {
    level: "初級",
    type: "穴埋め",
    q: "terraform apply ___ で確認プロンプトをスキップする",
    a: "-auto-approve",
    hint: "CI/CDでよく使うオプション",
  },
  {
    level: "初級",
    type: "穴埋め",
    q: "terraform init ___ でプロバイダーを最新にアップグレードする",
    a: "-upgrade",
    hint: "オプションフラグ",
  },
  {
    level: "初級",
    type: "穴埋め",
    q: "terraform plan ___ でplan結果をファイルに保存する",
    a: "-out",
    hint: "-out=tfplan のように使う",
  },
  {
    level: "初級",
    type: "穴埋め",
    q: "terraform ___ でバージョンを確認する",
    a: "version",
    hint: "プロバイダーのバージョンも一緒に表示される",
  },
  {
    level: "初級",
    type: "穴埋め",
    q: "terraform ___ でプロバイダーの情報を表示する",
    a: "providers",
    hint: "どのプロバイダーが使われているか確認できる",
  },
  {
    level: "初級",
    type: "穴埋め",
    q: "terraform ___ で現在のインフラ状態をstateに反映させる",
    a: "refresh",
    hint: "実際のクラウドとstateの乖離を修正する",
  },
  // 構文（初級）
  {
    level: "初級",
    type: "構文",
    q: "AWSのEC2インスタンスを定義するブロックの種類は？",
    a: "resource",
    hint: 'resource "aws_instance" "example" {} のように書く',
  },
  {
    level: "初級",
    type: "構文",
    q: "外部から値を渡すための入力定義ブロックは？",
    a: "variable",
    hint: "var.名前 で参照する",
  },
  {
    level: "初級",
    type: "構文",
    q: "Terraformの実行結果を外部に出力するブロックは？",
    a: "output",
    hint: "モジュール間の値受け渡しにも使う",
  },
  {
    level: "初級",
    type: "構文",
    q: "AWSやGCPなどのAPIと通信する橋渡し役を何と呼ぶ？",
    a: "provider",
    hint: 'provider "aws" {} のように設定する',
  },
  {
    level: "初級",
    type: "構文",
    q: "再利用可能なTerraformコードのまとまりを何と呼ぶ？",
    a: "module",
    hint: "DRYを実現するための仕組み",
  },
  {
    level: "初級",
    type: "構文",
    q: "データソースを参照するためのブロックは？",
    a: "data",
    hint: "data.aws_ami.example のように参照する",
  },
  {
    level: "初級",
    type: "構文",
    q: "使用するプロバイダーや設定を宣言するトップレベルブロックは？",
    a: "terraform",
    hint: "required_providers などを書く場所",
  },
  {
    level: "初級",
    type: "構文",
    q: "同じリソースを複数作るための引数は？",
    a: "count",
    hint: "count = 3 で3つ同じリソースを作れる",
  },
  {
    level: "初級",
    type: "構文",
    q: "Terraformの設定ファイルの拡張子は？",
    a: ".tf",
    hint: "main.tf, variables.tf など",
  },
  {
    level: "初級",
    type: "構文",
    q: "変数の値を外部ファイルで定義するときの拡張子は？",
    a: ".tfvars",
    hint: "terraform.tfvars が自動読み込みされる",
  },
  // state（初級）
  {
    level: "初級",
    type: "state",
    q: "Terraformがインフラの現在状態を記録するファイルの拡張子は？",
    a: "tfstate",
    hint: "terraform.tfstate というファイル名が標準",
  },
  {
    level: "初級",
    type: "state",
    q: "チームでstateを共有するためにS3などに保存する仕組みを何と呼ぶ？",
    a: "remote backend",
    hint: "ローカルに置くと競合が起きる",
  },
  {
    level: "初級",
    type: "state",
    q: "同時に複数人がapplyしないよう排他制御する仕組みは？",
    a: "state lock",
    hint: "DynamoDBやGCS nativeロックなどが使われる",
  },
  {
    level: "初級",
    type: "state",
    q: "stateのバックエンドとしてよく使われるAWSのストレージサービスは？",
    a: "S3",
    hint: "bucket名とキーを指定して設定する",
  },
  // 概念（初級）
  {
    level: "初級",
    type: "概念",
    q: "Terraformが採用している宣言的なコードの考え方を何と言う？",
    a: "Infrastructure as Code",
    hint: "IaC とも略される",
  },
  {
    level: "初級",
    type: "概念",
    q: "Terraformのコードで使われる設定言語の名前は？",
    a: "HCL",
    hint: "HashiCorp Configuration Language の略",
  },
  {
    level: "初級",
    type: "概念",
    q: "terraform applyで変更の実行前に入力を求められる確認文字列は？",
    a: "yes",
    hint: "「yes」と入力しないと適用されない",
  },
  {
    level: "初級",
    type: "概念",
    q: "Terraformで環境（dev/stg/prod）を切り替える仕組みは？",
    a: "workspace",
    hint: "terraform workspace new dev のように使う",
  },
  {
    level: "初級",
    type: "概念",
    q: "Terraformのプロバイダーを公開・配布しているレジストリサービスは？",
    a: "Terraform Registry",
    hint: "registry.terraform.io でアクセスできる",
  },
  {
    level: "初級",
    type: "概念",
    q: "terraform planで表示される「+」記号は何を意味する？",
    a: "追加",
    hint: "新しいリソースが作成されることを示す",
  },
  {
    level: "初級",
    type: "概念",
    q: "terraform planで表示される「-」記号は何を意味する？",
    a: "削除",
    hint: "リソースが破棄されることを示す",
  },
  {
    level: "初級",
    type: "概念",
    q: "terraform planで表示される「~」記号は何を意味する？",
    a: "変更",
    hint: "既存リソースの属性が更新されることを示す",
  },
  {
    level: "初級",
    type: "概念",
    q: "プロバイダーのバージョン情報を固定するために生成されるロックファイルは？",
    a: ".terraform.lock.hcl",
    hint: "Gitにコミットすることが推奨される",
  },
  {
    level: "初級",
    type: "概念",
    q: "Terraformで変数を参照するときのプレフィックスは？",
    a: "var.",
    hint: "var.instance_type のように使う",
  },
  {
    level: "初級",
    type: "概念",
    q: "ローカル変数を参照するときのプレフィックスは？",
    a: "local.",
    hint: "local.common_tags のように使う",
  },
  {
    level: "初級",
    type: "概念",
    q: "stateとクラウドの実態がズレた状態を何と呼ぶ？",
    a: "drift",
    hint: "terraform refreshで検出できる",
  },
  {
    level: "初級",
    type: "概念",
    q: "HashiCorpが提供するTerraformのクラウドサービスは？",
    a: "Terraform Cloud",
    hint: "stateの管理やCI/CDが統合されている",
  },
  {
    level: "初級",
    type: "概念",
    q: "Terraformで同じコードを複数環境に使い回すための仕組みは？",
    a: "モジュール",
    hint: "再利用可能なコードのまとまり",
  },
  {
    level: "初級",
    type: "概念",
    q: "Terraformが管理するリソースの住所のような識別子を何と呼ぶ？",
    a: "リソースアドレス",
    hint: "aws_instance.example のような形式",
  },

  // ===== 中級 =====
  // 穴埋め・コマンド（中級）
  {
    level: "中級",
    type: "穴埋め",
    q: "terraform ___ で特定リソースのみをターゲットにしてapplyする",
    a: "-target",
    hint: "-target=aws_instance.example のように指定",
  },
  {
    level: "中級",
    type: "穴埋め",
    q: "terraform apply ___ で変数を上書きする",
    a: "-var",
    hint: '-var="key=value" の形式',
  },
  {
    level: "中級",
    type: "穴埋め",
    q: "terraform apply ___ でtfvarsファイルを指定する",
    a: "-var-file",
    hint: "-var-file=prod.tfvars のように使う",
  },
  {
    level: "中級",
    type: "穴埋め",
    q: "terraform workspace ___ で新しいワークスペースを作る",
    a: "new",
    hint: "new + ワークスペース名",
  },
  {
    level: "中級",
    type: "穴埋め",
    q: "terraform workspace ___ でワークスペースを切り替える",
    a: "select",
    hint: "select + ワークスペース名",
  },
  {
    level: "中級",
    type: "穴埋め",
    q: "terraform workspace ___ で現在のワークスペースを確認する",
    a: "show",
    hint: "現在いるワークスペース名を表示",
  },
  {
    level: "中級",
    type: "穴埋め",
    q: "terraform init ___ でバックエンドをデータ移行しながら再初期化する",
    a: "-migrate-state",
    hint: "バックエンド設定変更後に実行する",
  },
  {
    level: "中級",
    type: "穴埋め",
    q: "terraform ___ でグラフ形式のリソース依存関係を出力する",
    a: "graph",
    hint: "Graphvizと組み合わせて可視化できる",
  },
  {
    level: "中級",
    type: "穴埋め",
    q: "terraform ___ でoutput値を一覧表示する",
    a: "output",
    hint: "apply後にoutputブロックの値を確認できる",
  },
  {
    level: "中級",
    type: "穴埋め",
    q: "terraform ___ でstateに直接データを書き込む",
    a: "state push",
    hint: "state pullの逆操作",
  },
  // 構文（中級）
  {
    level: "中級",
    type: "構文",
    q: "マップを使って複数リソースを作るための引数は？",
    a: "for_each",
    hint: "countより柔軟に複数リソースを制御できる",
  },
  {
    level: "中級",
    type: "構文",
    q: "リソースのライフサイクルを制御するブロックは？",
    a: "lifecycle",
    hint: "create_before_destroy などを設定できる",
  },
  {
    level: "中級",
    type: "構文",
    q: "リソース間の依存関係を明示的に指定する引数は？",
    a: "depends_on",
    hint: "暗黙的な参照では解決できない依存に使う",
  },
  {
    level: "中級",
    type: "構文",
    q: "他のリソースの値を参照して計算した値を定義するブロックは？",
    a: "locals",
    hint: "local.名前 で参照する",
  },
  {
    level: "中級",
    type: "構文",
    q: "リストや集合をループして新しいコレクションを作る式は？",
    a: "for",
    hint: "[for s in var.list : upper(s)] のように書く",
  },
  {
    level: "中級",
    type: "構文",
    q: "count使用時、何番目かを示す組み込みインデックスは？",
    a: "count.index",
    hint: "0から始まる連番",
  },
  {
    level: "中級",
    type: "構文",
    q: "for_each使用時、現在のキーを参照するには？",
    a: "each.key",
    hint: "each.value でバリューも取得できる",
  },
  {
    level: "中級",
    type: "構文",
    q: "リソースを削除する前に新しいリソースを作るlifecycle設定は？",
    a: "create_before_destroy",
    hint: "ダウンタイムを防ぐために使う",
  },
  {
    level: "中級",
    type: "構文",
    q: "Terraformが変更しようとしても無視する属性を指定するlifecycle設定は？",
    a: "ignore_changes",
    hint: "外部で変更される属性に対して使う",
  },
  {
    level: "中級",
    type: "構文",
    q: "条件によって値を切り替える三項演算子の書き方は？",
    a: "condition ? true_val : false_val",
    hint: 'var.env == "prod" ? "t3.large" : "t3.micro" など',
  },
  // state（中級）
  {
    level: "中級",
    type: "state",
    q: "別のstateの出力値を参照するためのデータソースは？",
    a: "terraform_remote_state",
    hint: "data.terraform_remote_state.vpc.outputs.id のように使う",
  },
  {
    level: "中級",
    type: "state",
    q: "AWSバックエンドでstateロックに使われるAWSサービスは？",
    a: "DynamoDB",
    hint: "LockIDをキーにしたテーブルを使う",
  },
  {
    level: "中級",
    type: "state",
    q: "stateを環境やコンポーネントごとに分割して管理する手法を何と呼ぶ？",
    a: "state分割",
    hint: "モノリシックなstateを避けることでリスクを分散できる",
  },
  // 概念（中級）
  {
    level: "中級",
    type: "概念",
    q: "プロバイダーのバージョン制約で「1.x系のみ許可」と書く記号は？",
    a: "~>",
    hint: "~> 1.0 のように使う（pessimistic constraint）",
  },
  {
    level: "中級",
    type: "概念",
    q: "Terraformで機密情報（パスワードなど）を扱うときに推奨される変数の設定は？",
    a: "sensitive = true",
    hint: "ログやplan出力に値が表示されなくなる",
  },
  {
    level: "中級",
    type: "概念",
    q: "ローカルマシン上でコマンドを実行するプロビジョナーは？",
    a: "local-exec",
    hint: "null_resourceやterraform_dataと組み合わせて使う",
  },
  {
    level: "中級",
    type: "概念",
    q: "Terraformのplan結果をファイルに保存して後からapplyする2ステップ方式の利点は？",
    a: "冪等性の保証",
    hint: "planとapplyの間に差分が発生しない",
  },
  {
    level: "中級",
    type: "概念",
    q: "モジュールを呼び出す際に必ず指定しなければならないキーは？",
    a: "source",
    hint: 'source = "./modules/vpc" のように指定',
  },
  {
    level: "中級",
    type: "概念",
    q: "Terraformでリソースを論理的にグループ化するための推奨ディレクトリ構成単位は？",
    a: "モジュール",
    hint: "environments/とmodules/に分けるパターンが一般的",
  },
  {
    level: "中級",
    type: "概念",
    q: "terraform graphコマンドの出力を可視化するOSSツールは？",
    a: "Graphviz",
    hint: "dot形式のファイルをPNGなどに変換できる",
  },
];

const VARIANTS = {
  init: ["terraform init"],
  plan: ["terraform plan"],
  apply: ["terraform apply"],
  destroy: ["terraform destroy"],
  fmt: ["terraform fmt"],
  validate: ["terraform validate"],
  refresh: ["terraform refresh"],
  import: ["terraform import"],
  providers: ["terraform providers"],
  version: ["terraform version"],
  graph: ["terraform graph"],
  output: ["terraform output"],
  list: ["terraform state list"],
  show: ["terraform state show"],
  rm: ["terraform state rm", "remove"],
  mv: ["terraform state mv", "move"],
  "state pull": ["terraform state pull"],
  "state push": ["terraform state push"],
  "-auto-approve": ["auto-approve", "--auto-approve"],
  "-upgrade": ["upgrade", "--upgrade"],
  "-out": ["out", "--out"],
  "-target": ["target", "--target"],
  "-var": ["var", "--var"],
  "-var-file": ["var-file", "--var-file"],
  "-migrate-state": ["migrate-state", "--migrate-state"],
  new: ["terraform workspace new"],
  select: ["terraform workspace select"],
  "remote backend": ["リモートバックエンド", "remotebackend"],
  "state lock": ["statelock", "ステートロック"],
  tfstate: [".tfstate", "terraform.tfstate"],
  "Infrastructure as Code": ["IaC", "iac", "infrastructure as code"],
  HCL: ["hcl", "HashiCorp Configuration Language"],
  ".tf": ["tf"],
  ".tfvars": ["tfvars"],
  ".terraform.lock.hcl": ["terraform.lock.hcl", "lock.hcl"],
  "Terraform Registry": ["terraform registry", "registry"],
  "Terraform Cloud": ["terraform cloud", "TFC", "tfc"],
  terraform_remote_state: ["remote_state", "terraform remote state"],
  "condition ? true_val : false_val": [
    "三項演算子",
    "condition ? true : false",
  ],
  "sensitive = true": ["sensitive"],
  モジュール: ["module", "モジュール化"],
  追加: ["作成", "create", "add"],
  削除: ["destroy", "delete", "remove"],
  変更: ["update", "modify", "edit"],
  state分割: ["stateの分割", "state split"],
  リソースアドレス: ["resource address"],
  冪等性の保証: ["冪等性", "べき等性"],
  "~>": ["チルダ大なり", "pessimistic constraint"],
};

const TYPE_CONFIG = {
  穴埋め: { emoji: "🔲", color: ["#4FACFE", "#00F2FE"] },
  構文: { emoji: "📝", color: ["#A18CD1", "#FBC2EB"] },
  state: { emoji: "💾", color: ["#F7971E", "#FFD200"] },
  概念: { emoji: "💡", color: ["#f953c6", "#b91d73"] },
};

const LEVEL_COLOR = { 初級: "#43E97B", 中級: "#FFB347" };
const TOTAL_SEC = 3 * 60;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fmt(s) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(
    s % 60
  ).padStart(2, "0")}`;
}

function normalize(s) {
  return s
    .trim()
    .toLowerCase()
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (c) =>
      String.fromCharCode(c.charCodeAt(0) - 0xfee0)
    )
    .replace(/[\u30A1-\u30F6]/g, (c) =>
      String.fromCharCode(c.charCodeAt(0) - 0x60)
    )
    .replace(/\s+/g, " ")
    .trim();
}

function judge(input, correct) {
  const i = normalize(input);
  const c = normalize(correct);
  if (i === c) return true;
  const variants = VARIANTS[correct] || [];
  if (variants.some((v) => normalize(v) === i)) return true;
  return false;
}

export default function App() {
  const [filterLevel, setFilterLevel] = useState("全部");
  const [deck, setDeck] = useState(() => shuffle(RIDDLES));
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState("idle");
  const [timeLeft, setTimeLeft] = useState(TOTAL_SEC);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  const cur = deck[idx % deck.length];
  const cfg = TYPE_CONFIG[cur.type];
  const [c1, c2] = cfg.color;
  const pct = timeLeft / TOTAL_SEC;
  const timerColor =
    timeLeft > 90 ? "#43E97B" : timeLeft > 30 ? "#FFB347" : "#FF6B9D";
  const R = 28,
    CIRC = 2 * Math.PI * R;

  useEffect(() => {
    if (phase !== "running") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setPhase("finished");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const start = () => {
    const filtered =
      filterLevel === "全部"
        ? RIDDLES
        : RIDDLES.filter((r) => r.level === filterLevel);
    setDeck(shuffle(filtered));
    setPhase("running");
    setTimeLeft(TOTAL_SEC);
    setIdx(0);
    setInput("");
    setResult(null);
    setCorrect(0);
    setTotal(0);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const submit = useCallback(() => {
    if (!input.trim()) return;
    const ok = judge(input, cur.a);
    setResult(ok ? "correct" : "wrong");
    setTotal((t) => t + 1);
    if (ok) setCorrect((c) => c + 1);
  }, [input, cur]);

  const next = useCallback(() => {
    setIdx((i) => i + 1);
    setInput("");
    setResult(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const resultRef = useRef(null);
  useEffect(() => {
    resultRef.current = result;
  }, [result]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      if (resultRef.current === null) submit();
      else next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [submit, next]);

  const scoreMsg =
    correct >= 15
      ? "Terraform マスター🔥"
      : correct >= 8
      ? "なかなかやりますね💪"
      : "もっと練習だ😊";

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg,#0F2027 0%,#203A43 50%,#2C5364 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI',monospace",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 34 }}>🏗️</div>
        <h1
          style={{
            fontSize: 18,
            fontWeight: 900,
            margin: "4px 0 2px",
            background:
              "linear-gradient(90deg,#4FACFE,#A18CD1,#43E97B,#FFB347)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Terraform なぞなぞ
        </h1>
        <p style={{ fontSize: 11, color: "#6B8899", margin: 0 }}>
          3分タイマー制 ✨ 全80問（初級50・中級30）
        </p>
      </div>

      {phase !== "idle" && (
        <div
          style={{
            position: "relative",
            width: 68,
            height: 68,
            marginBottom: 10,
          }}
        >
          <svg width="68" height="68" style={{ transform: "rotate(-90deg)" }}>
            <circle
              cx="34"
              cy="34"
              r={R}
              fill="none"
              stroke="#1a3344"
              strokeWidth="6"
            />
            <circle
              cx="34"
              cy="34"
              r={R}
              fill="none"
              stroke={timerColor}
              strokeWidth="6"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - pct)}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 900,
                color: timerColor,
                lineHeight: 1,
              }}
            >
              {fmt(timeLeft)}
            </span>
            <span style={{ fontSize: 9, color: "#6B8899" }}>残り</span>
          </div>
        </div>
      )}

      {phase === "running" && (
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 10,
            background: "#162533",
            borderRadius: 50,
            padding: "6px 20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
            fontSize: 13,
          }}
        >
          <span style={{ color: "#ccc" }}>
            ✅ <strong style={{ color: "#43E97B" }}>{correct}</strong> 正解
          </span>
          <span style={{ color: "#2a4a5a" }}>|</span>
          <span style={{ color: "#ccc" }}>
            ❌ <strong style={{ color: "#FF6B9D" }}>{total - correct}</strong>{" "}
            不正解
          </span>
          <span style={{ color: "#2a4a5a" }}>|</span>
          <span style={{ color: "#ccc" }}>
            📝 <strong style={{ color: "#fff" }}>{total}</strong> 問
          </span>
        </div>
      )}

      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "#162533",
          borderRadius: 24,
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: `linear-gradient(90deg,${c1},${c2})`,
            height: 5,
          }}
        />
        <div style={{ padding: "20px 22px 18px" }}>
          {phase === "idle" && (
            <div style={{ textAlign: "center", padding: "14px 0" }}>
              <div style={{ fontSize: 46, marginBottom: 8 }}>⏱️</div>
              <p style={{ color: "#E0EAF0", fontSize: 15, fontWeight: 700 }}>
                3分間チャレンジ！
              </p>
              <p
                style={{
                  color: "#6B8899",
                  fontSize: 12,
                  marginTop: 4,
                  marginBottom: 14,
                }}
              >
                レベルを選んでスタート
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "center",
                  marginBottom: 14,
                }}
              >
                {["全部", "初級", "中級"].map((lv) => (
                  <button
                    key={lv}
                    onClick={() => setFilterLevel(lv)}
                    style={{
                      padding: "6px 18px",
                      borderRadius: 20,
                      border: "none",
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer",
                      background:
                        filterLevel === lv
                          ? lv === "初級"
                            ? "#43E97B"
                            : lv === "中級"
                            ? "#FFB347"
                            : "#4FACFE"
                          : "#1e3a4a",
                      color: filterLevel === lv ? "#fff" : "#6B8899",
                      transition: "all 0.2s",
                    }}
                  >
                    {lv}
                  </button>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 5,
                  justifyContent: "center",
                }}
              >
                {Object.entries(TYPE_CONFIG).map(([k, v]) => (
                  <span
                    key={k}
                    style={{
                      fontSize: 10,
                      padding: "3px 10px",
                      borderRadius: 20,
                      color: "#fff",
                      background: `linear-gradient(90deg,${v.color[0]},${v.color[1]})`,
                    }}
                  >
                    {v.emoji} {k}
                  </span>
                ))}
              </div>
            </div>
          )}

          {phase === "running" && (
            <>
              <div
                style={{
                  marginBottom: 10,
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#fff",
                    padding: "2px 10px",
                    borderRadius: 20,
                    background: `linear-gradient(90deg,${c1},${c2})`,
                  }}
                >
                  {cfg.emoji} {cur.type}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 20,
                    background: LEVEL_COLOR[cur.level] + "33",
                    color: LEVEL_COLOR[cur.level],
                    border: `1px solid ${LEVEL_COLOR[cur.level]}55`,
                  }}
                >
                  {cur.level}
                </span>
              </div>
              <div
                style={{
                  background: "#0F1E2A",
                  borderRadius: 14,
                  padding: "14px 16px",
                  marginBottom: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#E0EAF0",
                  lineHeight: 1.8,
                  borderLeft: `4px solid ${c1}`,
                  whiteSpace: "pre-wrap",
                  fontFamily: "'Segoe UI',sans-serif",
                }}
              >
                {cur.q}
              </div>

              {result === null && (
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="答えを入力…"
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      borderRadius: 12,
                      border: `2px solid ${c1}55`,
                      outline: "none",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#E0EAF0",
                      background: "#0F1E2A",
                      fontFamily: "monospace",
                    }}
                  />
                  <button
                    onClick={submit}
                    style={{
                      padding: "10px 18px",
                      borderRadius: 12,
                      border: "none",
                      background: `linear-gradient(90deg,${c1},${c2})`,
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: 14,
                      cursor: "pointer",
                    }}
                  >
                    送信
                  </button>
                </div>
              )}

              {result === "correct" && (
                <div
                  style={{
                    background: "#0A2A1A",
                    borderRadius: 14,
                    padding: "12px 16px",
                    border: "2px solid #43E97B",
                  }}
                >
                  <div
                    style={{ fontSize: 18, fontWeight: 900, color: "#43E97B" }}
                  >
                    ⭕ 正解！
                  </div>
                  <div style={{ fontSize: 13, color: "#A0BFC0", marginTop: 4 }}>
                    答え：
                    <strong style={{ color: "#fff", fontFamily: "monospace" }}>
                      {cur.a}
                    </strong>
                  </div>
                  {cur.hint && (
                    <div
                      style={{ fontSize: 12, color: "#6B8899", marginTop: 6 }}
                    >
                      💡 {cur.hint}
                    </div>
                  )}
                </div>
              )}
              {result === "wrong" && (
                <div
                  style={{
                    background: "#2A0A1A",
                    borderRadius: 14,
                    padding: "12px 16px",
                    border: "2px solid #FF6B9D",
                  }}
                >
                  <div
                    style={{ fontSize: 18, fontWeight: 900, color: "#FF6B9D" }}
                  >
                    ❌ 不正解…
                  </div>
                  <div style={{ fontSize: 13, color: "#A0BFC0", marginTop: 4 }}>
                    あなたの答え：
                    <strong
                      style={{ color: "#FF6B9D", fontFamily: "monospace" }}
                    >
                      {input}
                    </strong>
                  </div>
                  <div style={{ fontSize: 13, color: "#A0BFC0", marginTop: 2 }}>
                    正解は：
                    <strong
                      style={{ color: "#FFB347", fontFamily: "monospace" }}
                    >
                      {cur.a}
                    </strong>
                  </div>
                  {cur.hint && (
                    <div
                      style={{ fontSize: 12, color: "#6B8899", marginTop: 6 }}
                    >
                      💡 {cur.hint}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {phase === "finished" && (
            <div style={{ textAlign: "center", padding: "14px 0" }}>
              <div style={{ fontSize: 48 }}>🎉</div>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 900,
                  color: "#4FACFE",
                  margin: "6px 0 10px",
                }}
              >
                タイムアップ！
              </p>
              <div
                style={{
                  background: "linear-gradient(135deg,#0F2A1A,#1A2A0F)",
                  borderRadius: 16,
                  padding: "14px",
                  marginBottom: 10,
                  border: "1px solid #2a4a3a",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div>
                    <div style={{ fontSize: 11, color: "#6B8899" }}>正解</div>
                    <div
                      style={{
                        fontSize: 38,
                        fontWeight: 900,
                        color: "#43E97B",
                      }}
                    >
                      {correct}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 28,
                      color: "#2a4a5a",
                      alignSelf: "center",
                    }}
                  >
                    /
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#6B8899" }}>挑戦</div>
                    <div
                      style={{
                        fontSize: 38,
                        fontWeight: 900,
                        color: "#E0EAF0",
                      }}
                    >
                      {total}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 28,
                      color: "#2a4a5a",
                      alignSelf: "center",
                    }}
                  >
                    =
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#6B8899" }}>正答率</div>
                    <div
                      style={{
                        fontSize: 38,
                        fontWeight: 900,
                        color: "#4FACFE",
                      }}
                    >
                      {total > 0 ? Math.round((correct / total) * 100) : 0}
                      <span style={{ fontSize: 14 }}>%</span>
                    </div>
                  </div>
                </div>
              </div>
              <p style={{ color: "#6B8899", fontSize: 12 }}>{scoreMsg}</p>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        {phase === "idle" && (
          <button
            onClick={start}
            style={{
              padding: "12px 44px",
              borderRadius: 50,
              border: "none",
              background: "linear-gradient(135deg,#4FACFE,#00F2FE)",
              color: "#fff",
              fontWeight: 900,
              fontSize: 15,
              cursor: "pointer",
              boxShadow: "0 4px 18px rgba(79,172,254,0.4)",
            }}
          >
            ▶ スタート！
          </button>
        )}
        {phase === "running" && result !== null && (
          <button
            onClick={next}
            style={{
              padding: "12px 44px",
              borderRadius: 50,
              border: "none",
              background: `linear-gradient(135deg,${c1},${c2})`,
              color: "#fff",
              fontWeight: 900,
              fontSize: 15,
              cursor: "pointer",
              boxShadow: `0 4px 18px ${c1}66`,
            }}
          >
            次の問題 → (Enter)
          </button>
        )}
        {phase === "finished" && (
          <button
            onClick={start}
            style={{
              padding: "12px 44px",
              borderRadius: 50,
              border: "none",
              background: "linear-gradient(135deg,#FF6B9D,#FFB347)",
              color: "#fff",
              fontWeight: 900,
              fontSize: 15,
              cursor: "pointer",
              boxShadow: "0 4px 18px rgba(255,107,157,0.4)",
            }}
          >
            🔁 もう一度！
          </button>
        )}
      </div>
      {phase === "running" && result === null && (
        <p style={{ color: "#2a4a5a", fontSize: 10, marginTop: 10 }}>
          Enterキーでも送信できます
        </p>
      )}
    </div>
  );
}
