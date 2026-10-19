'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  Users,
  BookOpen,
  FileText,
  FlaskConical,
  Layers,
  Wrench,
  BarChart3,
  Target,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/tech/SectionHeading';
import GlassCard from '@/components/tech/GlassCard';

const PAPER_URL = 'https://link.springer.com/article/10.1007/s10044-026-01761-5';
const CODE_URL = 'https://github.com/wsjw233/CATSANet';
const ZENODO_URL = 'https://doi.org/10.5281/zenodo.18822920';

interface Metric {
  value: string;
  label: string;
  note: string;
}

interface WorkBlock {
  period: string;
  title: string;
  body: string;
  points: string[];
}

interface DataTable {
  title: string;
  note?: string;
  headers: string[];
  rows: string[][];
}

interface TroubleItem {
  problem: string;
  symptom: string;
  fix: string;
}

interface ResearchData {
  back: string;
  kicker: string;
  title: string;
  subtitle: string;
  summary: string;
  roleLabel: string;
  role: string;
  period: string;
  journal: string;
  paperLink: string;
  codeLink: string;
  metrics: Metric[];
  backgroundTitle: string;
  background: string[];
  methodTitle: string;
  methods: Array<{ name: string; tag: string; desc: string; formula?: string[] }>;
  workTitle: string;
  workIntro: string;
  works: WorkBlock[];
  dataTitle: string;
  tables: DataTable[];
  troubleTitle: string;
  troubleHint: string;
  symptomLabel: string;
  fixLabel: string;
  troubles: TroubleItem[];
  abilityTitle: string;
  abilities: Array<{ title: string; evidence: string }>;
  closingTitle: string;
  closing: string;
  closingNote: string;
}

