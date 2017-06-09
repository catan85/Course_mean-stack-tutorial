import { Message } from "./message.model";
import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs/Observable";

@Injectable()
export class MessageService {
    private messages: Message[] = [];

    constructor(private http: Http){}

    messageIsEdit = new EventEmitter<Message>();

    addMessage(message: Message) {
        this.messages.push(message);
        const body = JSON.stringify(message);
        const headers = new Headers({'Content-type': 'application/json'});
        return this.http.post('http://localhost:3000/message',body, {headers: headers})
            .map((response: Response) => { return response.json();})
                    // nel caso di errore si deve creare un Observable 
                    // manualmente mentre nel caso di risposta positiva 
                    // viene creato automaticamente
            .catch((error:Response) => Observable.throw(error.json()));
    }

    getMessages() {
        return this.http.get('http://localhost:3000/message')
            .map((response: Response) => {
                const messages = response.json().messages;
                let transformedMessages: Message[] = [];
                for (let message of messages){
                    transformedMessages.push(new Message(
                        message.content, 
                        'Dummy',
                        message.id, 
                        null));
                }
                this.messages = transformedMessages;
                return transformedMessages;
            })
            .catch((error:Response) => Observable.throw(error.json()));
    }

    editMessage(message: Message){
        this.messageIsEdit.emit(message);
    }

    deleteMessage(message: Message) {
        this.messages.splice(this.messages.indexOf(message), 1);
    }
}