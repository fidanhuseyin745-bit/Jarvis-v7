'use strict';

class PlannerManager{

    constructor(){
        this.queue=[];
    }

    load(plan){

        this.queue=[];

        if(plan && Array.isArray(plan.tasks)){
            this.queue.push(...plan.tasks);
        }

    }

    next(){
        return this.queue.shift();
    }

    hasTasks(){
        return this.queue.length>0;
    }

    list(){
        return [...this.queue];
    }

}

module.exports=PlannerManager;

PlannerManager.prototype.register = function(name, agent){
    if(!this.agents) this.agents = {};
    this.agents[name] = agent;
};

PlannerManager.prototype.execute = async function(plan){

    if(!plan || !Array.isArray(plan.tasks)){
        return [];
    }

    const results = [];

    for(const task of plan.tasks){

        const agent = this.agents?.[task];

        if(agent && typeof agent.run === "function"){
            results.push(await agent.run(plan));
        }else{
            results.push(task);
        }

    }

    return results;

};