function getResearchData(lang: string): ResearchData {
  switch (lang) {
    case 'en-US':
      return {
        back: 'Back to Home',
        kicker: 'RESEARCH / CATSANET',
        title: 'CATSANet: Experiments, Engineering and Manuscript',
        subtitle: 'From taking over a reproduction to a published paper',
        summary:
          'Text-to-image person re-identification. The method chains three steps into one progressive alignment pipeline: filtering redundant visual tokens, soft part-level alignment, and fusing local cues back into the global representation. I was responsible for making the method run, proving it works, and writing it up.',
        roleLabel: 'Role',
        role: 'Second Author',
        period: '2025.02 — 2026.08',
        journal: 'Pattern Analysis and Applications, 2026, 29:176',
        paperLink: 'Springer',
        codeLink: 'Code',
        metrics: [
          {
            value: '78.43 / 70.45',
            label: 'TS + PACL ablation row',
            note: 'Rank-1 / mAP I ran, matching Table 3 digit for digit',
          },
          {
            value: '15.56 pt',
            label: 'Rank-1 gap',
            note: 'Simple addition fusion vs. gated residual fusion',
          },
          {
            value: '37.99 GFLOPs',
            label: 'Total compute',
            note: 'Token selection and fusion add no structural cost',
          },
          {
            value: '17 pages',
            label: 'Published paper',
            note: 'Pipeline figure, ablations and retrieval visualisations',
          },
        ],
        backgroundTitle: 'Problem',
        background: [
          'Given a sentence such as “a man in a black coat carrying a backpack”, the system has to retrieve that person from a large pedestrian gallery. This is harder than image-based re-identification for two reasons.',
          'First, there is a semantic gap between text and image: the same sentence may describe people who differ in pose, lighting and viewpoint. Second, the truly discriminative cues are often fine-grained details — a white logo on a black shirt versus a plain black shirt — and global features tend to average these differences away.',
          'CATSANet does not stack another module. It chains three complementary stages in order: reduce redundancy in visual tokens, align image parts with text tokens interpretably, then fuse the aligned local information back into the global retrieval representation as a residual.',
        ],
        methodTitle: 'Method',
        methods: [
          {
            name: 'CTS',
            tag: 'Cross-image semantic token selection',
            desc:
              'Separates the class token from patch features, scores every patch by its cross-image cosine consistency, and samples 80% of the tokens with a learnable temperature and keep ratio. Triple over-sampling plus deduplication keeps the output length consistent.',
          },
          {
            name: 'PACL',
            tag: 'Optimal-transport part alignment',
            desc:
              'Builds a cost matrix from negative cosine similarity and solves entropy-regularised optimal transport with Sinkhorn iterations (9 parts, uniform marginals, ε = 0.05, 10 iterations). The diagonal mean of the transport plan becomes the loss, computed on positive pairs only with weight 0.02.',
            formula: ['C = -F_img · F_txtᵀ', 'K = exp(-C / ε)', 'u = 1/(K v),  v = 1/(Kᵀ u),  P = diag(u) K diag(v)', 'L_PACL = -log(mean(diag(P)))'],
          },
          {
            name: 'PRIF',
            tag: 'Post-alignment residual interaction fusion',
            desc:
              'Fuses part features F_p and global features F_g with a learnable gate. The multiplicative term controls interaction strength; the residual term keeps the original information from being destroyed.',
            formula: ['F = α (F_p ⊙ F_g) + (F_p + F_g)'],
          },
        ],
        workTitle: 'What I did',
        workIntro:
          'The first author defined the method. I made it run, verified it and wrote it up. The work below follows the timeline.',
        works: [
          {
            period: '2025.02 — 2025.03',
            title: 'Reproduction and a reproducible baseline',
            body:
              'The predecessor method had code, but the environment, dependency versions and experiment records were incomplete.',
            points: [
              'Rebuilt the environment on a new server from the original archive, replacing only the changed files.',
              'Finished a 100-epoch run: R1 79.305 / R5 91.147 / R10 94.282 / mAP 71.070, above the previous record of 78.05.',
              'Compared 95 / 100 / 105 epochs and narrowed the best rank-1 window to roughly 90–110 epochs.',
            ],
          },
          {
            period: '2025.03',
            title: 'Training diagnosis',
            body:
              'More epochs or a different learning rate stopped helping, so the bottleneck had to be located from the logs.',
            points: [
              'Split the total loss by term and found id_loss accounted for nearly half of it, with the text-side loss consistently slightly higher than the image side.',
              'Found the scheduler decayed per batch rather than per epoch, so a 200-epoch run had 200 decays and ended with a learning rate that was far too low.',
              'Turned the discussion from hyper-parameters back to the method, instead of continuing to tune blindly.',
            ],
          },
          {
            period: '2026.01',
            title: 'PACL: fixing a silent failure',
            body:
              'The PACL formula was in the model code, but the metrics did not move as expected. The loss had to be checked step by step.',
            points: [
              'Compared every launch flag against options.py and found pacl_loss_weight, pacl_ot_reg and pacl_ot_iters were never registered in the parser — the command-line values were silently ignored.',
              'Fixed the conflicting MLM configuration at the same time, then retrained with the formal 150-epoch configuration.',
              'The cloud run on 2026-01-25 produced R1 78.43 / R5 90.55 / R10 94.19 / mAP 70.45 — the “+ TS + PACL” row of Table 3, matching digit for digit.',
              'A control run with PACL present but its parameters unregistered stayed at the 79.01 baseline level, confirming the gain came from the loss actually taking effect.',
            ],
          },
          {
            period: '2025.08 — 2026.01',
            title: 'Controlled experiment on fusion',
            body:
              'Why not simply add part features to global features? The answer needed a reproducible experiment, not a preference.',
            points: [
              'Built a control pair with identical loss combination, batch size, learning rate, epochs and dataset; the only difference was the fusion block in build.py.',
              'Gated residual: best R1 79.30474 at epoch 87. Simple addition: best R1 63.7427 at epoch 86 — a 15.56-point drop.',
              'Re-ran the gated version months later with the same configuration and got 79.30474 at epoch 87 again, bit for bit.',
            ],
          },
          {
            period: '2025 — 2026',
            title: 'Cross-dataset tuning and overfitting diagnosis',
            body:
              'Conclusions from CUHK-PEDES needed a second dataset; RSTPReid has shorter texts and more complex scenes.',
            points: [
              'Ran two rounds of RSTPReid training and parameter adjustment, recording rank-1 and the training/test curves.',
              'Used the divergence between training and test metrics to detect overfitting, then adjusted epochs and learning rate.',
              'Separated “best on one dataset” from “usable across datasets” to support the final configuration.',
            ],
          },
          {
            period: '2025.03 — 2026.02',
            title: 'Manuscript and visualisation',
            body:
              'The contribution statement in the paper covers main text, algorithm design and experiments; my work also covered the figures.',
            points: [
              'Took part in the main pipeline figure: proposed the “reduce patches” step, adjusted the arrows and hierarchy, and wrote the English annotations.',
              'Contributed to the first draft and wrote up method material on token reduction, fusion comparisons, the FLOPs table and visualisation notes.',
              'Produced the three-row top-10 retrieval comparison figure (original / token-reduced / PACL + token-reduced) and its English caption.',
              'Modified the evaluator to report text-to-image metrics only, so i2t scores would not influence model selection; fixed JSON serialisation, checkpoint path and plotting issues; kept each run’s configs and train_log.',
            ],
          },
        ],
        dataTitle: 'Key numbers',
        tables: [
          {
            title: 'Paper results',
            note: 'Team-level results, not numbers I ran alone.',
            headers: ['Dataset', 'Rank-1', 'Rank-5', 'Rank-10', 'mAP'],
            rows: [
              ['CUHK-PEDES', '78.79', '90.84', '94.25', '70.35'],
              ['RSTPReid', '67.05', '83.55', '89.30', '54.37'],
            ],
          },
          {
            title: 'CUHK-PEDES ablation (Table 3)',
            headers: ['Configuration', 'Rank-1', 'ΔR1', 'mAP', 'ΔmAP'],
            rows: [
              ['Baseline', '77.23', '—', '—', '—'],
              ['+ Token Selection', '78.10', '+0.87', '—', '+0.48'],
              ['+ PACL', '77.73', '+0.50', '—', '+0.18'],
              ['+ Fusion', '77.79', '+0.56', '—', '+0.17'],
              ['+ TS + PACL', '78.43', '+1.20', '—', '+0.70'],
              ['Full', '78.79', '+1.56', '—', '+0.60'],
            ],
            note: 'The “+ TS + PACL” row is the 2026-01-25 cloud run I executed.',
          },
          {
            title: 'RSTPReid ablation (Table 4)',
            headers: ['Configuration', 'Rank-1', 'ΔR1', 'mAP', 'ΔmAP'],
            rows: [
              ['CMLFA', '65.05', '—', '51.03', '—'],
              ['+ Token Selection', '65.65', '+0.60', '53.34', '+2.31'],
              ['+ TS + PACL', '66.95', '+1.90', '54.34', '+3.31'],
              ['Full', '67.05', '+2.00', '54.37', '+3.34'],
            ],
          },
          {
            title: 'Experiments I ran',
            headers: ['Date', 'Configuration', 'Epochs', 'Result', 'Purpose'],
            rows: [
              ['2025-03-04', 'Token reduction', '100', 'R1 79.305 / mAP 71.070', 'Reproduction baseline'],
              ['2025-03-08', 'Token reduction, 95/100/105', '95–105', '≈77 / 79.30 / 78.85', 'Epoch sensitivity'],
              ['2025-08-20', 'Gated residual fusion', '100', 'R1 79.30474 @ ep87', 'Fusion validation'],
              ['2026-01-26', 'Same config, independent re-run', '100', 'R1 79.30474 @ ep87', 'Reproducibility'],
              ['2026-01-30', 'Simple addition fusion', '100', 'R1 63.7427 @ ep86', 'Negative control'],
              ['2026-01-25', 'TS + PACL, formal config', '150', 'R1 78.43 / mAP 70.45', 'Table 3 row'],
            ],
          },
        ],
        troubleTitle: 'Engineering troubleshooting',
        troubleHint: 'Silent failures that never raise an error — the metrics simply look wrong',
        symptomLabel: 'Symptom',
        fixLabel: 'Fix',
        troubles: [
          {
            problem: 'PACL parameters not registered',
            symptom: 'Training normal, no errors, metrics did not improve',
            fix: 'Compared CLI flags with options.py, registered the three PACL parameters, retrained',
          },
          {
            problem: 'MLM configuration conflict',
            symptom: 'Masking strategy and loss configuration contradicted each other',
            fix: 'Aligned the configuration with the forward pass and restarted training',
          },
          {
            problem: 'Metric JSON serialisation',
            symptom: 'Evaluation succeeded, saving results raised',
            fix: 'Located the tensor type in the traceback and wrote Python scalars',
          },
          {
            problem: 'Checkpoint path',
            symptom: 'Resuming could not find the weights',
            fix: 'Unified the save and load path construction and re-ran',
          },
          {
            problem: 'Plotting dependency',
            symptom: 'Training curves could not be generated',
            fix: 'Installed the missing dependency and switched to a headless backend',
          },
          {
            problem: 'Evaluation direction interference',
            symptom: 'i2t and t2i metrics both drove model selection',
            fix: 'Kept t2i metrics only for selection',
          },
        ],
        abilityTitle: 'What this work demonstrates',
        abilities: [
          { title: 'Reproduction and baselines', evidence: 'Re-ran 79.305 / 71.070 on new hardware; two independent runs matched bit for bit' },
          { title: 'Experiment design and diagnosis', evidence: 'Epoch sweeps, loss decomposition, scheduler analysis, overfitting diagnosis' },
          { title: 'Engineering troubleshooting', evidence: 'Found unregistered parameters and silent config failures from logs and code' },
          { title: 'Controlled validation', evidence: '79.30 vs 63.74 with every other variable held identical' },
          { title: 'Writing and visualisation', evidence: 'Draft, main figure, top-10 retrieval chart, formulas and LaTeX checks' },
          { title: 'Data discipline', evidence: 'Ablation rows match the paper exactly; configs and logs retained' },
        ],
        closingTitle: 'Paper and code',
        closing:
          'CATSANet was published in Pattern Analysis and Applications (2026, 29:176). The full model result (78.79 / 70.35) is the team result; my own contributions are the experiments, engineering and manuscript work described above.',
        closingNote: 'Written up from training logs, manuscript tables and working notes.',
      };
    case 'ja-JP':
      return {
        back: 'ホームに戻る',
        kicker: 'RESEARCH / CATSANET',
        title: 'CATSANet：実験実行・実装・論文執筆',
        subtitle: '引き継いだ再現から論文掲載まで',
        summary:
          'テキストから画像への人物再識別。冗長な視覚 token の選別、部品レベルのソフトアラインメント、局所手がかりの全局表現への融合を一つの漸進的アラインメント・パイプラインにまとめた研究です。私は手法を実際に動かし、検証し、文章にするところを担当しました。',
        roleLabel: '役割',
        role: '第二著者',
        period: '2025.02 — 2026.08',
        journal: 'Pattern Analysis and Applications, 2026, 29:176',
        paperLink: 'Springer',
        codeLink: 'コード',
        metrics: [
          {
            value: '78.43 / 70.45',
            label: 'TS + PACL 消融行',
            note: '私が実行した Rank-1 / mAP。論文 Table 3 と桁まで一致',
          },
          { value: '15.56 pt', label: 'Rank-1 の差', note: '単純加算融合と残差ゲート融合の比較' },
          { value: '37.99 GFLOPs', label: '総計算量', note: 'token 選別と融合は構造を変えない' },
          { value: '17 ページ', label: '掲載論文', note: '手法図・消融表・検索可視化を含む' },
        ],
        backgroundTitle: '課題',
        background: [
          '「黒いコートを着てリュックを背負った男性」のような一文から、大規模な歩行者画像群の中から該当人物を検索するタスクです。画像同士の再識別より難しく、理由は二つあります。',
          '一つはテキストと画像の意味の隔たりで、同じ文でも姿勢・照明・視点が異なる画像に対応します。もう一つは、識別に効く情報が細部にあることです。黒いシャツの白いロゴと無地の黒いシャツは、全局特徴では平均化されてしまいます。',
          'CATSANet はモジュールを積み増すのではなく、三つの相補的な段階を順に繋ぎます。まず視覚 token の冗長性を減らし、次に画像部品とテキスト token を解釈可能に軟対応させ、最後に対応後の局所情報を残差として検索表現へ戻します。',
        ],
        methodTitle: '手法',
        methods: [
          {
            name: 'CTS',
            tag: '画像間意味一貫性による token 選別',
            desc:
              'class token と patch 特徴を分離し、patch ごとに画像間コサイン一貫性を計算して、学習可能な温度と保持率 0.8 でサンプリングします。3 倍のオーバーサンプリングと重複除去で出力長を揃えます。',
          },
          {
            name: 'PACL',
            tag: '最適輸送による部品アラインメント',
            desc:
              '負のコサイン類似度からコスト行列を作り、Sinkhorn 反復でエントロピー正則化付き最適輸送を解きます（9 部品、一様周辺分布、ε = 0.05、10 回）。輸送行列の対角平均が損失で、正例ペアのみ、重み 0.02 です。',
            formula: ['C = -F_img · F_txtᵀ', 'K = exp(-C / ε)', 'u = 1/(K v),  v = 1/(Kᵀ u),  P = diag(u) K diag(v)', 'L_PACL = -log(mean(diag(P)))'],
          },
          {
            name: 'PRIF',
            tag: '対応後の残差インタラクション融合',
            desc:
              '部品特徴 F_p と全局特徴 F_g を学習可能なゲートで融合します。乗算項が相互作用の強さを調整し、残差項が元の情報を保ちます。',
            formula: ['F = α (F_p ⊙ F_g) + (F_p + F_g)'],
          },
        ],
        workTitle: '担当した仕事',
        workIntro:
          '手法の定義は第一著者、私は「動かす・検証する・書く」を担当しました。以下は時系列です。',
        works: [
          {
            period: '2025.02 — 2025.03',
            title: '再現と再現可能なベースライン',
            body: '前身手法のコードはありましたが、環境・依存バージョン・実験記録が不完全でした。',
            points: [
              '元のアーカイブから新サーバーで環境を再構築し、変更ファイルのみを差し替えて訓練を開始。',
              '100 epoch で R1 79.305 / R5 91.147 / R10 94.282 / mAP 71.070 を達成（従来記録 78.05 を上回る）。',
              '95 / 100 / 105 epoch を比較し、rank-1 の最適域が概ね 90〜110 epoch と判断。',
            ],
          },
          {
            period: '2025.03',
            title: '訓練の診断',
            body: 'epoch や学習率を変えても改善しなくなり、ログからボトルネックを特定する必要がありました。',
            points: [
              '損失を項目別に分解し、id_loss が全体のほぼ半分を占め、テキスト側が画像側より常にやや高いことを確認。',
              'スケジューラが epoch 単位ではなくバッチ単位で減衰しており、200 epoch では減衰が 200 回になり終盤の学習率が低すぎたと判明。',
              'ハイパーパラメータ調整から手法レベルの議論へ論点を移した。',
            ],
          },
          {
            period: '2026.01',
            title: 'PACL：静かな失敗の修正',
            body: 'PACL の式はモデルに入っていたのに指標が動かず、損失が本当に効いているか確認する必要がありました。',
            points: [
              '起動引数と options.py を突き合わせ、pacl_loss_weight / pacl_ot_reg / pacl_ot_iters がパーサーに未登録で、コマンドライン値が無視されていたと判明。',
              'MLM 設定の矛盾も同時に修正し、正式な 150 epoch 設定で再訓練。',
              '2026-01-25 のクラウド訓練で R1 78.43 / R5 90.55 / R10 94.19 / mAP 70.45。Table 3 の「+ TS + PACL」行と桁まで一致。',
              'PACL を含むがパラメータ未登録の対照実行は 79.01 のベースライン水準に留まり、利得が実際に効いた損失によることを確認。',
            ],
          },
          {
            period: '2025.08 — 2026.01',
            title: '融合モジュールの対照実験',
            body: '部品特徴と全局特徴を単純に足してはいけない理由を、好みではなく再現可能な実験で示す必要がありました。',
            points: [
              '損失構成・バッチサイズ・学習率・epoch・データセットを揃え、build.py の融合部分だけを変えた対照を設計。',
              '残差ゲート：best R1 79.30474 @ epoch 87。単純加算：best R1 63.7427 @ epoch 86 で 15.56 ポイント低下。',
              '数か月後に同設定で独立に再実行し、79.30474 @ epoch 87 と桁まで一致。',
            ],
          },
          {
            period: '2025 — 2026',
            title: 'データセット間の調整と過学習診断',
            body: 'CUHK-PEDES の結論を別データセットでも確認する必要があり、RSTPReid は文が短くシーンも複雑です。',
            points: [
              'RSTPReid で 2 回の訓練とパラメータ調整を行い、rank-1 と訓練／テスト曲線を記録。',
              '訓練とテストの指標の乖離から過学習を判断し、epoch と学習率を調整して再検証。',
              '「単一データセットの最良」と「データセット間で使える」を分け、最終設定の根拠とした。',
            ],
          },
          {
            period: '2025.03 — 2026.02',
            title: '論文執筆と可視化',
            body: '論文の貢献声明は主稿・アルゴリズム設計・実験を挙げていますが、図の作業も担当しました。',
            points: [
              'メイン図の設計に参加し、「patch を減らす」ステップの提案、矢印と階層の調整、英語注記を担当。',
              '初稿の執筆に参加し、token 削減の処理、融合の前後比較、FLOPs 表、可視化説明を資料化。',
              '3 行の top-10 検索比較図（元画像／token 削減／PACL + token 削減）と英語キャプションを作成。',
              '評価コードを t2i 方向のみ出力するよう修正し、i2t 指標がモデル選択に干渉しないようにした。JSON 保存・checkpoint パス・描画依存も修正し、各実行の configs と train_log を保持。',
            ],
          },
        ],
        dataTitle: '主要な数値',
        tables: [
          {
            title: '論文の報告値',
            note: 'チーム全体の結果であり、私個人が単独で出した数値ではありません。',
            headers: ['データセット', 'Rank-1', 'Rank-5', 'Rank-10', 'mAP'],
            rows: [
              ['CUHK-PEDES', '78.79', '90.84', '94.25', '70.35'],
              ['RSTPReid', '67.05', '83.55', '89.30', '54.37'],
            ],
          },
          {
            title: 'CUHK-PEDES 消融（Table 3）',
            headers: ['構成', 'Rank-1', 'ΔR1', 'mAP', 'ΔmAP'],
            rows: [
              ['Baseline', '77.23', '—', '—', '—'],
              ['+ Token Selection', '78.10', '+0.87', '—', '+0.48'],
              ['+ PACL', '77.73', '+0.50', '—', '+0.18'],
              ['+ Fusion', '77.79', '+0.56', '—', '+0.17'],
              ['+ TS + PACL', '78.43', '+1.20', '—', '+0.70'],
              ['Full', '78.79', '+1.56', '—', '+0.60'],
            ],
            note: '「+ TS + PACL」行は 2026-01-25 に私が実行したクラウド訓練の結果です。',
          },
          {
            title: 'RSTPReid 消融（Table 4）',
            headers: ['構成', 'Rank-1', 'ΔR1', 'mAP', 'ΔmAP'],
            rows: [
              ['CMLFA', '65.05', '—', '51.03', '—'],
              ['+ Token Selection', '65.65', '+0.60', '53.34', '+2.31'],
              ['+ TS + PACL', '66.95', '+1.90', '54.34', '+3.31'],
              ['Full', '67.05', '+2.00', '54.37', '+3.34'],
            ],
          },
          {
            title: '私が実行した実験',
            headers: ['日付', '構成', 'Epoch', '結果', '用途'],
            rows: [
              ['2025-03-04', 'token 削減', '100', 'R1 79.305 / mAP 71.070', '再現ベースライン'],
              ['2025-03-08', 'token 削減 95/100/105', '95–105', '約 77 / 79.30 / 78.85', 'epoch 感度'],
              ['2025-08-20', '残差ゲート融合', '100', 'R1 79.30474 @ ep87', '融合の検証'],
              ['2026-01-26', '同設定で独立再実行', '100', 'R1 79.30474 @ ep87', '再現性'],
              ['2026-01-30', '単純加算融合', '100', 'R1 63.7427 @ ep86', '反証対照'],
              ['2026-01-25', 'TS + PACL 正式設定', '150', 'R1 78.43 / mAP 70.45', 'Table 3 の行'],
            ],
          },
        ],
        troubleTitle: '実装トラブルと対処',
        troubleHint: 'エラーは出ないが指標だけがおかしい、静かな失敗',
        symptomLabel: '症状',
        fixLabel: '対処',
        troubles: [
          { problem: 'PACL パラメータ未登録', symptom: '訓練は正常、エラーなし、指標が伸びない', fix: 'CLI と options.py を突き合わせて 3 項目を登録し再訓練' },
          { problem: 'MLM 設定の矛盾', symptom: 'マスク戦略と損失設定が食い違う', fix: '設定をフォワード計算に合わせて統一し再開' },
          { problem: '指標の JSON 保存', symptom: '評価後に保存で例外', fix: 'traceback からテンソル型を特定し Python スカラーで書き込み' },
          { problem: 'checkpoint パス', symptom: '再開時に重みが見つからない', fix: '保存・読み込みのパス結合を統一して再実行' },
          { problem: '描画依存の欠落', symptom: '訓練曲線が生成できない', fix: '依存を追加しヘッドレスバックエンドに変更' },
          { problem: '評価方向の干渉', symptom: 'i2t と t2i の両方がモデル選択に影響', fix: 't2i 指標のみを選択に使用' },
        ],
        abilityTitle: 'この経験で示せること',
        abilities: [
          { title: '再現とベースライン構築', evidence: '新ハードウェアで 79.305 / 71.070 を再現、2 回の独立実行が桁まで一致' },
          { title: '実験設計と診断', evidence: 'epoch 比較、損失分解、スケジューラ分析、過学習診断' },
          { title: '実装のトラブルシュート', evidence: 'ログとコードから未登録パラメータや静かな設定不備を特定' },
          { title: '対照による検証', evidence: '他の変数を揃えた 79.30 対 63.74 の比較' },
          { title: '執筆と可視化', evidence: '初稿、メイン図、top-10 検索図、数式と LaTeX の確認' },
          { title: 'データの厳密さ', evidence: '消融行が論文と一致、configs とログを保持' },
        ],
        closingTitle: '論文とコード',
        closing:
          'CATSANet は Pattern Analysis and Applications（2026, 29:176）に掲載されました。full model の 78.79 / 70.35 はチームの結果で、私の担当は本ページに記載した実験・実装・執筆です。',
        closingNote: '訓練ログ、論文の表、作業記録をもとにまとめています。',
      };
    default: // zh-CN
      return {
        back: '返回首页',
        kicker: 'RESEARCH / CATSANET',
        title: 'CATSANet：实验执行、工程落地与成稿',
        subtitle: '从接手复现到论文发表',
        summary:
          '文本到图像行人重识别。把「筛掉冗余视觉 token、在部件级别做软对齐、再把局部线索融回全局表示」串成一条渐进式对齐流水线。我负责把方法跑起来、验证出来、写出来。',
        roleLabel: '角色',
        role: '第二作者',
        period: '2025.02 — 2026.08',
        journal: 'Pattern Analysis and Applications, 2026, 29:176',
        paperLink: 'Springer',
        codeLink: '代码',
        metrics: [
          {
            value: '78.43 / 70.45',
            label: 'TS + PACL 消融行',
            note: '我跑出的 Rank-1 / mAP，与论文 Table 3 逐位吻合',
          },
          {
            value: '15.56 pt',
            label: 'Rank-1 落差',
            note: '简单加法融合相对残差门控的跌幅',
          },
          {
            value: '37.99 GFLOPs',
            label: '模型总计算量',
            note: 'token 选择与融合不改变模型结构',
          },
          {
            value: '17 页',
            label: '正式发表版',
            note: '含方法主图、消融表与检索可视化',
          },
        ],
        backgroundTitle: '要解决的问题',
        background: [
          '给定一句自然语言描述，比如「穿黑色外套、背双肩包的男子」，系统要从大规模行人图库中检索出对应的人。这件事比图像行人重识别更难，原因有两个。',
          '第一是文本与图像之间存在语义鸿沟，同一句话可以对应姿态、光照、视角完全不同的图像。第二是真正能区分身份的信息往往是细粒度局部线索，例如「黑色衬衫上的白色 logo」与「纯黑衬衫」，而全局特征容易把这些差异抹平。',
          'CATSANet 没有继续堆叠模块，而是把三个互补的环节按顺序串起来：先减少视觉 token 的冗余与噪声，再让图像部件与文本 token 做可解释的软对齐，最后把对齐后的局部信息以残差方式融回全局检索表示。',
        ],
        methodTitle: '方法三段式',
        methods: [
          {
            name: 'CTS',
            tag: '跨图像语义一致性 token 选择',
            desc:
              '把 class token 与 patch 特征分离，对每个 patch 计算跨图像余弦一致性评分，用可学习温度与可学习保留比例（0.8）采样；3 倍超采样后做唯一性筛选与长度对齐，避免索引不足或输出维度不一致。',
          },
          {
            name: 'PACL',
            tag: '基于最优传输的部件对齐',
            desc:
              '用负余弦相似度构造代价矩阵，以 Sinkhorn 迭代求解熵正则最优传输（9 个部件、均匀边缘分布、ε = 0.05、迭代 10 次）。传输矩阵的对角线均值即损失，只在正样本对上计算，权重 0.02。',
            formula: [
              'C = -F_img · F_txtᵀ',
              'K = exp(-C / ε)',
              'u = 1/(K v),  v = 1/(Kᵀ u),  P = diag(u) K diag(v)',
              'L_PACL = -log(mean(diag(P)))',
            ],
          },
          {
            name: 'PRIF',
            tag: '对齐后残差交互融合',
            desc:
              '把部件特征 F_p 与全局特征 F_g 用可学习门控融合：乘性项调节局部与全局的交互强度，残差项保证原始信息不被破坏。',
            formula: ['F = α (F_p ⊙ F_g) + (F_p + F_g)'],
          },
        ],
        workTitle: '我做了什么',
        workIntro:
          '一句话概括：第一作者负责把方法定义出来，我负责把方法跑出来、验证出来、写出来。下面按时间线展开。',
        works: [
          {
            period: '2025.02 — 2025.03',
            title: '接手复现，建立可重复的基线',
            body:
              '前身方法已有代码，但运行环境、依赖版本与实验记录不完整，需要先在干净环境里把结果复现出来。',
            points: [
              '在原压缩包基础上只替换改动过的文件，避免把混乱的本地修改一并带进来，并在新服务器上重建环境。',
              '完成 100 epoch 训练，得到 R1 79.305 / R5 91.147 / R10 94.282 / mAP 71.070，高于原记录 78.05。',
              '对比 95 / 100 / 105 epoch，把 rank-1 的最优区间收窄到 90 至 110 epoch。',
            ],
          },
          {
            period: '2025.03',
            title: '训练诊断：先判断瓶颈在哪',
            body:
              '复现成功后，继续加 epoch 或调学习率并不能稳定提升指标，需要先从日志里判断问题来源。',
            points: [
              '按损失项拆分训练日志，发现 id_loss 在总损失中占比接近一半，文本侧 loss 始终略高于图像侧。',
              '确认学习率调度是「按批次衰减」而不是「按 epoch 衰减」，200 epoch 被拆成 200 次下降，导致后期学习率过低、指标回落。',
              '提出「单纯改参数已经不够」，把讨论推进到方法层面，而不是继续在超参上打转。',
            ],
          },
          {
            period: '2026.01',
            title: 'PACL 工程落地：修复从未生效的损失',
            body:
              'PACL 的公式与实现已经写进模型代码，但训练日志显示指标没有预期变化，需要确认损失是否真的参与优化。',
            points: [
              '逐项比对训练启动参数与 options.py，发现 pacl_loss_weight、pacl_ot_reg、pacl_ot_iters 三个参数没有在解析器中注册，命令行传入后并未生效。',
              '同时修正 MLM 相关配置的自相矛盾，并按正式配置启动 150 epoch 训练。',
              '2026-01-25 云端训练得到 R1 78.43 / R5 90.55 / R10 94.19 / mAP 70.45，与论文 Table 3 的「+ TS + PACL」行四项指标逐位吻合。',
              '保留了一次「模型里加了 PACL、但参数未注册」的对照运行，结果 79.01，说明未生效的版本不会带来论文报告的那一行收益。',
            ],
          },
          {
            period: '2025.08 — 2026.01',
            title: '融合模块的对照验证',
            body:
              '残差交互融合是团队讨论中形成的方案，但「为什么不能直接把部件特征和全局特征相加」需要一个可复核的答案。',
            points: [
              '设计控制变量对照：两组实验的损失组合、批大小、学习率、epoch、数据集逐项一致，唯一差异是 build.py 中的融合代码段。',
              '残差门控版本 best R1 79.30474 @ epoch 87；简单加法版本 best R1 63.7427 @ epoch 86，下降 15.56 个百分点。',
              '几个月后以相同配置独立复跑残差版本，best R1 仍为 79.30474 @ epoch 87，逐位一致。',
            ],
          },
          {
            period: '2025 — 2026',
            title: '跨数据集调参与过拟合诊断',
            body:
              'CUHK-PEDES 上的结论需要在另一个数据集上验证，RSTPReid 的文本更短、场景更复杂，是常见的泛化测试集。',
            points: [
              '完成两轮 RSTPReid 训练与参数调整，记录每轮的 rank-1 与训练／测试曲线。',
              '通过训练集与测试集指标的分离趋势判断过拟合，调整 epoch 与学习率后重新验证。',
              '把「单数据集最优」与「跨数据集可用」区分开，为论文最终配置的选择提供依据。',
            ],
          },
          {
            period: '2025.03 — 2026.02',
            title: '论文写作、主图与检索配图',
            body:
              '论文第 16 页的贡献声明写的是主稿撰写、算法设计与实验执行，我的工作还覆盖了图与排版。',
            points: [
              '参与论文主图设计：提出在图像分支后增加「减少 patch」的步骤示意、调整箭头长度与层级关系，并补充对应的英文标注。',
              '参与论文初稿撰写，并把「减 Token」的处理流程、特征融合前后对比、FLOPs 结构表与可视化说明写成可交给第一作者使用的文档。',
              '制作三行 top-10 检索对比图（原始、减 token、PACL + 减 token），并撰写图注英文描述。',
              '修改评估代码，使其只输出文本到图像（t2i）方向的指标，避免 i2t 指标干扰模型选择；修复指标 JSON 序列化、checkpoint 路径与绘图依赖问题，并保留每次运行的 configs 与 train_log。',
            ],
          },
        ],
        dataTitle: '关键数据',
        tables: [
          {
            title: '论文报告结果',
            note: '这是团队整体结果，不是我单独跑出的数字。',
            headers: ['数据集', 'Rank-1', 'Rank-5', 'Rank-10', 'mAP'],
            rows: [
              ['CUHK-PEDES', '78.79', '90.84', '94.25', '70.35'],
              ['RSTPReid', '67.05', '83.55', '89.30', '54.37'],
            ],
          },
          {
            title: 'CUHK-PEDES 消融（Table 3）',
            headers: ['配置', 'Rank-1', 'ΔR1', 'mAP', 'ΔmAP'],
            rows: [
              ['Baseline', '77.23', '—', '—', '—'],
              ['+ Token Selection', '78.10', '+0.87', '—', '+0.48'],
              ['+ PACL', '77.73', '+0.50', '—', '+0.18'],
              ['+ Fusion', '77.79', '+0.56', '—', '+0.17'],
              ['+ TS + PACL', '78.43', '+1.20', '—', '+0.70'],
              ['Full', '78.79', '+1.56', '—', '+0.60'],
            ],
            note: '其中「+ TS + PACL」这一行，是我在 2026-01-25 云端训练得到的 78.43 / 70.45。',
          },
          {
            title: 'RSTPReid 消融（Table 4）',
            headers: ['配置', 'Rank-1', 'ΔR1', 'mAP', 'ΔmAP'],
            rows: [
              ['CMLFA', '65.05', '—', '51.03', '—'],
              ['+ Token Selection', '65.65', '+0.60', '53.34', '+2.31'],
              ['+ TS + PACL', '66.95', '+1.90', '54.34', '+3.31'],
              ['Full', '67.05', '+2.00', '54.37', '+3.34'],
            ],
          },
          {
            title: '我亲手执行的主要实验',
            headers: ['时间', '配置', '轮数', '结果', '用途'],
            rows: [
              ['2025-03-04', '减 token', '100', 'R1 79.305 / mAP 71.070', '复现基线'],
              ['2025-03-08', '减 token，95/100/105', '95–105', '约 77 / 79.30 / 78.85', '确认 epoch 敏感区间'],
              ['2025-08-20', '残差门控融合', '100', 'R1 79.30474 @ ep87', '融合方案验证'],
              ['2026-01-26', '同配置独立复跑', '100', 'R1 79.30474 @ ep87', '证明可复现'],
              ['2026-01-30', '简单加法融合', '100', 'R1 63.7427 @ ep86', '反证门控必要性'],
              ['2026-01-25', 'TS + PACL 正式配置', '150', 'R1 78.43 / mAP 70.45', '论文 Table 3 关键行'],
            ],
          },
        ],
        troubleTitle: '工程排错清单',
        troubleHint: '不报错、日志也正常，只有指标不对——这类静默失效最难查',
        symptomLabel: '表现',
        fixLabel: '处理',
        troubles: [
          {
            problem: 'PACL 参数未注册',
            symptom: '训练正常，无报错，指标不涨',
            fix: '逐项比对命令行参数与 options.py，补注册三个 PACL 参数后重新训练',
          },
          {
            problem: 'MLM 配置冲突',
            symptom: '掩码策略与损失配置互相矛盾',
            fix: '对照配置项与模型前向逻辑，统一配置后重启训练',
          },
          {
            problem: '指标 JSON 序列化失败',
            symptom: '评估结束后保存结果报错',
            fix: '从 traceback 定位到张量类型，转换为 Python 标量后写入',
          },
          {
            problem: 'checkpoint 路径错误',
            symptom: '恢复训练找不到权重',
            fix: '检查保存路径与加载路径的拼接，统一路径并复跑',
          },
          {
            problem: '绘图依赖缺失',
            symptom: '训练曲线无法生成',
            fix: '查看绘图函数调用栈，补齐依赖并改用无界面后端',
          },
          {
            problem: '评估方向干扰模型选择',
            symptom: 'i2t 与 t2i 指标同时参与选模',
            fix: '阅读评估器逻辑，只保留 t2i 指标用于选模',
          },
        ],
        abilityTitle: '这段经历对应什么能力',
        abilities: [
          {
            title: '复现与建基线',
            evidence: '换硬件后复跑 79.305 / 71.070；同配置两次独立运行逐位一致',
          },
          {
            title: '实验设计与诊断',
            evidence: '95/100/105 epoch 对比、loss 分解、学习率调度分析、RSTPReid 过拟合诊断',
          },
          {
            title: '工程排错',
            evidence: '从日志与配置定位 PACL 三参数未注册、MLM 配置冲突等静默故障',
          },
          {
            title: '对照验证',
            evidence: '融合对照 79.30 与 63.74，其余变量逐项一致',
          },
          {
            title: '论文写作与可视化',
            evidence: '初稿参与、主图设计、top-10 检索图与英文标注、公式与 LaTeX 检查',
          },
          {
            title: '数据严谨性',
            evidence: '消融行与论文逐位吻合，配置与训练日志全程留存',
          },
        ],
        closingTitle: '论文与代码',
        closing:
          'CATSANet 发表于 Pattern Analysis and Applications（2026, 29:176）。论文 full model 的 78.79 / 70.35 是团队整体结果，不是我单独跑出的数字；我的工作就是上面记录的实验执行、工程落地与部分成稿。',
        closingNote: '内容依据训练日志、论文表格与工作记录整理。',
      };
  }
}

