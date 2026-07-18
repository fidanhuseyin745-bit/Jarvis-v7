'use strict';

const simpleGit = require('simple-git');
const os = require('node:os');

const registry = require('../commands/registry');
const Patch=require('../commands/patch');
const Planner = require('../planner/planner');
const PluginManager = require('../plugins/pluginManager');
const selfUpdate = require('../commands/selfUpdate');
const CodeGenerator = require('../agents/codeGenerator');
const Reviewer = require('../agents/reviewer');
const planner=require('../planner');
const Fixer = require('../agents/fixer');
const WebAgent = require('../agents/webAgent');
const FileAgent = require('../agents/fileAgent');
const WorkflowEngine = require('../agents/workflowEngine');
const VoiceAgent = require('../agents/voiceAgent');
const ContextManager = require('../agents/contextManager');

function fs_existsSyncSafe(p) {
  try {
    return require('fs').existsSync(p);
  } catch (e) {
    return false;
  }
}
const WebClient = require('../agents/webClient');
const Orchestrator = require('../agents/orchestrator');
const TaskManager = require('../agents/taskManager');
const Executor = require('../agents/executor');
const Architect = require('../agents/architect');
const Memory = require('../agents/memory');
const PhoneAgent = require('../agents/phoneAgent');
const TerminalAgent = require('../agents/terminalAgent');
class Router {

  constructor({ projects, builder, runner, ai }) {
    this.projects = projects;
    this.builder = builder;
this.codeGenerator = new CodeGenerator(projects);
    this.reviewer = new Reviewer();
    this.fixer = new Fixer();
    this.web = new WebAgent();
    this.webClient = new WebClient();
    this.orchestrator = new Orchestrator(this);
    this.pluginManager = new PluginManager();   
 this.runner = runner;
    this.ai = ai || null;

    this.planner = new Planner(builder);
    this.planner.builder = builder;

    this.contextManager = new ContextManager();
    this.memory = new Memory(this.contextManager);
    this.architect = new Architect();
    this.taskManager = new TaskManager();
    this.executor = new Executor(builder, this.taskManager, ai, projects);
    this.phone = new PhoneAgent();
    this.terminal = new TerminalAgent();
    this.fileAgent = new FileAgent();
    this.workflowEngine = new WorkflowEngine();
    this.voice = new VoiceAgent();
  }

