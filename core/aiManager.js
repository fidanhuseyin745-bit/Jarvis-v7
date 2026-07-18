'use strict';

const { spawn, execSync } = require('child_process');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

function execSyncCheck(cmd) {
  execSync(cmd, { stdio: 'pipe' });
}

const LLAMA_SERVER_BIN = '/data/data/com.termux/files/home/llama.cpp/build/bin/llama-server';
const MODEL_PATH = '/data/data/com.termux/files/home/models/qwen2.5-1.5b-instruct-q4_k_m.gguf';
const HOST = '127.0.0.1';
const PORT = 9000;
const BASE_URL = `http://${HOST}:${PORT}`;

const CHAT_TIMEOUT_MS = 600000;
const DEFAULT_MAX_TOKENS = 150;

class AIManager {

  constructor() {
    this.serverProcess = null;
    this.starting = null;
    this.serverReady = false;
  }

  // ---------- Sunucu yönetimi ----------

  async isServerUp() {
    try {
      await axios.get(`${BASE_URL}/health`, { timeout: 1500 });
      return true;
    } catch (e) {
      return false;
    }
  }

  async ensureServer() {

    if (this.serverReady) {
      return true;
    }

    if (await this.isServerUp()) {
      this.serverReady = true;
      return true;
    }

    if (this.starting) {
      return this.starting;
    }

    this.starting = this._startServer();

    const result = await this.starting;
    this.starting = null;
    this.serverReady = false;

    return result;

  }

  _startServer() {

    return new Promise((resolve) => {

      if (!fs.existsSync(LLAMA_SERVER_BIN)) {
        console.log('❌ llama-server bulunamadı:', LLAMA_SERVER_BIN);
        return resolve(false);
      }

      if (!fs.existsSync(MODEL_PATH)) {
        console.log('❌ Model dosyası bulunamadı:', MODEL_PATH);
        return resolve(false);
      }

      console.log('🧠 AI motoru başlatılıyor (llama-server)...');

      const cmd = 'nohup "' + LLAMA_SERVER_BIN + '" -m "' + MODEL_PATH + '" --host ' + HOST +
        ' --port ' + String(PORT) + ' -c 4096 -t ' + String(require('os').cpus().length) +
        ' > /dev/null 2>&1 &';

      this.serverProcess = spawn('sh', ['-c', cmd], {
        cwd: path.dirname(LLAMA_SERVER_BIN),
        detached: true,
        stdio: 'ignore'
      });

      this.serverProcess.unref();

      this.serverProcess.on('error', (e) => {
        console.log('❌ AI motoru başlatılamadı:', e.message);
        resolve(false);
      });

      this.serverProcess.on('exit', () => {
        this.serverProcess = null;
      });

      this._waitUntilReady(30000).then((ok)=>{
        if(ok) this.serverReady = true;
        resolve(ok);
      });

    });

  }

  async _waitUntilReady(timeoutMs) {

    const start = Date.now();

    while (Date.now() - start < timeoutMs) {

      if (await this.isServerUp()) {
        console.log('✅ AI motoru hazır.');
        return true;
      }

      await new Promise(r => setTimeout(r, 1000));
    }

    console.log('❌ AI motoru zamanında hazır olmadı.');
    return false;

  }

  stopServer() {

    if (this.serverProcess) {
      try {
        this.serverProcess.kill('SIGTERM');
      } catch (e) {
        // yoksay
      }
      this.serverProcess = null;
    }

  }

  // ---------- Model ile konuşma ----------

  async chat(messages, options = {}) {

    const ready = await this.ensureServer();

    if (!ready) {
      throw new Error('AI motoru şu an kullanılamıyor.');
    }

    let response;

    try {

      response = await axios.post(
        `${BASE_URL}/v1/chat/completions`,
        {
          model: 'qwen2.5-1.5b-instruct',
          messages,
          temperature: options.temperature ?? 0.3,
          max_tokens: options.max_tokens ?? DEFAULT_MAX_TOKENS
        },
        { timeout: CHAT_TIMEOUT_MS }
      );

    } catch (e) {

      if (e.response && e.response.data) {
        console.log('🧾 AI sunucusu hata detayı:', JSON.stringify(e.response.data));
      }

      throw e;

    }

    const choice = response.data && response.data.choices && response.data.choices[0];

    if (!choice || !choice.message) {
      throw new Error('AI motorundan geçerli bir yanıt alınamadı.');
    }

    return choice.message.content;

  }

