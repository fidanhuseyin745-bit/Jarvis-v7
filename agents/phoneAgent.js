const ADBManager=require('../phone/adbManager');
const Fuzzy=require('../utils/fuzzySearch');
'use strict';

const { execSync, execFileSync } = require('child_process');

const KNOWN_SITES = {
  'google': 'https://google.com',
  'youtube': 'https://youtube.com',
  'whatsapp web': 'https://web.whatsapp.com',
  'instagram': 'https://instagram.com',
  'gmail': 'https://mail.google.com',
  'twitter': 'https://twitter.com',
  'x.com': 'https://x.com'
};

class PhoneAgent {

  constructor() {
    this.appCache = {};
    this.adb = new ADBManager();
  }

  notify(title, content) {
    try {
      execFileSync('termux-notification', ['--title', title, '--content', content]);
      console.log('🔔 Bildirim gönderildi.');
    } catch (e) {
      console.log('❌ Bildirim gönderilemedi:', e.message);
    }
  }

  openUrl(url) {
    try {
      execFileSync('termux-open-url', [url]);
      console.log('🌐 Link açıldı:', url);
    } catch (e) {
      console.log('❌ Link açılamadı:', e.message);
    }
  }

  clipboardSet(text) {
    try {
      execFileSync('termux-clipboard-set', [text]);
      console.log('📋 Panoya kopyalandı.');
    } catch (e) {
      console.log('❌ Panoya yazılamadı:', e.message);
    }
  }

  clipboardGet() {
    try {
      const result = execFileSync('termux-clipboard-get').toString().trim();
      console.log('📋 Pano içeriği:', result);
      return result;
    } catch (e) {
      console.log('❌ Pano okunamadı:', e.message);
      return null;
    }
  }

  batteryStatus() {
    try {
      const result = execFileSync('termux-battery-status').toString();
      const data = JSON.parse(result);
      console.log(`🔋 Batarya: %${data.percentage} (${data.status === 'CHARGING' ? 'şarj oluyor' : 'şarjda değil'})`);
      return data;
    } catch (e) {
      console.log('❌ Batarya durumu alınamadı:', e.message);
      return null;
    }
  }

  call(number) {
    try {
      execFileSync('termux-telephony-call', [number]);
      console.log('📞 Arama başlatıldı:', number);
    } catch (e) {
      console.log('❌ Arama başlatılamadı:', e.message);
    }
  }

  getInstalledPackages() {
    try {
      const raw = execSync('adb shell pm list packages -3').toString();
      const raw2 = execSync('adb shell pm list packages').toString();
      const all = (raw + '\n' + raw2)
        .split('\n')
        .map(l => l.replace('package:', '').trim())
        .filter(Boolean);
      return [...new Set(all)];
    } catch (e) {
      console.log('❌ Uygulama listesi alınamadı (adb bağlı mı?):', e.message);
      return [];
    }
  }

  openPackage(pkg) {

    try {
      const resolved = execSync(`adb shell cmd package resolve-activity --brief ${pkg}`).toString().trim();
      const lines = resolved.split('\n');
      const activityLine = lines[lines.length - 1];

      execSync(`adb shell input keyevent KEYCODE_WAKEUP`, { stdio: 'ignore' });
      execSync(`adb shell wm dismiss-keyguard`, { stdio: 'ignore' });

      if (activityLine && activityLine.includes('/')) {
        execSync(`adb shell am start -n ${activityLine}`, { stdio: 'ignore' });
      } else {
        execSync(`adb shell monkey -p ${pkg} -c android.intent.category.LAUNCHER 1`, { stdio: 'ignore' });
      }

      console.log('📱 Uygulama açıldı:', pkg);

    } catch (e) {
      console.log('❌ Uygulama açılamadı:', e.message);
    }

  }

  bringToFront(pkg) {
    try {
      execSync(`adb shell am start -a android.intent.action.MAIN -c android.intent.category.LAUNCHER -n ${pkg}`, { stdio: 'ignore' });
    } catch (e) {
      // sessizce gec
    }
  }

  isAppInForeground(pkg) {
    try {
      const focus = execSync(`adb shell dumpsys window`).toString();
      const match = focus.match(/mCurrentFocus=.*?([a-zA-Z0-9_.]+)\/[a-zA-Z0-9_.]+/);
      return match && match[1] === pkg;
    } catch (e) {
      return false;
    }
  }

