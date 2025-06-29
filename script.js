console.log("JavaScriptが読み込まれました！");

// ... (略)
if (response.ok) {
    // 成功した場合の処理
    resultDiv.className = 'result-success'; // successクラスを追加
    resultDiv.innerHTML = `...`;
} else {
    // エラーが発生した場合の処理
    resultDiv.className = 'result-error'; // errorクラスを追加
    resultDiv.innerHTML = `...`;
}