function DataTableCard({ table }: { table: DataTable }) {
  return (
    <GlassCard className="p-5 sm:p-6" lift={false}>
      <p className="font-mono text-[11px] tracking-[0.12em] text-[var(--neon-cyan)]">{table.title}</p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-border">
              {table.headers.map((h) => (
                <th key={h} className="whitespace-nowrap py-2 pr-4 font-medium text-foreground/80">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.join('|')} className="border-b border-border/60 last:border-0">
                {row.map((cell, i) => (
                  <td
                    key={`${cell}-${i}`}
                    className={`whitespace-nowrap py-2 pr-4 ${
                      i === 0 ? 'text-foreground/90' : 'font-mono text-muted-foreground'
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note ? (
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">{table.note}</p>
      ) : null}
    </GlassCard>
  );
}

export default function CatsanetResearchPage() {
  const { language } = useLanguage();
  const r = getResearchData(language || 'zh-CN');

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10">
        <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10 lg:px-8">
          <Link
            href="/#research"
            className="inline-flex items-center gap-2 text-xs text-[var(--neon-violet)] transition-colors hover:text-[var(--neon-cyan)] sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            {r.back}
          </Link>

          {/* Hero */}
          <Reveal>
            <GlassCard className="mt-6 p-6 sm:p-9" lift={false}>
              <span className="mono-label">{r.kicker}</span>
              <h1 className="mt-4 text-balance text-2xl font-bold leading-tight sm:text-4xl">
                <span className="text-aurora">{r.title}</span>
              </h1>
              <p className="mt-2 text-sm text-[var(--neon-violet)] sm:text-base">{r.subtitle}</p>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground sm:text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-[var(--neon-violet)]" />
                  {r.roleLabel}: <span className="text-foreground/90">{r.role}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[var(--neon-cyan)]" />
                  {r.period}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-[var(--neon-magenta)]" />
                  <span className="italic">{r.journal}</span>
                </span>
              </div>

              <p className="mt-5 max-w-3xl text-pretty text-[13px] leading-[1.85] text-muted-foreground sm:text-sm">
                {r.summary}
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5">
                <a
                  href={PAPER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[color-mix(in_oklab,var(--neon-violet)_35%,transparent)] px-3 py-1.5 text-xs text-[var(--neon-violet)] transition-colors hover:bg-[color-mix(in_oklab,var(--neon-violet)_12%,transparent)] sm:text-sm"
                >
                  <FileText className="h-3.5 w-3.5" />
                  {r.paperLink}
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href={CODE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
                >
                  <Github className="h-3.5 w-3.5" />
                  {r.codeLink}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </GlassCard>
          </Reveal>

          {/* Metrics */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 lg:grid-cols-4">
            {r.metrics.map((m, idx) => (
              <Reveal key={m.label} delay={60 + idx * 50}>
                <GlassCard className="h-full p-4 sm:p-5" lift={false}>
                  <p className="font-mono text-base font-semibold text-[var(--neon-cyan)] sm:text-xl">{m.value}</p>
                  <p className="mt-1.5 text-xs font-medium text-foreground/90 sm:text-sm">{m.label}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">{m.note}</p>
                </GlassCard>
              </Reveal>
            ))}
          </div>

          {/* Background */}
          <section className="mt-14 sm:mt-20">
            <SectionHeading kicker="CONTEXT / 01" title={r.backgroundTitle} align="left" />
            <div className="mt-6 space-y-3">
              {r.background.map((p, i) => (
                <Reveal key={i} delay={i * 40}>
                  <p className="text-pretty text-[13px] leading-[1.9] text-muted-foreground sm:text-sm">{p}</p>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Method */}
          <section className="mt-14 sm:mt-20">
            <SectionHeading kicker="METHOD / 02" title={r.methodTitle} align="left" />
            <div className="mt-6 grid gap-3 lg:grid-cols-3">
              {r.methods.map((m, idx) => (
                <Reveal key={m.name} delay={idx * 60}>
                  <GlassCard className="h-full p-5" lift={false}>
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-[var(--neon-violet)]" />
                      <span className="font-mono text-sm font-semibold text-[var(--neon-violet)]">{m.name}</span>
                    </div>
                    <p className="mt-1.5 text-xs font-medium text-foreground/90 sm:text-sm">{m.tag}</p>
                    <p className="mt-2.5 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">{m.desc}</p>
                    {m.formula ? (
                      <div className="mt-3 space-y-1.5 rounded-lg border border-border/70 bg-[color-mix(in_oklab,var(--neon-cyan)_6%,transparent)] p-2.5">
                        {m.formula.map((f) => (
                          <code key={f} className="block break-words font-mono text-[10px] text-[var(--neon-cyan)] sm:text-[11px]">
                            {f}
                          </code>
                        ))}
                      </div>
                    ) : null}
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Work */}
          <section className="mt-14 sm:mt-20">
            <SectionHeading kicker="WORK / 03" title={r.workTitle} align="left" description={r.workIntro} />
            <div className="mt-6 space-y-3">
              {r.works.map((w, idx) => (
                <Reveal key={w.title} delay={idx * 40}>
                  <GlassCard className="p-5 sm:p-6" lift={false}>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-mono text-[11px] text-[var(--neon-cyan)] sm:text-xs">{w.period}</span>
                      <h3 className="text-sm font-semibold text-foreground sm:text-base">{w.title}</h3>
                    </div>
                    <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground sm:text-sm">{w.body}</p>
                    <ul className="mt-3 space-y-2">
                      {w.points.map((p) => (
                        <li key={p} className="flex gap-2 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--neon-lime)]" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Data */}
          <section className="mt-14 sm:mt-20">
            <SectionHeading kicker="DATA / 04" title={r.dataTitle} align="left" />
            <div className="mt-6 space-y-3">
              {r.tables.map((t) => (
                <Reveal key={t.title}>
                  <DataTableCard table={t} />
                </Reveal>
              ))}
            </div>
          </section>

          {/* Troubleshooting */}
          <section className="mt-14 sm:mt-20">
            <SectionHeading kicker="DEBUG / 05" title={r.troubleTitle} align="left" description={r.troubleHint} />
            <div className="mt-6 space-y-2.5">
              {r.troubles.map((t, idx) => (
                <Reveal key={t.problem} delay={idx * 30}>
                  <details className="group rounded-2xl panel px-5 py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-xs font-medium text-foreground sm:text-sm">
                        <Wrench className="h-3.5 w-3.5 text-[var(--neon-amber)]" />
                        {t.problem}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground transition-transform group-open:rotate-90">
                        →
                      </span>
                    </summary>
                    <dl className="mt-3 space-y-1.5 border-t border-border/70 pt-3 text-[11px] leading-relaxed sm:text-xs">
                      <div className="flex gap-2">
                        <dt className="w-14 shrink-0 text-muted-foreground">{r.symptomLabel}</dt>
                        <dd className="text-muted-foreground">{t.symptom}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="w-14 shrink-0 text-[var(--neon-lime)]">{r.fixLabel}</dt>
                        <dd className="text-foreground/80">{t.fix}</dd>
                      </div>
                    </dl>
                  </details>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Abilities */}
          <section className="mt-14 sm:mt-20">
            <SectionHeading kicker="TAKEAWAY / 06" title={r.abilityTitle} align="left" />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {r.abilities.map((a, idx) => (
                <Reveal key={a.title} delay={idx * 40}>
                  <GlassCard className="h-full p-4 sm:p-5" lift={false}>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-[var(--neon-violet)]" />
                      <p className="text-xs font-semibold text-foreground sm:text-sm">{a.title}</p>
                    </div>
                    <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">{a.evidence}</p>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Closing */}
          <section className="mt-14 sm:mt-20">
            <Reveal>
              <GlassCard className="p-6 sm:p-8" lift={false}>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-[var(--neon-cyan)]" />
                  <h2 className="text-base font-semibold text-foreground sm:text-lg">{r.closingTitle}</h2>
                </div>
                <p className="mt-3 text-pretty text-[12px] leading-[1.85] text-muted-foreground sm:text-sm">
                  {r.closing}
                </p>
                <p className="mt-3 text-[11px] text-muted-foreground/80 sm:text-xs">{r.closingNote}</p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <a
                    href={PAPER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[color-mix(in_oklab,var(--neon-violet)_35%,transparent)] px-3 py-1.5 text-xs text-[var(--neon-violet)] transition-colors hover:bg-[color-mix(in_oklab,var(--neon-violet)_12%,transparent)] sm:text-sm"
                  >
                    <FlaskConical className="h-3.5 w-3.5" />
                    {r.paperLink}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <a
                    href={CODE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
                  >
                    <Github className="h-3.5 w-3.5" />
                    {r.codeLink}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <a
                    href={ZENODO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
                  >
                    Zenodo
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </GlassCard>
            </Reveal>
          </section>
        </div>
      </div>
    </div>
  );
}
