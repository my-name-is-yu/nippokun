// 1. 必要なパッケージを読み込む
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

// 2. Expressアプリを作成
const app = express();
const port = 3000; // サーバーを起動するポート番号

// 3. ミドルウェアを設定
app.use(cors()); // CORSを許可する
app.use(bodyParser.json()); // JSON形式のリクエストボディをパースする
app.use(express.static(__dirname)); // HTMLやCSSなどの静的ファイルを提供

// 4. MySQLデータベースへの接続設定
const connection = mysql.createConnection({
  host: 'localhost', // MySQLサーバーのホスト名（ご自身の環境に合わせてください）
  user: 'root',      // MySQLのユーザー名（ご自身の環境に合わせてください）
  password: 'password', // MySQLのパスワード（ご自身の環境に合わせてください）
  database: 'daily_report_app' // 使用するデータベース名
});

connection.connect((err) => {
  if (err) {
    console.error('データベースへの接続に失敗しました: ', err);
    return;
  }
  console.log('データベースに正常に接続しました。');
});

// 5. APIエンドポイントの作成
// [POST] /api/record : 時刻を記録し、稼働時間を計算して返す
// [POST] /api/record : 時刻を記録し、稼働時間を計算して返す
app.post('/api/record', (req, res) => {
  // 1. フロントエンドから送信されたデータを取得
  const { startTime, endTime, breakDurationMinutes } = req.body;

  // 2. バリデーション
  if (!startTime || !endTime) {
    return res.status(400).json({ error: '開始時刻と終了時刻は必須です。' });
  }

  // 休憩時間が空かマイナスなら0にする
  const breakMinutes = Math.max(0, parseInt(breakDurationMinutes || '0', 10));

  // 3. データベースに保存
  const sql = 'INSERT INTO records (start_time, end_time, break_duration_minutes) VALUES (?, ?, ?)';
  const params = [startTime, endTime, breakMinutes];

  connection.query(sql, params, (err, result) => {
    if (err) {
      console.error('データの保存に失敗しました: ', err);
      return res.status(500).json({ error: 'データベースへの保存に失敗しました。' });
    }
    console.log('データが正常に保存されました。');

    // 4. 稼働時間の計算
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMilliseconds = end - start; // 総時間（ミリ秒）

    // 休憩時間（分）をミリ秒に変換して差し引く
    const breakMilliseconds = breakMinutes * 60 * 1000;
    const workMilliseconds = diffMilliseconds - breakMilliseconds;

    const workHours = workMilliseconds / 1000 / 60 / 60; // 時間単位に変換

    // 5. 計算結果をフロントエンドに返す
    res.json({
      message: '記録に成功しました！',
      workHours: workHours.toFixed(2)
    });
  });
});

// 6. サーバーを起動
app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動しました。`);
});