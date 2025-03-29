import Dexie, { Table } from "dexie";

interface Dex_Thread{
    id: string;
    title: string;
    created_at: Date;
    updated_at: Date;
}

class ChatDb extends Dexie{
    threads!: Table<Dex_Thread>

    constructor(){
        super("chatdb");
        this.version(1).stores({
            threads: "id, title, created_at, updated_at"
        })
        this.threads.hook("creating", (_,obj)=>{
            obj.created_at = new Date();
            obj.updated_at = new Date();
        })
    }
    async createChat(title:string){
        const id = crypto.randomUUID();
        await this.threads.add({
            id,
            title,
            created_at: new Date(),
            updated_at: new Date()
        });
        return id;
    }
    async getAllThreads(){
        return this.threads.reverse().sortBy("updated_at")
    }
}

export const db = new ChatDb();