  async handle(input) {

    const referencedProject = this.contextManager.resolveReference(input);

    if (referencedProject && fs_existsSyncSafe(referencedProject)) {
      try {
        this.projects.setCurrent(referencedProject);
        console.log('🧭 Önceki projeye dönüldü:', referencedProject);
      } catch (e) {
        // proje artik yoksa sessizce gec
      }
    }

    try{

      const plan=await planner.run(input);

      if(plan && plan.length){

        console.log("📋 PLAN => "+plan.map(x=>x.agent).join(" -> "));

      }

    }catch(e){

      console.log("⚠ Planner:",e.message);

    }
    
    if(input.toLowerCase()=="kendini güncelle"){
      selfUpdate();
      return;
    }

    if (input.toLowerCase() === "pluginler") {
      console.log("📦 Pluginler");
      this.pluginManager.list().forEach(p=>console.log("- "+p));
      return;
    }

    const parts=input.split(" ");


// ===== ADB COMMANDS =====
if(input.toLowerCase()=="youtube aç")
  return this.pluginManager.run("adb","youtube");

if(input.toLowerCase()=="whatsapp aç")
  return this.pluginManager.run("adb","whatsapp");

if(input.startsWith("dokun "))
  return this.pluginManager.run("adb","tap",input.substring(6));

if(input.startsWith("kaydır "))
  return this.pluginManager.run("adb","swipe",input.substring(7));

if(input.startsWith("yaz "))
  return this.pluginManager.run("adb","text",input.substring(4));
// ========================


    if(this.pluginManager.has(parts[0])){
      this.pluginManager.run(parts[0],parts.slice(1).join(" "));
      return;
    }


    
    if(input.toLowerCase()=="kendini güncelle"){
      selfUpdate();
      return;
    }



    

    

    

    

    







if(input.toLowerCase().trim() === "youtube ac" || input.toLowerCase().trim() === "youtube aç"
|| input.toLowerCase().startsWith("whatsapp")
|| input.toLowerCase().startsWith("dokun")
|| input.toLowerCase().startsWith("kaydır")
|| input.toLowerCase().startsWith("yaz ")){
  return;
}

//ADB_FAST_EXIT


/* ===== JARVIS V7 ADB FAST PATH ===== */

if(input.toLowerCase()=="youtube aç")
    return this.pluginManager.run("adb","youtube");

if(input.toLowerCase()=="whatsapp aç")
    return this.pluginManager.run("adb","whatsapp");

if(input.startsWith("dokun "))
    return this.pluginManager.run("adb","tap",input.substring(6));

if(input.startsWith("kaydır "))
    return this.pluginManager.run("adb","swipe",input.substring(7));

if(input.startsWith("yaz "))
    return this.pluginManager.run("adb","text",input.substring(4));

/* ================================ */


    if(input.toLowerCase().startsWith("internette araştır ")){
      const q=input.substring(20).trim();
      const r=await this.webClient.search(q);

      console.log("\n🌐 Sonuçlar:\n");

      (r.results||[]).forEach((x,i)=>{
        console.log((i+1)+". "+x.title);
        console.log("   "+x.url);
        console.log("   "+x.snippet+"\n");
      });

      return;
    }


const action = registry.match(input);

    if (!action) {
      if(
        input.toLowerCase().trim() === "youtube ac" || input.toLowerCase().trim() === "youtube aç" ||
        input.toLowerCase().startsWith("whatsapp") ||
        input.toLowerCase().startsWith("dokun") ||
        input.toLowerCase().startsWith("kaydır") ||
        input.toLowerCase().startsWith("yaz ")
      ){
        return;
      }
      if(
    input.startsWith("dokun ") ||
    input.startsWith("kaydır ") ||
    input.startsWith("yaz ") ||
    input.toLowerCase()=="youtube aç" ||
    input.toLowerCase()=="whatsapp aç"
){
    return;
}
return this.routeFallback(input);
    }

    switch (action) {

      case 'help':
        return this.showHelp();

      case 'status':
        return this.showStatus();

      case 'git':
        return this.gitStatus();

      case 'list_projects':
        return this.listProjects();

      case 'select_project':
        return this.selectProject(input);

      case 'create_express':
        return this.codeGenerator.generateExpress();

      case 'create_react':
        return this.builder.build('react oluştur');

      case 'create_vue':
        return this.builder.build('vue oluştur');
      case 'create_nextjs':
        return this.builder.build('next.js oluştur');

      case 'create_flask':
        return this.builder.build('flask oluştur');

      case 'create_fastapi':
        return this.builder.build('fastapi oluştur');

      case 'run':
        return this.runner.run();

      case 'phone_battery':
        return this.phone.batteryStatus();

      case 'phone_clipboard_get':
        return this.phone.clipboardGet();

      case 'speak_text':
        return this.speakText(input);

      case 'voice_command':
        return this.runVoiceCommand();

      case 'plugin_list':
        return this.listPlugins();

      case 'plugin_enable':
        return this.togglePlugin(input, true);

      case 'plugin_disable':
        return this.togglePlugin(input, false);

      case 'plugin_run':
        return this.runPlugin(input);

      case 'workflow_create':
        return this.createWorkflow(input);

      case 'workflow_list':
        return this.listWorkflows();

      case 'workflow_run':
        return this.runWorkflow(input);

      case 'file_task':
        return this.runFileTask(input);

      case 'web_search':
        return this.runWebSearch(input);

      case 'terminal_run':
        return this.runTerminal(input);

      case 'auto_build':
        return this.autoBuild(input);

      
      case 'build_ai':
        return this.orchestrator.build(input);


      case 'planner':
        return this.planner.create(input);

      case 'apply_plan':
        return this.planner.apply();

      case 'add_login':
        return this.withProject(() => this.builder.addLogin());

      case 'add_jwt':
        return this.withProject(() => this.builder.addJWT());

      case 'add_sqlite':
        return this.withProject(() => this.builder.addSQLite());

      case 'add_postgres':
        return this.withProject(() => this.builder.addPostgres());

      case 'add_mongo':
        return this.withProject(() => this.builder.addMongo());

      case 'add_tailwind':
        return this.withProject(() => this.builder.addTailwind());

      case 'add_cors':
        return this.withProject(() => this.builder.addCors());

      case 'add_helmet':
        return this.withProject(() => this.builder.addHelmet());
      case 'add_ratelimit':
        return this.withProject(() => this.builder.addRateLimit());

      case 'add_oauth':
        return this.withProject(() => this.builder.addOAuth());

      case 'add_docker':
        return this.withProject(() => this.builder.addDocker());

      case 'add_docker_compose':
        return this.withProject(() => this.builder.addDockerCompose());

      case 'add_github_actions':
        return this.withProject(() => this.builder.addGithubActions());

      case 'add_swagger':
        return this.withProject(() => this.builder.addSwagger());

      case 'add_test':
        return this.withProject(() => this.builder.addTest());

      case 'patch':
        return this.patch.run(input);
      case 'generate_readme':
        return this.withAI(() => this.ai.generateReadme(this.projects.getCurrent()));

      case 'analyze':
        return this.withAI(() => this.ai.analyze(this.projects.getCurrent()));

      
      case 'review':
        return console.log(
          this.reviewer.review([
            "core/router.js",
            "agents/phoneAgent.js",
            "plugins/pluginManager.js"
          ])
        );


      case 'fix':
        return this.withAI(() => this.ai.fix(this.projects.getCurrent()));

      case 'show_memory':
        return this.showMemory();

      case 'patch_project':
        return this.withAI(async () => {
          const summary = this.memory.recentSummary(this.projects.getCurrent(), 5);
          if((input.trim() === "youtube ac" || input.trim() === "youtube aç")
|| input.startsWith("whatsapp")
|| input.startsWith("dokun")
|| input.startsWith("kaydır")
|| input.startsWith("yaz ")){
  return;
}

const result = await this.ai.patchProject(this.projects.getCurrent(), input, summary);
          this.memory.add({
            action: 'patch_project',
            input,
            project: this.projects.getCurrent(),
            success: result ? result.success : false,
            rolledBack: result ? result.rolledBack : false
          });
          return result;
        });

      case 'generate_feature':
        return this.withAI(async () => {
          if((input.trim() === "youtube ac" || input.trim() === "youtube aç")
|| input.startsWith("whatsapp")
|| input.startsWith("dokun")
|| input.startsWith("kaydır")
|| input.startsWith("yaz ")){
  return;
}

const result = await this.ai.generateFeature(this.projects.getCurrent(), input);
          this.memory.add({
            action: 'generate_feature',
            input,
            project: this.projects.getCurrent(),
            created: result ? result.created : []
          });
          return result;
        });

      case 'edit':
        return this.withAI(() => this.ai.applyEdit(this.projects.getCurrent(), input));

      default:
        if(
        input.toLowerCase().trim() === "youtube ac" || input.toLowerCase().trim() === "youtube aç" ||
        input.toLowerCase().startsWith("whatsapp") ||
        input.toLowerCase().startsWith("dokun") ||
        input.toLowerCase().startsWith("kaydır") ||
        input.toLowerCase().startsWith("yaz ")
      ){
        return;
      }
      return this.routeFallback(input);
    }

  }

