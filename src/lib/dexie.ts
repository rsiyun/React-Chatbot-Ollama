import Dexie, { Table } from "dexie";

interface Dex_Thread{
    id: string;
    title: string;
    created_at: Date;
    updated_at: Date;
}

interface Dex_Message{
    id:string;
    role: "user"|"assistant";
    content:string,
    chat_id: string
    thought:string,
    created_at: Date,
}

class ChatDb extends Dexie{
    threads!: Table<Dex_Thread>
    messages!: Table<Dex_Message>

    constructor(){
        super("chatdb");
        this.version(1).stores({
            threads: "id, title, created_at, updated_at",
            messages: "id, role, created_at, chat_id, content, thought"
        })
        this.threads.hook("creating", (_,obj)=>{
            obj.created_at = new Date();
            obj.updated_at = new Date();
        })
        this.threads.hook("creating", (_,obj)=>{
            obj.created_at = new Date();
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
    async deleteThreads(chat_id:string){
        await this.transaction("rw", [this.threads, this.messages], async()=>{
            await this.threads.where("id").equals(chat_id as string).delete();
            await this.messages.where("chat_id").equals(chat_id as string).delete();
        })
    }
    async createMessage(message: Pick<Dex_Message, "content" | "role" | "chat_id" | "thought">){
        const messageId = crypto.randomUUID();
        await this.transaction("rw",[this.threads, this.messages], async()=>{
            await this.messages.add({
                ...message,
                id: messageId,
                created_at: new Date()
            })
            await this.threads.update(message.chat_id,{
                updated_at: new Date()
            })
        })
    }
    async getMessageForChat(chatId: string){
        // if()
        return this.messages.where("chat_id").equals(chatId as string).sortBy("created_at");
    }
}

export const db = new ChatDb();