  async ensureForeground(pkg) {
    this.bringToFront(pkg);
    await new Promise(r => setTimeout(r, 500));
    if (this.isAppInForeground(pkg)) return true;
    this.notify('Jarvis', 'Lutfen telefona bakip uygulamayi acik tutar misin, devam ediyorum...');
    await new Promise(r => setTimeout(r, 2500));
    return this.isAppInForeground(pkg);
  }
  async findPackage(appName, aiManager) {

    const simple = appName.toLowerCase().replace(/\s/g, '');

    if (this.appCache[simple]) {
      return this.appCache[simple];
    }

    const packages = this.getInstalledPackages();

    if (packages.length === 0) return null;

    const directMatch = packages.find(p => p.toLowerCase().includes(simple));

    if (directMatch) {
      this.appCache[simple] = directMatch;
      return directMatch;
    }

    if (!aiManager) return null;

    const list = packages.slice(0, 200).join('\n');

    const messages = [
      {
        role: 'system',
        content: 'Sana bir uygulama adi ve kurulu paket adlari listesi verilecek. Kullanicinin istedigi uygulamaya en uygun paket adini SADECE tek satir olarak, baska hicbir aciklama olmadan yaz. Eger hicbiri uymuyorsa sadece NONE yaz.'
      },
      {
        role: 'user',
        content: `Istenen uygulama: ${appName}\n\nKurulu paketler:\n${list}`
      }
    ];

    try {
      const raw = await aiManager.chat(messages, { max_tokens: 60, temperature: 0.1 });
      const pkg = raw.trim().split('\n')[0].trim();

      if (pkg === 'NONE' || !packages.includes(pkg)) return null;

      this.appCache[simple] = pkg;
      return pkg;

    } catch (e) {
      return null;
    }

  }

  async openAppByName(appName, aiManager) {

    const pkg = await this.findPackage(appName, aiManager);

    if (!pkg) {
      console.log('❌ Uygulama bulunamadı:', appName);
      return null;
    }

    this.openPackage(pkg);
    return pkg;

  }

  // ---------- Uygulama içi kontrol (ADB input) ----------

  tap(x, y) {
    try {
      execSync(`adb shell input tap ${x} ${y}`);
    } catch (e) {
      console.log('❌ Dokunma başarısız:', e.message);
    }
  }

  swipe(x1, y1, x2, y2, durationMs) {
    try {
      execSync(`adb shell input swipe ${x1} ${y1} ${x2} ${y2} ${durationMs || 300}`);
    } catch (e) {
      console.log('❌ Kaydırma başarısız:', e.message);
    }
  }

  typeText(text) {
    try {
      const encoded = String(text).replace(/\s/g, '%s');
      execSync(`adb shell input text "${encoded}"`);
    } catch (e) {
      console.log('❌ Yazı yazılamadı:', e.message);
    }
  }

  keyEvent(key) {

    const map = {
      back: 'KEYCODE_BACK',
      home: 'KEYCODE_HOME',
      enter: 'KEYCODE_ENTER',
      del: 'KEYCODE_DEL'
    };

    const code = map[key] || key;

    try {
      execSync(`adb shell input keyevent ${code}`);
    } catch (e) {
      console.log('❌ Tuş gönderilemedi:', e.message);
    }

  }

  dumpScreenElements() {

    try {

      execSync('adb shell uiautomator dump /sdcard/jarvis_dump.xml', { stdio: 'ignore' });
      const xml = execSync('adb shell cat /sdcard/jarvis_dump.xml').toString();

      const nodes = [];
      const nodeRegex = /<node[^>]*\/>/g;
      const matches = xml.match(nodeRegex) || [];

      for (const nodeStr of matches) {

        const textMatch = nodeStr.match(/text="([^"]*)"/);
        const descMatch = nodeStr.match(/content-desc="([^"]*)"/);
        const clickableMatch = nodeStr.match(/clickable="true"/);
        const boundsMatch = nodeStr.match(/bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/);

        const text = (textMatch && textMatch[1]) || (descMatch && descMatch[1]) || '';

        if (!boundsMatch) continue;
        if (!text && !clickableMatch) continue;

        const x1 = parseInt(boundsMatch[1], 10);
        const y1 = parseInt(boundsMatch[2], 10);
        const x2 = parseInt(boundsMatch[3], 10);
        const y2 = parseInt(boundsMatch[4], 10);

        nodes.push({
          text: text,
          clickable: !!clickableMatch,
          x: Math.round((x1 + x2) / 2),
          y: Math.round((y1 + y2) / 2)
        });

      }