  // ---------- Proje odaklı yardımcı fonksiyonlar ----------

  readProjectSnapshot(dir, maxFiles = 6, maxCharsPerFile = 800) {

    const ignoreDirs = new Set(['node_modules', '.git', 'dist', 'build', '__pycache__', 'venv', '.jarvis-backups', '.jarvis-backup']);

    const files = [];

    const walk = (current) => {

      if (files.length >= maxFiles) return;

      const entries = fs.readdirSync(current, { withFileTypes: true });

      for (const entry of entries) {

        if (files.length >= maxFiles) return;

        if (entry.isDirectory()) {
          if (!ignoreDirs.has(entry.name)) {
            walk(path.join(current, entry.name));
          }
          continue;
        }

        const fullPath = path.join(current, entry.name);
        const rel = path.relative(dir, fullPath);

        const codeExtensions = ['.js', '.jsx', '.py', '.json', '.html', '.css'];
        if (!codeExtensions.includes(path.extname(entry.name))) continue;

        try {

          let content = fs.readFileSync(fullPath, 'utf8');

          if (content.length > maxCharsPerFile) {
            content = content.slice(0, maxCharsPerFile) + '\n... (kırpıldı)';
          }

          files.push({ path: rel, content });

        } catch (e) {
          // okunamayan dosyayı atla
        }

      }

    };

    walk(dir);

    return files;

  }

  buildProjectContext(dir) {

    const files = this.readProjectSnapshot(dir);

    return files
      .map(f => `--- ${f.path} ---\n${f.content}`)
      .join('\n\n');

  }

  async analyze(dir) {

    if (!dir) throw new Error('Aktif proje yok.');

    console.log('🔍 Proje analiz ediliyor, bu biraz sürebilir...');

    const context = this.buildProjectContext(dir);

    const messages = [
      {
        role: 'system',
        content: 'Sen deneyimli bir yazılım mimarısın. Verilen proje dosyalarını analiz et. Kısa, net, madde madde bir değerlendirme yap: proje ne yapıyor, olası hatalar/riskler neler, iyileştirme önerileri neler. Türkçe cevap ver.'
      },
      {
        role: 'user',
        content: `Aşağıda bir projenin dosyaları var. Analiz et:\n\n${context}`
      }
    ];

    const result = await this.chat(messages, { max_tokens: DEFAULT_MAX_TOKENS });

    console.log('\n📋 Analiz Sonucu:\n');
    console.log(result);

    return result;

  }

  async fix(dir) {

    if (!dir) throw new Error('Aktif proje yok.');

    console.log('🛠️ Hatalar tespit ediliyor, bu biraz sürebilir...');

    const context = this.buildProjectContext(dir);

    const messages = [
      {
        role: 'system',
        content: 'Sen deneyimli bir yazılım mühendisisin. Verilen proje dosyalarında sözdizimi hatası, mantık hatası, veya eksik/yanlış import gibi sorunları tespit et. Her sorunu hangi dosyada olduğunu belirterek listele ve nasıl düzeltileceğini kısaca açıkla. Türkçe cevap ver. Eğer belirgin bir hata bulamazsan bunu açıkça belirt.'
      },
      {
        role: 'user',
        content: `Aşağıdaki projede hata ara:\n\n${context}`
      }
    ];

    const result = await this.chat(messages, { max_tokens: DEFAULT_MAX_TOKENS });

    console.log('\n🛠️ Bulgular:\n');
    console.log(result);

    return result;

  }

