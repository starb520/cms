import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Message } from '../message.model'; 

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
  @Output() addMessageEvent = new EventEmitter<Message>();


  onSendMessage() {
    const subjectInput = this.subjectRef.nativeElement.value;
    const msgTextInput = this.msgTextRef.nativeElement.value;
    const newMessage = new Message('4', subjectInput, msgTextInput, this.currentSender);
    console.log('Child emitting: '), newMessage;
    this.addMessageEvent.emit(newMessage);
  }

  onClear() {
    this.subjectRef.nativeElement.value = '';
    this.msgTextRef.nativeElement.value = '';
  }
}
