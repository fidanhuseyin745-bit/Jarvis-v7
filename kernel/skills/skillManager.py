class SkillManager:

    def __init__(self):
        self.skills={}

    def register(self,name,func):
        self.skills[name]=func

    def run(self,name,*args):
        if name not in self.skills:
            return "Skill bulunamadı."
        return self.skills[name](*args)

manager=SkillManager()