  async edit(dir, instruction) {

    if (!dir) throw new Error('Aktif proje yok.');

    console.log('✏️ İstek işleniyor, bu biraz sürebilir...');

    const context = this.buildProjectContext(dir);

    const messages = [
      {
        role: 'system',
        content: 'Sen deneyimli bir yazılım mühendisisin. Kullanıcının isteğine göre projede hangi dosyanın nasıl değiştirilmesi gerektiğini söyle. Sadece öneri ve kod parçacığı ver, dosyaları otomatik değiştirme; kullanıcı manuel uygulayacak. Türkçe cevap ver.'
      },
      {
        role: 'user',
        content: `Proje dosyaları:\n\n${context}\n\nKullanıcının isteği: "${instruction}"\n\nBu isteği karşılamak için hangi dosyada ne değişmeli, göster.`
      }
    ];

    const result = await this.chat(messages, { max_tokens: DEFAULT_MAX_TOKENS });

    console.log('\n✏️ Öneri:\n');
    console.log(result);

    return result;

  }

  backupFile(filePath) {

    if (!fs.existsSync(filePath)) return null;

    const dir = path.dirname(filePath);
    const backupsDir = path.join(dir, '.jarvis-backups');

    fs.mkdirSync(backupsDir, { recursive: true });

    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupsDir, `${path.basename(filePath)}.${stamp}.bak`);

    fs.copyFileSync(filePath, backupPath);