  async autoBuild(input) {

    const plan=await planner.run(input);

    console.log("🤖 AUTOBUILD:",plan.map(x=>x.agent).join(" -> "));

    console.log('🧠 Plan hazırlanıyor...');

    const { projectType, modules } = await this.architect.planWithAI(input, this.ai);

    if (!this.projects.hasProject()) {

      const typeToUse = projectType || 'express';

      console.log(`📦 Proje bulunamadı, otomatik oluşturuluyor: ${typeToUse}`);

       await this.builder.build(`${typeToUse} oluştur`);

    }

    console.log('🐞 DEBUG input:', input);
    console.log('🐞 DEBUG detectTemplate:', this.codeGenerator.detectTemplate(input));
    console.log('🐞 DEBUG current project:', this.projects.getCurrent());

    const templateFiles = await this.codeGenerator.generate(this.projects.getCurrent(), input);

    console.log('🐞 DEBUG templateFiles:', JSON.stringify(templateFiles));

    if (templateFiles && templateFiles.length > 0) {
      console.log('🏗️ Şablon uygulandı: ' + templateFiles.join(', '));
    }

    if (modules.length === 0) {
      console.log("⚠️ Ek modül bulunamadı, sadece proje ve temel adımlarla devam ediliyor.");
    }

    const fullModules = [...modules, 'test', 'git_commit'];

    this.taskManager.create(projectType, fullModules);
    this.memory.add({
      action: 'auto_build',
      input,
      project: this.projects.getCurrent(),
      modules: fullModules
    });

    await this.executor.run();

    console.log("🔍 Reviewer çalışıyor...");

    let review;
try{
    review = await this.reviewer.review(
      this.ai,
      [this.projects.getCurrent()]
    );

    console.log(review);

}catch(e){
    console.log("⚠️ Reviewer atlandı:", e.message);
    review = "Reviewer atlandı";
}

    if(
      typeof review==="string" &&
      (
        review.toLowerCase().includes("bug") ||
        review.toLowerCase().includes("hata") ||
        review.toLowerCase().includes("error")
      )
    ){
      console.log("🛠️ Fixer çalışıyor...");

      const fixed = await this.fixer.fix(
        this.ai,
        review,
        ""
      );

      console.log(fixed);
    }

  }

