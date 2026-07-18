'use strict';

const PlannerV2 = require('./plannerV2');
const PlannerManager=require('./plannerManager');

class Planner {

  constructor(builder) {
    this.builder = builder;
    this.current = null;
    this.v2 = new PlannerV2();
    this.manager=new PlannerManager();
  }

  create(task) {

    const autoPlan = this.v2.build(task);
    console.log("🧠 Planner V2:", autoPlan.tasks.join(" -> "));
this.current = autoPlan;
this.manager.load(autoPlan);

    this.current = {
      task,
      steps: [
        'İsteği analiz et',
        'Gerekli dosyaları belirle',
        'Değişiklik planı oluştur',
        'Güvenlik kontrolü',
        'Uygulamaya hazır'
      ]
    };

    console.log('📋 Görev Planı');
    console.log('----------------');

    this.current.steps.forEach((step, index) => {
      console.log(`${index + 1}. ${step}`);
    });

  }

  apply() {

    if (!this.current) {
      console.log('❌ Önce plan oluştur.');
      return;
    }

    console.log(`🚀 Uygulanıyor: ${this.current.task}`);

    const task = this.current.task.toLowerCase();

    const actions = {
      jwt: () => this.builder.addJWT(),
      login: () => this.builder.addLogin(),
      swagger: () => this.builder.addSwagger(),
      docker: () => this.builder.addDocker(),
      sqlite: () => this.builder.addSQLite(),
      postgres: () => this.builder.addPostgres(),
      mongo: () => this.builder.addMongo(),
      oauth: () => this.builder.addOAuth(),
      helmet: () => this.builder.addHelmet(),
      cors: () => this.builder.addCors()
    };

    for (const [key, action] of Object.entries(actions)) {

      if (task.includes(key)) {

        console.log(`⚙️ ${key.toUpperCase()} kuruluyor...`);

        try {
          action();
        } catch (e) {
          console.log(`❌ ${key}: ${e.message}`);
        }

      }

    }

    this.current.steps.forEach((step, index) => {
      console.log(`✅ ${index + 1}. ${step}`);
    });

    console.log('🎉 Plan tamamlandı.');

  }

}

module.exports = Planner;
