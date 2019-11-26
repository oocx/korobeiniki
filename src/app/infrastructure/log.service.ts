import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {


  private messages: string[] = [];

  constructor() { }

  public writeLine(msg: string) {
    console.log(msg);
    this.messages.push(msg);
    if (this.messages.length > 20) {
      this.messages.splice(0, 1);
    }
  }

  public getMessages() {
    return this.messages;
  }
}