    return backupPath;

  }

  async generateReadme(dir) {

    if (!dir) throw new Error('Aktif proje yok.');

    console.log('📝 README oluşturuluyor, bu biraz sürebilir...');

    const context = this.buildProjectContext(dir);

    const messages = [
      {
        role: 'system',
        content: 'Sen deneyimli bir yazılım mühendisisin. Verilen proje dosyalarına bakarak bu proje için profesyonel bir README.md dosyası yaz. SADECE markdown içeriğini ver, başka açıklama, önsöz veya kod bloğu işareti (```) ekleme. Türkçe yaz.'
      },
      {
        role: 'user',
        content: `Proje dosyaları:\n\n${context}\n\nBu proje için bir README.md oluştur.`
      }
    ];

    const result = await this.chat(messages, { max_tokens: DEFAULT_MAX_TOKENS });

    const readmePath = path.join(dir, 'README.md');

    const backupPath = this.backupFile(readmePath);

    fs.writeFileSync(readmePath, result.trim() + '\n');

    console.log('✅ README.md güncellendi.');

    if (backupPath) {
      console.log('🗄️ Eski sürüm yedeklendi:', backupPath);
    }

    return result;

  }

  validateSyntax(filePath) {

    const ext = path.extname(filePath);

    try {

      if (ext === '.js' || ext === '.jsx') {
        execSyncCheck(`node --check "${filePath}"`);
        return { valid: true };
      }

      if (ext === '.py') {
        execSyncCheck(`python3 -m py_compile "${filePath}"`);
        return { valid: true };
      }

      return { valid: true };

    } catch (e) {
      return { valid: false, error: e.message };
    }

  }

  async applyEdit(dir, instruction) {

    if (!dir) throw new Error('Aktif proje yok.');

    console.log('✏️ Değişiklik hazırlanıyor, bu biraz sürebilir...');

    const context = this.buildProjectContext(dir);

    const messages = [
      {
        role: 'system',
        content: 'Sen deneyimli bir yazılım mühendisisin. Kullanıcının isteğine göre, verilen proje dosyalarından SADECE BİR TANESİNİ değiştir. Yanıtını TAM OLARAK şu formatta ver, başka hiçbir açıklama veya metin ekleme:\nDOSYA: <değiştirilecek dosyanın göreli yolu>\n---\n<dosyanın TAM yeni içeriği>\n---'
      },
      {
        role: 'user',
        content: `Proje dosyaları:\n\n${context}\n\nİstek: "${instruction}"\n\nBu isteği karşılamak için hangi dosyayı nasıl değiştireceğini yukarıdaki formatta ver.`
      }
    ];

    const result = await this.chat(messages, { max_tokens: 600 });

    const fileMatch = result.match(/DOSYA:\s*(.+)/);
    const bodyMatch = result.match(/---\s*\n([\s\S]*?)\n---/);

    if (!fileMatch || !bodyMatch) {
      console.log('⚠️ AI beklenen formatta yanıt vermedi, otomatik değişiklik yapılamadı.');
      console.log('\nHam yanıt:\n' + result);
      return null;
    }

    const relPath = fileMatch[1].trim();
    const newContent = bodyMatch[1];
    const targetPath = path.join(dir, relPath);

    if (!targetPath.startsWith(dir)) {
      console.log('❌ Güvenlik: proje dizini dışına yazma engellendi:', relPath);
      return null;
    }

    if (!fs.existsSync(targetPath)) {
      console.log(`⚠️ Dosya bulunamadı: ${relPath}. Otomatik değişiklik yapılamadı.`);
      console.log('\nAI önerisi:\n' + result);
      return null;
    }

    const tmpPath = targetPath + '.jarvis-tmp';
    fs.writeFileSync(tmpPath, newContent);

    const validation = this.validateSyntax(tmpPath);

    if (!validation.valid) {
      fs.unlinkSync(tmpPath);
      console.log('❌ AI\'ın önerdiği kod sözdizimi hatası içeriyor, dosya DEĞİŞTİRİLMEDİ.');
      console.log('Hata detayı:', validation.error);
      console.log('\nHam AI yanıtı:\n' + result);
      return null;
    }

    fs.unlinkSync(tmpPath);

    const backupPath = this.backupFile(targetPath);

    fs.writeFileSync(targetPath, newContent);

    console.log(`✅ ${relPath} güncellendi (sözdizimi doğrulandı).`);

    if (backupPath) {
      console.log('🗄️ Eski sürüm yedeklendi:', backupPath);
    }

    return { file: relPath, backupPath };

  }

  async generateFeature(dir, instruction) {

    if (!dir) throw new Error('Aktif proje yok.');

    console.log('🧩 Özellik oluşturuluyor, bu biraz sürebilir...');

    const files = this.readProjectSnapshot(dir, 2, 200);
    const context = files.map(f => '--- ' + f.path + ' ---\n' + f.content).join('\n\n');

    const messages = [
      {
        role: 'system',
        content: 'Sen deneyimli bir yazilim muhendisisin. Kullanicinin istedigi ozelligi eklemek icin gerekli dosyalari olustur. Yanitini SADECE su formatta ver, baska hicbir aciklama ekleme:\nDOSYA: <goreli yol>\n---\n<dosyanin TAM icerigi>\n---\nSADECE 1 dosya olustur, cok kisa ve calisan kod yaz, aciklama satiri ekleme.'
      },
      {
        role: 'user',
        content: 'Proje dosyalari:\n\n' + context + '\n\nIstenen ozellik: "' + instruction + '"'
      }
    ];

    const result = await this.chat(messages, { max_tokens: 300 });

    const blocks = result.split(/DOSYA:/).slice(1);
    const created = [];
    const failed = [];

    for (const block of blocks) {

      const fileMatch = block.match(/^\s*(.+)/);
      const bodyMatch = block.match(/---\s*\n([\s\S]*?)\n---/);

      if (!fileMatch || !bodyMatch) continue;

      const relPath = fileMatch[1].trim();
      const content = bodyMatch[1];
      const targetPath = path.join(dir, relPath);

      if (!targetPath.startsWith(dir)) {
        failed.push({ file: relPath, reason: 'guvenlik: proje disi yol' });
        continue;
      }

      fs.mkdirSync(path.dirname(targetPath), { recursive: true });

      const tmpPath = targetPath + '.jarvis-tmp';
      fs.writeFileSync(tmpPath, content);

      const validation = this.validateSyntax(tmpPath);

      if (!validation.valid) {
        fs.unlinkSync(tmpPath);
        failed.push({ file: relPath, reason: validation.error });
        continue;
      }

      fs.unlinkSync(tmpPath);

      if (fs.existsSync(targetPath)) {
        this.backupFile(targetPath);
      }

      fs.writeFileSync(targetPath, content);
      created.push(relPath);

    }

    console.log('✅ Oluşturulan dosyalar:', created.join(', ') || '(yok)');

    if (failed.length > 0) {
      console.log('⚠️ Başarısız dosyalar:');
      failed.forEach(f => console.log('  -', f.file, ':', f.reason));
    }

    return { created, failed };

  }

  // ---------- AI Patch Sistemi + Auto Rollback ----------

  runProjectTests(dir) {

    const pkgPath = path.join(dir, 'package.json');

    if (!fs.existsSync(pkgPath)) {
      return { ran: false, passed: false, output: '' };
    }

    let pkg;

    try {
      pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    } catch (e) {
      return { ran: false, passed: false, output: '' };
    }

    if (!pkg.scripts || !pkg.scripts.test) {
      return { ran: false, passed: false, output: '' };
    }

    try {

      execSync('npm test', { cwd: dir, stdio: 'pipe', timeout: 60000 });

      return { ran: true, passed: true, output: '' };

    } catch (e) {

      const output = (e.stdout ? e.stdout.toString() : '') + (e.stderr ? e.stderr.toString() : e.message);

      return { ran: true, passed: false, output };

    }

  }

  backupOriginalFile(dir, backupRoot, relPath) {

    const sourcePath = path.join(dir, relPath);

    if (!fs.existsSync(sourcePath)) {
      return null;
    }

    const destPath = path.join(backupRoot, relPath);

    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(sourcePath, destPath);

    return destPath;

  }

  restoreFromBackup(dir, backupRoot, changedFiles) {

    for (const entry of changedFiles) {

      const targetPath = path.join(dir, entry.relPath);

      if (entry.existedBefore) {

        const backupPath = path.join(backupRoot, entry.relPath);

        if (fs.existsSync(backupPath)) {
          fs.mkdirSync(path.dirname(targetPath), { recursive: true });
          fs.copyFileSync(backupPath, targetPath);
        }

      } else {

        if (fs.existsSync(targetPath)) {
          fs.unlinkSync(targetPath);
        }

      }

    }

  }

  cleanupBackupDir(backupRoot) {

    try {
      fs.rmSync(backupRoot, { recursive: true, force: true });
    } catch (e) {
      // yoksay, kritik degil
    }

  }

  async patchProject(dir, instruction, memoryContext) {

    if (!dir) throw new Error('Aktif proje yok.');

    const sessionId = 'patch-' + Date.now();
    const backupRoot = path.join(dir, '.jarvis-backup', sessionId);

    const files = this.readProjectSnapshot(dir, 3, 400);
    const context = files.map(f => '--- ' + f.path + ' ---\n' + f.content).join('\n\n');

    const basePrompt = 'Sen deneyimli bir yazilim muhendisisin. Kullanicinin istegine gore ilgili dosyalari degistir veya yeni dosya olustur. Yanitini SADECE su formatta ver, baska hicbir aciklama ekleme:\nDOSYA: <goreli yol>\n---\n<dosyanin TAM icerigi>\n---\nEn fazla 2 dosya degistir, kisa ve calisan kod yaz.';

    const runAttempt = async (extraNote) => {

      const messages = [
        { role: 'system', content: basePrompt },
        {
          role: 'user',
          content: 'Proje dosyalari:\n\n' + context + '\n\nIstek: "' + instruction + '"' + (extraNote || '')
        }
      ];

      const result = await this.chat(messages, { max_tokens: 400 });

      const blocks = result.split(/DOSYA:/).slice(1);
      const changedFiles = [];
      const errors = [];

      for (const block of blocks) {

        const fileMatch = block.match(/^\s*(.+)/);
        const bodyMatch = block.match(/---\s*\n([\s\S]*?)\n---/);

        if (!fileMatch || !bodyMatch) continue;

        const relPath = fileMatch[1].trim();
        const newContent = bodyMatch[1];
        const targetPath = path.join(dir, relPath);

        if (!targetPath.startsWith(dir)) {
          errors.push({ file: relPath, reason: 'guvenlik: proje disi yol' });
          continue;
        }

        const existedBefore = fs.existsSync(targetPath);

        const tmpPath = targetPath + '.jarvis-tmp';
        fs.mkdirSync(path.dirname(tmpPath), { recursive: true });
        fs.writeFileSync(tmpPath, newContent);

        const validation = this.validateSyntax(tmpPath);

        if (!validation.valid) {
          fs.unlinkSync(tmpPath);
          errors.push({ file: relPath, reason: validation.error });
          continue;
        }

        fs.unlinkSync(tmpPath);

        if (existedBefore) {
          this.backupOriginalFile(dir, backupRoot, relPath);
        }

        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.writeFileSync(targetPath, newContent);

        changedFiles.push({ relPath, existedBefore });

      }

      return { changedFiles, errors };

    };

    const evaluateAttempt = (attemptResult) => {

      const syntaxOk = attemptResult.errors.length === 0;
      const hasChanges = attemptResult.changedFiles.length > 0;

      let testResult = { ran: false, passed: false, output: '' };

      if (syntaxOk && hasChanges) {
        testResult = this.runProjectTests(dir);
      }

      const testOk = !testResult.ran || testResult.passed;
      const success = syntaxOk && hasChanges && testOk;

      return { success, testResult, syntaxOk, hasChanges };

    };

    console.log('🔧 Değişiklik hazırlanıyor, bu biraz sürebilir...');

    let attempt1 = await runAttempt('');
    let evaluation1 = evaluateAttempt(attempt1);

    if (evaluation1.success) {

      console.log('✅ Değiştirilen/oluşturulan dosyalar:', attempt1.changedFiles.map(f => f.relPath).join(', '));

      if (evaluation1.testResult.ran) {
        console.log('✅ Testler başarılı.');
      }

      this.cleanupBackupDir(backupRoot);

      return { success: true, applied: attempt1.changedFiles.map(f => f.relPath), rolledBack: false };

    }

    console.log('⚠️ İlk deneme başarısız oldu, AI hatayı düzeltmeye çalışıyor...');

    if (attempt1.errors.length > 0) {
      attempt1.errors.forEach(e => console.log('  - Sözdizimi hatası:', e.file, ':', e.reason));
    }

    if (evaluation1.testResult.ran && !evaluation1.testResult.passed) {
      console.log('  - Test hatası:', evaluation1.testResult.output.slice(0, 300));
    }

    this.restoreFromBackup(dir, backupRoot, attempt1.changedFiles);

    const errorSummary = attempt1.errors.map(e => e.file + ': ' + e.reason).join(' | ');
    const testSummary = evaluation1.testResult.ran ? evaluation1.testResult.output.slice(0, 500) : '';

    const retryNote = '\n\nOnceki denemende su sorunlar olustu.' +
      (errorSummary ? ' Sozdizimi hatalari: ' + errorSummary + '.' : '') +
      (testSummary ? ' Test ciktisi: ' + testSummary + '.' : '') +
      ' Bu hatalari gidererek kodu tekrar yaz.';

    let attempt2 = await runAttempt(retryNote);
    let evaluation2 = evaluateAttempt(attempt2);

    if (evaluation2.success) {

      console.log('✅ Düzeltme başarılı. Değiştirilen dosyalar:', attempt2.changedFiles.map(f => f.relPath).join(', '));

      if (evaluation2.testResult.ran) {
        console.log('✅ Testler başarılı.');
      }

      this.cleanupBackupDir(backupRoot);

      return { success: true, applied: attempt2.changedFiles.map(f => f.relPath), rolledBack: false };

    }

    console.log('❌ İkinci deneme de başarısız oldu, otomatik rollback yapılıyor...');

    this.restoreFromBackup(dir, backupRoot, attempt2.changedFiles);
    this.cleanupBackupDir(backupRoot);

    console.log('↩️ Rollback tamamlandı: proje değişiklik öncesi haline döndürüldü.');

    if (attempt2.errors.length > 0) {
      attempt2.errors.forEach(e => console.log('  - Sözdizimi hatası:', e.file, ':', e.reason));
    }

    if (evaluation2.testResult.ran && !evaluation2.testResult.passed) {
      console.log('  - Test hatası:', evaluation2.testResult.output.slice(0, 300));
    }

    return { success: false, applied: [], rolledBack: true };

  }

}

module.exports = AIManager;
