import { Injectable } from '@angular/core';
declare var alertify : any;

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

  constructor() { }
  // message(message : string, messageType : MessageType, position: Position, delay : number = 3, dismissOthers: boolean = false){
    message(message : string,options : Partial<AlertifyOptions>){
    alertify.set("notifier","position", options.position);
    alertify.set("notifier","delay",options.delay);
    const msj =alertify[options.messageType](message);
    if(options.dismissOthers)
    {msj.dismissOthers();}
  }
  dismissAll(){
    alertify.dismissAll();
  }

}
export class AlertifyOptions{
  messageType: MessageType = MessageType.message;
  position:Position = Position.BottomRight;
  delay:number = 3;
  dismissOthers:boolean = false;
}
export enum MessageType{
  error = "error",
  message = "message",
  success = "success",
  notify= "notify",
  warning = "warning"
}
export enum Position{
TopRight ="top-right",
TopLeft ="top-left",
TopCenter ="top-center",
BottomRight ="bottom-right",
BottomLeft = "bottom-left",
BottomCenter = "bottom-center"
}
