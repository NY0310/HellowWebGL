/* 
 * 生WebGLで三角形を描画する
 * 
 * # 処理の流れ
 * 1. CanvasDOM取得 & WebGLコンテキストを取得とセットアップ
 * 2. 頂点シェーダコンパイル、フラグメントシェーダコンパイル
 * 3. WebGLProgramの生成、シェーダのアタッチとリンク、有効化
 * 4. 三角ポリゴンの頂点バッファ生成
 * 5. 背景描画
 * 6. ビューポートの設定
 * 7. 頂点属性を有効化してデータを注入
 * 8. 描画する
 * 
 */
//onload・ウェブページのロードのコールバック

window.onload = function () {
    // ======== Start 1.CanvasDOM取得 & WebGLコンテキストを取得とセットアップ ========
    var key = 'canvas';
    //  id プロパティが指定された文字列に一致する要素を表す Element オブジェクトを返します。
    var canvas = document.getElementById(key);
    var gl = canvas.getContext('webgl', null);
    var size = Math.min(window.innerWidth, window.innerHeight);
    canvas.width = size;
    canvas.height = size;
    // ======== End 1.CanvasDOM取得 & WebGLコンテキストを取得とセットアップ ========


    // ======== Start 2.頂点シェーダコンパイル、フラグメントシェーダコンパイル ========
    var vsElement = document.getElementById('vs');
    var vs = null;
    if (vsElement.type == 'x-shader/x-vertex') {
        vs = gl.createShader(gl.VERTEX_SHADER);
    }
    // シェーダオブジェクトに頂点シェーダーを代入
    gl.shaderSource(vs, vsElement.text);
    // 頂点シェーダをコンパイル
    gl.compileShader(vs);

    var fsElement = document.getElementById('fs');
    var fs = null;
    if (fsElement.type == 'x-shader/x-fragment') {
        fs = gl.createShader(gl.FRAGMENT_SHADER);
    }
    // シェーダオブジェクトにフラグメントシェーダを代入
    gl.shaderSource(fs, fsElement.text);
    // フラグメントシェーダをコンパイル
    gl.compileShader(fs);
    // ======== End 2.頂点シェーダコンパイル、フラグメントシェーダコンパイル ========


    // ======== Start 3.WebGLProgramの生成、シェーダのアタッチとリンク、有効化 ========
    // WebGLProgram
    var program = gl.createProgram();
    // WebGLProgramに頂点シェーダーを紐付ける
    gl.attachShader(program, vs);
    // WebGLProgramにフラグメントシェーダーを紐付ける
    gl.attachShader(program, fs);
    // WebGLProgramに紐付けられた、頂点シェーダとフラグメントシェーダをWebGLProgramにリンクさせる
    gl.linkProgram(program);
    // WebGLProgramのパラメータを取得する
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        // WebGLProgramを有効化する
        gl.useProgram(program);
    } else {
        console.log(gl.getProgramInfoLog(program));
        return;
    }
    // ======== End 3.WebGLProgramの生成、シェーダのアタッチとリンク、有効化 ========


    // ======== Start 4.三角ポリゴンの頂点バッファ生成 ========
    // 三角ポリゴンの頂点バッファを生成
    // 空のバッファ生成
    var positionBuffer = gl.createBuffer();
    // 生成したバッファをバインドする
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var position = [
        0, 0.5, 0,
        -0.5, -0.5, 0,
        0.5, -0.5, 0
    ];
    // バインドされたバッファに三角ポリゴンのデータをセットする
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);
    // バインド解除
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    // ======== End 4.三角ポリゴンの頂点バッファ生成 ========

    // 描画開始
    render();

    function render() {
        // ======== Start 5.背景描画 ========
        // 背景描画
        gl.clearColor(0.8, 0.8, 0.8, 1.0);
        // バッファをクリアする(指定された色でクリアするための定数です。COLOR_BUFFER_BIT)
        gl.clear(gl.COLOR_BUFFER_BIT);
        // ======== End 5.背景描画 ========

        // ======== Start 6.ビューポートの設定 ========
        gl.viewport(0, 0, size, size);
        // ======== End 6.ビューポートの設定 ========


        // ======== Start 7.頂点属性を有効化してデータを注入 ========
        // 三角ポリゴン頂点バッファをバインド
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // 頂点シェーダのアドレスを保持
        var positionAddress = gl.getAttribLocation(program, "position");
        // 頂点属性を有効化する
        gl.enableVertexAttribArray(positionAddress);
        // 頂点属性に頂点データを設定する
        gl.vertexAttribPointer(positionAddress, 3, gl.FLOAT, false, 0, 0);
        // ======== End 7.頂点属性を有効化してデータを注入 ========


        // ======== Start 8.描画する ========
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
        // ======== End 8.描画する ========
    }
};