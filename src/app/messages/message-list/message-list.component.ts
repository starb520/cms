import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  standalone: false,
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {

  messages: Message[] = [
    new Message('1', 'Message One', 'This is message one', 'Sylvester Stallone'),
    new Message('2', 'Message Two', 'This is message two', 'Bruce Lee'),
    new Message('3', 'Message Three', 'This is message three', 'Jackie Chan')
  ];


  onAddMessage(message: Message) {
    this.messages.push(message);
  }





}