      return nodes.slice(0, 40);

    } catch (e) {
      console.log('❌ Ekran okunamadı:', e.message);
      return [];
    }

  }

  async controlApp(goal, aiManager, appName) {

    if (!aiManager) {
      console.log('🤖 AI motoru bağlı değil.');
      return;
    }

    let pkg = null;

    if (appName) {
      pkg = await this.openAppByName(appName, aiManager);
      if (!pkg) return;
      await new Promise(r => setTimeout(r, 1200));
    }

    const maxSteps = 10;

    for (let step = 0; step < maxSteps; step++) {

      if (pkg) { await this.ensureForeground(pkg); }
      const elements = this.dumpScreenElements();

      const elementList = elements
        .map((el, i) => `${i}: "${el.text}" ${el.clickable ? '(tiklanabilir)' : ''}`)
        .join('\n');

      const messages = [
        {
          role: 'system',
          content: [
            'Sen bir telefon ekran kontrol asistanisin. Sana bir hedef ve ekrandaki ogelerin listesi verilecek.',
            'SADECE JSON formatinda cevap ver, baska aciklama ekleme.',
            'Format: {"action": "tap|type|key|swipe|done", "index": 0, "text": "", "key": "back|home|enter", "reply": ""}',
            'action=tap ise index alaninda dokunulacak ogenin numarasini yaz.',
            'action=type ise text alanina yazilacak metni yaz (once tap ile bir yazi kutusuna dokunulmus olmali).',
            'action=key ise key alanina back/home/enter yaz.',
            'action=swipe ise ekranda yukari kaydirmak icin kullan.',
            'Eger uygulama WhatsApp ise ve mesaj gonderme hedefi varsa su sirayla ilerle: 1) arama/ara simgesine dokun, 2) kisi adini yaz (action=type), 3) listede cikan kisiye dokun, 4) mesaj yazma kutusuna dokun, 5) mesaji yaz (action=type), 6) gonder (ok/send) simgesine dokun.',
            'Hedef tamamlandiysa action=done yap ve reply alanina Turkce kisa bir sonuc mesaji yaz.',
            'Eger hicbir oge uygun degilse action=swipe dene ya da action=done ile basarisiz oldugunu bildir.'
          ].join('\n')
        },
        {
          role: 'user',
          content: `Hedef: ${goal}\n\nEkrandaki ogeler:\n${elementList}`
        }
      ];

      try {

        const raw = await aiManager.chat(messages, { max_tokens: 100, temperature: 0.2 });
        const cleaned = raw.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        if (parsed.action === 'done') {
          console.log('✅', parsed.reply || 'İşlem tamamlandı.');
          return;
        }

        if (parsed.action === 'tap') {
          const el = elements[parsed.index];
          if (el) {
            this.tap(el.x, el.y);
            console.log(`👆 Dokunuldu: "${el.text}"`);
          }
        } else if (parsed.action === 'type') {
          this.typeText(parsed.text || '');
          console.log('⌨️ Yazıldı:', parsed.text);
        } else if (parsed.action === 'key') {
          this.keyEvent(parsed.key || 'back');
          console.log('🔘 Tuş:', parsed.key);
        } else if (parsed.action === 'swipe') {
          this.swipe(500, 1500, 500, 500, 300);
          console.log('👇 Kaydırıldı.');
        }

        await new Promise(r => setTimeout(r, 1200));

      } catch (e) {
        console.log('⚠️ Ekran kontrolü sırasında sorun:', e.message);
        return;
      }

    }

    console.log('⏹️ Adım sınırına ulaşıldı, işlem durduruldu.');

  }

  checkKnownSite(input) {
    const text = input.toLowerCase();
    for (const key of Object.keys(KNOWN_SITES)) {
      if (text.includes(key)) return KNOWN_SITES[key];
    }
    return null;
  }

  async assist(input, aiManager) {

    try{


    if(!this.adb.ensure()){
        return "📱 Telefon bağlı değil.";
    }


    const knownUrl = this.checkKnownSite(input);
    if (knownUrl) {
      this.openUrl(knownUrl);
      return;
    }

    const actionWords = ['gonder', 'gönder', 'tikla', 'tıkla', 'ac ve', 'aç ve', 'bas'];
    const lower = input.toLowerCase();

if(
    lower.startsWith("dokun ") ||
    lower.startsWith("kaydır ") ||
    lower.startsWith("yaz ") ||
    lower=="youtube aç" ||
    lower=="whatsapp aç"
){
    return;
}


    if(
      lower.startsWith("dokun") ||
      lower.startsWith("kaydır") ||
      lower.startsWith("youtube aç") ||
      lower.startsWith("whatsapp aç") ||
      lower.startsWith("yaz ")
    ){
      return;
    }


    const looksLikeControl = actionWords.some(w => lower.includes(w));

    if (looksLikeControl && aiManager) {
      await this.controlApp(input, aiManager, null);
      return;
    }

    if (!aiManager) {
      console.log('🤖 AI motoru bağlı değil, bu isteği işleyemiyorum.');
      return;
    }

    const systemPrompt = [
      'Sen bir telefon asistanisin. Kullanicinin istegini analiz et ve SADECE JSON formatinda cevap ver, baska aciklama ekleme, kod blogu isareti kullanma.',
      'Format: {"action": "notify|open_url|open_app|control_app|call|clipboard_set|chat", "params": {}, "reply": ""}',
      '',
      'Ornekler:',
      'Istek: "bana su icmemi hatirlat" -> {"action": "notify", "params": {"title": "Hatirlatma", "content": "Su icmeyi unutma"}, "reply": ""}',
      'Istek: "youtube ac" -> {"action": "open_url", "params": {"url": "https://youtube.com"}, "reply": ""}',
      'Istek: "whatsappi ac" -> {"action": "open_app", "params": {"name": "whatsapp"}, "reply": ""}',
      'Istek: "whatsappta ahmete merhaba yaz" -> {"action": "control_app", "params": {"app": "whatsapp", "goal": "Ahmet adli kisiye merhaba mesaji gonder"}, "reply": ""}',
      'Istek: "spotifyde lofi calsin" -> {"action": "control_app", "params": {"app": "spotify", "goal": "lofi muzik ara ve calistir"}, "reply": ""}',
      'Istek: "annemi ara" -> {"action": "chat", "params": {}, "reply": "Kimi aramak istedigini numarasiyla belirtmelisin."}',
      'Istek: "en buyuk gezegen hangisi" -> {"action": "chat", "params": {}, "reply": "Jupiter en buyuk gezegendir."}',
      '',
      'Sadece uygulamayi acmak istiyorsa action=open_app kullan.',
      'Uygulama icinde bir islem yapmasi (mesaj gonder, arama yap, oynat, ara vb.) isteniyorsa action=control_app kullan, params.app alanina uygulama adini, params.goal alanina yapilacak islemi Turkce yaz.',
      'Sadece gercek bir telefon numarasi belirtilmisse action=call kullan.',
      'Eger istek hicbir kategoriye tam uymuyorsa action=chat yap ve reply alanina Turkce, dogal, kisa bir cevap yaz.'
    ].join('\n');

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: input }
    ];

    try {

      const raw = await aiManager.chat(messages, { max_tokens: 120, temperature: 0.2 });
      const cleaned = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      if (parsed.action === 'call') {
        const number = parsed.params && parsed.params.number;
        const isValidNumber = number && /^[0-9+][0-9\s]{4,}$/.test(number);
        if (!isValidNumber) {
          console.log('💬', parsed.reply || 'Aramak için geçerli bir numara belirtmelisin.');
          return;
        }
        this.call(number);
        return;
      }

      if (parsed.action === 'open_app') {
        const name = (parsed.params && parsed.params.name) || '';
        await this.openAppByName(name, aiManager);
        return;
      }

      if (parsed.action === 'control_app') {
        const appName = (parsed.params && parsed.params.app) || '';
        const goal = (parsed.params && parsed.params.goal) || input;
        await this.controlApp(goal, aiManager, appName);
        return;
      }

      switch (parsed.action) {
        case 'notify':
          this.notify((parsed.params && parsed.params.title) || 'Jarvis', (parsed.params && parsed.params.content) || '');
          break;
        case 'open_url':
          this.openUrl(parsed.params && parsed.params.url);
          break;
        case 'clipboard_set':
          this.clipboardSet(parsed.params && parsed.params.text);
          break;
        case 'chat':
        default:
          console.log('💬', parsed.reply || raw);
          break;
      }

    } catch (e) {
      console.log('⚠️ İsteği işlerken sorun oluştu:', e.message);
    }

    } finally {
      this.adb.stop();
    }

  }

}

module.exports = PhoneAgent;