  showMemory() {

    const summary = this.memory.recentSummary(this.projects.getCurrent(), 10);

    if (!summary) {
      console.log('🧠 Henüz bu proje için kayıtlı bir geçmiş yok.');
      return;
    }

    console.log('🧠 Son işlemler:\n' + summary);

  }

  async runFileTask(input) {

    if (!this.projects.hasProject()) {
      console.log('⚠️ Önce bir proje oluşturmalısın (örn: "express oluştur").');
      return;
    }

    console.log('📁 İşlem yapılıyor...');

    const result = await this.fileAgent.handleInstruction(this.projects.getCurrent(), input, this.ai);

    if (!result.success) {
      console.log('❌ Hata:', result.error);
      return;
    }

    if (result.action === 'read') {
      console.log('📄 Dosya içeriği:\n' + result.content);
    } else if (result.action === 'list' || result.action === 'search') {
      console.log(result.formatted);
    } else {
      console.log('✅ İşlem tamamlandı (' + result.action + ').');
      if (result.backupPath) {
        console.log('🗄️ Yedek alındı:', result.backupPath);
      }
    }

    this.memory.add({
      action: 'file_task',
      input,
      project: this.projects.getCurrent(),
      fileAction: result.action,
      success: result.success
    });

  }

  async runWebSearch(input) {

    console.log('🔎 Aranıyor...');

    const result = await this.web.smartSearch(input);

    if (!result.success) {
      console.log('❌ Arama başarısız:', result.error);
      return;
    }

    console.log(`📚 Kaynak: ${result.source}\n`);
    console.log(this.web.formatResults(result.results));

    this.memory.add({
      action: 'web_search',
      input,
      project: this.projects.hasProject() ? this.projects.getCurrent() : null,
      source: result.source,
      resultCount: Array.isArray(result.results) ? result.results.length : null
    });

  }

  buildWorkflowExecutors() {

    return {
      runTerminal: async (stepInput) => this.runTerminal(stepInput),
      runWebSearch: async (stepInput) => this.runWebSearch(stepInput),
      runFileTask: async (stepInput) => this.runFileTask(stepInput),
      autoBuild: async (stepInput) => this.autoBuild(stepInput),
      phoneAssist: async (stepInput) => this.phone.assist(stepInput, this.ai)
    };

  }

  async createWorkflow(input) {

    console.log('🧩 Workflow planlanıyor...');

    const cleanInput = input.replace(/workflow olustur|workflow oluştur/gi, '').trim();

    const { name, steps } = await this.workflowEngine.planSteps(cleanInput, this.ai);

    if (!steps || steps.length === 0) {
      console.log('⚠️ Workflow oluşturulamadı, adım bulunamadı.');
      return;
    }

    this.workflowEngine.saveWorkflow(name, steps);

    console.log(`✅ Workflow kaydedildi: "${name}" (${steps.length} adım)`);
    steps.forEach((s, i) => console.log(`  ${i + 1}. [${s.target}] ${s.input}`));

    console.log('\n▶️ Şimdi çalıştırılıyor...');

    await this.workflowEngine.runSteps(steps, this.buildWorkflowExecutors());

    console.log('\n🎉 Workflow tamamlandı.');

    this.memory.add({
      action: 'workflow_create',
      input: cleanInput,
      project: this.projects.hasProject() ? this.projects.getCurrent() : null,
      workflowName: name,
      stepCount: steps.length
    });

  }

  listWorkflows() {

    const names = this.workflowEngine.list();

    if (names.length === 0) {
      console.log('📋 Henüz kayıtlı workflow yok.');
      return;
    }

    console.log('📋 Kayıtlı workflowlar:');
    names.forEach(n => console.log('  - ' + n));

  }

