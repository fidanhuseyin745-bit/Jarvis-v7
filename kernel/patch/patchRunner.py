from pathlib import Path
import shutil
import datetime

class PatchRunner:

    def backup(self,file):

        src=Path(file)

        if not src.exists():
            print("Dosya bulunamadı.")
            return False

        backup_dir=Path("kernel/patch/backups")
        backup_dir.mkdir(parents=True,exist_ok=True)

        t=datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

        dst=backup_dir/f"{src.name}.{t}.bak"

        shutil.copy(src,dst)

        print("Yedek oluşturuldu:",dst)

        return True

if __name__=="__main__":

    p=PatchRunner()

    p.backup("kernel/master/masterBrain.js")
