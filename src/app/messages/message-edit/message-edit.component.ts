import { Component, ViewChild, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Message } from '../message.model'; 
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  standalone: false,
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})
export class MessageEditComponent {
  @ViewChild('subject') subjectRef!: ElementRef;
  @ViewChild('msgText') msgTextRef!: ElementRef;
  currentSender = 'Star';
  // @Output() addMessageEvent = new EventEmitter<Message>();

  constructor(private messageService: MessageService) {}

  ngOnInit() {}

  onSendMessage() {
    const subjectInput = this.subjectRef.nativeElement.value;
    const msgTextInput = this.msgTextRef.nativeElement.value;
    const newMessage = new Message('4', subjectInput, msgTextInput, this.currentSender);
    this.messageService.addMessage(newMessage);
  }

  onClear() {
    this.subjectRef.nativeElement.value = '';
    this.msgTextRef.nativeElement.value = '';
  }
}
