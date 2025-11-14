import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';  

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new EventEmitter<Message[]>();
  maxMessageId: number;

  constructor(private http: HttpClient) {
    this.messages = MOCKMESSAGES;
    this.maxMessageId = this.getMaxId();
   }

   getMessages() {
      this.http
      .get<Message[]>('https://wdd430-cms-cc424-default-rtdb.firebaseio.com/messages.json')
      .subscribe({
        next: (messages: Message[]) => {
          this.messages = messages || []; 

          // console.log("🔥 Messages received from Firebase:", this.messages);

          this.messages.sort((a, b) => {
            if (a.subject < b.subject) return -1;
            if (a.subject > b.subject) return 1;
            return 0;
          });

          this.maxMessageId = this.getMaxId();
          this.messageChangedEvent.emit(this.messages.slice());
        },

        error: (error: any) => {  
          console.error('Error fetching messages:', error);
        },
      });
   }

  //  getMessages(): Message[] {
  //    return this.messages.slice();
  //  }

    getMessage(id: string): Message | null {
      const message = this.messages.find((m) => m.id === id); 
      return message ? { ...message } : null;
    }

    storeMessages() {
      const messagesString = JSON.stringify(this.messages);
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      this.http
        .put('https://wdd430-cms-cc424-default-rtdb.firebaseio.com/messages.json', messagesString, { headers })
        .subscribe({
          next: () => {
            this.messageChangedEvent.emit(this.messages.slice());
          },
          error: (error: any) => {
            console.error('Error storing messages:', error);
          },
        });
    }


    private getMaxId(): number {
      let maxId = 0;
      this.messages.forEach((message) => {
        const currentId = parseInt(message.id, 10);
        if (currentId > maxId) {
          maxId = currentId;
        } 
      });
      return maxId;
    }

    // addMessage(message: Message) {
    //   this.messages.push(message);
    //   this.messageChangedEvent.emit(this.messages.slice());
    // }

    addMessage(newMessage: Message) {
      if (!newMessage) {
        return;
      }
      this.maxMessageId++;
      newMessage.id = this.maxMessageId.toString();
      this.messages.push(newMessage);
      this.storeMessages(); 
    }
}