  async runWorkflow(input) {

    const match = input.match(/workflow calistir\s+(.+)|workflow çalıştır\s+(.+)/i);
    const name = match ? (match[1] || match[2]).trim() : null;

    if (!name) {
      console.log('⚠️ Hangi workflowu çalıştıracağımı belirtmelisin. Örn: "workflow calistir test-ve-rapor"');
      return;
    }

    const workflow = this.workflowEngine.get(name);

    if (!workflow) {
      console.log('❌ Workflow bulunamadı:', name);
      this.listWorkflows();
      return;
    }

    console.log(`▶️ Workflow çalıştırılıyor: ${name} (${workflow.steps.length} adım)`);

    await this.workflowEngine.runSteps(workflow.steps, this.buildWorkflowExecutors());

    console.log('\n🎉 Workflow tamamlandı.');

    this.memory.add({
      action: 'workflow_run',
      input: name,
      project: this.projects.hasProject() ? this.projects.getCurrent() : null,
      workflowName: name
    });

  }

  async runVoiceCommand() {

    console.log('🎤 Dinliyorum...');

    const result = this.voice.listen();

    if (!result.success) {
      console.log('❌ Ses algılanamadı:', result.error);
      return;
    }

    console.log('🗣️ Algılanan:', result.text);

    return this.handle(result.text);

  }

  speakText(input) {

    const text = input.replace(/sesli soyle|sesli söyle|seslendir/gi, '').trim();

    if (!text) {
      console.log('⚠️ Ne söylememi istediğini belirtmelisin.');
      return;
    }

    const result = this.voice.speak(text);

    if (!result.success) {
      console.log('❌ Seslendirme başarısız:', result.error);
      return;
    }

    console.log('🔊 Seslendirildi.');

  }

  listPlugins() {

    const plugins = this.pluginManager.list();

    console.log('🔌 Pluginler:');

    plugins.forEach(p => {
      const status = p.enabled ? '✅ açık' : '⛔ kapalı';
      console.log(`  - ${p.name} (v${p.version}) [${status}]`);
    });

  }

  togglePlugin(input, enabled) {

    const parts = input.trim().split(/\s+/);
    const name = parts[parts.length - 1];

    if (!name) {
      console.log('⚠️ Plugin adı belirtmelisin.');
      return;
    }

    this.pluginManager.setEnabled(name, enabled);

  }

  runPlugin(input) {

    const cleaned = input.replace(/^plugin\s+(calistir|çalıştır)\s+/i, '').trim();
    const parts = cleaned.split(/\s+/);
    const name = parts[0];
    const args = parts.slice(1);

    if (!name) {
      console.log('⚠️ Hangi plugin çalıştırılacak belirtmelisin. Örn: "plugin calistir weather Ankara"');
      return;
    }

    const config = this.pluginManager.list().find(p => p.name === name);

    if (config && !config.enabled) {
      console.log(`⛔ Plugin "${name}" kapalı. Açmak için: "plugin ac ${name}"`);
      return;
    }

    if (!this.pluginManager.has(name)) {
      console.log('❌ Plugin bulunamadı:', name);
      return;
    }

    this.pluginManager.run(name, ...args);

  }

  async routeFallback(input) {

    if (!this.ai) {
      return this.phone.assist(input, this.ai);
    }

    const decision = await this.orchestrator.route(input);

    if (!decision || !decision.target) {
      return this.phone.assist(input, this.ai);
    }

    switch (decision.target) {

      case 'auto_build':
        return this.autoBuild(input);

      case 'terminal':
        return this.runTerminal(input);

      case 'web_search':
        return this.runWebSearch(input);

      case 'file_task':
        return this.runFileTask(input);

      case 'phone':
        return this.phone.assist(input, this.ai);

      case 'chat':
      default:
        if (decision.reply) {
          console.log('💬', decision.reply);
          return;
        }
        return this.phone.assist(input, this.ai);

    }

  }

  async runTerminal(input) {

    const cwd = this.projects.hasProject() ? this.projects.getCurrent() : undefined;

    const result = await this.terminal.runNaturalLanguage(input, this.ai, cwd);

    if (result.blocked) {
      console.log('🚫', result.error);
      return;
    }

    if (result.success) {
      console.log('✅ Komut çalıştı:\n' + result.output);
    } else {
      console.log('❌ Komut başarısız:\n' + (result.error || result.output));
    }

    this.memory.add({
      action: 'terminal_run',
      input,
      project: this.projects.hasProject() ? this.projects.getCurrent() : null,
      success: result.success
    });

  }

  withProject(fn) {

    if (!this.projects.hasProject()) {
      console.log('⚠️ Önce bir proje oluşturmalısın (örn: "express oluştur").');
      return;
    }

    return fn();

  }

  withAI(fn) {

    if (!this.ai) {
      console.log('🤖 AI motoru henüz bağlı değil.');
      return;
    }

    return this.withProject(fn);

  }

  listProjects() {

    const list = this.projects.listProjects();

    if (list.length === 0) {
      console.log('📂 Henüz hiç proje yok. Önce bir proje oluştur (örn: "express oluştur").');
      return;
    }

    console.log('📂 Projelerin:');

    list.forEach(p => {
      const marker = p.active ? '👉' : '  ';
      console.log(`${marker} ${p.index}. ${p.name}  [${p.type}]`);
    });

    console.log('\nBir projeye geçmek için: "proje seç <numara>" yazabilirsin.');

  }

  selectProject(input) {

    const match = input.match(/(\d+)/);

    if (!match) {
      console.log('⚠️ Hangi projeye geçmek istediğini numara ile belirtmelisin. Örn: "proje seç 2"');
      return;
    }

    const index = parseInt(match[1], 10);

    try {
      const project = this.projects.selectByIndex(index);
      console.log(`✅ Aktif proje değiştirildi: ${project.name} [${project.type}]`);
    } catch (e) {
      console.log('❌', e.message);
    }

  }

  showHelp() {

    console.log(`
📖 Jarvis v6 - Komut Listesi

Proje oluşturma:
  express oluştur        → Express.js projesi oluşturur
  react oluştur           → React (Vite) projesi oluşturur
  vue oluştur             → Vue (Vite) projesi oluşturur
  next.js oluştur         → Next.js projesi oluşturur (⚠️ bu cihazda çalışmaz)
  flask oluştur           → Flask projesi oluşturur
  fastapi oluştur         → FastAPI projesi oluşturur

Proje yönetimi:
  projelerimi göster      → Tüm projelerini listeler
  proje seç <numara>      → Belirtilen projeyi aktif yapar
  çalıştır                → Aktif projeyi başlatır

Veritabanı:
  sqlite ekle             → SQLite veritabanı ekler
  postgresql ekle         → PostgreSQL bağlantı kodu ekler
  mongodb ekle            → MongoDB bağlantı kodu ekler

Güvenlik:
  login sistemi ekle      → Login/auth sistemi ekler
  jwt ekle                → JWT doğrulama ekler
  oauth ekle              → Google OAuth iskeleti ekler
  helmet ekle             → Güvenlik HTTP header'ları ekler
  rate limit ekle         → İstek sınırlama ekler

DevOps:
  docker ekle             → Dockerfile ekler
  docker compose ekle     → docker-compose.yml ekler
  github actions ekle     → CI/CD workflow ekler
  swagger ekle            → API dokümantasyonu ekler
  test oluştur            → Test dosyaları oluşturur

AI destekli:
  projeyi analiz et       → Aktif projeyi analiz eder
  hata düzelt             → Hataları/güvenlik açıklarını tespit eder
  readme oluştur          → README.md'yi otomatik yazar (dosyayı günceller)
  ... optimize et / düzenle → Serbest metinle öneri üretir

Otomasyon:
  otomatik oluştur <istek> → Proje oluşturur, modülleri ekler, test yazar, commit atar

Genel:
  durum                   → Sistem ve proje durumunu gösterir
  git                     → Git durumunu gösterir / repo başlatır
  yardım                  → Bu listeyi gösterir
  çık                     → Jarvis'ten çıkar
`);

  }

  showStatus() {

    const dir = this.projects.getCurrent();

    console.log('📊 Durum:');
    console.log('  Node sürümü:', process.version);
    console.log('  Platform:', os.platform());
    console.log('  Aktif proje:', dir ? dir : '(yok)');
    console.log('  AI motoru:', this.ai ? 'bağlı ✅' : 'bağlı değil ⚠️');

  }

  async gitStatus() {

    return this.withProject(async () => {

      const dir = this.projects.getCurrent();
      const git = simpleGit(dir);

      const isRepo = await git.checkIsRepo();

      if (!isRepo) {
        console.log('🔧 Bu projede git deposu yok, başlatılıyor...');
        await git.init();
        console.log('✅ Git deposu oluşturuldu.');
        return;
      }

      const status = await git.status();

      console.log('📂 Git durumu:');
      console.log('  Dal:', status.current);
      console.log('  Değişen dosyalar:', status.files.length);

      status.files.forEach(f => {
        console.log('   -', f.path, `(${f.working_dir})`);
      });

    });

  }

}

module.exports = Router;
